import React, { useState } from "react";
import axios from "axios";
import "./AddProduct.css";
import { Link } from "react-router-dom";

function AddProduct() {

  const [title, setTitle] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rating, setRating] = useState("");
  const [gst, setGst] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", imageUpload);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("rating", rating);
    formData.append("gst", gst);

    axios.post("https://my-react-app-backend-4517.onrender.com/products", formData)
      .then((res) => {
        alert("Product Added Successfully");

        // Reset form
        setTitle("");
        setImageUpload(null);
        setCategory("");
        setPrice("");
        setQuantity("");
        setRating("");
        setGst("");
      })
      .catch((err) => {
        console.log(err);
        alert("Error adding product");
      });
  };

  return (
    <div className="add-container">
      <br />
      <h2>Admin Add Product</h2>

      <form className="add-form" onSubmit={handleSubmit}>

        <label>Product Title</label>
        <input
          type="text"
          placeholder="Enter product title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Image Upload</label>
        <input
          type="file"
          onChange={(e) => setImageUpload(e.target.files[0])}
          required
        />

        <label>Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select Category</option>
          <option value="Smartwatch">Smart Watch</option>
          <option value="Bluetooth">Bluetooth Headset</option>
          <option value="Eyewear">Eyewear</option>
          <option value="Cap">Cap</option>
          <option value="Bag">Bag</option>
        </select>

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <label>Rating</label>
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />

        <div style={{ marginBottom: "10px" }}>
          <label>GST</label><br />
          <input
            style={{ marginBottom: "10px", width: "80%" }}
            type="number"
            placeholder="Enter GST"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Product</button>
        <br />

      </form>

      <Link to="/dashboard" className="back-btn">
        Back
      </Link>
    </div>
  );
}

export default AddProduct;
