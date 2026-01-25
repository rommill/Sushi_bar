import React, { useRef, useEffect } from "react";
import type { CartItem } from "../../types";

interface SimpleCartProps {
  cart?: CartItem[];
  onRemove?: (id: number) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  totalPrice?: number;
  totalItems?: number;
  onClose?: () => void;
  isVisible?: boolean;
}

const SimpleCart: React.FC<SimpleCartProps> = ({
  cart = [],
  onRemove = () => {},
  onUpdateQuantity = () => {},
  totalPrice = 0,
  totalItems = 0,
  onClose,
  isVisible = true,
}) => {
  const cartRef = useRef<HTMLDivElement>(null);
  const safeCart = Array.isArray(cart) ? cart : [];

  // Закрытие при клике снаружи
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        onClose &&
        cartRef.current &&
        !cartRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isVisible && onClose) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, isVisible]);

  // Закрытие по Esc
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (onClose && event.key === "Escape") {
        onClose();
      }
    };

    if (isVisible && onClose) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, isVisible]);

  // Не рендерим если не видима
  if (!isVisible) return null;

  return (
    <div ref={cartRef} className="simple-cart">
      <div className="cart-header">
        <h3>🛒 Cart ({totalItems} items)</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="cart-close-btn"
            aria-label="Close cart"
            title="Close cart"
          >
            ×
          </button>
        )}
      </div>

      {safeCart.length === 0 ? (
        <div className="empty-cart">
          <p>🍣 Your cart is empty</p>
          <p className="empty-hint">Add sushi from the menu!</p>
        </div>
      ) : (
        <>
          <ul className="cart-items-list">
            {safeCart.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-subtotal">
                    €{item.price} × {item.quantity} = €
                    {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="item-controls">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))
                    }
                    className="quantity-btn minus"
                    aria-label="Decrease quantity"
                    title="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn plus"
                    aria-label="Increase quantity"
                    title="Increase quantity"
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <strong>€{totalPrice.toFixed(2)}</strong>
            </div>
            {safeCart.length > 0 && (
              <button
                className="checkout-btn"
                onClick={() => {
                  console.log("Proceed to checkout");
                  alert(
                    `Order total: €${totalPrice.toFixed(2)}\n${safeCart.length} items`,
                  );
                }}
              >
                Checkout
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleCart;
