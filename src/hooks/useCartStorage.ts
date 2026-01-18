import { useState, useEffect } from "react";
import type { SushiItem, CartItem } from "../types";

export function useCartStorage() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Загружаем из localStorage при инициализации
    const saved = localStorage.getItem("sushiCart");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedSushi, setSelectedSushi] = useState<SushiItem | null>(null);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("sushiCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (sushi: SushiItem, quantity: number = 1) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === sushi.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === sushi.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }

      return [...prev, { ...sushi, quantity }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("sushiCart");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    selectedSushi,
    setSelectedSushi,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };
}
