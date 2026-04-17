import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Category.css";

function Category() {
  const [activeCategory, setActiveCategory] = useState("SmartWatch");
  const navigate = useNavigate();

  const categories = [
    "SmartWatch",
    "Bluetooth",
    "Eyewear",
    "Cap",
    "Bag",
  ];

  const categoryRoutes = {
    SmartWatch: "/smartwatch",
    Bluetooth: "/bluetooth",
    Eyewear: "/eyewear",
    Cap: "/cap",
    Bag: "/bag",
  };

  const products = {
    SmartWatch: [{ id: 1, img: "/cwatch.jpeg" }],
    Bluetooth: [{ id: 1, img: "/cblue.jpeg" }],
    Eyewear: [{ id: 1, img: "/c1.png" }],
    Cap: [{ id: 1, img: "/cap.png" }],
    Bag: [{ id: 1, img: "/cbag.png" }],
  };

  return (
    <div className="collection-page">

      <section className="hero-section">
        <video
          className="hero-video"
          src="/collectionv.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-accent"></div>

          <div className="hero-text">
            <p className="hero-ii">HRX COLLECTION</p>
            <h1 className="hero-title">FIND YOUR EDGE</h1>
            <p className="hero-subtitle">
              Everything you need throughout your fitness journey
            </p>
          </div>
        </div>
      </section>

      <div className="category-wrapper">
        <div className="category-container">
          <span className="collection-titles">COLLECTIONS</span>

          <div className="divider"></div>

          <div className="category-list">
            {categories.map((cat) => (
              <span
                key={cat}
                className={activeCategory === cat ? "active" : ""}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="category-header">
        <p>Everything you need for your fitness journey is right here.</p>
        <h2>{activeCategory.toUpperCase()}</h2>
      </div>

      <div className="product-grid">
        {products[activeCategory]?.map((item) => (
          <div
            key={item.id}
            className="product-card"
            onClick={() => navigate(categoryRoutes[activeCategory])}
          >
            <img src={item.img} alt="product" />

            <div className="overlay">
              <span>{activeCategory}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Category;