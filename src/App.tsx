import { useState, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Components
import SunriseAnimation from "./components/Sections/SunriseAnimation";
import MenuSection from "./components/Sections/MenuSection";
import SushiSphere from "./components/Menu3D/SushiSphere";
import SushiModal from "./components/UI/SushiModal";
import SimpleCart from "./components/Cart/SimpleCart";
import CheckoutPage from "./components/Checkout/CheckoutPage";
import LowPerformanceSushiSphere from "./components/Menu3D/LowPerformanceSushiSphere";
import AdminOrders from "./components/Admin/AdminOrders";
import Footer from "./components/Layout/Footer";

// Hooks & Types
import { useCartStorage } from "./hooks/useCartStorage";
import type { SushiItem } from "./types";
import "./index.css";

// Utils: Вынесено из компонента
const isIntelMac = () => {
  if (typeof navigator === "undefined") return false;
  return (
    /Mac/.test(navigator.platform) &&
    /Chrome/.test(navigator.userAgent) &&
    !/Edge/.test(navigator.userAgent)
  );
};

function App() {
  // Navigation State
  const [view, setView] = useState<
    "animation" | "menu" | "3d" | "checkout" | "admin"
  >("animation");

  // UI State
  const [selectedSushi, setSelectedSushi] = useState<SushiItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Performance Check
  const shouldUseLowPerformance = useMemo(() => isIntelMac(), []);

  // Cart Logic
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStorage();

  // --- Handlers ---
  const handleSushiClick = (sushi: SushiItem) => {
    setSelectedSushi(sushi);
    setShowModal(true);
  };

  const handleAddToCart = (sushi: SushiItem) => {
    addToCart(sushi);
    setShowCart(true);
  };

  // Method для отправки заказа в Telegram
  const handlePlaceOrder = async (orderData: any) => {
    const BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID;

    const message = `
🍣 **НОВЫЙ ЗАКАЗ!**
━━━━━━━━━━━━━━
👤 **Клиент:** ${orderData.name}
📞 **Телефон:** ${orderData.phone}
📍 **Адрес:** ${orderData.address}, ${orderData.city}
📧 **Email:** ${orderData.email}

🛒 **ТОВАРЫ:**
${cart.map((item: any) => `• ${item.name} (x${item.quantity}) - €${(item.price * item.quantity).toFixed(2)}`).join("\n")}

━━━━━━━━━━━━━━
💰 **ИТОГО: €${getTotalPrice().toFixed(2)}**
    `.trim();

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: "Markdown",
          }),
        },
      );

      if (!response.ok) throw new Error("Telegram API Error");

      const result = await response.json();
      if (result.ok) {
        clearCart();
        return { success: true };
      }
      throw new Error("Failed to send message");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Ошибка при отправке заказа.");
      throw error;
    }
  };

  // --- Shared UI Components ---
  const CartButton = () => (
    <button onClick={() => setShowCart(true)} className="cart-toggle-btn">
      🛒 Cart ({getTotalItems()})
      {getTotalItems() > 0 && (
        <span className="cart-badge">€{getTotalPrice().toFixed(2)}</span>
      )}
    </button>
  );

  const CheckoutNavButton = () => (
    <button
      onClick={() => setView("checkout")}
      className="checkout-nav-btn"
      disabled={getTotalItems() === 0}
    >
      🚀 Checkout
    </button>
  );

  // ==================== RENDER SCENES ====================

  // 1. ANIMATION SCENE
  if (view === "animation") {
    return <SunriseAnimation onComplete={() => setView("menu")} />;
  }

  if (view === "admin") {
    return (
      <div className="admin-wrapper">
        <button onClick={() => setView("menu")} className="exit-admin">
          ← Back to Site
        </button>
        <AdminOrders />
      </div>
    );
  }
  // 2. CHECKOUT SCENE
  if (view === "checkout") {
    return (
      <div className="checkout-wrapper">
        <header className="checkout-nav-header">
          <button
            onClick={() => setView("3d")}
            className="back-from-checkout-btn"
          >
            ← Back
          </button>
          <h1>Checkout</h1>
        </header>
        <CheckoutPage
          cart={cart}
          total={getTotalPrice()}
          onOrderSubmit={handlePlaceOrder}
        />
      </div>
    );
  }

  // 3. 3D SPHERE SCENE
  if (view === "3d") {
    return (
      <>
        <div className="three-d-container fixed inset-0 flex flex-col overflow-hidden bg-slate-900">
          <header className="three-d-header flex-shrink-0 z-50">
            {/* Твой текущий хедер */}
            <div
              className="logo"
              onClick={() => setView("admin")}
              style={{ cursor: "pointer" }}
            >
              <div className="logo-circle">寿</div>
              <h1 className="text-white">3D Menu</h1>
            </div>
            <div className="header-buttons">
              <CartButton />
              <CheckoutNavButton />
              <button onClick={() => setView("menu")} className="back-btn">
                ← Menu
              </button>
            </div>
          </header>

          <div className="flex-grow relative w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 50 }}
              dpr={[1, 2]} // Оптимизация для мобильных ретина-дисплеев
              style={{ touchAction: "none" }} // Чтобы скролл не дергался
            >
              <ambientLight intensity={0.6} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <Suspense fallback={null}>
                {shouldUseLowPerformance ? (
                  <LowPerformanceSushiSphere onSushiClick={handleSushiClick} />
                ) : (
                  <SushiSphere onSushiClick={handleSushiClick} />
                )}
              </Suspense>
              <OrbitControls
                autoRotate
                autoRotateSpeed={0.3}
                maxDistance={12}
                minDistance={3}
                enablePan={false}
              />
            </Canvas>
          </div>
        </div>
        <CommonUI />
      </>
    );
  }

  // 4. DEFAULT MENU SECTION
  return (
    <>
      <MenuSection
        onBackToSunrise={() => setView("animation")}
        onOpen3DMenu={() => setView("3d")}
        onAddToCart={handleAddToCart}
        cartToggle={<CartButton />}
        checkoutButton={<CheckoutNavButton />}
      />
      <CommonUI />
      <Footer />
    </>
  );

  // Вспомогательный компонент, чтобы не дублировать модалки
  function CommonUI() {
    return (
      <>
        <SushiModal
          sushi={selectedSushi}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAddToCart={handleAddToCart}
        />
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
}
export default App;
