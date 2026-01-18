import React from 'react';
import type { CartItem } from '../../types';

interface SimpleCartProps {
  cart?: CartItem[]; // Делаем опциональным
  onRemove?: (id: number) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  totalPrice?: number;
  totalItems?: number;
}

const SimpleCart: React.FC<SimpleCartProps> = ({ 
  cart = [], // Значение по умолчанию
  onRemove = () => {},
  onUpdateQuantity = () => {},
  totalPrice = 0,
  totalItems = 0
}) => {
  // Проверка на всякий случай
  const safeCart = Array.isArray(cart) ? cart : [];
  
  return (
    <div className="simple-cart">
      <h3>Cart ({totalItems} items)</h3>
      {safeCart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <ul>
            {safeCart.map(item => (
              <li key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">€{item.price}</span>
                </div>
                <div className="item-controls">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total">
            <strong>Total: €{totalPrice.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleCart;
