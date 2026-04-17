import React from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./EditProduct.css";
import axios from 'axios';

function EditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        title:"",
        imageUpload:"",
        category:"",
        price:"",
        quantity:"",
        rating:""
    });

    useEffect(()=>{

        axios.get(`http://localhost:3001/products/${id}`)
        .then(res=>{
            setProduct(res.data);
        })
        .catch(err=>{
            console.log(err);
        });

    },[id]);

    const handleSubmit = async(e)=>{
        e.preventDefault();

        const formData = new FormData();

        formData.append("title",product.title);
        formData.append("category",product.category);
        formData.append("price",product.price);
        formData.append("quantity",product.quantity);
        formData.append("rating",product.rating);

        if(product.imageUpload instanceof File){
            formData.append("image",product.imageUpload);
        }

        await axios.put(`http://localhost:3001/products/${id}`,formData,{
            headers:{"Content-Type":"multipart/form-data"}
        });

        alert("Product updated successfully");
        navigate("/manageproduct");
    }

  return (
    <div className="edit-container">

      <div className="add-product" style={{width:"400px",margin:"50px auto"}}>

        <form onSubmit={handleSubmit}>

          <h3>Update Product</h3>

          <label>Product Title</label><br/>
          <input
          type="text"
          value={product.title}
          onChange={(e)=>setProduct({...product,title:e.target.value})}
          required
          />

          <br/>

          <label>Image Upload</label><br/>
          <input
          type="file"
          onChange={(e)=>setProduct({...product,imageUpload:e.target.files[0]})}
          />

          <br/>

          <label>Category</label><br/>
          <select
          value={product.category}
          onChange={(e)=>setProduct({...product,category:e.target.value})}
          required
          >
            <option value="">Select Category</option>
            <option value="Smartwatch">Smart Watch</option>
          <option value="Bluetooth">Bluetooth Headset</option>
          <option value="Eyewear">Eyewear</option>
          <option value="Cap">Cap</option>
          <option value="Bag">Bag</option>

          </select>

          <br/>

          <label>Price</label><br/>
          <input
          type="number"
          value={product.price}
          onChange={(e)=>setProduct({...product,price:e.target.value})}
          required
          />

          <br/>

          <label>Quantity</label><br/>
          <input
          type="number"
          value={product.quantity}
          onChange={(e)=>setProduct({...product,quantity:e.target.value})}
          required
          />

          <br/>

          <label>Rating</label><br/>
          <input
          type="number"
          value={product.rating}
          onChange={(e)=>setProduct({...product,rating:e.target.value})}
          required
          />

          <br/><br/>

          <button type="submit">Update</button>

          <button
          type="button"
          style={{backgroundColor:"red",marginLeft:"10px"}}
          onClick={()=>navigate("/manageproduct")}
          >
          Back
          </button>

        </form>

      </div>

    </div>
  )
}

export default EditProduct;