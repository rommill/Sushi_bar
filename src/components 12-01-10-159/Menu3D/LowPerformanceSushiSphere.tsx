import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface LowPerformanceSushiSphereProps {
  onSushiClick: (sushi: any) => void;
}

const LowPerformanceSushiSphere: React.FC<LowPerformanceSushiSphereProps> = ({
  onSushiClick,
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Простые цвета вместо текстур
  const sushiItems = [
    { name: "Philadelphia", position: [2, 0, 0], color: "#FF6B6B" },
    { name: "California", position: [-2, 0, 0], color: "#4ECDC4" },
    { name: "Unagi", position: [0, 2, 0], color: "#FFD166" },
    { name: "Sake Maki", position: [0, -2, 0], color: "#06D6A0" },
  ];

  return (
    <group ref={groupRef}>
      {/* Упрощенная центральная сфера */}
      <mesh>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial color="#2D3436" />
      </mesh>

      {sushiItems.map((sushi, index) => (
        <mesh
          key={index}
          position={sushi.position as [number, number, number]}
          onClick={() => onSushiClick({ name: sushi.name })}
        >
          <sphereGeometry args={[0.5, 8, 8]} />
          <meshBasicMaterial color={sushi.color} />
          <Text position={[0, 0.8, 0]} fontSize={0.3} color="white">
            {sushi.name}
          </Text>
        </mesh>
      ))}
    </group>
  );
};

export default LowPerformanceSushiSphere;
