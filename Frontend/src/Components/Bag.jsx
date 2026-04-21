import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Products.css";

function Bag() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);


  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";


  useEffect(() => {
    const delay = setTimeout(() => {
      axios
        .get(`https://my-react-app-backend-4517.onrender.com/search?query=${search}`)
        .then((res) => {

          const filtered = res.data.filter(
            (item) => item.category === "Bag"
          );
          setProducts(filtered);
        })
        .catch((err) => console.log(err));
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <>

      <div className="products-header">

        <div className="proback">
          <button
            className="back-btn"
            onClick={() => navigate("/category")}
          >
            Back
          </button>
        </div>


        <h1>Bags</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search bags..."
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

        <p>Total Products: {products.length}</p>
      </div>

      <div className="products-page">
        {products.length === 0 ? (
          <h2 style={{ color: "white" }}>No products found</h2>
        ) : (
          products.map((item) => (
            <div key={item._id} className="product-card">
              <img
                //src={`http://localhost:3001/uploads/${item.imageUpload}`}
                src={item.imageUpload}
                alt={item.title}
                className="product-img"
              />

              <h2>{item.title}</h2>
              <p>Price: ₹{item.price}</p>
              <p>Rating: {item.rating}</p>

              <button
                onClick={() =>
                  navigate(`/productdisplay/${item._id}`)
                }
                className="product-btn"
              >
                View More
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Bag;
