import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const formData = location.state?.form;
  const cartData = location.state?.cartData;

  const [paymentMethod, setPaymentMethod] = useState("");

  const totalPrice = cartData
    ? cartData.reduce(
      (sum, item) => sum + item.productId.price * item.quantity,
      0
    )
    : 0;

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
<<<<<<< HEAD
        await axios.post("http://localhost:3001/orders", {
=======
        await axios.post("https://my-react-app-backend-4517.onrender.com/orders", {
>>>>>>> a77120413c14f522a7edd5dd7fb787a4373b1c97
          userId: user._id,
          address: fullAddress,
          paymentMethod: "COD",

          items: cartData.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity
          }))
        });

        alert("Order placed (Cash on Delivery)");

        localStorage.removeItem(`cart_${user._id}`);
        navigate("/productview");

      } catch (err) {
        console.log(err);
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
        "https://my-react-app-backend-4517.onrender.com/create-order",
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
            cartData,
            userId: user._id,
            userName: user.name || user.firstname,
            address: fullAddress,
            amount: totalPrice,
          };

          try {
            const res = await axios.post(
              "https://my-react-app-backend-4517.onrender.com/verify-payment",
              data
            );

            if (res.data.success) {
              alert("Payment Verified & Order Placed");

              localStorage.removeItem(`cart_${user._id}`);

              navigate("/productview");
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.log(err);
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

          {cartData?.map((item) => (
            <div key={item._id} className="item">
              <img
                src={`https://my-react-app-backend-4517.onrender.com/uploads/${item.productId.imageUpload}`}
                alt=""
              />
              <div>
                <p>{item.productId.title}</p>
                <p>Qty: {item.quantity}</p>
              </div>
              <span>₹{item.productId.price * item.quantity}</span>
            </div>
          ))}

          <h3>Total: ₹{totalPrice}</h3>
        </div>


        <div className="right">
          <h3>Delivery Details</h3>

          <div className="address">
            <strong>{formData?.name}</strong>
            <p>
              {formData?.address}, {formData?.city}, {formData?.state} -{" "}
              {formData?.pincode}
            </p>
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
            Pay Online (Card / UPI / Net Banking)
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


