import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./style.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all orders when the component mounts
    axios
      .get("/api/admin/getOrders", {
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.status) {
          setOrders(response.data.data);
        } else {
          alert("Failed to fetch orders.");
        }
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [orders]);

  const handleConfirmOrder = (id) => {
    axios
      .put(
        `/api/admin/confirmOrder/${id}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.status) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === id
                ? {
                    ...order,
                    isConfirmed: true,
                    isCanceled: false,
                    isDelivered: false,
                  }
                : order
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error confirming order:", error);
      });
  };

  const handleCancelOrder = (id) => {
    console.log(id);
    axios
      .put(
        `/api/admin/cancelOrder/${id}`,
        {},
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.error("Error canceling order:", error);
      });
  };

  const handleDeliveredOrder = (id, total) => {
    axios
      .put(
        `/api/admin/deliverOrder/${id}`,
        { total },
        {
          headers: { token: localStorage.getItem("token") },
        }
      )
      .then((response) => {
        if (response.data.status) {
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order._id === id
                ? {
                    ...order,
                    isDelivered: true,
                    isConfirmed: true,
                    isCanceled: false,
                  }
                : order
            )
          );
        }
      })
      .catch((error) => {
        console.error("Error delivering order:", error);
      });
  };

  const filteredOrders = showConfirmed
    ? orders.filter((order) => order.isConfirmed)
    : orders;
  function showSizes(sizes) {
    return [
      `${sizes.filter((elt) => elt === "XXL").length} XXL`,
      `${sizes.filter((elt) => elt === "XL").length} XL`,
      `${sizes.filter((elt) => elt === "L").length} L`,
      `${sizes.filter((elt) => elt === "M").length} M`,
      `${sizes.filter((elt) => elt === "S").length} S`,
    ];
  }
  return (
    <div className="orders">
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

      <div className="orders-content">
        <h2>Orders</h2>
        <button
          onClick={() => setShowConfirmed(!showConfirmed)}
          className="filter-btn"
        >
          {showConfirmed ? "Show All Orders" : "Show Confirmed Orders"}
        </button>

        {filteredOrders.length === 0 ? (
          <p id="no-orders">No orders found.</p>
        ) : (
          <ul>
            {filteredOrders.map((order) => (
              <li key={order._id}>
                <div className="order-info">
                  <h3>Order ID: {order._id}</h3>
                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.customerId ? order.customerId.fullName : "N/A"}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {order.customerId ? order.customerId.phone : "N/A"}
                  </p>
                  <p>
                    <strong>Total Price:</strong>{" "}
                    {order.cart.reduce(
                      (total, item) =>
                        total + item.qte * (item.pId ? item.pId.pPrice : 0),
                      0
                    )}
                    DT
                  </p>
                  <p>
                    <strong>Address:</strong> {order.address || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {order.status}
                  </p>
                  <div>
                    <strong>Products:</strong>
                    <ul>
                      {order.cart.map((item, index) => (
                        <li key={index}>
                          <p>
                            <strong>Product:</strong>{" "}
                            {item.pId ? item.pId.pName : "N/A"}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {item.qte}
                          </p>
                          <p>
                            <strong>Price:</strong>{" "}
                            {item.pId ? item.pId.pPrice : "N/A"} DT
                          </p>
                          <p>
                            <strong>Size:</strong>{" "}
                            {item.size &&
                              showSizes(item.size).map((elt) => {
                                return elt[0] > 0 && <p>{elt}</p>;
                              })}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="order-actions">
                  {!order.isConfirmed && !order.isCanceled ? (
                    <>
                      <button
                        onClick={() => handleConfirmOrder(order._id)}
                        className="confirm-btn"
                      >
                        Confirm Order
                      </button>

                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="cancel-btn"
                      >
                        Cancel Order
                      </button>
                    </>
                  ) : order.isConfirmed &&
                    !order.isCanceled &&
                    !order.isDelivered ? (
                    <>
                      <p>Order is confirmed</p>
                      <button
                        onClick={() => {
                          const total = order.cart.reduce(
                            (total, item) =>
                              total +
                              item.qte * (item.pId ? item.pId.pPrice : 0),
                            0
                          );
                          handleDeliveredOrder(order._id, total);
                        }}
                        className="deliver-btn"
                      >
                        Deliver Order
                      </button>
                    </>
                  ) : order.isCanceled ? (
                    <p>Order is cancelled</p>
                  ) : order.isDelivered &&
                    order.isConfirmed &&
                    !order.isCanceled ? (
                    <p>Order is delivered</p>
                  ) : (
                    <p>Order is pending</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Orders;
