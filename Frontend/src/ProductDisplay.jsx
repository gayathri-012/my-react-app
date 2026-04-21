import React, { useState, useEffect } from "react";
import "./ProductDisplay.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
function ProductDisplay() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    imageUpload: "",
    category: "",
    price: "",
    quantity: "",
    rating: ""
  });

  const [count, setCount] = useState(1);

  useEffect(() => {
    axios
      .get(`https://my-react-app-backend-4517.onrender.com/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const increase = () => {
    setCount((prev) => prev + 1);
  };

  const decrease = () => {
    if (count > 1) {
      setCount((prev) => prev - 1);
    }
  };

  const addProduct = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  
  if (!user) {
    alert("Please login first"); 
    navigate("/login");           
    return;
  }

  try {
    await fetch("https://my-react-app-backend-4517.onrender.com/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: product._id,
        quantity: count,
        userId: user._id
      }),
    });

    alert("Added to cart");
    navigate("/cart");
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="product-page">
      <div className="product-container">

        <div className="product-left">
          <img
            src={product.imageUpload}
            alt={product.title}
          />
        </div>

        <div className="product-right">
          <h2>{product.title}</h2>
          <p>Category: {product.category}</p>
          <p>Price: ₹{product.price}</p>
          <p>Rating: {product.rating}</p>

          <div className="qty">
            <button onClick={decrease}>-</button>
            <span>{count}</span>
            <button onClick={increase}>+</button>
          </div>

          <div className="buttons">
            <button className="add" onClick={addProduct}>
              Add to Cart
            </button>
           


            <button
  className="buy"
  onClick={() => {
    const user = JSON.parse(localStorage.getItem("user"));

    
    if (!user) {
      alert("Please login first");   
      navigate("/login");            
      return;
    }

    navigate("/checkout", {
      state: {
        singleProduct: product,
        quantity: count
      }
    });
  }}
>
  Buy Now
</button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ProductDisplay;
