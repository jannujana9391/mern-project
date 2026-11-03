import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nexstore_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
      return [];
    }
  });

  // Keep localStorage synchronized with cart state
  useEffect(() => {
    try {
      localStorage.setItem('nexstore_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cartItems]);

  /**
   * Add a product to the cart or increment quantity if already present
   */
  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const productId = product.id || product._id || product.productId;
      const existingIndex = prevItems.findIndex(
        (item) => (item.id || item._id || item.productId) === productId
      );

      if (existingIndex > -1) {
        // Increment quantity of existing item
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      } else {
        // Append new item
        return [
          ...prevItems,
          {
            id: productId,
            name: product.name,
            price: Number(product.price),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
            image: product.image || '',
            category: product.category || 'General',
            vendor: product.vendor || product.vendorName || 'Independent Merchant',
            quantity: Math.max(1, quantity),
          },
        ];
      }
    });
  };

  /**
   * Remove item entirely from cart
   */
  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => (item.id || item._id || item.productId) !== productId
      )
    );
  };

  /**
   * Update quantity of a specific item
   */
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if ((item.id || item._id || item.productId) === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  /**
   * Empty entire cart
   */
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('nexstore_cart');
  };

  // Calculations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% estimated tax
  const shipping = subtotal > 50 || cartItems.length === 0 ? 0 : 9.99;
  const grandTotal = Math.round((subtotal + tax + shipping) * 100) / 100;

  // Number of distinct vendors
  const distinctVendors = Array.from(new Set(cartItems.map((item) => item.vendor)));

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        subtotal,
        tax,
        shipping,
        grandTotal,
        distinctVendors,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;

