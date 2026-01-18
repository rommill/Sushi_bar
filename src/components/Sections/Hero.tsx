import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HeroProps {
  onAnimationComplete: () => void;
}

export default function Hero({ onAnimationComplete }: HeroProps) {
  const [showSun, setShowSun] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSun(true), 500);
    const timer2 = setTimeout(() => setShowTitle(true), 1500);
    const timer3 = setTimeout(() => setShowSubtitle(true), 2500);
    const timer4 = setTimeout(() => setShowMenu(true), 3500);
    const timer5 = setTimeout(() => {
      setAnimationComplete(true);
      onAnimationComplete();
    }, 4500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onAnimationComplete]);

  if (animationComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-orange-50 to-amber-100">
      {/* Солнце */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={showSun ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5 }}
        className="relative mb-12"
      >
        <div className="w-64 h-64 bg-gradient-to-br from-red-500 to-yellow-300 rounded-full shadow-2xl" />
      </motion.div>

      {/* Текст */}
      <AnimatePresence>
        {showTitle && (
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl font-bold text-gray-800 mb-4"
          >
            中国传统文化
          </motion.h1>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubtitle && (
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl text-gray-600 mb-8"
          >
            中国传统建筑
          </motion.h2>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-lg text-gray-600 mb-2">Загрузка меню...</div>
            <div className="w-48 h-2 bg-gray-200 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1 }}
                className="h-full bg-red-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
