import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  let cartItems = [];

  if (location.state) {
    if (Array.isArray(location.state)) {
      cartItems = location.state; 
    } else {
      
      cartItems = [
        {
          productId: location.state,
          quantity: location.state.quantity || 1,
        },
      ];
    }
  }

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  
  if (!cartItems || cartItems.length === 0) {
    return <h2 style={{ color: "white" }}>No items found</h2>;
  }

 
  let subtotal = 0;
  let totalGST = 0;

  cartItems.forEach((item) => {
    const product = item.productId;

    const price = product?.price || 0;
    const qty = item.quantity || 1;
    const gst = product?.gst || 0;

    const base = price * qty;
    const gstAmount = (base * gst) / 100;

    subtotal += base;
    totalGST += gstAmount;
  });

  const totalPrice = (subtotal + totalGST).toFixed(2);

 
  const continueToPayment = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Fill all details");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: { form, cartItems },
    });
  };

  return (
    <div className="checkout-container">
      <h2>CHECKOUT</h2>

      <div className="checkout-box">

       
        <div className="checkout-left">
          <h2>Order Summary</h2>

          {cartItems.map((item, index) => {
            const product = item.productId;

            const price = product?.price || 0;
            const qty = item.quantity || 1;
            const gst = product?.gst || 0;

            const base = price * qty;
            const gstAmount = (base * gst) / 100;
            const total = base + gstAmount;

            return (
              <div key={index} className="product-cardc">

                <img
                  src={product?.imageUpload}
                  alt={product?.title}
                  style={{ width: "80px" }}
                />

                <div className="product-infoc">
                  <p className="title">{product?.title}</p>
                  <p>Price: ₹{price}</p>
                  <p>Qty: {qty}</p>
                  <p>GST ({gst}%): ₹{gstAmount.toFixed(2)}</p>
                  <p><strong>Total: ₹{total.toFixed(2)}</strong></p>
                </div>

              </div>
            );
          })}

          <div style={{ marginTop: "15px" }}>
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>GST: ₹{totalGST.toFixed(2)}</p>
            <h3 className="totalc">Grand Total: ₹{totalPrice}</h3>
          </div>
        </div>

        
        <div className="checkout-right">
          <h3>Delivery Details</h3>

          <input name="name" placeholder="Full Name" onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" onChange={handleChange} />
          <textarea name="address" placeholder="Address" onChange={handleChange} />

          <div className="row">
            <input name="pincode" placeholder="Pincode" onChange={handleChange} />
            <input name="city" placeholder="City" onChange={handleChange} />
          </div>

          <input name="state" placeholder="State" onChange={handleChange} />
        </div>
      </div>

      <button className="checkout-btn" onClick={continueToPayment}>
        Continue to Payment
      </button>
    </div>
  );
}

export default Checkout;