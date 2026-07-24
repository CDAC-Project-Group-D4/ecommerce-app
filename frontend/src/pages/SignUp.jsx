import { useState } from "react";
import { signupUser } from "../api/authApi";
import '../css/SignUp.css'
import { useNavigate, Link } from "react-router-dom";

function SignUp() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        role: "CUSTOMER"
    })

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setError(null)
        setSuccess(null)

        try {
            const data = await signupUser(formData);
            setSuccess("SignUp Succesful");

            setFormData({
                fullName: "",
                email: "",
                phone: "",
                password: "",
                role: "CUSTOMER"
            })

            setTimeout(()=>{
                navigate("/signin")
            }, 1000)

        }
        catch (err) {
            setError(err.message);
        }
        finally {
            setLoading(false);
        }
    }

    return (

        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100 signup-container">

            <div className="auth-wrapper d-flex shadow">

                {/* Left illustration panel */}
                <div className="illustration-panel d-none d-md-flex flex-column justify-content-between">
                    <div className="illustration-text">
                        <h1>Get started with your account.</h1>
                        <p>Join our platform to explore, shop, or sell — all in one place.</p>
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

                {/* Right form panel */}
                <div className="card signup-card" style={{ width: "400px" }}>

                    <h2 className="text-center mb-4 signup-title">Sign Up</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input name="fullName" placeholder="Full Name" onChange={handleChange} value={formData.fullName} className="form-control custom-input" />
                        </div>
                        <div className="mb-3">
                            <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="form-control custom-input" />
                        </div>
                        <div className="mb-3">
                            <input name="phone" placeholder="Phone" onChange={handleChange} value={formData.phone} className="form-control custom-input" />
                        </div>
                        <div className="mb-3">
                            <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} className="form-control custom-input" />
                        </div>
                        <div className="mb-3">
                            <select name="role" onChange={handleChange} value={formData.role} className="form-select custom-select">
                                <option value="CUSTOMER">Customer</option>
                                <option value="SELLER">Seller</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 custom-btn" disabled={loading}>
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>
                    
                    <p className="text-center mt-12">
                        Already have an account?{" "}
                        <Link to="/signin" className="font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}

                </div>
            </div>
        </div>
    )
}

export default SignUp