import { useEffect, useState } from "react";
import "./SunriseAnimation.css";

interface SunriseAnimationProps {
  onComplete: () => void;
}

export default function SunriseAnimation({
  onComplete,
}: SunriseAnimationProps) {
  const [showText, setShowText] = useState(false);
  const [brightness, setBrightness] = useState(0.3);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  useEffect(() => {
    if (isSkipped) return; // Если пропустили, не запускаем анимацию

    // Загрузка изображения
    const img = new Image();
    img.src = "/images/sun.png";
    img.onload = () => setImageLoaded(true);

    // Анимация яркости (6 секунд)
    const brightnessInterval = setInterval(() => {
      setBrightness((prev) => {
        if (prev >= 1.2) {
          clearInterval(brightnessInterval);
          return 1.2;
        }
        return prev + 0.015;
      });
    }, 50);

    // Показ текста через 4 секунды
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 4000);

    // Завершение через 8 секунд
    const completionTimer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearInterval(brightnessInterval);
      clearTimeout(textTimer);
      clearTimeout(completionTimer);
    };
  }, [onComplete, isSkipped]);

  // Обработчик пропуска
  const handleSkip = () => {
    setIsSkipped(true);
    onComplete();
  };

  // Горячие клавиши
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Escape" || e.key === "Enter") {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="scene-container">
      {/* Кнопка Skip */}
      <button
        className="skip-button"
        onClick={handleSkip}
        aria-label="Skip animation"
      >
        ⏩ Skip
        <span className="skip-hint">(ESC / Space)</span>
      </button>

      {/* Световая вспышка (солнце) */}
      <div className="sun" />

      {/* Картинка с домиком */}
      {imageLoaded && (
        <div
          className="silhouette"
          style={{
            filter: `brightness(${brightness}) contrast(${brightness})`,
          }}
        />
      )}

      {/* Текст приглашения */}
      <div className={`invite-text ${showText ? "show" : ""}`}>
        <h1 style={{ fontSize: "4rem", marginBottom: "20px" }}>
          Japanese Tradition
        </h1>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "40px" }}>
          Modern Sushi Experience
        </h2>
        <p
          style={{
            fontSize: "1.2rem",
            marginBottom: "30px",
            maxWidth: "600px",
          }}
        >
          Discover the art of Japanese cuisine in a modern 3D format
        </p>
        <div className="loading-indicator">
          <div className="loading-bar" />
          <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
            Loading menu...
          </p>
        </div>
      </div>
    </div>
  );
}
