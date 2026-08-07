import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <style>{`
        .custom-navbar {
          background: var(--cart-gradient, linear-gradient(135deg, #ff9142 0%, #ff5c00 100%));
          box-shadow: 0 8px 20px rgba(255, 92, 0, 0.18);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
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

        .navbar-btn-outline {
          border: 1px solid rgba(255, 255, 255, 0.5) !important;
          background: rgba(255, 255, 255, 0.1) !important;
          color: #ffffff !important;
          font-weight: 600;
          backdrop-filter: blur(4px);
          transition: all 0.2s ease;
        }

        .navbar-btn-outline:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          border-color: #ffffff !important;
          transform: translateY(-1px);
          color: #ffffff !important;
        }

        .navbar-btn-solid {
          background: #ffffff !important;
          color: var(--cart-orange-dark, #ff5c00) !important;
          font-weight: 700;
          border: 0 !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .navbar-btn-solid:hover {
          background: #fff8f3 !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          color: var(--cart-orange-dark, #ff5c00) !important;
        }

        .custom-navbar .navbar-toggler {
          border-color: rgba(255, 255, 255, 0.4);
        }

        .custom-navbar .navbar-toggler:focus {
          box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark custom-navbar mb-4 py-3">
        <div className="container">
          <Link
            className="navbar-brand fw-bold d-flex align-items-center gap-2"
            to="/"
          >
            <span>🛒</span> ApnaKart
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
            aria-controls="navContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-3">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/">
                  Home
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              <Link
                to="/cart"
                className="btn navbar-btn-outline rounded-3 px-4 py-2 position-relative d-inline-flex align-items-center gap-2"
              >
                <span>🛒</span> Cart
              </Link>
              <Link
                to="/dashboard"
                className="btn navbar-btn-solid rounded-3 px-4 py-2 d-inline-flex align-items-center gap-2"
              >
                <span>👤</span> Account
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
