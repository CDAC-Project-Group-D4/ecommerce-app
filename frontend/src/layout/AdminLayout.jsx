import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/adminComponents/Sidebar';
import { getCurrentUser } from '../utils/authhelper'; // Adjust path if needed
import { Menu, Bell } from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Safely get user data via authHelper
  const user = getCurrentUser();

  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* Sidebar Component */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area - Added w-100 and min-w-0 to prevent layout overlap */}
      <div className="d-flex flex-column flex-grow-1 min-w-0 h-100 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between shadow-sm flex-shrink-0">
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="btn btn-light d-lg-none p-1"
              aria-label="Toggle Navigation"
            >
              <Menu size={20} />
            </button>
            <h5 className="mb-0 text-dark d-none d-sm-block">Control Center</h5>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* Notification Icon */}
            <button className="btn btn-light rounded-circle p-2 position-relative">
              <Bell size={18} />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-primary border border-light rounded-circle">
                <span className="visually-hidden">New alerts</span>
              </span>
            </button>

            <div className="vr my-auto" style={{ height: '24px' }}></div>

            {/* Profile Circle */}
            <div 
              className="rounded-circle bg-primary-subtle text-primary fw-bold d-flex align-items-center justify-content-center" 
              style={{ width: '38px', height: '38px' }}
            >
              {(user?.name?.[0] || user?.email?.[0] || 'A').toUpperCase()}
            </div>
          </div>
        </header>

        {/* Dynamic Route Body */}
        <main className="flex-grow-1 overflow-auto p-4">
          <div className="container-fluid max-width-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;