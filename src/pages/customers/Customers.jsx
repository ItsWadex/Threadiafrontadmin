import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/admin/customers", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        setCustomers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching customers:", error);
      });
  }, []);

  const handleBanCustomer = (id, isBanned) => {
    const apiUrl = isBanned
      ? `/api/admin/unBanCustomer/${id}`
      : `/api/admin/banCustomer/${id}`;

    axios
      .put(
        apiUrl,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        const updatedCustomer = response.data.data;
        setCustomers(
          customers.map((customer) =>
            customer._id === updatedCustomer._id ? updatedCustomer : customer
          )
        );
      })
      .catch((error) => {
        console.error("Error updating customer:", error);
      });
  };

  return (
    <div className="customers">
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
      <div className="customers-content">
        <h2>Customers</h2>
        <ul>
          {customers.map((customer) => (
            <li key={customer._id}>
              <p>{customer.fullName}</p>
              <p>{customer.email}</p>
              <p>{customer.phone}</p>
              <p>{customer.dateofBirth}</p>
              <button
                onClick={() =>
                  handleBanCustomer(customer._id, customer.isBanned)
                }
              >
                {customer.isBanned ? "Unban" : "Ban"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Customers;
