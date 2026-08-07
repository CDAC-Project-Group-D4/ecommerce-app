import React from "react";
import { FaArrowRight } from "react-icons/fa";
import "../../css/Hero.css";

function Hero() {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="row align-items-center">

          {/* Left Content */}
          <div className="col-lg-6 col-md-6 hero-content">
            <span className="offer-badge">🔥 Limited Time Offer</span>

            <h1>
              Shop Smart <br />
              <span>Live Better</span>
            </h1>

            <p>
              Discover thousands of quality products at the best prices.
              Fast delivery, secure payments and amazing deals every day.
            </p>

            <button className="shop-btn">
              Shop Now <FaArrowRight className="ms-2" />
            </button>
          </div>

          {/* Right Image */}
          <div className="col-lg-6 col-md-6 text-center">
            <img
              src="/hero.png"
              alt="Hero"
              className="img-fluid hero-image"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;