import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  Environment,
  ContactShadows,
  Float,
  Html,
} from "@react-three/drei";
import * as THREE from "three";

function CityEnvironment() {
  const buildings = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 40; i++) {
      const x = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 50;
      if (Math.abs(x) < 7 && Math.abs(z) < 7) continue;
      temp.push({
        position: [x, Math.random() * 3 + 0.5, z],
        args: [
          2 + Math.random() * 1,
          2 + Math.random() * 6,
          2 + Math.random() * 1,
        ],
        id: i,
      });
    }
    return temp;
  }, []);

  return (
    <group>
      {buildings.map((b) => (
        <mesh key={b.id} position={b.position as any}>
          <boxGeometry args={b.args as any} />
          <meshStandardMaterial color="#080808" />
        </mesh>
      ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#020202" />
      </mesh>
    </group>
  );
}

function AutoCamera() {
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.3; // Скорость облета
    const radius = 15;
    state.camera.position.x = Math.sin(t) * radius;
    state.camera.position.z = Math.cos(t) * radius;
    state.camera.position.y = 7;
    state.camera.lookAt(0, 1, 0);
  });
  return <PerspectiveCamera makeDefault fov={45} />;
}

export default function ContactMap3D() {
  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <Canvas shadows>
        {/* 1. Насыщенный фоновый свет (чтобы видеть очертания зданий) */}
        <ambientLight intensity={0.4} />
        {/* 2. Основной прожектор над рестораном */}
        <spotLight
          position={[15, 20, 15]}
          angle={0.3}
          penumbra={1}
          intensity={200} // В новых версиях Three.js значения интенсивности стали выше
          castShadow
        />
        {/* 3. Дополнительный заполняющий свет с другой стороны */}
        <pointLight
          position={[-10, 5, -10]}
          intensity={50}
          color="#3355ff"
          opacity={0.5}
        />
        <CityEnvironment />
        <group position={[0, 0, 0]}>
          {/* Здание ресторана */}
          <mesh castShadow receiveShadow position={[0, 2, 0]}>
            <boxGeometry args={[4, 4, 4]} />
            <meshStandardMaterial
              color="#202020"
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>

          {/* Светящаяся вывеска */}
          <Html transform position={[0, 2.5, 2.05]} distanceFactor={8}>
            <div
              style={{
                color: "#fff",
                fontSize: "44px",
                fontWeight: "900",
                fontFamily: "'Arial Black', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "2px",
                // Эффект неонового свечения
                textShadow: `
          0 0 10px #ff0000,
          0 0 20px #ff0000,
          0 0 40px #ff0000
        `,
                padding: "10px",
                border: "2px solid #ff0000",
                background: "rgba(0,0,0,0.5)",
              }}
            >
              Sushi Bar
            </div>
          </Html>
        </group>
        <Environment preset="city" />{" "}
        {/* Сменил night на city для более ярких бликов */}
        <AutoCamera />
        <ContactShadows opacity={0.6} scale={40} blur={2} far={15} />
      </Canvas>
    </div>
  );
}
