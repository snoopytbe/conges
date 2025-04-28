import { useState, useEffect } from "react";
import UAParser from "ua-parser-js";

/**
 * Hook personnalisé pour détecter si l'appareil est un mobile
 * @returns {boolean} - true si l'appareil est un mobile, false sinon
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const parser = new UAParser();
    setIsMobile(parser?.getDevice()?.type === "mobile");
  }, []);
  
  return isMobile;
} 