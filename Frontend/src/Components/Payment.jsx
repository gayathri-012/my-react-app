// import React, { useState } from "react";
// import { useNavigate, useParams, useLocation } from "react-router-dom";
// import axios from "axios";
// import "./Payment.css";

// function Payment() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const user = JSON.parse(localStorage.getItem("user"));
//   const formData = location.state?.form;
//   const cartData = location.state?.cartData;

//   const [paymentMethod, setPaymentMethod] = useState("");

//   const totalPrice = cartData
//     ? cartData.reduce(
//       (sum, item) => sum + item.productId.price * item.quantity,
//       0
//     )
//     : 0;

//   const loadRazorpay = () => {
//     return new Promise((resolve) => {
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const orderPlace = async () => {
//     if (!user) {
//       alert("Please login first");
//       navigate("/login");
//       return;
//     }

//     if (!paymentMethod) {
//       alert("Select payment method");
//       return;
//     }

//     const fullAddress = `${formData?.address}, ${formData?.city}, ${formData?.state} - ${formData?.pincode}`;

//     if (paymentMethod === "COD") {
//       try {
//         await axios.post("https://my-react-app-backend-4517.onrender.com/orders", {
//           userId: user._id,
//           address: fullAddress,
//           paymentMethod: "COD",

//           items: cartData.map(item => ({
//             productId: item.productId._id,
//             quantity: item.quantity
//           }))
//         });

//         alert("Order placed (Cash on Delivery)");

//         localStorage.removeItem(`cart_${user._id}`);
//         navigate("/productview");

//       } catch (err) {
//         console.log(err);
//       }
//       return;
//     }
//     const res = await loadRazorpay();

//     if (!res) {
//       alert("Razorpay failed to load");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://my-react-app-backend-4517.onrender.com/create-order",
//         { amount: totalPrice }
//       );

//       const order = response.data;

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//         amount: order.amount,
//         currency: "INR",
//         name: "My Store",
//         description: "Order Payment",
//         order_id: order.id,

//         handler: async function (razorpayResponse) {
//           const data = {
//             razorpay_payment_id: razorpayResponse.razorpay_payment_id,
//             razorpay_order_id: razorpayResponse.razorpay_order_id,
//             razorpay_signature: razorpayResponse.razorpay_signature,
//             cartData,
//             userId: user._id,
//             userName: user.name || user.firstname,
//             address: fullAddress,
//             amount: totalPrice,
//           };

//           try {
//             const res = await axios.post(
//               "https://my-react-app-backend-4517.onrender.com/verify-payment",
//               data
//             );

//             if (res.data.success) {
//               alert("Payment Verified & Order Placed");

//               localStorage.removeItem(`cart_${user._id}`);

//               navigate("/productview");
//             } else {
//               alert("Payment verification failed");
//             }
//           } catch (err) {
//             console.log(err);
//           }
//         },

//         modal: {
//           ondismiss: function () {
//             alert("Payment cancelled");
//           },
//         },

//         prefill: {
//           name: user?.name,
//           email: user?.email,
//           contact: formData?.phone,
//         },

//         theme: {
//           color: "#ff0000",
//         },
//       };

//       const paymentObject = new window.Razorpay(options);
//       paymentObject.open();
//     } catch (err) {
//       console.log("Payment Error:", err);
//     }
//   };

//   return (
//     <div className="payment-container">
//       <h2>Payment</h2>

//       <div className="payment-box">


//         <div className="left">
//           <h3>Order Summary</h3>

//           {cartData?.map((item) => (
//             <div key={item._id} className="item">
//               <img
//                 src={item.productId.imageUpload}
//                 alt=""
//               />
//               <div>
//                 <p>{item.productId.title}</p>
//                 <p>Qty: {item.quantity}</p>
//               </div>
//               <span>₹{item.productId.price * item.quantity}</span>
//             </div>
//           ))}

//           <h3>Total: ₹{totalPrice}</h3>
//         </div>


//         <div className="right">
//           <h3>Delivery Details</h3>

//           <div className="address">
//             <strong>{formData?.name}</strong>
//             <p>
//               {formData?.address}, {formData?.city}, {formData?.state} -{" "}
//               {formData?.pincode}
//             </p>
//             <p>{formData?.phone}</p>
//           </div>

//           <h3>Payment Method</h3>


//           <div
//             className={`method ${paymentMethod === "COD" ? "active" : ""}`}
//             onClick={() => setPaymentMethod("COD")}
//           >
//             Cash on Delivery
//           </div>


//           <div
//             className={`method ${paymentMethod === "ONLINE" ? "active" : ""}`}
//             onClick={() => setPaymentMethod("ONLINE")}
//           >
//             Pay Online (Card / UPI / Net Banking)
//           </div>

//           <button className="pay-btn" onClick={orderPlace}>
//             Place Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Payment;


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

  // ✅ GST CALCULATION ADDED
  let subtotal = 0;
  let totalGST = 0;

  const itemsWithGST = cartData?.map(item => {
    const price = item.productId.price;
    const qty = item.quantity;
    const gst = item.productId.gst || 0;

    const base = price * qty;
    const gstAmount = (base * gst) / 100;

    subtotal += base;
    totalGST += gstAmount;

    return {
      productId: item.productId._id,
      quantity: qty,
      price,
      gst,
      gstAmount
    };
  });

  const totalAmount = subtotal + totalGST;

  // Razorpay loader
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

    // ✅ COD ORDER WITH GST
    if (paymentMethod === "COD") {
      try {
        await axios.post("https://my-react-app-backend-4517.onrender.com/orders", {
          userId: user._id,
          address: fullAddress,
          paymentMethod: "COD",

          items: itemsWithGST,   // ✅ GST items
          subtotal,
          totalGST,
          totalAmount
        });

        alert("Order placed (Cash on Delivery)");

        localStorage.removeItem(`cart_${user._id}`);
        navigate("/productview");

      } catch (err) {
        console.log(err);
      }
      return;
    }

    // ONLINE PAYMENT
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay failed to load");
      return;
    }

    try {
      const response = await axios.post(
        "https://my-react-app-backend-4517.onrender.com/create-order",
        { amount: totalAmount }   // ✅ GST included
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

            items: itemsWithGST,   // ✅ GST items
            userId: user._id,
            userName: user.name || user.firstname,
            address: fullAddress,

            subtotal,
            totalGST,
            totalAmount
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

          {cartData?.map((item) => {
            const base = item.productId.price * item.quantity;
            const gstAmount = (base * (item.productId.gst || 0)) / 100;

            return (
              <div key={item._id} className="item">
                <img src={item.productId.imageUpload} alt="" />
                <div>
                  <p>{item.productId.title}</p>
                  <p>Qty: {item.quantity}</p>
                </div>
                <span>₹{base + gstAmount}</span>
              </div>
            );
          })}

          <h3>Subtotal: ₹{subtotal}</h3>
          <h3>GST: ₹{totalGST.toFixed(2)}</h3>
          <h3>Total: ₹{totalAmount.toFixed(2)}</h3>
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