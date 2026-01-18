import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SushiItem } from "../../types";
import { sushiData } from "../../data/sushi";

interface SushiSphereProps {
  onSushiClick?: (sushi: SushiItem) => void;
}

export default function SushiSphere({ onSushiClick }: SushiSphereProps) {
  const sphereRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  // Создаем позиции для элементов суши
  const positions = sushiData.map((_, i) => {
    const phi = Math.acos(-1 + (2 * i) / sushiData.length);
    const theta = Math.sqrt(sushiData.length * Math.PI) * phi;

    return {
      x: 3 * Math.cos(theta) * Math.sin(phi),
      y: 3 * Math.sin(theta) * Math.sin(phi),
      z: 3 * Math.cos(phi),
    };
  });

  const handleClick = (sushi: SushiItem) => {
    console.log("Clicked sushi:", sushi.name);
    if (onSushiClick) {
      onSushiClick(sushi);
    }
  };

  return (
    <group ref={sphereRef}>
      {/* Полупрозрачная сфера-основа */}
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshStandardMaterial
          color="#FF6B6B"
          transparent
          opacity={0.05}
          wireframe
        />
      </mesh>

      {/* Элементы суши */}
      {sushiData.map((sushi, index) => {
        const pos = positions[index];
        const isHovered = hovered === sushi.id;

        return (
          <group
            key={sushi.id}
            position={[pos.x, pos.y, pos.z]}
            onPointerOver={() => setHovered(sushi.id)}
            onPointerOut={() => setHovered(null)}
            onClick={() => handleClick(sushi)}
          >
            {/* Шар-точка */}
            <mesh>
              <sphereGeometry args={[isHovered ? 0.25 : 0.2, 16, 16]} />
              <meshStandardMaterial
                color={sushi.popular ? "#FF9E7D" : "#8BC34A"}
                emissive={isHovered ? "#FF6B6B" : "#000000"}
                emissiveIntensity={isHovered ? 0.5 : 0}
              />
            </mesh>

            {/* Название суши в 3D */}
            <Text
              position={[0, isHovered ? 0.5 : 0.4, 0]}
              fontSize={0.2}
              color={
                isHovered ? "#FF6B6B" : sushi.popular ? "#FF9E7D" : "#FFFFFF"
              }
              anchorX="center"
              anchorY="middle"
              maxWidth={1}
              outlineWidth={0.02}
              outlineColor="#000000"
            >
              {sushi.name}
            </Text>

            {/* Популярная метка */}
            {sushi.popular && (
              <Text
                position={[0, -0.3, 0]}
                fontSize={0.12}
                color="#FFD700"
                anchorX="center"
                anchorY="middle"
              >
                ★ Popular
              </Text>
            )}

            {/* Цена в евро */}
            <Text
              position={[0, -0.5, 0]}
              fontSize={0.15}
              color={isHovered ? "#FF6B6B" : "#CCCCCC"}
              anchorX="center"
              anchorY="middle"
            >
              €{sushi.price}
            </Text>
          </group>
        );
      })}

      {/* Освещение */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#FF6B6B" />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#8BC34A" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#FF9E7D" />
      <ambientLight intensity={0.4} />
    </group>
  );
}
