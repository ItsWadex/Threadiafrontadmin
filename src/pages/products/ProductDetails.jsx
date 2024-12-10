import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useParams, useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./productDetail.css";

function ProductDetails() {
  const [product, setProduct] = useState(null);
  console.log(product);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/admin/products/${id}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setProduct(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  const handleModifyProduct = () => {
    navigate(`/ModifyProduct/${id}`);
  };

  const handleDeleteProduct = () => {
    axios
      .delete(`/api/admin/deleteProduct/${id}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then(() => {
        alert("Product deleted successfully!");
        navigate("/products");
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-details">
      <nav className="navbar">
        <div className="navbar-left" onClick={() => navigate("/dashboard")}>
          <h1>Threadia</h1>
        </div>
        <div className="navbar-right">
          <ul>
            <li>
              <a href="/customers">Customers</a>
            </li>
            <li>
              <a href="/products">Products</a>
            </li>
            <li>
              <a href="/orders">Orders</a>
            </li>
            <li>
              <a href="/SubAdmins">Admins</a>
            </li>
            <li>
              <a href="/">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="product-details-content">
        <h2>{product.pName}</h2>
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
        >
          {product.pImg.map((image, index) => (
            <div key={index}>
              <img src={image} width={250} alt={`Product Image ${index}`} />
            </div>
          ))}
        </Slider>
        <p>{product.pDescription}</p>
        <p>Price: {product.pPrice} DT</p>
        <p>Available: {product.pAvailable ? "In Stock" : "Out of Stock"}</p>
        {product.pSize.map((elt, index) => (
          <>
            <p>
              Size: {elt.size}, Qte: {elt.qte}{" "}
            </p>
          </>
        ))}
        <p>Category: {product.pCategory}</p>
        <div className="product-details-actions">
          <button className="modify-btn" onClick={handleModifyProduct}>
            Modify Product
          </button>
          <button className="delete-btn" onClick={handleDeleteProduct}>
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
