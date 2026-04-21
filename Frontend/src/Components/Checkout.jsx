import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [cartData, setCartData] = useState([]);

  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    pincode: "",
    city: "",
    state: "",
    payment: "COD"
  });

  
  const fetchCart = async () => {
    try {
      const res = await fetch(`https://my-react-app-backend-4517.onrender.com/cart/${user._id}`);
      const data = await res.json();
      setCartData(data);
    } catch (err) {
      console.log(err);
      alert("Failed to load cart");
    }
  };

  useEffect(() => {
   
    if (!user) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    
    if (location.state && location.state.singleProduct) {
      setCartData([
        {
          _id: "temp",
          productId: location.state.singleProduct,
          quantity: location.state.quantity
        }
      ]);
    } else {
      fetchCart();
    }
  }, [location]);


  const totalPrice = cartData.reduce(
    (total, item) =>
      total + item.productId.price * item.quantity,
    0
  );

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const continueToPayment = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Fill all details");
      return;
    }

    navigate("/payment", {
      state: {
        form,
        cartData
      }
    });
  };

  return (
    <div className="checkout-main">

   
      <div className="checkout-left">
        <h2>Your Items</h2>

        {cartData.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          cartData.map(item => (
            <div key={item._id} className="checkout-card">

              <img
<<<<<<< HEAD
                //src={`http://localhost:3001/uploads/${item.productId.imageUpload}`}
                src={item.productId.imageUpload}
                alt={item.productId.title}
=======
                src={`https://my-react-app-backend-4517.onrender.com/uploads/${item.productId.imageUpload}`}
                alt=""
>>>>>>> a77120413c14f522a7edd5dd7fb787a4373b1c97
              />

              <div className="info">
                <h3>{item.productId.title}</h3>
                <p>Price: ₹{item.productId.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>

              <div className="item-total">
                ₹{item.productId.price * item.quantity}
              </div>

            </div>
          ))
        )}

        <h3 className="total">Total: ₹{totalPrice}</h3>
      </div>


      <div className="checkout-right">
        <h3>Delivery Details</h3>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <div className="row">
          <input
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
          />
          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
          />
        </div>

        <input
          name="state"
          placeholder="State"
          onChange={handleChange}
        />

        <button className="checkout-btn" onClick={continueToPayment}>
          Continue to Payment
        </button>
      </div>

    </div>
  );
}

export default Checkout;
