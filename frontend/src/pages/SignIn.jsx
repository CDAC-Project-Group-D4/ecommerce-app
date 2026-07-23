import { useState } from "react";
import { signinUser } from "../api/authApi";
import "../css/SignUp.css"; 

function SignIn() {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await signinUser(formData);
            setSuccess("Login Successful");

            setFormData({
                email: "",
                password: ""
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 signup-container">

            <div className="auth-wrapper d-flex shadow">

                {/* Right form */}
                <div className="card signup-card" style={{ width: "400px" }}>

                    <h2 className="text-center mb-4 signup-title">Sign In</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="form-control custom-input"/>
                        </div>

                        <div className="mb-3">
                            <input name="password" type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control custom-input"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 custom-btn"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center mt-3">
                        Don’t have an account?{" "}
                        <a href="/signup" className="font-semibold hover:underline">
                            Sign Up
                        </a>
                    </p>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}

                </div>

                {/* Left panel SAME */}
                <div className="illustration-panel d-none d-md-flex flex-column justify-content-between">
                    <div className="illustration-text">
                        <h1>Welcome back 👋</h1>
                        <p>Sign in to continue your shopping or manage your store effortlessly.</p>
                    </div>

                    <div className="illustration-graphic">
                        <svg viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">
                            {/* soft glow behind figure */}
                            <ellipse cx="140" cy="210" rx="90" ry="14" fill="rgba(0,0,0,0.08)" />
                            <circle cx="140" cy="115" r="95" fill="rgba(255,255,255,0.07)" />

                            {/* trolley wheels */}
                            <circle cx="70" cy="200" r="9" fill="#ffffff" />
                            <circle cx="120" cy="200" r="9" fill="#ffffff" />

                            {/* trolley basket */}
                            <path d="M40 130 h95 l-14 60 h-70 z" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinejoin="round" />
                            <line x1="52" y1="130" x2="60" y2="190" stroke="#ffffff" strokeWidth="3" />
                            <line x1="88" y1="130" x2="88" y2="190" stroke="#ffffff" strokeWidth="3" />
                            <line x1="124" y1="130" x2="116" y2="190" stroke="#ffffff" strokeWidth="3" />

                            {/* items in trolley */}
                            <circle cx="65" cy="118" r="12" fill="#ffd166" />
                            <rect x="82" y="105" width="20" height="26" rx="4" fill="rgba(255,255,255,0.9)" />
                            <rect x="104" y="112" width="18" height="20" rx="3" fill="#ffffff" opacity="0.75" />

                            {/* trolley handle */}
                            <path d="M135 130 L150 95" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />

                            {/* person - arm on handle */}
                            <path d="M150 95 L172 108" stroke="#ffe0c2" strokeWidth="8" strokeLinecap="round" />

                            {/* person - body */}
                            <path d="M165 100 q15 -8 30 0 l10 55 q-25 12 -50 0 z" fill="#ffffff" />

                            {/* person - legs */}
                            <path d="M172 155 l-6 45" stroke="#f5691f" strokeWidth="10" strokeLinecap="round" opacity="0.85" />
                            <path d="M198 155 l6 45" stroke="#f5691f" strokeWidth="10" strokeLinecap="round" opacity="0.85" />

                            {/* person - head */}
                            <circle cx="183" cy="80" r="18" fill="#ffe0c2" />
                            <path d="M166 76 q17 -18 34 0 q0 -20 -17 -20 t-17 20 z" fill="#5b3a29" />

                            {/* sparkle accents */}
                            <path d="M215 70 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z" fill="rgba(255,255,255,0.6)" />
                            <circle cx="35" cy="90" r="4" fill="rgba(255,255,255,0.5)" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SignIn;