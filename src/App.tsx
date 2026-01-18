import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SunriseAnimation from "./components/Sections/SunriseAnimation";
import MenuSection from "./components/Sections/MenuSection";
import SushiSphere from "./components/Menu3D/SushiSphere";
import SushiModal from "./components/UI/SushiModal";
import SimpleCart from "./components/Cart/SimpleCart";
import { useCartStorage } from "./hooks/useCartStorage";
import type { SushiItem } from "./types";
import "./index.css";

function App() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showMenuSection, setShowMenuSection] = useState(false);
  const [show3DSphere, setShow3DSphere] = useState(false);
  const [selectedSushi, setSelectedSushi] = useState<SushiItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Получаем методы из хука - используйте правильные названия
  const {
    cart, // Это должно быть cart, а не cartItems
    selectedSushi: cartSelectedSushi,
    setSelectedSushi: setCartSelectedSushi,
    addToCart, // Это addToCart, а не addItem
    removeFromCart, // Это removeFromCart, а не removeItem
    updateQuantity, // Это updateQuantity, а не updateItemQuantity
    clearCart,
    getTotalPrice, // Это getTotalPrice, а не getTotal
    getTotalItems, // Это getTotalItems, а не getItemCount
  } = useCartStorage();

  const handleSushiClick = (sushi: SushiItem) => {
    console.log("Sushi clicked:", sushi.name);
    setSelectedSushi(sushi);
    setShowModal(true);
  };

  const handleAddToCart = (sushi: SushiItem) => {
    addToCart(sushi); // Используем addToCart вместо addItem
    console.log("Added to cart:", sushi.name);
  };

  // Для отладки - посмотрим что возвращает хук
  console.log("Cart from hook:", cart);
  console.log("Is array?", Array.isArray(cart));

  if (showAnimation) {
    return (
      <SunriseAnimation
        onComplete={() => {
          setShowAnimation(false);
          setShowMenuSection(true);
        }}
      />
    );
  }

  if (show3DSphere) {
    return (
      <>
        <div className="three-d-container">
          <header className="three-d-header">
            <div className="logo">
              <div className="logo-circle">寿</div>
              <h1>3D Sushi Sphere</h1>
            </div>

            <div className="header-buttons">
              <button
                onClick={() => {
                  setShow3DSphere(false);
                  setShowMenuSection(true);
                }}
                className="back-btn"
              >
                ← Back to Menu
              </button>
              <button
                onClick={() => {
                  setShow3DSphere(false);
                  setShowAnimation(true);
                }}
                className="sunrise-btn"
              >
                🌅 Start Over
              </button>
            </div>
          </header>

          <div className="three-d-canvas-container">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight
                position={[-10, -10, -10]}
                intensity={0.5}
                color="#FF6B6B"
              />
              <Suspense fallback={null}>
                <SushiSphere onSushiClick={handleSushiClick} />
              </Suspense>
              <OrbitControls
                enableZoom={true}
                enablePan={true}
                enableRotate={true}
                zoomSpeed={0.6}
                panSpeed={0.5}
                rotateSpeed={0.5}
                maxDistance={12}
                minDistance={3}
                autoRotate
                autoRotateSpeed={0.3}
              />
            </Canvas>

            <div className="canvas-hint">
              <p>
                🖱️ Rotate with mouse • 🔍 Zoom with wheel • 👆 Click sushi for
                details
              </p>
            </div>
          </div>

          <footer className="three-d-footer">
            <p>
              Interactive 3D Menu • React + Three.js • Cart: {getTotalItems()}{" "}
              items (€{getTotalPrice().toFixed(2)})
            </p>
          </footer>
        </div>

        {/* Модалка */}
        <SushiModal
          sushi={selectedSushi}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
        />

        {/* Корзина с Local Storage */}
        <SimpleCart
          cart={cart || []} // Используем cart и проверяем на undefined
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          totalPrice={getTotalPrice()}
          totalItems={getTotalItems()}
        />
      </>
    );
  }

  return (
    <>
      <MenuSection
        onBackToSunrise={() => {
          setShowMenuSection(false);
          setShowAnimation(true);
        }}
        onOpen3DMenu={() => {
          setShowMenuSection(false);
          setShow3DSphere(true);
        }}
        onAddToCart={handleAddToCart}
      />

      {/* Модалка для обычного меню */}
      <SushiModal
        sushi={selectedSushi}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Корзина с Local Storage */}
      <SimpleCart
        cart={cart || []} // Используем cart, а не items
        onRemove={removeFromCart} // Используем onRemove, а не onRemoveItem
        onUpdateQuantity={updateQuantity} // Используем onUpdateQuantity
        totalPrice={getTotalPrice()}
        totalItems={getTotalItems()}
      />
    </>
  );
}

export default App;
