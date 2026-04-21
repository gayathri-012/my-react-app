import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
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
  }, [user]);

  if (!user) {
    return <h3 className="orders-container">Please login first</h3>;
  }

  return (

    <div className="orders-container">


      <div style={{ marginBottom: "20px" }}>
    <p style={{ color: "gray" }}>
      Signed in as <strong>{user.email}</strong>
    </p>
    <p>
      <strong>Name:</strong> {user.firstname}
    </p>
  </div>

      <h2>My Orders</h2>

      <div className="order-details">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="order-card">

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

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;