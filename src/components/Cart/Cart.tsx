import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import type { SushiItem, CartItem } from "../../types";

interface CartProps {
  items: CartItem[];
  onAddItem: (item: SushiItem) => void;
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onClearCart: () => void;
}

export default function Cart({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: CartProps) {
  const [isOpen, setIsOpen] = useState(false);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Кнопка корзины */}
      <button className="cart-button" onClick={() => setIsOpen(true)}>
        <ShoppingCart size={24} />
        {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
      </button>

      {/* Модальное окно корзины */}
      {isOpen && (
        <div className="cart-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h2>
                <ShoppingCart size={24} />
                Your Cart
                {itemCount > 0 && (
                  <span className="cart-badge">{itemCount}</span>
                )}
              </h2>
              <button className="close-btn" onClick={() => setIsOpen(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="cart-content">
              {items.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingCart size={64} />
                  <p>Your cart is empty</p>
                  <p className="empty-hint">Add sushi from the 3D menu</p>
                </div>
              ) : (
                <div className="cart-items">
                  {items.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <h3>{item.name}</h3>
                        <p className="item-price">{item.price} ₽</p>
                      </div>
                      <div className="item-controls">
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() =>
                            onUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="item-total">
                        {item.price * item.quantity} ₽
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>{total} ₽</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery:</span>
                    <span>Free</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>{total} ₽</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button className="clear-btn" onClick={onClearCart}>
                    Clear Cart
                  </button>
                  <button className="checkout-btn">Checkout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
