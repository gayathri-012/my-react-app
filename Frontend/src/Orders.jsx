import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
<<<<<<< HEAD
    if (user) {
      axios
        .get(`http://localhost:3001/orders/${user._id}`)
        .then((res) => {
         
          const sorted = res.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setOrders(sorted);
        })
        .catch((err) => console.log(err));
    }
=======
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `https://my-react-app-backend-4517.onrender.com/orders/${user._id}`
        );

        // ✅ LATEST ORDERS FIRST
        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
>>>>>>> a77120413c14f522a7edd5dd7fb787a4373b1c97
  }, [user]);

  if (!user) {
    return <h3 className="orders-container">Please login first</h3>;
  }

  return (

    <div className="orders-container">


<<<<<<< HEAD
      <div style={{ marginBottom: "20px" }}>
    <p style={{ color: "gray" }}>
      Signed in as <strong>{user.email}</strong>
    </p>
    <p>
      <strong>Name:</strong> {user.firstname}
    </p>
  </div>

      <h2>My Orders</h2>
=======
            
            {order.items?.map((item, index) => (
              <div className="order-item" key={index}>

                <img
                  src={
                    item.productId?.imageUpload
                      ? `https://my-react-app-backend-4517.onrender.com/uploads/${item.productId.imageUpload}`
                      : "/no-image.png"
                  }
                  alt="product"
                  className="order-img"
                />
>>>>>>> a77120413c14f522a7edd5dd7fb787a4373b1c97

      <div className="order-details">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-card">

<<<<<<< HEAD
              <div className="order-row">

              
                <div className="order-images">
                  {order.items?.map((item, i) => (
                    <img
                      key={i}
                      src={
                        item.productId?.imageUpload
                          ? `http://localhost:3001/uploads/${item.productId.imageUpload}`
                          : "/no-image.png"
                      }
                      alt="product"
                      className="order-image"
                    />
                  ))}
                </div>

                
                <div className="order-info">

                  
                  <div className="product-names">
                    {order.items?.map((item, i) => (
                      <p key={i}>
                        {item.productId?.title} (x{item.quantity})
                      </p>
                    ))}
=======
                 
                  <div className="product-title">
                    {item.productId?.title || "Product Not Available"}
>>>>>>> a77120413c14f522a7edd5dd7fb787a4373b1c97
                  </div>

                  <p><strong>Total:</strong> ₹{order.totalPrice}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <p className={`status ${order.status}`}>
                    <strong>Status:</strong> {order.status}
                  </p>

                </div>
              </div>

<<<<<<< HEAD
=======
            <div className="order-summary">
              <div><strong>Total:</strong> ₹{order.totalPrice}</div>
              <div><strong>Payment:</strong> {order.paymentMethod}</div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <div className={`status ${order.status}`}>
                <strong>Status:</strong> {order.status}
              </div>
>>>>>>> a77120413c14f522a7edd5dd7fb787a4373b1c97
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;