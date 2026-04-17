import "./Dashboard.css";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="admin-dashboardd">

      <h1 className="dashboard-titled">Admin Dashboard</h1>

      <p className="dashboard-subtitled">
        Manage products, orders and users from one place
      </p>

      <div className="dashboard-buttonsd">

        <Link to="/addproduct" className="dash-btnn">
          Add Product
        </Link>

        <Link to="/manageproduct" className="dash-btnn">
          Manage Products
        </Link>

        <Link to="/manageorder" className="dash-btnn">
          Manage Orders
        </Link>

      <Link to="/" className="logout-btn">
          Logout
        </Link>



      </div>

    </div>
  );
}

export default Dashboard;