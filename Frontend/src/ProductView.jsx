
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ProductView.css";

function ProductView() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

 
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

 
  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(`http://localhost:3001/search?query=${search}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.log(err));
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>
     
      <div className="products-header">
        <h2 className="product-title">BUY NOW</h2>

       
        <div className="search-container">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => {
              const value = e.target.value;

              if (value) {
                setSearchParams({ search: value });
              } else {
                setSearchParams({});
              }
            }}
            className="search-input"
          />
        </div>

        <p style={{ color: "white" }}>
          Total Products: {products.length}
        </p>
      </div>

      <div className="products">
        <div className="best-grid">
          {products.length === 0 ? (
            <h2 style={{ color: "white" }}>No products found</h2>
          ) : (
            products.map((product) => (
              <div className="product-card" key={product._id}>
                
                <img
                  // src={`http://localhost:3001/uploads/${product.imageUpload}`}
                  src={product.imageUpload}
                  alt={product.title}
                />

                <h3>{product.title}</h3>
                <p>Price: ₹{product.price}</p>
                <p>Rating: {product.rating}</p>

                <button
                  onClick={() =>
                    navigate(`/productdisplay/${product._id}`)
                  }
                >
                  View More
                </button>

              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default ProductView;
