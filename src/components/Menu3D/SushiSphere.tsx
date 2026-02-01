// src/components/Menu3D/SushiSphere.tsx
import { useState, useEffect, Suspense } from "react";
import SushiSphereDesktop from "./SushiSphereDesktop";
import SushiSphereMobile from "./SushiSphereMobile";
import type { SushiItem } from "../../types";

interface SushiSphereProps {
  onSushiClick?: (sushi: SushiItem) => void;
}

export default function SushiSphere({ onSushiClick }: SushiSphereProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsLoading(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isLoading) {
    return null; // или лоадер
  }

  return (
    <Suspense fallback={null}>
      {isMobile ? (
        <SushiSphereMobile onSushiClick={onSushiClick} />
      ) : (
        <SushiSphereDesktop onSushiClick={onSushiClick} />
      )}
    </Suspense>
  );
}
