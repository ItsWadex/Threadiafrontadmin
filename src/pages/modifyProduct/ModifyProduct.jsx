import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./style.css";

function ModifyProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [pName, setPName] = useState("");
  const [pPrice, setPPrice] = useState();
  const [pDescription, setPDescription] = useState("");
  const [pAvailable, setPAvailable] = useState(true);
  const [pSize, setPSize] = useState([]); // Track size and quantities here

  useEffect(() => {
    axios
      .get(`/api/admin/products/${id}`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        const data = response.data.data;
        setProduct(data);
        setPName(data.pName);
        setPPrice(data.pPrice);
        setPDescription(data.pDescription);
        setPAvailable(data.pAvailable);
        setPSize(data.pSize); // Set the sizes and quantities here
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      });
  }, [id]);

  // Update the quantity of a specific size
  const handleSizeQuantityChange = (index, newQuantity) => {
    const updatedSizes = [...pSize];
    updatedSizes[index].qte = newQuantity;
    setPSize(updatedSizes);
  };

  const handleSubmit = () => {
    axios
      .put(
        `/api/admin/updateProduct/${id}`,
        { pName, pPrice, pDescription, pAvailable, pSize }, // Send the updated sizes and quantities
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        navigate("/products");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="modify-product">
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
      <div className="modify-product-content">
        <h2>Modify Product</h2>
        <form>
          <div>
            <label htmlFor="pName">Name:</label>
            <input
              type="text"
              id="pName"
              value={pName}
              onChange={(e) => setPName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="pPrice">Price:</label>
            <input
              type="number"
              id="pPrice"
              value={pPrice}
              onChange={(e) => setPPrice(Number(e.target.value))}
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
            <label htmlFor="pAvailable">Available:</label>
            <input
              type="checkbox"
              id="pAvailable"
              checked={pAvailable}
              onChange={() => setPAvailable(!pAvailable)}
            />
          </div>
          <div>
            {pSize.map((elt, index) => (
              <div key={index}>
                <label htmlFor={`size-${index}`}>Size: {elt.size}</label>
                <input
                  type="number"
                  id={`size-${index}`}
                  value={elt.qte}
                  onChange={(e) =>
                    handleSizeQuantityChange(index, Number(e.target.value))
                  }
                  min="0"
                />
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} type="button">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default ModifyProduct;
