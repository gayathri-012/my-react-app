
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstname || !lastname || !email || !password) {
    alert("All fields are required");
    return;
  }

 if (password.length !== 6) {
  alert("Password must be exactly 6 characters");
  return;
}

    axios.post("https://my-react-app-backend-4517.onrender.com/register", {
        firstname,
        lastname,
        email,
        password,
      })
.then((result) => {
  console.log(result);
  navigate("/login"); 
})
.catch(err => console.log(err));

  };

  return (
    <div className="page">
      <div className="register-card">

      
        <div className="card-left">
          <img src="/hrx-logo.png" className="logo" alt="HRX Logo" />
          <h2>India's biggest fitness community</h2>
          <p className="sub-text">
            Register and become part of the HRX Fitness Collection,
            Get access to the Fitness Hub, Special Discounts and Freebies.
          </p>
          <p className="signin-link">
            Already in our Community? <Link to="/login">Sign-in</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstname(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastname(e.target.value)}
              required
            />
            
            <input
              type="email"
              placeholder="Email ID"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <button type="submit" className="register-btn">
              Register
            </button>
          </form>
        </div>

      
        <div className="card-right">
          <span className="close" onClick={() => navigate("/")}>X</span>
          <img src="/model.png" alt="Fitness Model" />
        </div>

      </div>
    </div>
  );
}

export default Register;
