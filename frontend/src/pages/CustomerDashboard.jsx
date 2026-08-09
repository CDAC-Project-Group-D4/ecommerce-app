import { useState } from "react";
import Navbar from "../components/Navbar";
import { ProfileTab } from "../components/customerComponents/dashboard/ProfileTab"; // Profile tab import karein
import { OrdersTab } from "../components/customerComponents/dashboard/OrdersTab";
import { AddressesTab } from "../components/customerComponents/dashboard/AddressesTab";

export default function CustomerDashboard() {
  // Default 'profile' rakha h taaki pehle profile khule
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4">My Account</h2>
        <div className="row">
          
          {/* Sidebar Tabs */}
          <div className="col-md-3 mb-3">
            <div className="list-group">
              <button
                type="button"
                className={`list-group-item list-group-item-action ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </button>
              
              <button
                type="button"
                className={`list-group-item list-group-item-action ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
              
              <button
                type="button"
                className={`list-group-item list-group-item-action ${activeTab === "addresses" ? "active" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                Addresses
              </button>
            </div>
          </div>

          {/* Right Section Content */}
          <div className="col-md-9">
            <div className="card border-0 shadow-sm p-4">
              {activeTab === "profile" && <ProfileTab />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}