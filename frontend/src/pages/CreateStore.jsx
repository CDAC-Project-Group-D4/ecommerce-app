import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStore } from "../api/storeApi";
import "../css/CreateStore.css";

//this is similar to the signup page
function CreateStore() {
    
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        storeName: "",
        description: ""
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

        try{
            const data = await createStore(formData);
            setSuccess("Store created successfully");

            setFormData({
                storeName: "",
                description: ""
            })

            setTimeout(() => {
                navigate("/seller/dashboard");
            }, 1000);
        }
        catch(err){
            setError(err.response?.data?.message || "failed to create a store");
        }
        finally{
            setLoading(false);
        }
    }

    return (
        <div className="cs-page">
            <div className="cs-window">

                <form className="cs-form" onSubmit={handleSubmit}>
                    <h1 className="cs-heading">Create Your Store</h1>

                    {error && <div className="cs-error">{error}</div>}

                    <div className="cs-field">
                        <label>Store Name*</label>
                        <input
                            name="storeName"
                            placeholder="Type your store name"
                            value={formData.storeName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="cs-field">
                        <label>Description*</label>
                        <textarea
                            name="description"
                            placeholder="Tell customers about your store"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            required
                        />
                    </div>

                    <button type="submit" className="cs-submit" disabled={loading}>
                        {loading ? "Creating..." : "Submit"}
                    </button>

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}

                </form>
            </div>
        </div>
    );
}

export default CreateStore;