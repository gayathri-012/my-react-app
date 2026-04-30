import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("https://my-react-app-backend-4517.onrender.com/admin/stats")
      .then(res => setStats(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!stats) return <h2 className="loading">Loading...</h2>;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");

  const salesData = {
    labels: Object.keys(stats.salesByDate || {}).map(formatDate),
    datasets: [{
      label: "Sales",
      data: Object.values(stats.salesByDate || {}),
      borderColor: "#00e5ff",
      fill: true,
      backgroundColor: "rgba(0,229,255,0.2)"
    }]
  };

  const signupData = {
    labels: Object.keys(stats.usersByDate || {}).map(formatDate),
    datasets: [{
      label: "Signup",
      data: Object.values(stats.usersByDate || {}),
      borderColor: "#2979ff",
      fill: true,
      backgroundColor: "rgba(41,121,255,0.2)"
    }]
  };

  const paymentData = {
    labels: ["COD", "Online"],
    datasets: [{
      data: [stats.codPayments || 0, stats.onlinePayments || 0],
      backgroundColor: ["#f97316", "#22c55e"]
    }]
  };

  const topProductsData = {
    labels: stats.topProducts?.map(p => p.name) || [],
    datasets: [{
      label: "Top Products",
      data: stats.topProducts?.map(p => p.count) || [],
      backgroundColor: "#7c4dff"
    }]
  };

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#fff" } },
  },
  scales: {
    x: { ticks: { color: "#fff" } },
    y: {
      ticks: { color: "#fff" },
      beginAtZero: true,   
      min: 0               
    },
  },
};

const signupOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: "#fff" } },
  },
  scales: {
    x: { ticks: { color: "#fff" } },
    y: {
      beginAtZero: true,
      min: 0,
      max: 10,             
      ticks: {
        stepSize: 2,       
        color: "#fff",
        precision: 0
      }
    },
  },
};

  return (
    <>
      <div className="top-bar">
        <h2>Admin Dashboard</h2>
        <button className="logout-btn" onClick={() => navigate("/")}>
          Logout
        </button>
      </div>

      <div className="dash-container">

     
        <div className="left-container">
          <div className="admin-buttons">
            <button onClick={() => navigate("/addproduct")}> Add Products</button>
            <button onClick={() => navigate("/manageproduct")}>Manage Products</button>
            <button onClick={() => navigate("/manageorder")}> Manage Orders</button>
          </div>
        </div>

        
        <div className="right-container">

          
          <div className="stats">
            <div className="card">
              <h3>Total Products</h3>
              <p>{stats.totalProducts ?? 0}</p>
            </div>

            <div className="card">
              <h3>Total Payment</h3>
              <p>₹{stats.totalPayments}</p>
            </div>

            <div className="card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>

            <div className="card">
              <h3>Total Orders</h3>
              <p>{stats.totalOrders}</p>
            </div>
          </div>

        
          <div className="chart-section">

            <div className="chart">
              <h3>Sales Trend</h3>
              <Line data={salesData} options={chartOptions}/>
            </div>

            <div className="chart">
              <h3>Payment Methods</h3>
              <Pie data={paymentData} />
            </div>

            <div className="chart">
              <h3>Signup Count</h3>
              <Line data={signupData} options={signupOptions}/>
            </div>

            <div className="chart">
              <h3>Top Products</h3>
              <Bar data={topProductsData} />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;