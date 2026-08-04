// src/routes/ProtectedAdminRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../utils/authHelper'; 

export const ProtectedAdminRoute = () => {
  // 1. Check for token using both possible key names
  const token = localStorage.getItem('jwtToken') || localStorage.getItem('token');
  const user = getCurrentUser();

  // Debugging: Open browser console (F12) to see what is actually stored
  console.log("ProtectedAdmin Check -> Token:", !!token, "User:", user);

  // 2. If no token, redirect to signin
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // 3. Normalize role checks (handles "ADMIN", "ROLE_ADMIN", "admin")
  const role = user?.role?.toUpperCase() || user?.roles?.[0]?.toUpperCase();
  const isAdmin = role === 'ADMIN' || role === 'ROLE_ADMIN';

  if (!isAdmin) {
    console.warn("User logged in, but not an ADMIN. Current Role:", role);
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Authorized -> Render Admin Pages
  return <Outlet />;
};