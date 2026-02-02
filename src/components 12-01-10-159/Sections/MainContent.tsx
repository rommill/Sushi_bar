import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { motion } from "framer-motion";
import SushiSphere from "../Menu3D/SushiSphere";
import { sushiData } from "../../data/sushi";

interface MainContentProps {
  show: boolean;
}

export default function MainContent({ show }: MainContentProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen pt-20"
    >
      <section className="min-h-screen flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 text-center mb-12">
          <h1 className="text-5xl font-bold mb-6">Sushi Bar 3D</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Исследуйте наше меню в интерактивной 3D сфере
          </p>
        </div>

        <div className="w-full h-[500px]">
          <Canvas camera={{ position: [0, 0, 8] }}>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <SushiSphere sushiItems={sushiData} />
            <OrbitControls enableZoom enablePan enableRotate />
          </Canvas>
        </div>
      </section>
    </motion.div>
  );
}
