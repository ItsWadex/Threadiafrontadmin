import React, { useState, useEffect } from "react";
import "./styles.css";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const token = localStorage.getItem("token");
  const [totalUsers, setTotalUsers] = useState([]);
  const [totalProductsSold, setTotalProductsSold] = useState([]);
  const [totalOrders, setTotalOrders] = useState([]); // State for total orders
  const [totalProfit, setTotalProfit] = useState(12000);

  // Fetch total users
  useEffect(() => {
    axios
      .get("/api/admin/customers", {
        headers: { token },
      })
      .then((response) => {
        setTotalUsers(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching customers data:", error);
      });
  }, []);

  // Fetch delivered orders and calculate total products sold and total profit
  useEffect(() => {
    axios
      .get("/api/admin/getDeliveredOrders", {
        headers: { token },
      })
      .then((response) => {
        const deliveredOrders = response.data.data;
        setTotalProductsSold(deliveredOrders);
      })
      .catch((error) => {
        console.error("Error fetching DeliveredOrders data:", error);
      });
  }, []);

  // Fetch total orders
  useEffect(() => {
    axios
      .get("/api/admin/getOrders", {
        headers: { token },
      })
      .then((response) => {
        setTotalOrders(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching orders data:", error);
      });
  }, []);

  // Bar chart data (for Users, Orders, and Delivered Orders)
  const barChartData = {
    labels: ["Total Users", "Total Orders", "Delivered Orders"],
    datasets: [
      {
        label: "Count",
        data: [totalUsers.length, totalOrders.length, totalProductsSold.length],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  // Pie chart data (for Delivered Orders and Profit)
  const pieChartData = {
    labels: ["Total Profit", "Delivered Orders"],
    datasets: [
      {
        data: [
          totalProductsSold.reduce((acc, curr) => acc + curr.total, 0),
          totalProductsSold.length,
        ],
        backgroundColor: ["#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-left">
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

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Total Users</h2>
          <p>{totalUsers.length}</p>
        </div>
        <div className="dashboard-card">
          <h2>Total Orders</h2>
          <p>{totalOrders.length}</p> {/* Display total orders */}
        </div>
        <div className="dashboard-card">
          <h2>Total Orders Delivered</h2>
          <p>{totalProductsSold.length}</p>
        </div>
        <div className="dashboard-card">
          <h2>Total Profit</h2>
          <p>
            {totalProductsSold.reduce((acc, curr) => acc + curr.total, 0)} DT
          </p>
        </div>

        {/* Bar chart for Users, Orders, Delivered Orders */}
        <div className="chart-container">
          <h2>Users & Orders Overview</h2>
          <Bar data={barChartData} />
        </div>

        {/* Pie chart for Profit and Delivered Orders */}
        <div className="chart-container">
          <h2>Profit & Delivered Orders Distribution</h2>
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
