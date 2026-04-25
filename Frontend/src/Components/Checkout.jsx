// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Checkout.css";

// function Checkout() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const [cartData, setCartData] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     address: "",
//     phone: "",
//     pincode: "",
//     city: "",
//     state: "",
//     payment: "COD"
//   });

  
//   const fetchCart = async () => {
//     try {
//       const res = await fetch(`https://my-react-app-backend-4517.onrender.com/cart/${user._id}`);
//       const data = await res.json();
//       setCartData(data);
//     } catch (err) {
//       console.log(err);
//       alert("Failed to load cart");
//     }
//   };

//   useEffect(() => {
   
//     if (!user) {
//       alert("Please login first");
//       navigate("/login");
//       return;
//     }

    
//     if (location.state && location.state.singleProduct) {
//       setCartData([
//         {
//           _id: "temp",
//           productId: location.state.singleProduct,
//           quantity: location.state.quantity
//         }
//       ]);
//     } else {
//       fetchCart();
//     }
//   }, [location]);


//   const totalPrice = cartData.reduce(
//     (total, item) =>
//       total + item.productId.price * item.quantity,
//     0
//   );

  
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };


//   const continueToPayment = () => {
//     if (!form.name || !form.phone || !form.address) {
//       alert("Fill all details");
//       return;
//     }

//     navigate("/payment", {
//       state: {
//         form,
//         cartData
//       }
//     });
//   };

//   return (
//     <div className="checkout-main">

   
//       <div className="checkout-left">
//         <h2>Your Items</h2>

//         {cartData.length === 0 ? (
//           <p>No items in cart</p>
//         ) : (
//           cartData.map(item => (
//             <div key={item._id} className="checkout-card">

//               <img
//                 src={item.productId.imageUpload}
//                 alt={item.productId.title}
//               />

//               <div className="info">
//                 <h3>{item.productId.title}</h3>
//                 <p>Price: ₹{item.productId.price}</p>
//                 <p>Quantity: {item.quantity}</p>
//               </div>

//               <div className="item-total">
//                 ₹{item.productId.price * item.quantity}
//               </div>

//             </div>
//           ))
//         )}

//         <h3 className="total">Total: ₹{totalPrice}</h3>
//       </div>


//       <div className="checkout-right">
//         <h3>Delivery Details</h3>

//         <input
//           name="name"
//           placeholder="Full Name"
//           onChange={handleChange}
//         />

//         <input
//           name="phone"
//           placeholder="Phone Number"
//           onChange={handleChange}
//         />

//         <textarea
//           name="address"
//           placeholder="Address"
//           onChange={handleChange}
//         />

//         <div className="row">
//           <input
//             name="pincode"
//             placeholder="Pincode"
//             onChange={handleChange}
//           />
//           <input
//             name="city"
//             placeholder="City"
//             onChange={handleChange}
//           />
//         </div>

//         <input
//           name="state"
//           placeholder="State"
//           onChange={handleChange}
//         />

//         <button className="checkout-btn" onClick={continueToPayment}>
//           Continue to Payment
//         </button>
//       </div>

//     </div>
//   );
// }

// export default Checkout;


import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

 const savedData = JSON.parse(localStorage.getItem("checkoutData"));

const cartItems = location.state?.cartItems || savedData?.cartItems;
const product = location.state?.product || savedData?.product;

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    pincode: "",
    city: "",
    state: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!cartItems && !product) {
  return <h2 style={{ color: "white" }}>No items found</h2>;
}

  // ✅ GST CALCULATION (COMMON)
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

  const continueToPayment = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Fill all details");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
  alert("Please login first");

 
  localStorage.setItem(
    "paymentData",
    JSON.stringify({ form, cartItems, product })
  );

  navigate("/login");
} else {
  navigate("/payment", {
    state: { form, cartItems, product },
  });
}
  };

  return (
    <div className="checkout-container">
      <h2>CHECKOUT</h2>

      <div className="checkout-box">

        {/* LEFT SIDE */}
        <div className="checkout-left">
          <h2>Order Summary</h2>

          {/* CART ITEMS */}
          {cartItems ? (
            cartItems.map((item) => {
              const base = item.productId.price * item.quantity;
              const gst = item.productId.gst || 0;
              const gstAmount = (base * gst) / 100;
              const final = base + gstAmount;

              return (
                <div key={item._id} className="product-cardc">
                  <img
                    src={item.productId?.imageUpload}
                    alt={item.productId?.title}
                    style={{ width: "100px" }}
                  />

                  <div className="product-infoc">
                    <p className="title">{item.productId.title}</p>
                    <p>Price: ₹{item.productId.price}</p>
                    <p>Qty: {item.quantity}</p>
                    <p>GST ({gst}%): ₹{gstAmount.toFixed(2)}</p>
                    <p><strong>Total: ₹{final.toFixed(2)}</strong></p>
                  </div>
                </div>
              );
            })
          ) : (
            product && (() => {
              const base = product.price * (product.quantity || 1);
              const gst = product.gst || 0;
              const gstAmount = (base * gst) / 100;
              const final = base + gstAmount;

              return (
                <div className="product-cardc">
                  <img src={product.imageUpload} alt={product.title} />

                  <div className="product-infoc">
                    <p className="titlec">{product.title}</p>
                    <p>Price: ₹{product.price}</p>
                    <p>Qty: {product.quantity || 1}</p>
                    <p>GST ({gst}%): ₹{gstAmount.toFixed(2)}</p>
                    <p><strong>Total: ₹{final.toFixed(2)}</strong></p>
                  </div>
                </div>
              );
            })()
          )}

          {/* TOTAL SECTION */}
          <div style={{ marginTop: "15px" }}>
            <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
            <p>GST: ₹{totalGST.toFixed(2)}</p>
            <h3 className="totalc">Grand Total: ₹{totalPrice}</h3>
          </div>
        </div>

        {/* RIGHT SIDE */}
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