import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import SellerNavbar from "../components/sellerComponents/SellerNavbar";
import Icon from "../components/sellerComponents/Icon";
import { getMyStore, updateStore, deleteStore, uploadStoreMedia, deactivateStore, reactivateStore } from "../api/storeApi.js";
import { getCurrentUser } from "../utils/authhelper.js";
import { useSeller } from "../context/SellerContext.jsx";
import "../css/SellerDashboard.css";
import "../css/Store.css";
import { useNavigate } from "react-router-dom";

const getImageUrl = (url) => {
    if (!url) return null;
    if (
        url.startsWith("http://") || 
        url.startsWith("https://") || 
        url.startsWith("data:") || 
        url.startsWith("blob:")
    ) {
        return url;
    }
    const cleanPath = url.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:8080${formattedPath}`;
};

function Store() {

    const navigate = useNavigate();
    const { store: contextStore, setStore: setContextStore } = useSeller();

    //intial values in formData
    const [formData, setFormData] = useState({
        storeName: contextStore?.storeName || "",
        description: contextStore?.description || ""
    });
    const [store, setStore] = useState(contextStore);
    const [loading, setLoading] = useState(!contextStore);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // The store DTO doesn't carry email/phone — those live on the user account.
    const currentUser = getCurrentUser(); //current user details will come from localStorage

    //component mounting - call the api as soon as the page loads
    useEffect(() => {
        if (contextStore) {
            setStore(contextStore);
            setFormData({
                storeName: contextStore.storeName || "",
                description: contextStore.description || ""
            });
            setLoading(false);
        }
        getMyStore() //calling get api
            .then((data) => {
                setStore(data || null); //api se jo data aa rha hai usko store state me save karta hia aur ui ko update kar deta hai.
                if (setContextStore) setContextStore(data || null);
                if (data) {
                    setFormData({ 
                        storeName: data.storeName || "", //api se aya hua data ko form me show karega
                        description: data.description || ""
                    });
                }
            })
            .catch((err) => setError(err.response?.data?.message || err.message || "Could not load store"))
            .finally(() => setLoading(false));
    }, []);


    //this function will update the store form when user will type something. jis input box me user type kr raha hai usi field ka data change hona chahiye ..hamare project me bss storename aur description update ho skta hai
    const handleFormChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };


    const handleSaveDetails = async (e) => {
        e.preventDefault(); //prevents from page reloading
        setSaving(true);
        setError(null);
        try {
            const updated = await updateStore({ //calling backend api.. updating information and saving to there corresponding fields
                storeName: formData.storeName,
                description: formData.description,
                bannerUrl: store.bannerUrl,
                profilePhotoUrl: store.profilePhotoUrl,
            });
            setStore(updated);  //updating the value of setStore with updated value.
            if (setContextStore) setContextStore(updated);
            setIsEditing(false);  //setting isEditing back to false so that it can show store information
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update store");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete your store? This can't be undone.")) return;
        setSaving(true);
        setError(null);
        try {
            await deleteStore(); //calling deleteStore api from backend. 
            setStore(null);  //updating the store info to null
            if (setContextStore) setContextStore(null);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to delete store");
        } finally {
            setSaving(false);
        }
    };

    const handleDeactivate = async () => {
        if (!window.confirm("Deactivate your store? All your products will be hidden from shoppers.")) return;
        setSaving(true);
        setError(null);
        try {
            const updated = await deactivateStore();
            setStore(updated);
            if (setContextStore) setContextStore(updated);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to deactivate store");
        } finally {
            setSaving(false);
        }
    };

    const handleReactivate = async () => {
        setSaving(true);
        setError(null);
        try {
            const updated = await reactivateStore();
            setStore(updated);
            if (setContextStore) setContextStore(updated);
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to reactivate store");
        } finally {
            setSaving(false);
        }
    };

    //useRef is used to directly access and trigger DOM elements. Here it is used to programmatically click hidden file inputs when the user clicks a button.
    const bannerInputRef = useRef(null);
    const photoInputRef = useRef(null);

    //field is bannerUrl or profilePhotoUrl anf file if selected image
    const handleImageChange = async (field, file) => {
        if (!file || !store) return; //if file is not present or store is not present then return
        const payload = new FormData(); //formData creation
        payload.append(field === "bannerUrl" ? "banner" : "profilePhoto", file); //if field is bannerUrl then banner ki file(image) jayegi agr field bannerUrl nahi hoga toh profilephoto is file(image) jayegi

        setSaving(true); 
        setError(null);
        try {
            const media = await uploadStoreMedia(payload); //image is given to backend. 
            const newUrl = field === "bannerUrl"
                ? (media.bannerUrl || media.url || media.banner) //bannerUrl bheja hoga toh backend se uss bannerUrl ka url milega
                : (media.profilePhotoUrl || media.profilePhoto || media.url); //bannerUrl nahi bheja hoga toh backend se uss profilePhoto ka url milega

            const updated = await updateStore({ //updating image url in backend
                storeName: store.storeName,
                description: store.description,
                bannerUrl: field === "bannerUrl" ? newUrl : store.bannerUrl,
                profilePhotoUrl: field === "profilePhotoUrl" ? newUrl : store.profilePhotoUrl,
            });
            setStore(updated); //updated values ke sath information set krte hai store me
            if (setContextStore) setContextStore(updated);
        } catch (err) {
            setError(err.message || "Image upload failed");
        } finally {
            setSaving(false);
        }
    };

    const bannerImgUrl = getImageUrl(store?.bannerUrl); //creating browser friendly url for banner 
    const profileImgUrl = getImageUrl(store?.profilePhotoUrl); //creating browser friendly url for profileimage

    return (
        <div className="sd-shell">
            <Sidebar storeName={store?.storeName} />

            <main className="sd-main">
                <SellerNavbar title="Store Information" />

                {loading && <p>Loading...</p>}
                {error && <div className="si-error">{error}</div>}

                {!loading && store && ( //if store exits then show on dashboard

                    //this is for banner
                    <div className="si-card">
                        <div
                            className="si-banner"
                            style={bannerImgUrl ? { backgroundImage: `url("${bannerImgUrl}")` } : undefined}  //ui me banner show hoga
                        >
                            {bannerImgUrl && (
                                <img
                                    src={bannerImgUrl}
                                    alt="Store Banner"
                                    className="si-banner-img"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            )}
                            <button
                                type="button"
                                className="si-update-banner-btn"
                                onClick={() => bannerInputRef.current?.click()} //with the help of this we can open the hidden file input and select the image we want to add
                                disabled={saving}
                            >
                                <Icon name="camera" size={14} /> Update Banner
                            </button>
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleImageChange("bannerUrl", e.target.files[0])} //yaha se selected image handleImageChange function me jayegi
                            />
                        </div>

                        
                        <div className="si-header-row">
                            {/* this is for profile picture */}
                            <div className="si-avatar-wrap">
                                <div
                                    className="si-avatar"
                                    onClick={() => photoInputRef.current?.click()}
                                    style={profileImgUrl ? { backgroundImage: `url("${profileImgUrl}")` } : undefined} //ui me profilephoto show hogi
                                >
                                    {profileImgUrl && (
                                        <img
                                            src={profileImgUrl}
                                            alt="Store Profile"
                                            className="si-avatar-img"
                                            onError={(e) => {
                                                e.target.style.display = "none";
                                            }}
                                        />
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="si-avatar-cam-btn"
                                    onClick={() => photoInputRef.current?.click()}
                                    disabled={saving}
                                >
                                    <Icon name="camera" size={13} />
                                </button>
                                <span className="si-avatar-tooltip">Update Profile Photo</span>
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleImageChange("profilePhotoUrl", e.target.files[0])}
                                />
                            </div>

                            {/* this is for displaying store name and store id beside the profile picture */}
                            <div className="si-title-block">
                                <div className="si-heading-row" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <h2 className="si-store-name">{store.storeName}</h2>
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: "12px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        backgroundColor: store.active ? "#dcfce7" : "#fee2e2",
                                        color: store.active ? "#166534" : "#991b1b"
                                    }}>
                                        {store.active ? "● Active" : "● Inactive"}
                                    </span>
                                </div>
                                <span className="si-store-id">Store ID: ST{String(store.id).padStart(8, "0")}</span>
                            </div>
                        </div>

                        {/* Details list */}
                        {!isEditing ? (  //if isEditing is false then show this below ui where data is displayed.
                            <>
                                {!store.active && (
                                    <div style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", border: "1px solid #fde68a" }}>
                                        ⚠️ <strong>Your store is currently inactive.</strong> All associated products are hidden from customers on the platform.
                                    </div>
                                )}

                                <div className="si-details-list">
                                    <div className="si-detail-row">
                                        <span className="si-detail-label">
                                            <Icon name="store" size={16} /> Store Name
                                        </span>
                                        <span className="si-detail-value">{store.storeName}</span>
                                    </div>
                                    <div className="si-detail-row">
                                        <span className="si-detail-label">
                                            <Icon name="edit" size={16} /> Description
                                        </span>
                                        <span className="si-detail-value">{store.description}</span>
                                    </div>
                                    <div className="si-detail-row">
                                        <span className="si-detail-label">
                                            <Icon name="mail" size={16} /> Email
                                        </span>
                                        <span className="si-detail-value">{currentUser?.email || "—"}</span>
                                    </div>
                                    <div className="si-detail-row">
                                        <span className="si-detail-label">
                                            <Icon name="phone" size={16} /> Phone
                                        </span>
                                        <span className="si-detail-value">{currentUser?.phone || "—"}</span>
                                    </div>
                                </div>

                                <div className="si-actions">
                                    <button className="si-btn si-btn-outline-primary" onClick={() => setIsEditing(true)}> {/* when we will click on update button this will set the isEditing as true and the else part code will proceed */}
                                        <Icon name="edit" size={15} /> Update Store
                                    </button>

                                    {store.active ? (
                                        <button className="si-btn si-btn-outline-danger" style={{ borderColor: "#f59e0b", color: "#d97706" }} onClick={handleDeactivate} disabled={saving}>
                                            ⏸️ {saving ? "Deactivating..." : "Deactivate Store"}
                                        </button>
                                    ) : (
                                        <button className="si-btn si-btn-outline-primary" style={{ backgroundColor: "#16a34a", borderColor: "#16a34a", color: "#fff" }} onClick={handleReactivate} disabled={saving}>
                                            ▶️ {saving ? "Reactivating..." : "Reactivate Store"}
                                        </button>
                                    )}

                                    <button className="si-btn si-btn-outline-danger" onClick={handleDelete} disabled={saving}> {/* when delete button is clicked then it will go to a function called handleDelete where delete logic is applied */}
                                        <Icon name="trash" size={15} />
                                        {saving ? "Deleting..." : "Delete Store Permanently"}
                                    </button>
                                </div>
                            </>
                        ) : ( //if isEditing is true then show this ui where we will update the store name and description
                            <form className="si-edit-form" onSubmit={handleSaveDetails}>
                                <div className="si-field">
                                    <label>Store Name</label>
                                    <input
                                        name="storeName"
                                        value={formData.storeName}
                                        onChange={handleFormChange}
                                        required
                                    />
                                </div>
                                <div className="si-field">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleFormChange}
                                        rows={3}
                                    />
                                </div>
                                <div className="si-actions">
                                    <button type="submit" className="si-btn si-btn-outline-primary" disabled={saving}>
                                        {saving ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        className="si-btn si-btn-secondary"
                                        onClick={() => setIsEditing(false)} //when clicked on cancel button setting isEditing as false meaning it will display the store information
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {!loading && !store && !error && ( //no store found then navigate to create your store url
                    <div className="si-no-store">
                        <p>No store found</p>

                        <button
                            className="si-btn-primary"
                            onClick={() => navigate("/create-store")}
                        >
                            Create Your Store
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Store;