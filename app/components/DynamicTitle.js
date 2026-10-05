"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DynamicTitle() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0) {
      const lastParam = segments[segments.length - 1];
      // Capitalize first letter for display
      const capitalized = lastParam.charAt(0).toUpperCase() + lastParam.slice(1);
      document.title = `Pay ${capitalized} on Cash App`;
      
      // Update meta description
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `Pay ${capitalized} on Cash App`);
      }
    } else {
      document.title = "Pay Emily on Cash App";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", "Pay Emily on Cash App");
      }
    }
  }, [pathname]);

  return null;
}
