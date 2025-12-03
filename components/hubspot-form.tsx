"use client";

import { useEffect, useRef } from "react";

interface HubSpotFormProps {
  /**
   * The HubSpot portal ID (e.g., "244495034")
   */
  portalId: string;
  /**
   * The HubSpot form ID (e.g., "ae198bf0-8ccb-4c53-b539-e1e066b9fecb")
   */
  formId: string;
  /**
   * Optional: Region (e.g., "na1", "na2", "eu1")
   * Defaults to "na2" (based on your embed code)
   */
  region?: string;
  /**
   * Optional: Additional CSS class names
   */
  className?: string;
}

/**
 * HubSpot Form Component for Next.js
 * 
 * Uses HubSpot's standard forms API for reliable rendering.
 * 
 * Usage:
 * <HubSpotForm 
 *   portalId="244495034" 
 *   formId="ae198bf0-8ccb-4c53-b539-e1e066b9fecb" 
 *   region="na2"
 * />
 */
export function HubSpotForm({
  portalId,
  formId,
  region = "na2",
  className,
}: HubSpotFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const formCreatedRef = useRef(false);
  const containerId = `hs-form-container-${formId}`;

  useEffect(() => {
    if (!formRef.current || formCreatedRef.current) return;

    const container = formRef.current;
    
    // Ensure container has an ID
    if (!container.id) {
      container.id = containerId;
    }

    // Function to create the form
    const createForm = () => {
      if (!window.hbspt || !window.hbspt.forms || !container) return;

      // Clear any existing content
      container.innerHTML = "";

      try {
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: `#${containerId}`,
        });
        formCreatedRef.current = true;
      } catch (error) {
        console.error("Error creating HubSpot form:", error);
      }
    };

    // Check if HubSpot script is already loaded
    if (window.hbspt && window.hbspt.forms) {
      createForm();
      return;
    }

    // Load HubSpot forms script
    const scriptId = "hs-forms-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "//js.hsforms.net/forms/v2.js";
      script.charset = "utf-8";
      script.type = "text/javascript";
      script.async = true;

      script.onload = () => {
        if (window.hbspt && window.hbspt.forms) {
          createForm();
        }
      };

      script.onerror = () => {
        console.error("Failed to load HubSpot forms script");
      };

      document.head.appendChild(script);
    } else {
      // Script exists, wait for it to load if not already loaded
      if (script.complete || script.readyState === "complete") {
        // Script already loaded
        if (window.hbspt && window.hbspt.forms) {
          createForm();
        }
      } else {
        script.onload = () => {
          if (window.hbspt && window.hbspt.forms) {
            createForm();
          }
        };
      }
    }

    return () => {
      // Cleanup: clear form container
      if (container) {
        container.innerHTML = "";
      }
      formCreatedRef.current = false;
    };
  }, [portalId, formId, region, containerId]);

  return (
    <div
      ref={formRef}
      id={containerId}
      className={className || ""}
    />
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    hbspt?: {
      forms: {
        create: (options: {
          region?: string;
          portalId: string;
          formId: string;
          target: string;
          [key: string]: unknown;
        }) => void;
      };
    };
  }
}

