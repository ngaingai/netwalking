"use client";

import { useEffect, useRef } from "react";

interface HubSpotFormFrameProps {
  /**
   * The HubSpot portal ID (e.g., "244495034")
   */
  portalId: string;
  /**
   * The HubSpot form ID (e.g., "40586442-1dc6-48e8-bbe2-10b5a0d4e38f")
   */
  formId: string;
  /**
   * Optional: Region (e.g., "na1", "na2", "eu1")
   * Defaults to "na2"
   */
  region?: string;
  /**
   * Optional: Additional CSS class names
   */
  className?: string;
}

/**
 * HubSpot Form Frame Component for Next.js
 *
 * Uses HubSpot's embed script that automatically renders forms
 * into divs with the hs-form-frame class and data attributes.
 *
 * Usage:
 * <HubSpotFormFrame
 *   portalId="244495034"
 *   formId="40586442-1dc6-48e8-bbe2-10b5a0d4e38f"
 *   region="na2"
 * />
 */
export function HubSpotFormFrame({
  portalId,
  formId,
  region = "na2",
  className,
}: HubSpotFormFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptId = `hs-forms-embed-${portalId}`;
  const scriptUrl = `https://js-${region}.hsforms.net/forms/embed/${portalId}.js`;

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    const container = containerRef.current;

    // Set up the data attributes for HubSpot's embed script
    container.className = `hs-form-frame ${className || ""}`.trim();
    container.setAttribute("data-region", region);
    container.setAttribute("data-form-id", formId);
    container.setAttribute("data-portal-id", portalId);

    // Load the HubSpot embed script if not already loaded
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = scriptUrl;
      script.defer = true;

      // Mark script as loaded when it successfully loads
      script.addEventListener("load", () => {
        script.setAttribute("data-loaded", "true");
      });

      // Silently handle errors - browser extensions often block HubSpot scripts
      // The form may still work in some cases, and users can't control this
      script.addEventListener("error", () => {
        // Error handled silently - browser extensions commonly block HubSpot scripts
      });

      document.head.appendChild(script);
    } else {
      // Script exists - check if already loaded
      if (script.getAttribute("data-loaded") === "true") {
        // Already loaded, form should render automatically
        return undefined;
      }
    }
  }, [portalId, formId, region, className, scriptId, scriptUrl]);

  return <div ref={containerRef} />;
}

