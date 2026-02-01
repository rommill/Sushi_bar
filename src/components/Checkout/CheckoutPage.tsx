import React, { useState } from "react";
import { useCartStorage } from "../../hooks/useCartStorage";
import type { CartItem } from "../../types";
import "./CheckoutPage.css";

// Типы для формы
interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

// Типы для пропсов (связь с App.tsx)
interface CheckoutProps {
  cart: CartItem[];
  total: number;
  onOrderSubmit: (formData: FormData) => Promise<any>;
}

const CheckoutPage: React.FC<CheckoutProps> = ({
  cart,
  total,
  onOrderSubmit,
}) => {
  const { clearCart } = useCartStorage();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    notes: "",
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderInfo, setOrderInfo] = useState<{
    id: string;
    number: string;
  } | null>(null);

  // Расчеты
  const tax = total * 0.1;
  const finalTotal = total + tax;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Отправляем данные на сервер через функцию из App.tsx
      const result = await onOrderSubmit(formData);

      if (result.success) {
        setOrderInfo({
          id: result.order.id,
          number: result.order.orderNumber,
        });
        setOrderComplete(true);
        clearCart(); // Очищаем корзину после успеха
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        "Ошибка соединения с сервером. Убедитесь, что бэкенд запущен на порту 3001",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // 1. Экран пустой корзины
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-empty">
        <div className="empty-container">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add delicious sushi before checking out!</p>
          <button
            className="back-to-menu-btn"
            onClick={() => window.location.reload()}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // 2. Экран успешного заказа (после ответа от API)
  if (orderComplete && orderInfo) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id">
            Order ID: <strong>{orderInfo.number}</strong>
          </p>

          <div className="order-details">
            <h3>Summary</h3>
            <div className="detail-row">
              <span>Total Paid:</span>
              <span className="amount">€{finalTotal.toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span>Status:</span>
              <span className="status-confirmed">Confirmed</span>
            </div>
          </div>

          <div className="confirmation-actions">
            <button
              className="print-receipt-btn"
              onClick={() => window.print()}
            >
              🖨️ Print Receipt
            </button>
            <button
              className="back-to-menu-btn"
              onClick={() => window.location.reload()}
            >
              🍣 Order More
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Основная форма
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          {/* Форма */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <h2>1. Delivery Details</h2>
              <div className="form-grid">
                <input
                  name="name"
                  placeholder="Full Name"
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  name="address"
                  placeholder="Address"
                  onChange={handleInputChange}
                  required
                  className="form-input full-width"
                />
                <input
                  name="city"
                  placeholder="City"
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  name="zipCode"
                  placeholder="ZIP"
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="payment-simulation">
                <div className="payment-header">
                  <h2>2. Payment</h2>
                  <span className="test-badge">TEST MODE</span>
                </div>
                <p>Card: 4242 ... 4242 | Expiry: 12/34 | CVC: 123</p>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={isProcessing}
              >
                {isProcessing
                  ? "Processing..."
                  : `Pay & Order - €${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Сводка (Summary) */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="order-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>€{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (10%):</span>
                  <span>€{tax.toFixed(2)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total:</span>
                  <span>€{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
