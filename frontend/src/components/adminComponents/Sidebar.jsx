import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/authhelper'; // Adjust path if needed
import {
  FolderTree,
  Users,
  Truck,
  Scale,
  MessageSquareWarning,
  CircleDollarSign,
  History,
  LogOut,
  X,
  UserCheck,
} from 'lucide-react';

/**
 * Admin Sidebar Navigation Component
 * 
 * @param {boolean} isOpen - Controls visibility on mobile screens
 * @param {function} onClose - Closes sidebar on mobile selection
 */
const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Get user details safely using authHelper
  const user = getCurrentUser();

  // Handle Logout by clearing auth storage and redirecting
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    navigate('/signin');
  };

  const navItems = [
    { name: 'Categories & Specs', path: '/admin/categories', icon: FolderTree },
    { name: 'Sellers & Users', path: '/admin/sellers', icon: Users },
    { name: 'Logistics Simulation', path: '/admin/logistics', icon: Truck },
    { name: 'Disputes & Returns', path: '/admin/disputes', icon: Scale },
    { name: 'Complaints', path: '/admin/complaints', icon: MessageSquareWarning },
    { name: 'Commission & Payouts', path: '/admin/payouts', icon: CircleDollarSign },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: History },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`bg-dark text-white d-flex flex-column justify-content-between flex-shrink-0 h-100 ${
          isOpen ? 'position-fixed top-0 start-0 d-flex' : 'd-none d-lg-flex position-lg-relative'
        }`}
        style={{ width: '260px', zIndex: 1050, transition: 'all 0.3s' }}
      >
        <div>
          {/* Header / Logo */}
          <div className="d-flex align-items-center justify-content-between px-3 py-3 border-bottom border-secondary">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white p-1 rounded">
                <UserCheck size={20} />
              </div>
              <span className="fs-5 fw-bold tracking-wide">Admin Portal</span>
            </div>
            <button
              onClick={onClose}
              className="btn text-secondary d-lg-none p-0"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="nav nav-pills flex-column p-3 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-3 text-start ${
                      isActive ? 'active bg-primary text-white' : 'text-light'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer / Account Info */}
        <div className="p-3 border-top border-secondary">
          <div className="bg-secondary bg-opacity-25 rounded p-2 mb-2 text-truncate">
            <p className="mb-0 fw-semibold text-white small text-truncate">
              {user?.name || user?.email || 'Admin User'}
            </p>
            <p
              className="mb-0 text-info fw-bold small text-uppercase"
              style={{ fontSize: '0.75rem' }}
            >
              {user?.role || 'Administrator'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;