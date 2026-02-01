// SushiSphereDesktop.tsx - ДЕСКТОПНАЯ ВЕРСИЯ (ПОЛНАЯ)
import { useRef, useState, useEffect, useMemo } from "react";
import { Text, Float, Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { SushiItem } from "../../types";
import { sushiData } from "../../data/sushi";

interface SushiSphereProps {
  onSushiClick?: (sushi: SushiItem) => void;
}

export default function SushiSphereDesktop({ onSushiClick }: SushiSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [textures, setTextures] = useState<Record<number, THREE.Texture>>({});
  const rotationFactor = useRef(0);

  useEffect(() => {
    const textureLoader = new THREE.TextureLoader();
    sushiData.forEach((sushi) => {
      if (sushi.image && !textures[sushi.id]) {
        // УМНАЯ ПРОВЕРКА ПУТИ:
        let path = sushi.image;
        // Если это не внешняя ссылка и не начинается с /, добавляем /
        if (!path.startsWith("http") && !path.startsWith("/")) {
          path = "/" + path;
        }

        textureLoader.load(path, (texture) => {
          setTextures((prev: Record<number, THREE.Texture>) => ({
            ...prev,
            [sushi.id]: texture,
          }));
        });
      }
    });
  }, []);

  const spherePositions = useMemo(() => {
    return sushiData.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / sushiData.length);
      const theta = Math.sqrt(sushiData.length * Math.PI) * phi;
      const radius = 5;
      return {
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        floatSpeed: 0.5 + i * 0.1,
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetSpeed = hoveredId !== null ? 0 : 0.05;
      rotationFactor.current = THREE.MathUtils.lerp(
        rotationFactor.current,
        targetSpeed,
        0.05,
      );
      groupRef.current.rotation.y += delta * rotationFactor.current;
    }
  });

  return (
    <group ref={groupRef}>
      {sushiData.map((sushi, index) => (
        <SushiCard
          key={sushi.id}
          sushi={sushi}
          pos={spherePositions[index]}
          texture={textures[sushi.id]}
          isHovered={hoveredId === sushi.id}
          onHover={() => setHoveredId(sushi.id)}
          onUnhover={() => setHoveredId(null)}
          onSushiClick={onSushiClick}
        />
      ))}
    </group>
  );
}

// Внутренний компонент SushiCard
function SushiCard({
  sushi,
  pos,
  texture,
  isHovered,
  onHover,
  onUnhover,
  onSushiClick,
}: {
  sushi: SushiItem;
  pos: { x: number; y: number; z: number; floatSpeed: number };
  texture: THREE.Texture | undefined;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  onSushiClick?: (sushi: SushiItem) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [isClicked, setIsClicked] = useState(false);

  useFrame(() => {
    if (groupRef.current) {
      // 1. Плавное увеличение при наведении
      // 2. Эффект "подлета" при клике (scale становится огромным)
      const targetScale = isClicked ? 3 : isHovered ? 1.5 : 1;
      groupRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setIsClicked(true);
    // Небольшая задержка перед открытием меню, чтобы успели увидеть анимацию "подлета"
    setTimeout(() => {
      onSushiClick?.(sushi);
      setIsClicked(false);
    }, 300);
  };

  return (
    <Float
      speed={isHovered || isClicked ? 0 : pos.floatSpeed}
      rotationIntensity={0.2}
      floatIntensity={0.5}
    >
      <group
        ref={groupRef}
        position={[pos.x, pos.y, pos.z]}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover();
        }}
        onPointerOut={onUnhover}
        onClick={handleClick}
      >
        <Billboard>
          {/* Изображение суши */}
          <mesh position={[0, 0, 0.01]}>
            <circleGeometry args={[0.7, 32]} />
            {texture ? (
              <meshBasicMaterial
                map={texture}
                transparent
                side={THREE.DoubleSide}
              />
            ) : (
              <meshStandardMaterial color="#444" transparent opacity={0.3} />
            )}
          </mesh>

          {/* Мягкая подсветка */}
          <mesh visible={isHovered} scale={1.05} position={[0, 0, 0]}>
            <circleGeometry args={[0.72, 32]} />
            <meshBasicMaterial color="white" transparent opacity={0.2} />
          </mesh>

          <Text
            position={[0, -1.1, 0.02]}
            fontSize={0.25}
            color="white"
            outlineWidth={0.03}
            outlineColor="#1a1a1a"
            textAlign="center"
          >
            {`${sushi.name}\n${sushi.price} €`}
          </Text>
        </Billboard>
      </group>
    </Float>
  );
}
