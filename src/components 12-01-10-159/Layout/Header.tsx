import type { SushiItem } from "../../types";

interface HeaderProps {
  totalItems: number;
  totalPrice: number;
  onCartClick: () => void;
  onCheckoutClick: () => void;
  onBackClick?: () => void;
  showBackButton?: boolean;
  title?: string;
}

export const Header = ({
  totalItems,
  totalPrice,
  onCartClick,
  onCheckoutClick,
  onBackClick,
  showBackButton,
  title = "Sushi Bar",
}: HeaderProps) => {
  return (
    <header className="three-d-header">
      <div className="logo">
        <div className="logo-circle">寿</div>
        <h1>{title}</h1>
      </div>

      <div className="header-buttons">
        {/* Кнопка корзины */}
        <button onClick={onCartClick} className="cart-toggle-btn">
          🛒 Cart ({totalItems})
          {totalItems > 0 && (
            <span className="cart-badge">€{totalPrice.toFixed(2)}</span>
          )}
        </button>

        {/* Кнопка оформления */}
        <button
          onClick={onCheckoutClick}
          className="checkout-nav-btn"
          disabled={totalItems === 0}
        >
          🚀 Checkout
        </button>

        {/* Кнопка назад (опционально) */}
        {showBackButton && onBackClick && (
          <button onClick={onBackClick} className="back-btn">
            ← Back
          </button>
        )}
      </div>
    </header>
  );
};
