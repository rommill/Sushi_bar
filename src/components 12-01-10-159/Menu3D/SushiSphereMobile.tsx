import { useRef, useMemo } from "react";
import { Text, Float, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SushiItem } from "../../types";
import { sushiData } from "../../data/sushi";

interface SushiSphereProps {
  onSushiClick?: (sushi: SushiItem) => void;
}

function SushiCard({
  sushi,
  pos,
  onClick,
}: {
  sushi: SushiItem;
  pos: any;
  onClick: () => void;
}) {
  // Загружаем текстуру. Если путь правильный (/images/...), она появится
  const texture = useTexture(sushi.image);

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        position={[pos.x, pos.y, pos.z]}
        rotation={[0, pos.rotationY + Math.PI, 0]} // Разворачиваем к камере
        onClick={onClick}
      >
        {/* Сама карточка с картинкой */}
        <mesh>
          <planeGeometry args={[1.8, 2.2]} />
          <meshStandardMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent={true}
            roughness={0.6}
          />
        </mesh>

        {/* Подложка для текста, чтобы он читался */}
        <mesh position={[0, -0.8, -0.01]}>
          <planeGeometry args={[1.8, 0.6]} />
          <meshBasicMaterial color="black" transparent opacity={0.5} />
        </mesh>

        <Text
          position={[0, -0.7, 0.05]}
          fontSize={0.15}
          color="white"
          maxWidth={1.6}
          textAlign="center"
        >
          {`${sushi.name}\n€${sushi.price}`}
        </Text>
      </group>
    </Float>
  );
}

export default function SushiSphereMobile({ onSushiClick }: SushiSphereProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15; // Чуть быстрее для динамики
    }
  });

  const positions = useMemo(() => {
    return sushiData.map((_, i) => {
      const angle = (i / sushiData.length) * Math.PI * 2;
      // Уменьшили радиус до 2.8, чтобы на iPhone всё влезло в экран
      const radius = 2.8;

      return {
        x: Math.cos(angle) * radius,
        // Добавили небольшой разброс по высоте, чтобы карточки не слипались
        y: i % 2 === 0 ? 0.5 : -0.5,
        z: Math.sin(angle) * radius,
        rotationY: -angle,
      };
    });
  }, []);

  return (
    <>
      <ambientLight intensity={1.2} />
      <pointLight position={[5, 5, 5]} intensity={1.5} />

      <group ref={groupRef}>
        {sushiData.map((sushi, index) => (
          <SushiCard
            key={sushi.id}
            sushi={sushi}
            pos={positions[index]}
            onClick={() => onSushiClick?.(sushi)}
          />
        ))}
      </group>
    </>
  );
}
