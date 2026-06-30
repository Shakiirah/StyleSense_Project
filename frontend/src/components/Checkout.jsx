import { useNavigate } from "react-router-dom";
import { useShop } from "./context/ShopContext";
import "./Checkout.css";
import { useState } from "react";

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useShop();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const enriched = cartItems;

  const subtotal = enriched.reduce((sum, product) => sum + product.price * product.qty, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (orderComplete) {
    return (
      <div className="checkout-empty checkout-success-card">
        <h2>Order confirmed</h2>
        <p>Your demo transaction is complete. No real payment was processed.</p>
        <p className="checkout-order-number">Order #{orderNumber}</p>
        <button onClick={() => navigate("/shop")}>Continue Shopping</button>
      </div>
    );
  }

  if (enriched.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some items from the shop first.</p>
        <button onClick={() => navigate("/shop")}>Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>

      <div className="checkout-list">
        {enriched.map((item) => (
          <div key={item.id} className="checkout-item">
            <div>
              <p className="checkout-name">{item.name}</p>
              <p className="checkout-price">${item.price} each</p>
            </div>

            <div className="checkout-qty">
              <button onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
              <span>{item.qty}</span>
              <button onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
            </div>

            <p className="checkout-line-total">${(item.price * item.qty).toFixed(2)}</p>

            <button className="checkout-remove" onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="checkout-summary">
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Shipping: {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</p>
        <p className="checkout-total">Total: ${total.toFixed(2)}</p>
      </div>

      <div className="checkout-demo-payment">
        <strong>Payment method</strong>
        <span>Demo checkout - no real card or payment required</span>
      </div>

      <label className="checkout-address-label" htmlFor="shipping-address">
        Shipping address
      </label>
      <textarea
        id="shipping-address"
        className="checkout-address-input"
        value={shippingAddress}
        onChange={(event) => setShippingAddress(event.target.value)}
        placeholder="Enter your delivery address"
      />

      {message && <p className="checkout-message success">{message}</p>}
      {error && <p className="checkout-message error">{error}</p>}

      <button
        className="checkout-place-order"
        disabled={placingOrder}
        onClick={async () => {
          setPlacingOrder(true);
          setError("");
          setMessage("");
          try {
            if (!shippingAddress.trim()) {
              setError("Please enter a shipping address to complete the demo checkout.");
              return;
            }

            await new Promise((resolve) => setTimeout(resolve, 650));
            setOrderNumber(`SS-${Date.now().toString().slice(-6)}`);
            clearCart();
            setOrderComplete(true);
            setMessage("Order placed successfully. This was a demo checkout transaction.");
          } catch (err) {
            setError("Unable to complete the demo checkout. Please try again.");
          } finally {
            setPlacingOrder(false);
          }
        }}
      >
        {placingOrder ? "Completing demo order..." : "Complete Demo Order"}
      </button>
    </div>
  );
}
