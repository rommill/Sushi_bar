// src/components/Menu3D/SushiSphereMobile.tsx
import { useRef, useMemo } from "react";
import { Text, Float } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SushiItem } from "../../types";
import { sushiData } from "../../data/sushi";

interface SushiSphereProps {
  onSushiClick?: (sushi: SushiItem) => void;
}

export default function SushiSphereMobile({ onSushiClick }: SushiSphereProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  // Более простые позиции для мобильного
  const positions = useMemo(() => {
    return sushiData.map((_, i) => {
      const angle = (i / sushiData.length) * Math.PI * 2;
      const radius = 3.5;

      return {
        x: Math.cos(angle) * radius,
        y: 0,
        z: Math.sin(angle) * radius,
        rotationY: -angle,
      };
    });
  }, []);

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[5, 5, 5]} intensity={1} />

      <group ref={groupRef}>
        {sushiData.map((sushi, index) => {
          const pos = positions[index];

          return (
            <Float key={sushi.id} speed={0.5} floatIntensity={0.15}>
              <group
                position={[pos.x, pos.y, pos.z]}
                rotation={[0, pos.rotationY, 0]}
                onClick={() => onSushiClick?.(sushi)}
              >
                {/* Упрощенная карточка */}
                <mesh>
                  <boxGeometry args={[1.6, 2, 0.06]} />
                  <meshStandardMaterial
                    color={sushi.popular ? "#FFE0B2" : "#FFFFFF"}
                    roughness={0.5}
                    side={THREE.DoubleSide}
                  />
                </mesh>

                {/* Только название и цена */}
                <Text
                  position={[0, 0, 0.031]}
                  fontSize={0.16}
                  color="#333333"
                  anchorX="center"
                  anchorY="middle"
                  maxWidth={1.4}
                >
                  {sushi.name}
                </Text>

                <Text
                  position={[0, -0.5, 0.031]}
                  fontSize={0.14}
                  color="#666666"
                  anchorX="center"
                  anchorY="middle"
                >
                  €{sushi.price}
                </Text>
              </group>
            </Float>
          );
        })}
      </group>
    </>
  );
}
