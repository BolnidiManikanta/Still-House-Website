/**
 * Safe JSON serialization and deep sanitization utilities for Still Studio Visual Editor.
 * Guards against:
 * 1. Circular structures (WeakSet cycle detection)
 * 2. DOM Elements (HTMLDivElement, SVGElement, Node, Document, Window)
 * 3. React Fiber Nodes (__reactFiber$, stateNode, FiberNode, etc.)
 * 4. Synthetic & Native Events (MouseEvent, Event, e.target, e.nativeEvent)
 * 5. Undefined, function, or non-serializable nodes
 */

/**
 * Safe JSON serialization and deep sanitization utilities for Still Studio Visual Editor.
 * Guards against:
 * 1. Circular structures (WeakSet cycle detection)
 * 2. DOM Elements (HTMLDivElement, SVGElement, Node, Document, Window)
 * 3. React Fiber Nodes (__reactFiber$, stateNode, FiberNode, etc.)
 * 4. Synthetic & Native Events (MouseEvent, Event, e.target, e.nativeEvent)
 * 5. Undefined, function, or non-serializable nodes
 */

export function isDomOrFiberOrEvent(val: any): boolean {
  if (!val || typeof val !== "object") return false;

  // Check DOM Nodes, Elements, Document, Window
  if (typeof Node !== "undefined" && val instanceof Node) return true;
  if (typeof Window !== "undefined" && val instanceof Window) return true;
  if ("nodeType" in val || "tagName" in val || "ownerDocument" in val || "attributes" in val) return true;

  // Check constructor name
  const cName = val.constructor?.name;
  if (
    cName &&
    (cName.endsWith("Element") ||
      cName.endsWith("Node") ||
      cName === "FiberNode" ||
      cName.includes("Event") ||
      cName === "Window" ||
      cName === "Document")
  ) {
    return true;
  }

  // Check React Fiber & internal properties
  if ("stateNode" in val && ("memoizedState" in val || "child" in val || "return" in val || "tag" in val)) return true;
  if ("_owner" in val && "_store" in val) return true;

  // Check if any property key matches React internal Fiber prefix
  try {
    for (const key of Object.keys(val)) {
      if (
        key.startsWith("__reactFiber") ||
        key.startsWith("__reactInternal") ||
        key.startsWith("__reactContainer") ||
        key.startsWith("__reactProps")
      ) {
        return true;
      }
    }
  } catch {
    // In case object keys cannot be enumerated
    return true;
  }

  // Native and Synthetic Events
  if (typeof Event !== "undefined" && val instanceof Event) return true;
  if ("nativeEvent" in val || ("isTrusted" in val && "bubbles" in val)) return true;

  return false;
}

/**
 * Clean plain object sanitizer that extracts only serializable primitives and nested plain records.
 * Uses a WeakSet cycle tracker to guarantee that circular references are safely trimmed.
 */
export function cleanSerializableObject(
  input: any,
  seen: WeakSet<object> = new WeakSet(),
  depth = 0
): any {
  if (input === null || input === undefined) return input;
  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean"
  ) {
    return input;
  }

  if (typeof input !== "object") {
    return undefined;
  }

  if (depth > 12) {
    return undefined;
  }

  if (isDomOrFiberOrEvent(input)) {
    return undefined;
  }

  // Cycle detection
  if (seen.has(input)) {
    return undefined;
  }
  seen.add(input);

  if (Array.isArray(input)) {
    return input
      .map((item) => cleanSerializableObject(item, seen, depth + 1))
      .filter((item) => item !== undefined);
  }

  try {
    const output: Record<string, any> = {};
    for (const [key, val] of Object.entries(input)) {
      if (
        key.startsWith("__react") ||
        key.startsWith("_react") ||
        key === "stateNode" ||
        key === "_owner" ||
        key === "_store" ||
        key === "child" ||
        key === "return" ||
        key === "sibling" ||
        key === "alternate" ||
        key === "memoizedState" ||
        key === "memoizedProps"
      ) {
        continue;
      }
      const cleaned = cleanSerializableObject(val, seen, depth + 1);
      if (cleaned !== undefined) {
        output[key] = cleaned;
      }
    }
    return output;
  } catch {
    return undefined;
  }
}

export function sanitizePlainRecord(input: any, maxDepth = 6): any {
  return cleanSerializableObject(input, new WeakSet(), 12 - maxDepth);
}

/**
 * Deep clone an object safely without calling JSON.stringify, eliminating any potential
 * for circular structure errors.
 */
export function safeClone<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== "object") return obj;

  if (isDomOrFiberOrEvent(obj)) {
    return (Array.isArray(obj) ? [] : {}) as unknown as T;
  }

  try {
    const cleaned = cleanSerializableObject(obj);
    return (cleaned !== undefined ? cleaned : Array.isArray(obj) ? [] : {}) as unknown as T;
  } catch {
    return (Array.isArray(obj) ? [] : {}) as unknown as T;
  }
}

/**
 * Safe JSON stringify that pre-cleans the input to guarantee no circular structures or DOM nodes
 * can ever reach the native JSON.stringify engine.
 */
export function safeJsonStringify(obj: any, indent?: number): string {
  try {
    if (obj === null || obj === undefined) {
      return "{}";
    }

    const cleaned = cleanSerializableObject(obj);
    if (cleaned === undefined) {
      return "{}";
    }

    return JSON.stringify(cleaned, null, indent) || "{}";
  } catch {
    return "{}";
  }
}

// Client-side window global safety guard to intercept and neutralize any accidental circular stringify calls
if (typeof window !== "undefined" && !(window as any).__SAFE_JSON_GUARD_ACTIVE__) {
  (window as any).__SAFE_JSON_GUARD_ACTIVE__ = true;
  const nativeStringify = JSON.stringify;
  JSON.stringify = function (value: any, replacer?: any, space?: any) {
    try {
      return nativeStringify(value, replacer, space);
    } catch (err: any) {
      if (
        err &&
        typeof err.message === "string" &&
        (err.message.includes("circular") || err.message.includes("cyclic"))
      ) {
        try {
          const cleaned = cleanSerializableObject(value);
          return nativeStringify(cleaned, replacer, space) || "{}";
        } catch {
          return "{}";
        }
      }
      throw err;
    }
  };
}
