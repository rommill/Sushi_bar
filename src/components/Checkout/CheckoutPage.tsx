import React, { useState } from "react";
import { useCartStorage } from "../../hooks/useCartStorage";
import "./CheckoutPage.css";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

const CheckoutPage: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCartStorage();
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
  const [orderId, setOrderId] = useState<string>("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Имитация обработки заказа (2 секунды)
    setTimeout(() => {
      const newOrderId = `SUSHI-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      // Сохраняем заказ в localStorage
      const order = {
        id: newOrderId,
        ...formData,
        items: cart,
        total: getTotalPrice(),
        date: new Date().toISOString(),
        status: "confirmed",
      };

      const existingOrders = JSON.parse(
        localStorage.getItem("sushiOrders") || "[]",
      );
      localStorage.setItem(
        "sushiOrders",
        JSON.stringify([order, ...existingOrders]),
      );

      setOrderId(newOrderId);
      setOrderComplete(true);
      clearCart();
      setIsProcessing(false);
    }, 2000);
  };

  // Если корзина пустая и не было заказа
  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-empty">
        <div className="empty-container">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add delicious sushi before checking out!</p>
          <button
            className="back-to-menu-btn"
            onClick={() => (window.location.href = "/")}
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // После успешного заказа
  if (orderComplete) {
    return (
      <div className="order-confirmation">
        <div className="confirmation-card">
          <div className="confirmation-icon">🎉</div>
          <h2>Order Confirmed!</h2>
          <p className="order-id">
            Order ID: <strong>{orderId}</strong>
          </p>
          <p className="confirmation-message">
            Thank you for your order! This is a test transaction - no real
            payment was processed.
          </p>

          <div className="order-details">
            <h3>Order Details</h3>
            <div className="detail-row">
              <span>Total Amount:</span>
              <span className="amount">€{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="detail-row">
              <span>Items:</span>
              <span>{cart.length} sushi items</span>
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
              onClick={() => (window.location.href = "/")}
            >
              🍣 Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Основная форма оформления заказа
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <header className="checkout-header">
          <h1>🍣 Checkout</h1>
          <p className="checkout-subtitle">
            Complete your order in simple steps
          </p>
        </header>

        <div className="checkout-content">
          {/* Левая колонка - форма */}
          <div className="checkout-form-section">
            <div className="form-section-header">
              <h2>1. Delivery Information</h2>
              <p className="section-subtitle">
                Where should we deliver your sushi?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">
                    Phone Number <span className="required">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+1 (234) 567-8900"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">
                    Delivery Address <span className="required">*</span>
                  </label>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="123 Sushi Street, Apt 4B"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">
                    City <span className="required">*</span>
                  </label>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Tokyo"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="zipCode">
                    ZIP Code <span className="required">*</span>
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    placeholder="100-0001"
                    className="form-input"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="notes">Delivery Notes (Optional)</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Special instructions, doorbell doesn't work, leave at reception..."
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>

              {/* Симуляция платежа */}
              <div className="payment-simulation">
                <div className="payment-header">
                  <h2>2. Payment Simulation</h2>
                  <span className="test-badge">TEST MODE</span>
                </div>

                <div className="payment-note-card">
                  <div className="payment-icon">💳</div>
                  <div className="payment-info">
                    <p className="payment-title">No real payment required</p>
                    <p className="payment-description">
                      This is a demonstration checkout. Your card will not be
                      charged.
                    </p>
                  </div>
                </div>

                <div className="test-card-details">
                  <h4>Test Card for Demonstration:</h4>
                  <div className="test-card-grid">
                    <div className="test-card-item">
                      <span className="card-label">Card Number:</span>
                      <code className="card-value">4242 4242 4242 4242</code>
                    </div>
                    <div className="test-card-item">
                      <span className="card-label">Expiry Date:</span>
                      <code className="card-value">12/34</code>
                    </div>
                    <div className="test-card-item">
                      <span className="card-label">CVC:</span>
                      <code className="card-value">123</code>
                    </div>
                    <div className="test-card-item">
                      <span className="card-label">ZIP:</span>
                      <code className="card-value">12345</code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Кнопка оформления заказа */}
              <div className="order-submit-section">
                <button
                  type="submit"
                  className="place-order-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner"></span>
                      Processing Your Order...
                    </>
                  ) : (
                    `Place Order - €${getTotalPrice().toFixed(2)}`
                  )}
                </button>

                <p className="secure-checkout-note">
                  🔒 Secure checkout • Test transaction only
                </p>
              </div>
            </form>
          </div>

          {/* Правая колонка - сводка заказа */}
          <div className="order-summary-section">
            <div className="summary-card">
              <h2>Order Summary</h2>

              <div className="order-items-list">
                {cart.map((item) => (
                  <div key={item.id} className="order-item">
                    <div className="item-image">
                      <div className="image-placeholder">
                        {item.name.charAt(0)}
                      </div>
                    </div>
                    <div className="item-details">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                      <p className="item-price">€{item.price} each</p>
                    </div>
                    <div className="item-subtotal">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span className="total-label">Subtotal</span>
                  <span className="total-value">
                    €{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="total-row">
                  <span className="total-label">Delivery Fee</span>
                  <span className="total-value free">FREE</span>
                </div>
                <div className="total-row">
                  <span className="total-label">Tax (10%)</span>
                  <span className="total-value">
                    €{(getTotalPrice() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="total-row grand-total">
                  <span className="total-label">Total Amount</span>
                  <span className="total-value">
                    €{(getTotalPrice() * 1.1).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="delivery-estimate">
                <div className="delivery-icon">🚚</div>
                <div className="delivery-info">
                  <p className="delivery-title">Estimated Delivery</p>
                  <p className="delivery-time">30-45 minutes</p>
                </div>
              </div>
            </div>

            <div className="support-info">
              <h3>Need Help?</h3>
              <p>📞 Call us: +1 (800) SUSHI-123</p>
              <p>✉️ Email: support@sushibartest.com</p>
              <p className="support-note">
                This is a demonstration website for portfolio purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
