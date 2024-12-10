import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import ProductDetails from "./pages/products/ProductDetails";
import ModifyProduct from "./pages/modifyProduct/ModifyProduct";
import Customers from "./pages/customers/Customers";
import SubAdmins from "./pages/SubAdmins/SubAdmins";
import AddProduct from "./pages/products/AddProduct";
import Orders from "./pages/orders/Orders";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/ModifyProduct/:id" element={<ModifyProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/subAdmins" element={<SubAdmins />} />
        <Route path="/addProduct" element={<AddProduct />} />
        <Route path="/Orders" element={<Orders />} />
      </Routes>
    </div>
  );
}

export default App;
