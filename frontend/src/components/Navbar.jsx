import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signoutUser } from "../api/authApi";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../utils/authhelper";
import Icon from "./sellerComponents/Icon";

export default function Navbar() {
  const navigate = useNavigate();
  const [navSearch, setNavSearch] = useState("");
  const { cartCount, wishlistCount } = useCart();

  const currentUser = getCurrentUser();
  const roleStr = String(currentUser?.role || currentUser?.roles?.[0] || "").toUpperCase();
  const isSeller = roleStr.includes("SELLER");

  useEffect(() => {
    if (sessionStorage.getItem("showLogoutAlert") === "true") {
      alert("Logged out successfully!");
      sessionStorage.removeItem("showLogoutAlert");
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/search?query=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
    }
  };

  const handleLogout = async () => {
    try {
      await signoutUser();
    } catch (error) {
      console.warn("Server cookie clearing failed:", error);
    } finally {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
      sessionStorage.clear();
      sessionStorage.setItem("showLogoutAlert", "true");
      window.location.href = "/";
    }
  };

  return (
    <>
      <style>{`
        .custom-navbar {
          background: var(--cart-gradient, linear-gradient(135deg, #ff9142 0%, #ff5c00 100%));
          box-shadow: 0 8px 20px rgba(255, 92, 0, 0.18);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          z-index: 1030;
        }
        .custom-navbar .navbar-brand {
          color: #ffffff !important;
          font-size: 1.35rem;
          letter-spacing: -0.3px;
        }
        .custom-navbar .nav-link {
          color: rgba(255, 255, 255, 0.88) !important;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .custom-navbar .nav-link:hover {
          color: #ffffff !important;
        }
        .navbar-search-wrapper {
          flex-grow: 1;
          max-width: 600px;
        }
        .navbar-search-input {
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          border-radius: 20px 0 0 20px;
          padding: 0.5rem 1.2rem;
          outline: none;
          width: 100%;
        }
        .navbar-search-input::placeholder {
          color: rgba(255, 255, 255, 0.75);
        }
        .navbar-search-input:focus {
          background: rgba(255, 255, 255, 0.3);
          color: #ffffff;
          box-shadow: none;
        }
        .navbar-search-btn {
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-left: none;
          background: rgba(255, 255, 255, 0.3);
          color: #ffffff;
          border-radius: 0 20px 20px 0;
          padding: 0.5rem 1.2rem;
        }
        .navbar-search-btn:hover {
          background: #ffffff;
          color: #ff5c00;
        }
        .navbar-btn-outline {
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          font-weight: 600;
        }
        .navbar-btn-seller {
          border: 1px solid rgba(255, 255, 255, 0.6) !important;
          background: rgba(255, 255, 255, 0.18) !important;
          color: #ffffff !important;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .navbar-btn-seller:hover {
          background: #ffffff !important;
          color: #ff5c00 !important;
        }
        .navbar-btn-solid {
          background: #ffffff !important;
          color: var(--cart-orange-dark, #ff5c00) !important;
          font-weight: 700;
        }
        .navbar-btn-logout {
          background: rgba(220, 53, 69, 0.2) !important;
          border: 1px solid rgba(255, 255, 255, 0.3) !important;
          color: #ffffff !important;
          font-weight: 600;
        }
        .cart-badge, .wishlist-badge {
          background-color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.45rem;
          border-radius: 50%;
          line-height: 1;
          margin-left: 2px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .cart-badge {
          color: #ff5c00;
        }
        .wishlist-badge {
          color: #dc3545;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar sticky-top py-3">
        <div className="container-fluid px-4">
          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            to="/"
          >
            <Icon name="cart-fill" size={22} /> ApnaKart
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav mb-2 mb-lg-0 ms-lg-3">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/">
                  Home
                </Link>
              </li>
            </ul>

            <div className="navbar-search-wrapper mx-auto my-2 my-lg-0 w-100 px-lg-4">
              <form onSubmit={handleSearchSubmit} className="d-flex w-100">
                <input
                  type="text"
                  className="form-control navbar-search-input"
                  placeholder="Search items, brands, and categories..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                />
                <button className="btn navbar-search-btn d-flex align-items-center justify-content-center" type="submit">
                  <Icon name="search" size={16} />
                </button>
              </form>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0">
              {/* Seller Login / Seller Dashboard Button */}
              <Link
                to={isSeller ? "/seller/dashboard" : "/signin"}
                className="btn navbar-btn-seller rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
              >
                <Icon name="store" size={16} /> {isSeller ? "Seller Dashboard" : "Seller Login"}
              </Link>

              {/* Wishlist Button */}
              <Link
                to="/wishlist"
                className="btn navbar-btn-outline rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
              >
                <Icon name="heart" size={24} />
                {wishlistCount > 0 && (
                  <span className="wishlist-badge">{wishlistCount}</span>
                )}
              </Link>

              <Link
                to="/cart"
                className="btn navbar-btn-outline rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
              >
                <Icon name="cart" size={16} /> Cart
                {cartCount > 0 && (
                  <span className="cart-badge">{cartCount}</span>
                )}
              </Link>

              <Link
                to="/dashboard"
                className="btn navbar-btn-solid rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
              >
                <Icon name="user" size={16} /> Account
              </Link>

              <button
                onClick={handleLogout}
                className="btn navbar-btn-logout rounded-3 px-3 py-2 d-inline-flex align-items-center gap-2"
              >
                <Icon name="logout" size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}