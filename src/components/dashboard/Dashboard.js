import React, { useEffect, useState } from "react";
import "./dashboard.css";
import DashboardCard from "./DashboardCard";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { db } from "../../config/firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Dashboard = ({ handleLogOut }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsCollectionRef = collection(db, "products");
    const getProducts = async () => {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getProducts();
  }, []);
  return (
    <div className="dashboard-container">
      <DashboardSidebar />
      <div className="dashboard-main">
        <DashboardNavbar handleLogOut={handleLogOut} />
        <div className="dashboard-main-wrapper">
          <h2>Dashboard</h2>
          <div className="dashboard-main-best-seller">
            <h3>Best Seller</h3>
            <div className="dashboard-menu-wrapper">
              <DashboardCard products={products} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
