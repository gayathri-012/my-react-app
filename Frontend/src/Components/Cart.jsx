import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(
        `https://my-react-app-backend-4517.onrender.com/cart/${user._id}`
      );

      const data = await res.json();
      setCartData(data);
    } catch (err) {
      console.error(err);
    }
  };

  const increaseQty = async (id, quantity) => {
    await fetch(`https://my-react-app-backend-4517.onrender.com/cart/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: quantity + 1 }),
    });
    fetchCart();
  };

  const decreaseQty = async (id, quantity) => {
    if (quantity > 1) {
      await fetch(`https://my-react-app-backend-4517.onrender.com/cart/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: quantity - 1 }),
      });
      fetchCart();
    }
  };

  const deleteProduct = async (id) => {
    await fetch(`https://my-react-app-backend-4517.onrender.com/cart/${id}`, {
      method: "DELETE",
    });
    fetchCart();
  };

  const totalPrice = cartData.reduce(
    (total, item) =>
      total + (item.productId?.price || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-section">
      <br /><br />
      <h1>Your Cart</h1>

      {cartData.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <div className="cart-container">
            {cartData.map((item) => (
              <div key={item._id} className="cart-item">

                {item.productId ? (
                  <>
                    <img
                      src={item.productId.imageUpload}
                      alt={item.productId.title}
                      className="cart-img"
                    />

                    <h3>{item.productId.title}</h3>
                    <p>₹{item.productId.price}</p>
                  </>
                ) : (
                  <p style={{ color: "red" }}>Product not available</p>
                )}

                <div className="qty">
                  <button onClick={() => decreaseQty(item._id, item.quantity)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item._id, item.quantity)}>
                    +
                  </button>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteProduct(item._id)}
                >
                  Remove
                </button>

              </div>
            ))}
          </div>

          <h2 className="total">Total: ₹{totalPrice}</h2>
        </>
      )}

      <button className="back-btn" onClick={() => navigate("/productview")}>
        Back to Products
      </button>

      <button
        onClick={() => navigate("/checkout", { state: cartData })}
        className="checkout-btn"
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

export default Cart;
