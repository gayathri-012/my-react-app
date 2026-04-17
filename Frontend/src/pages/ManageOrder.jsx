import React, { useEffect, useState } from "react";
import "./ManageOrder.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ManageOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    axios.get("http://localhost:3001/orders")
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  };

  const updateStatus = (id, status) => {
    axios.put(`http://localhost:3001/orders/${id}`, { status })
      .then(() => {
        fetchOrders();
      });
  };

  const deleteOrder = (id) => {
    axios.delete(`http://localhost:3001/orders/${id}`)
      .then(() => {
        fetchOrders();
      });
  };

  return (
    <>
      <br></br><br></br><br></br>
      <h2>Manage Orders</h2>
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        Back
      </button>
    
      <table className="table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Product</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Address</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id}</td>
              <td>{order.userName || "No Name"}</td>
              <td>{order.productId?.title}</td>
              <td>{order.quantity}</td>
              <td>₹{order.totalPrice}</td>
              <td>{order.address}</td>
              <td>{order.paymentMethod}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => updateStatus(order._id, "Shipped")} className="b1">
                  Shipped
                </button><br></br>
                <button onClick={() => updateStatus(order._id, "Delivered")} className="b2">
                  Delivered
                </button><br></br>
                <button onClick={() => deleteOrder(order._id)} className="b3">
                  Delete
                </button><br></br>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ManageOrder;


