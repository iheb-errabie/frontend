import React, { useEffect, useState } from 'react';
import { fetchCart, addToCart, removeFromCart, confirmOrder } from '../../api.js';

const Cart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetchCart();
        setCart(response.data.cart);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    };
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      setCart(cart.filter(item => item.product._id !== productId));
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const handleConfirmOrder = async () => {
    try {
      await confirmOrder();
      setCart([]);
      alert('Order confirmed successfully!');
    } catch (error) {
      console.error('Failed to confirm order:', error);
    }
  };

  return (
    <div>
      <h1>Shopping Cart</h1>
      <ul>
        {cart.map(item => (
          <li key={item.product._id}>
            <h3>{item.product.name}</h3>
            <p>Quantity: {item.quantity}</p>
            <button onClick={() => handleRemove(item.product._id)}>Remove</button>
          </li>
        ))}
      </ul>
      {cart.length > 0 && <button onClick={handleConfirmOrder}>Confirm Order</button>}
    </div>
  );
};

export default Cart;