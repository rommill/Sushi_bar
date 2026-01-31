import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SunriseAnimation from "./components/Sections/SunriseAnimation";
import MenuSection from "./components/Sections/MenuSection";
import SushiSphere from "./components/Menu3D/SushiSphere";
import SushiModal from "./components/UI/SushiModal";
import SimpleCart from "./components/Cart/SimpleCart";
import CheckoutPage from "./components/Checkout/CheckoutPage";
import { useCartStorage } from "./hooks/useCartStorage";
import type { SushiItem } from "./types";
import LowPerformanceSushiSphere from "./components/Menu3D/LowPerformanceSushiSphere";
import "./index.css";

// Функция определения Intel Mac + Chrome
const isIntelMac = () => {
  if (typeof navigator === "undefined") return false;
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const isChrome =
    /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
  return isMac && isChrome;
};

function App() {
  // Состояния для навигации
  const [showAnimation, setShowAnimation] = useState(true);
  const [showMenuSection, setShowMenuSection] = useState(false);
  const [show3DSphere, setShow3DSphere] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  // Состояния для модалки и корзины
  const [selectedSushi, setSelectedSushi] = useState<SushiItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Определяем какую версию 3D сферы использовать
  const shouldUseLowPerformance = isIntelMac();

  // Хук для работы с корзиной
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCartStorage();

  // Обработчик клика на суши
  const handleSushiClick = (sushi: SushiItem) => {
    console.log("Sushi clicked:", sushi.name);
    setSelectedSushi(sushi);
    setShowModal(true);
  };

  // Обработчик добавления в корзину
  const handleAddToCart = (sushi: SushiItem) => {
    addToCart(sushi);
    console.log("Added to cart:", sushi.name);
    setShowCart(true);
  };

  // Кнопка переключения корзины
  const CartToggleButton = () => (
    <button
      onClick={() => setShowCart(!showCart)}
      className="cart-toggle-btn"
      aria-label={showCart ? "Hide cart" : "Show cart"}
    >
      🛒 Cart ({getTotalItems()})
      {getTotalItems() > 0 && (
        <span className="cart-badge">€{getTotalPrice().toFixed(2)}</span>
      )}
    </button>
  );

  // Кнопка перехода к оформлению заказа
  const CheckoutButton = () => (
    <button
      onClick={() => setShowCheckout(true)}
      className="checkout-nav-btn"
      disabled={getTotalItems() === 0}
    >
      🚀 Proceed to Checkout
      {getTotalItems() > 0 && (
        <span className="checkout-badge">€{getTotalPrice().toFixed(2)}</span>
      )}
    </button>
  );

  // Кнопка назад из чекаута
  const BackFromCheckoutButton = () => (
    <button
      onClick={() => setShowCheckout(false)}
      className="back-from-checkout-btn"
    >
      ← Back to Menu
    </button>
  );

  // ==================== RENDER LOGIC ====================

  // Показываем Checkout страницу
  if (showCheckout) {
    return (
      <div className="checkout-wrapper">
        <header className="checkout-nav-header">
          <div className="checkout-nav">
            <BackFromCheckoutButton />
            <div className="checkout-title">
              <h1>🍣 Sushi Bar Checkout</h1>
              <p>Test transaction - no real payment</p>
            </div>
          </div>
        </header>
        <CheckoutPage />
      </div>
    );
  }

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
              <CartToggleButton />
              <CheckoutButton />
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

          {/* Уведомление об упрощенной версии */}
          {shouldUseLowPerformance && (
            <div className="intel-notice">
              <p>🎮 Using simplified 3D for better performance on Intel Mac</p>
            </div>
          )}

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
                {shouldUseLowPerformance ? (
                  <LowPerformanceSushiSphere onSushiClick={handleSushiClick} />
                ) : (
                  <SushiSphere onSushiClick={handleSushiClick} />
                )}
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
            <CheckoutButton />
          </footer>
        </div>

        {/* Модалка */}
        <SushiModal
          sushi={selectedSushi}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
        />

        {/* Корзина */}
        <SimpleCart
          cart={cart || []}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          totalPrice={getTotalPrice()}
          totalItems={getTotalItems()}
          onClose={() => setShowCart(false)}
          isVisible={showCart}
        />
      </>
    );
  }

  // Menu Section
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
        cartToggle={<CartToggleButton />}
        checkoutButton={<CheckoutButton />}
      />

      {/* Модалка для обычного меню */}
      <SushiModal
        sushi={selectedSushi}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Корзина */}
      <SimpleCart
        cart={cart || []}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        totalPrice={getTotalPrice()}
        totalItems={getTotalItems()}
        onClose={() => setShowCart(false)}
        isVisible={showCart}
      />
    </>
  );
}

export default App;
