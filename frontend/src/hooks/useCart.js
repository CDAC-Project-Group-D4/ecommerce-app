import { useState, useEffect } from 'react';
import { cartApi } from '../api/customerApi';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await cartApi.getCart();
      setCart(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    await cartApi.updateCartItem(itemId, quantity);
    fetchCart();
  };

  return { cart, loading, updateQuantity, refreshCart: fetchCart };
};