import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, CartCustomization } from '../types.js';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, customization: CartCustomization, quantity?: number, customUnitPrice?: number) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  totalItemsCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  freeDeliveryThreshold: number;
  amountNeededForFreeDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'crumb_co_cart_v1';
const FREE_DELIVERY_THRESHOLD = 999;
const STANDARD_DELIVERY_FEE = 80;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    customization: CartCustomization,
    quantity: number = 1,
    customUnitPrice?: number
  ) => {
    // Determine unit price
    let unitPrice = customUnitPrice !== undefined ? customUnitPrice : product.price;
    if (customUnitPrice === undefined && customization.size) {
      const sizeOpt = product.sizes?.find(s => s.size === customization.size);
      if (sizeOpt) unitPrice = sizeOpt.price;
    }

    // Check if an identical item exists (same product, same size, same flavour, same message)
    const existingIndex = items.findIndex(
      item =>
        item.productId === product.id &&
        item.customization.size === customization.size &&
        item.customization.flavour === customization.flavour &&
        (item.customization.customMessage || '') === (customization.customMessage || '') &&
        (item.customization.specialInstructions || '') === (customization.specialInstructions || '')
    );

    if (existingIndex > -1) {
      setItems(prev => {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      });
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        productId: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        unitPrice,
        quantity,
        customization
      };
      setItems(prev => [newItem, ...prev]);
    }

    setIsCartOpen(true);
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const discount = subtotal >= 1500 ? 100 : 0;
  const total = subtotal + deliveryFee - discount;
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        discount,
        total,
        totalItemsCount,
        isCartOpen,
        openCart,
        closeCart,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        amountNeededForFreeDelivery
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
