import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

function AddProduct() {
  const [sizesQte, setSizesQte] = useState([]);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pCategory, setPCategory] = useState("");
  const [pImg, setPImg] = useState([]);
  const navigate = useNavigate();

  let sizes = ["XXL", "XL", "L", "M", "S"];

  // Handle image change
  const handleImageChange = (event) => {
    setPImg(event.target.files);
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("pName", pName);
    formData.append("pPrice", pPrice);
    formData.append("pDescription", pDescription);
    formData.append("pCategory", pCategory);

    // Append sizes and quantities as JSON to FormData
    formData.append("pSize", JSON.stringify(sizesQte));

    // Append images to FormData
    for (let i = 0; i < pImg.length; i++) {
      formData.append("pImage", pImg[i]);
    }

    // Make the API request
    axios
      .post("/api/admin/addProduct", formData, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
        navigate("/products");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="add-product">
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
              <a href="/subAdmins">Admins</a>
            </li>
            <li>
              <a href="/">Logout</a>
            </li>
          </ul>
        </div>
      </nav>

      <div className="add-product-content">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="pName">Name:</label>
            <input
              type="text"
              id="pName"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="pPrice">Price:</label>
            <input
              type="number"
              id="pPrice"
              value={pPrice}
              onChange={(e) => setPPrice(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="pDescription">Description:</label>
            <textarea
              id="pDescription"
              value={pDescription}
              onChange={(e) => setPDescription(e.target.value)}
            />
          </div>

          <div>
            <span htmlFor="pSize">Size:</span>
            {sizes.map((size) => (
              <div className="size" key={size}>
                <div className="pSize-box">
                  <label>{size}</label>
                </div>
                <input
                  type="number"
                  id="size-qte"
                  name={size}
                  onChange={(e) => {
                    const { name, value } = e.target;

                    setSizesQte((prevSizesQte) => {
                      const existingSizeIndex = prevSizesQte.findIndex(
                        (item) => item.size === name
                      );

                      if (existingSizeIndex !== -1) {
                        const updatedSizesQte = [...prevSizesQte];
                        updatedSizesQte[existingSizeIndex] = {
                          size: name,
                          qte: Number(value),
                        };
                        return updatedSizesQte;
                      }

                      return [
                        ...prevSizesQte,
                        { size: name, qte: Number(value) },
                      ];
                    });
                  }}
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="pCategory">Category:</label>
            <input
              type="text"
              id="pCategory"
              value={pCategory}
              onChange={(e) => setPCategory(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="pImg">Upload Images:</label>
            <input
              type="file"
              id="pImg"
              multiple
              onChange={handleImageChange}
            />
          </div>

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
