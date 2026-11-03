import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('nexstore_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to parse wishlist from localStorage', e);
      return [];
    }
  });

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('nexstore_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => String(item.id || item._id) === String(productId));
  };

  const addToWishlist = (product) => {
    const id = product._id || product.id;
    if (!isInWishlist(id)) {
      const newItem = {
        id,
        _id: id,
        name: product.name,
        price: typeof product.price === 'number' ? product.price : Number(product.price || 0),
        originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
        image: product.image || (product.images && product.images[0]) || '',
        category: product.category,
        vendor: product.vendorName || (typeof product.vendor === 'object' ? product.vendor?.storeName : product.vendor) || 'Marketplace Merchant',
        vendorName: product.vendorName || (typeof product.vendor === 'object' ? product.vendor?.storeName : product.vendor) || 'Marketplace Merchant',
        stock: product.stock !== undefined ? product.stock : 10,
        rating: product.rating || 5.0,
        reviews: product.reviews || 0,
      };
      setWishlistItems((prev) => [...prev, newItem]);
      return true;
    }
    return false;
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.filter((item) => String(item.id || item._id) !== String(productId))
    );
  };

  const toggleWishlist = (product) => {
    const id = product._id || product.id;
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      return false; // Removed
    } else {
      addToWishlist(product);
      return true; // Added
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export default WishlistContext;

