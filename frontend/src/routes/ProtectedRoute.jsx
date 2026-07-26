import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("jwtToken");

    // If no JWT token is stored, redirect the user immediately to /signin
    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    // Token exists, render the requested child page
    return <Outlet />;
};

export default ProtectedRoute;
