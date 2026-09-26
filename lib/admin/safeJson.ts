/**
 * Safe JSON serialization utilities for Still Studio Admin Visual Editor.
 * Guards against:
 * 1. Circular structures (WeakSet cycle detection)
 * 2. DOM Elements (HTMLDivElement, SVGElement, etc.)
 * 3. React Fiber Nodes (__reactFiber$, stateNode, etc.)
 * 4. Synthetic/Native Events (e.target, e.nativeEvent)
 * 5. Undefined or non-serializable nodes
 */

export function safeJsonStringify(obj: any, indent?: number): string {
  const seen = new WeakSet();

  return JSON.stringify(
    obj,
    (key, value) => {
      // Filter out DOM nodes
      if (
        (typeof Node !== "undefined" && value instanceof Node) ||
        (value && typeof value === "object" && ("nodeType" in value || "tagName" in value))
      ) {
        return undefined;
      }

      // Filter out React Fiber and internal properties
      if (
        key.startsWith("__reactFiber") ||
        key.startsWith("__reactInternal") ||
        key === "stateNode" ||
        key === "_owner" ||
        key === "_store"
      ) {
        return undefined;
      }

      // Filter out Event objects
      if (
        (typeof Event !== "undefined" && value instanceof Event) ||
        (value && typeof value === "object" && ("nativeEvent" in value || ("isTrusted" in value && "bubbles" in value)))
      ) {
        return undefined;
      }

      // Cycle detection
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return undefined;
        }
        seen.add(value);
      }

      return value;
    },
    indent
  );
}

/**
 * Deep clone an object safely via safeJsonStringify to strip out any non-serializable properties
 */
export function safeClone<T>(obj: T): T {
  try {
    const serialized = safeJsonStringify(obj);
    if (!serialized) return obj;
    return JSON.parse(serialized);
  } catch {
    return obj;
  }
}
