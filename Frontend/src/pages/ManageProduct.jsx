
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import "./ManageProduct.css";

function ManageProduct(){

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const deleteProduct = async (id) => {

        if(!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`https://my-react-app-backend-4517.onrender.com/products/${id}`);
            alert("Product deleted successfully");
            setProducts(products.filter(product => product._id !== id));
        } 
        catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        axios.get('https://my-react-app-backend-4517.onrender.com/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

   

    return(
        <div className="manage-container">
            <br></br><br></br><br></br>
            <h2>Manage Product</h2>

            <button 
            className="back-button" 
            onClick={() => navigate("/dashboard")}
            >
            Back
            </button>

            <table className="table">

                <thead>
                    <tr>
                        <th>Product Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Rating</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>

                    {products.map(product => (

                        <tr key={product._id}>

                            <td><img src={`https://my-react-app-backend-4517.onrender.com/uploads/${product.imageUpload}`}
                            alt={product.title}
                            style={{width:"100px"}}/>
                            </td>
                            <td>{product.title}</td>
                            <td>{product.category}</td>
                            <td>₹{product.price}</td>
                            <td>{product.quantity}</td>
                            <td>{product.rating}</td>

                            <td>

                                <button
                                className="edit-btn"
                                onClick={() => navigate(`/editproduct/${product._id}`)}
                                >
                                Edit
                                </button>

                                <button
                                className="delete-btn"
                                onClick={() => deleteProduct(product._id)}
                                >
                                Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ManageProduct;
