import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const savedData = JSON.parse(localStorage.getItem("paymentData"));

  const formData = location.state?.form || savedData?.form;
  const cartItems = location.state?.cartItems || savedData?.cartItems;
  const product = location.state?.product || savedData?.product;

  const [paymentMethod, setPaymentMethod] = useState("");


  let subtotal = 0;
  let totalGST = 0;

  if (cartItems) {
    cartItems.forEach((item) => {
      const price = item.productId.price;
      const qty = item.quantity;
      const gst = item.productId.gst || 0;

      const base = price * qty;
      const gstAmount = (base * gst) / 100;

      subtotal += base;
      totalGST += gstAmount;
    });
  } else if (product) {
    const price = product.price;
    const qty = product.quantity || 1;
    const gst = product.gst || 0;

    const base = price * qty;
    const gstAmount = (base * gst) / 100;

    subtotal += base;
    totalGST += gstAmount;
  }

  const totalPrice = Number((subtotal + totalGST).toFixed(2));

  // LOAD RAZORPAY
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };


  const orderPlace = async () => {
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    if (!paymentMethod) {
      alert("Select payment method");
      return;
    }

    const fullAddress = `${formData?.address}, ${formData?.city}, ${formData?.state} - ${formData?.pincode}`;


    if (paymentMethod === "COD") {
      try {
        await axios.post("http://localhost:3001/orders", {
          userId: user._id,
          address: fullAddress,
          phone: formData?.phone,
          paymentMethod: "COD",

          items: cartItems
            ? cartItems.map((item) => ({
              productId: item.productId._id,
              quantity: item.quantity,
            }))
            : [
              {
                productId: product._id,
                quantity: product.quantity || 1,
              },
            ],
        });

        alert("Order placed successfully (COD)");

        navigate("/orders");
      } catch (err) {
        console.log(err);
        alert("COD failed");
      }
      return;
    }


    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay failed to load");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/create-order",
        { amount: totalPrice }
      );

      const order = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: order.id,

        handler: async function (razorpayResponse) {
          const data = {
            razorpay_payment_id: razorpayResponse.razorpay_payment_id,
            razorpay_order_id: razorpayResponse.razorpay_order_id,
            razorpay_signature: razorpayResponse.razorpay_signature,

            cartData: cartItems || [
              {
                productId: product,
                quantity: product.quantity || 1,
              },
            ],

            userId: user._id,
            userName: user.name || user.firstname,
            address: fullAddress,
          };

          try {
            const res = await axios.post(
              "http://localhost:3001/verify-payment",
              data
            );

            if (res.data.success) {
              alert("Payment Verified & Order Placed ");

              navigate("/orders");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.log(err);
            alert("Verification error");
          }
        },

        modal: {
          ondismiss: function () {
            alert("Payment cancelled");
          },
        },

        prefill: {
          name: user?.name,
          email: user?.email,
          contact: formData?.phone,
        },

        theme: {
          color: "#ff0000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.log("Payment Error:", err);
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>

      <div className="payment-box">


        <div className="left">
          <h3>Order Summary</h3>

          {cartItems
            ? cartItems.map((item) => {
              const base = item.productId.price * item.quantity;
              const gst = item.productId.gst || 0;
              const gstAmount = (base * gst) / 100;
              const final = base + gstAmount;

              return (
                <div key={item._id} className="item">
                  <img src={item.productId.imageUpload} alt="" />
                  <div>
                    <p>{item.productId.title}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>GST: ₹{gstAmount.toFixed(2)}</p>
                  </div>
                  <span>₹{final.toFixed(2)}</span>
                </div>
              );
            })
            : product && (
              <div className="item">
                <img src={product.imageUpload} alt="" />
                <div>
                  <p>{product.title}</p>
                  <p>Qty: {product.quantity || 1}</p>
                </div>
                <span>₹{totalPrice}</span>
              </div>
            )}

          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          <p>GST: ₹{totalGST.toFixed(2)}</p>
          <h3>Total: ₹{totalPrice}</h3>
        </div>


        <div className="right">
          <h3>Delivery Details</h3>

          <div className="address">
            <strong>{formData?.name}</strong>
            <p>{formData?.address}, {formData?.city}</p>
            <p>{formData?.state} - {formData?.pincode}</p>
            <p>{formData?.phone}</p>
          </div>

          <h3>Payment Method</h3>

          <div
            className={`method ${paymentMethod === "COD" ? "active" : ""}`}
            onClick={() => setPaymentMethod("COD")}
          >
            Cash on Delivery
          </div>

          <div
            className={`method ${paymentMethod === "ONLINE" ? "active" : ""}`}
            onClick={() => setPaymentMethod("ONLINE")}
          >
            Pay Online (UPI / Card)
          </div>

          <button className="pay-btn" onClick={orderPlace}>
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;