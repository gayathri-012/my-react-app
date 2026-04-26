import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `https://my-react-app-backend-4517.onrender.com/orders/${user._id}`
        );


        const sortedOrders = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setOrders(sortedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return <h3 className="orders-container">Please login first</h3>;
  }

  return (
    <div className="oorders-container">


      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "gray" }}>
          Signed in as <strong>{user.email}</strong>
        </p>
        <p>
          <strong>Name:</strong> {user.firstname}
        </p>
      </div>

      <h2 className="oorders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="ono-orders">No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="oorder-card" key={order._id}>


            {order.items?.map((item, index) => (
              <div className="oorder-item" key={index}>

                <img
                  src={
                    item.productId?.imageUpload
                      ? item.productId.imageUpload   
                      : "/no-image.png"
                  }
                  alt="product"
                  className="oorder-img"
                />

                <div className="oorder-details">

                  <div className="oproduct-title">
                    {item.productId?.title || "Product Not Available"}
                  </div>

                  <div>Quantity: {item.quantity}</div>

                  <div>
                    Price: ₹
                    {(item.productId?.price || 0) * item.quantity}
                  </div>

                </div>
              </div>
            ))}


            <div className="oorder-summary">
              <div><strong>Total:</strong> ₹{order.totalPrice}</div>
              <div><strong>Payment:</strong> {order.paymentMethod}</div>

              <div>
                <strong>Date:</strong>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </div>

              <div className={`status ${order.status}`}>
                <strong>Status:</strong> {order.status}
              </div>
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;

