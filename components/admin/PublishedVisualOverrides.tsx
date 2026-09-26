"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/lib/admin/siteConfigStore";
import { generatePublishedStylesCss } from "@/lib/admin/visualEditorBridge";
import { safeClone } from "@/lib/admin/safeJson";

export default function PublishedVisualOverrides() {
  const pathname = usePathname();
  const { config } = useSiteConfig();
  const elementOverrides = config.elementOverrides || {};

  // 1. Generate active CSS rules from published element overrides
  const dynamicCss = useMemo(() => {
    return generatePublishedStylesCss(elementOverrides);
  }, [elementOverrides]);

  // 2. Client-side text & media hydration for published overrides (skip if inside admin editor itself)
  useEffect(() => {
    if (typeof window === "undefined" || pathname === "/admin" || !elementOverrides) return;

    // Small delay to ensure client hydration complete
    const timeout = setTimeout(() => {
      Object.values(elementOverrides).forEach((override) => {
        if (!override || !override.selector) return;

        try {
          const els = document.querySelectorAll(override.selector);
          els.forEach((el) => {
            // Text replacement
            if (override.text && (override.elementType === "text" || override.elementType === "button")) {
              if (!el.querySelector("input, textarea, select")) {
                if (el.childNodes.length === 1 && el.firstChild?.nodeType === 3) {
                  if (el.firstChild.nodeValue !== override.text) {
                    el.firstChild.nodeValue = override.text;
                  }
                } else if (el.children.length === 0) {
                  if (el.textContent !== override.text) {
                    el.textContent = override.text;
                  }
                }
              }
            }

            // Image src replacement
            if (override.src && (override.elementType === "image" || el.tagName.toLowerCase() === "img")) {
              const img = el.tagName.toLowerCase() === "img" ? (el as HTMLImageElement) : el.querySelector("img");
              if (img && img.src !== override.src) {
                img.src = override.src;
              }
            }

            // Button / Link URL replacement
            if (override.linkUrl && (el.tagName.toLowerCase() === "a" || el.hasAttribute("href"))) {
              (el as HTMLAnchorElement).href = override.linkUrl;
            }
          });
        } catch {
          // Ignore invalid selector in dynamic DOM
        }
      });
    }, 150);

    return () => clearTimeout(timeout);
  }, [pathname, elementOverrides]);

  // 3. Admin Inspector mode (activated when iframe has ?admin_inspector=1)
  useEffect(() => {
    if (typeof window === "undefined" || pathname === "/admin") return;
    const urlParams = new URLSearchParams(window.location.search);
    const isInspectorActive = urlParams.get("admin_inspector") === "1";

    if (!isInspectorActive) return;

    // Add inspector styles for hover and selection outlines
    let inspectorStyle = document.getElementById("admin-inspector-styles") as HTMLStyleElement | null;
    if (!inspectorStyle) {
      inspectorStyle = document.createElement("style");
      inspectorStyle.id = "admin-inspector-styles";
      inspectorStyle.textContent = `
        .__admin_hover_target {
          outline: 2px dashed #00E5FF !important;
          outline-offset: 3px !important;
          cursor: crosshair !important;
          position: relative !important;
        }
        .__admin_selected_target {
          outline: 2px solid #FF9100 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 15px rgba(255, 145, 0, 0.4) !important;
          position: relative !important;
        }
        .__admin_badge {
          position: absolute;
          top: -24px;
          left: 0;
          background: #FF9100;
          color: #000;
          font-family: monospace;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 3px;
          pointer-events: none;
          z-index: 999999;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
      `;
      document.head.appendChild(inspectorStyle);
    }

    let hoveredEl: HTMLElement | null = null;
    let selectedEl: HTMLElement | null = null;
    let badgeEl: HTMLElement | null = null;

    const determineElementType = (el: HTMLElement): 'text' | 'image' | 'button' | 'section' | 'link' => {
      const tag = el.tagName.toLowerCase();
      if (tag === "img" || el.querySelector("img") || el.getAttribute("role") === "img") return "image";
      if (tag === "button" || el.getAttribute("role") === "button" || el.classList.contains("glass-capsule") || el.classList.contains("glass-button")) return "button";
      if (tag === "a") return "link";
      if (tag === "section" || tag === "header" || tag === "footer" || tag === "main" || tag === "aside") return "section";
      return "text";
    };

    const getElementSelector = (el: HTMLElement): string => {
      if (el.id) return `#${el.id}`;
      if (el.getAttribute("data-admin")) return `[data-admin="${el.getAttribute("data-admin")}"]`;
      if (el.getAttribute("data-admin-id")) return `[data-admin-id="${el.getAttribute("data-admin-id")}"]`;

      // Meaningful classes
      const goodClasses = Array.from(el.classList || []).filter(
        (c) =>
          !c.startsWith("__admin") &&
          !c.startsWith("hover:") &&
          !c.startsWith("focus:") &&
          !c.startsWith("active:") &&
          c.length > 2
      );
      if (goodClasses.length > 0) {
        return `${el.tagName.toLowerCase()}.${goodClasses.slice(0, 2).join(".")}`;
      }

      return el.tagName.toLowerCase();
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target === document.body || target === document.documentElement) return;
      if (target.classList?.contains("__admin_badge")) return;

      if (hoveredEl && hoveredEl !== target) {
        hoveredEl.classList.remove("__admin_hover_target");
      }
      hoveredEl = target;
      hoveredEl.classList.add("__admin_hover_target");
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList) {
        target.classList.remove("__admin_hover_target");
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Check if interactive browse mode is requested by parent
      if ((window as any).__ADMIN_INTERACT_MODE__) {
        return; // Allow natural navigation and clicking
      }

      e.preventDefault();
      e.stopPropagation();

      const target = e.target as HTMLElement;
      if (!target || target === document.body) return;

      if (selectedEl) {
        selectedEl.classList.remove("__admin_selected_target");
      }
      selectedEl = target;
      selectedEl.classList.add("__admin_selected_target");

      // Attach badge
      if (!badgeEl) {
        badgeEl = document.createElement("div");
        badgeEl.className = "__admin_badge";
        document.body.appendChild(badgeEl);
      }
      const rect = target.getBoundingClientRect();
      badgeEl.textContent = `${target.tagName.toLowerCase()} · ${determineElementType(target)}`;
      badgeEl.style.top = `${window.scrollY + Math.max(0, rect.top - 24)}px`;
      badgeEl.style.left = `${window.scrollX + rect.left}px`;
      badgeEl.style.display = "block";

      const computed = window.getComputedStyle(target);
      const img = target.tagName.toLowerCase() === "img" ? (target as HTMLImageElement) : target.querySelector("img");

      const elementData = {
        tagName: String(target.tagName || "").toLowerCase(),
        selector: String(getElementSelector(target) || "div"),
        elementType: determineElementType(target),
        text: String(target.innerText || target.textContent || "").slice(0, 1000),
        src: img ? String(img.src || "") : "",
        href: String(target.getAttribute("href") || (target.closest("a")?.getAttribute("href") || "")),
        styles: {
          color: String(computed.color || ""),
          fontSize: String(computed.fontSize || ""),
          fontFamily: String(computed.fontFamily || ""),
          fontWeight: String(computed.fontWeight || ""),
          lineHeight: String(computed.lineHeight || ""),
          letterSpacing: String(computed.letterSpacing || ""),
          textAlign: String(computed.textAlign || ""),
          backgroundColor: String(computed.backgroundColor || ""),
          opacity: parseFloat(computed.opacity || "1") || 1,
          borderRadius: parseFloat(computed.borderRadius || "0") || 0,
          paddingTop: parseFloat(computed.paddingTop || "0") || 0,
          paddingBottom: parseFloat(computed.paddingBottom || "0") || 0,
          paddingLeft: parseFloat(computed.paddingLeft || "0") || 0,
          paddingRight: parseFloat(computed.paddingRight || "0") || 0,
          width: String(computed.width || ""),
          height: String(computed.height || ""),
        },
      };

      // Notify parent admin editor window safely
      if (window.parent && window.parent !== window) {
        try {
          const payload = safeClone({
            type: "ADMIN_ELEMENT_SELECTED",
            data: elementData,
          });
          window.parent.postMessage(payload, "*");
        } catch {
          // ignore postMessage error
        }
      }
    };

    // Listen for live update messages from parent editor
    const handleParentMessage = (event: MessageEvent) => {
      const msg = event.data;
      if (!msg || typeof msg !== "object") return;

      if (msg.type === "ADMIN_SET_INTERACT_MODE") {
        (window as any).__ADMIN_INTERACT_MODE__ = !!msg.interact;
      }

      if (msg.type === "ADMIN_SELECT_BY_SELECTOR" && typeof msg.selector === "string") {
        try {
          const el = document.querySelector(msg.selector) as HTMLElement | null;
          if (el) {
            if (selectedEl) selectedEl.classList.remove("__admin_selected_target");
            selectedEl = el;
            selectedEl.classList.add("__admin_selected_target");
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        } catch {
          // ignore
        }
      }

      if (msg.type === "ADMIN_LIVE_UPDATE_ELEMENT") {
        const { selector, text, src, styles, animation } = msg;
        try {
          const el = (selectedEl || (selector ? document.querySelector(selector) : null)) as HTMLElement | null;
          if (el) {
            if (text !== undefined) {
              if (el.childNodes.length === 1 && el.firstChild?.nodeType === 3) {
                el.firstChild.nodeValue = text;
              } else if (el.children.length === 0) {
                el.textContent = text;
              }
            }
            if (src !== undefined) {
              const img = el.tagName.toLowerCase() === "img" ? (el as HTMLImageElement) : el.querySelector("img");
              if (img) img.src = src;
            }
            if (styles && typeof styles === "object") {
              if (styles.color) el.style.color = styles.color;
              if (styles.fontSize) el.style.fontSize = styles.fontSize;
              if (styles.fontFamily) el.style.fontFamily = styles.fontFamily;
              if (styles.fontWeight) el.style.fontWeight = styles.fontWeight;
              if (styles.letterSpacing) el.style.letterSpacing = styles.letterSpacing;
              if (styles.textAlign) el.style.textAlign = styles.textAlign;
              if (styles.backgroundColor) el.style.backgroundColor = styles.backgroundColor;
              if (styles.opacity !== undefined) el.style.opacity = String(styles.opacity);
              if (styles.borderRadius !== undefined) el.style.borderRadius = `${styles.borderRadius}px`;
            }
            if (animation && animation.type && animation.type !== "none") {
              el.style.animation = "none";
              // trigger reflow
              void el.offsetHeight;
              el.style.animation = `ss-${animation.type} ${animation.duration || 800}ms ${animation.easing || "ease-out"} forwards`;
            }
          }
        } catch {
          // ignore
        }
      }

      if (msg.type === "ADMIN_TRIGGER_PREVIEW_EFFECT") {
        const { animation } = msg;
        if (selectedEl && animation && animation.type && animation.type !== "none") {
          selectedEl.style.animation = "none";
          void selectedEl.offsetHeight;
          selectedEl.style.animation = `ss-${animation.type} ${animation.duration || 800}ms ${animation.easing || "ease-out"} forwards`;
        }
      }

      if (msg.type === "ADMIN_RESET_ELEMENT_STYLES") {
        if (selectedEl) {
          selectedEl.removeAttribute("style");
        }
      }
    };

    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("message", handleParentMessage);

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("message", handleParentMessage);
      if (inspectorStyle) inspectorStyle.remove();
      if (badgeEl) badgeEl.remove();
    };
  }, [pathname]);

  if (pathname === "/admin") {
    return null;
  }

  return (
    <style
      id="still-studio-published-overrides"
      dangerouslySetInnerHTML={{ __html: dynamicCss }}
    />
  );
}
