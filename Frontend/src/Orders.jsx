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
          `http://localhost:3001/orders/${user._id}`
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
  }, [user]);

  if (!user) {
    return <h3 className="orders-container">Please login first</h3>;
  }

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found</p>
      ) : (
        orders.map((order) => (
          <div className="order-card" key={order._id}>

            {/* 🔹 PRODUCTS */}
            {order.items?.map((item, index) => (
              <div className="order-item" key={index}>

                <img
                  src={
                    item.productId?.imageUpload
                      ? `http://localhost:3001/uploads/${item.productId.imageUpload}`
                      : "/no-image.png"
                  }
                  alt="product"
                  className="order-img"
                />

                <div className="order-details">

                  {/* ✅ USE DIV (IMPORTANT FIX) */}
                  <div className="product-title">
                    {item.productId?.title || "Product Not Available"}
                  </div>

                  <div>Quantity: {item.quantity}</div>

                  <div>
                    Price: ₹{item.productId?.price * item.quantity}
                  </div>

                </div>
              </div>
            ))}

            {/* 🔻 ORDER SUMMARY */}
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
            </div>

          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
