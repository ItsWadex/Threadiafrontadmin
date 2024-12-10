import React, { useState, useEffect } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./style.css";

function Products() {
  const [products, setProducts] = useState([]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/admin/products", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setProducts(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  const handleAddProduct = () => {
    navigate("/AddProduct");
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleNavbarClick = () => {
    navigate("/dashboard");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left" onClick={handleNavbarClick}>
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
              <a href="/subAdmins">Admins</a>
            </li>
            <li>
              <a href="/">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="products-content">
        <button className="add-product-btn" onClick={handleAddProduct}>
          Add Product
        </button>
        <div className="products-list">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <Slider {...settings}>
                {product.pImg.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => handleProductClick(product._id)}
                  >
                    <img
                      src={image}
                      width={250}
                      alt={`Product Image ${index}`}
                    />
                  </div>
                ))}
              </Slider>
              <h2>{product.pName}</h2>
              <p>{product.pDescription}</p>
              <p>{product.pPrice} DT</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
