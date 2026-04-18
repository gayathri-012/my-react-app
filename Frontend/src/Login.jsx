import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";


function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post("https://localhost:3001/login", {
  email,
  password,
})


.then((res) => {
  console.log(res.data);

  if (res.data.status === "success") {

   
    const userData = {
      ...res.data.user,
      isAdmin: res.data.role === "admin"
    };

    
    localStorage.setItem("user", JSON.stringify(userData));

    if (userData.isAdmin) {
      navigate("/dashboard");
       
    } else {
      navigate("/");
       
    }

  } else {
    alert("Login failed");
  }
})
.catch((err) => {
  console.log(err);
  alert("Server error");
});

  };

  return (
    <div className="page">
      <div className="login-card">
        
        
        <div className="card-left">
          <img src="/hrx-logo.png" className="logo" alt="HRX Logo" />
          <p className="tagline">#KEEPGOING</p>

          <h2>India’s biggest fitness community</h2>

          <p className="register">
            New to our Community?{" "}
            <Link to="/register">Click Here to Register</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Please Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />

           

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>

      
        <div className="card-right">
          <span className="close">X</span>
          <img src="/model.png" alt="Fitness Model" />
        </div>

      </div>
    </div>
  );
}

export default Login;
