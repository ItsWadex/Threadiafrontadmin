import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function SubAdmins() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubAdmin, setNewSubAdmin] = useState({
    email: "",
    fullName: "",
    phone: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/admin/subAdmins", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setSubAdmins(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching sub-admins:", error);
      });
  }, []);

  const handleAddSubAdmin = () => {
    axios
      .post("/api/admin/addSubAdmin", newSubAdmin, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setSubAdmins([...subAdmins, response.data.data]);
        setShowAddForm(false); // Hide form after adding
        setNewSubAdmin({ email: "", fullName: "", phone: "" }); // Reset form fields
      })
      .catch((error) => {
        console.error("Error adding sub-admin:", error);
        alert("Failed to add sub-admin. Please try again.");
      });
  };

  const handleDeleteSubAdmin = (email) => {
    if (window.confirm("Are you sure you want to delete this sub-admin?")) {
      axios
        .delete(`/api/admin/removeSubAdmin`, {
          headers: { token: localStorage.getItem("token") },
          data: { email },
        })
        .then(() => {
          setSubAdmins(
            subAdmins.filter((subAdmin) => subAdmin.email !== email)
          );
        })
        .catch((error) => {
          console.error("Error deleting sub-admin:", error);
          alert("Failed to delete sub-admin. Please try again.");
        });
    }
  };

  return (
    <div className="sub-admins">
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

      <div className="sub-admins-content">
        <button
          className="add-subadmin-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Cancel" : "Add SubAdmin"}
        </button>

        {showAddForm && (
          <div className="add-subadmin-form">
            <input
              type="text"
              placeholder="Full Name"
              value={newSubAdmin.fullName}
              onChange={(e) =>
                setNewSubAdmin({ ...newSubAdmin, fullName: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={newSubAdmin.email}
              onChange={(e) =>
                setNewSubAdmin({ ...newSubAdmin, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Phone"
              value={newSubAdmin.phone}
              onChange={(e) =>
                setNewSubAdmin({ ...newSubAdmin, phone: e.target.value })
              }
            />
            <button onClick={handleAddSubAdmin} className="submit-btn">
              Submit
            </button>
          </div>
        )}

        <h2>Sub-Admins</h2>
        <ul>
          {subAdmins.map((subAdmin) => (
            <li key={subAdmin._id}>
              <div className="sub-admin-info">
                <p>{subAdmin.fullName}</p>
                <p>{subAdmin.email}</p>
                <p>{subAdmin.phone}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteSubAdmin(subAdmin.email)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SubAdmins;
