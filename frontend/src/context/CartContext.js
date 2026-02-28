import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const amountToAdd = product.quantity || 1;
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + amountToAdd;

        if (newQuantity > product.stock) return prev;

        return prev.map(p =>
          p.id === product.id
            ? { ...p, quantity: newQuantity }
            : p
        );
      }
      return [ ...prev, {...product, quantity: Math.min(amountToAdd, product.stock)}];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const increaseQuantity = (product) => {
    setCart((prev) => {
      if (product.quantity < product.stock) {
          return prev.map(p =>
            p.id === product.id
              ? { ...p, quantity: p.quantity + 1 }
              : p
          );
        }
      return prev;
    });
  };

  const decreaseQuantity = (product) => {
    setCart((prev) => {
      if (product.quantity > 0) {
          return prev.map(p =>
            p.id === product.id
              ? { ...p, quantity: p.quantity - 1 }
              : p
          );
        }
      return prev;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
