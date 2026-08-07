import { useState } from "react";
import Navbar from "../components/Navbar";
import { OrdersTab } from "../components/customerComponents/dashboard/OrdersTab";
import { AddressesTab } from "../components/customerComponents/dashboard/AddressesTab";

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h2 className="mb-4">My Account</h2>
        <div className="row">
          <div className="col-md-3 mb-3">
            <div className="list-group">
              <button
                className={`list-group-item list-group-item-action ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                Orders
              </button>
              <button
                className={`list-group-item list-group-item-action ${activeTab === "addresses" ? "active" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                Addresses
              </button>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card border-0 shadow-sm p-3">
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
