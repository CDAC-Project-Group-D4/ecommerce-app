import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import Icon from "../components/sellerComponents/Icon";
import { getMyStore, updateStore, deleteStore, uploadStoreMedia } from "../api/storeApi.js";
import { getCurrentUser } from "../utils/authhelper.js";
import "../css/SellerDashboard.css";
import "../css/Store.css";
import { useNavigate } from "react-router-dom";

const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }
    const cleanPath = url.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:8080${formattedPath}`;
};

function Store() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        storeName: "",
        description: ""
    });

    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const bannerInputRef = useRef(null);
    const photoInputRef = useRef(null);

    // The store DTO doesn't carry email/phone — those live on the user account.
    const currentUser = getCurrentUser();

    useEffect(() => {
        getMyStore()
            .then((data) => {
                setStore(data);
                setFormData({ storeName: data.storeName || "", description: data.description || "" });
            })
            .catch((err) => setError(err.message || "Could not load store"))
            .finally(() => setLoading(false));
    }, []);

    const handleImageChange = async (field, file) => {
        if (!file || !store) return;
        const payload = new FormData();
        payload.append(field === "bannerUrl" ? "banner" : "profilePhoto", file);

        setSaving(true);
        setError(null);
        try {
            const media = await uploadStoreMedia(payload);
            const newUrl = field === "bannerUrl"
                ? (media.bannerUrl || media.url || media.banner)
                : (media.profilePhotoUrl || media.profilePhoto || media.url);

            const updated = await updateStore({
                storeName: store.storeName,
                description: store.description,
                bannerUrl: field === "bannerUrl" ? newUrl : store.bannerUrl,
                profilePhotoUrl: field === "profilePhotoUrl" ? newUrl : store.profilePhotoUrl,
            });
            setStore(updated);
        } catch (err) {
            setError(err.message || "Image upload failed");
        } finally {
            setSaving(false);
        }
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveDetails = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            const updated = await updateStore({
                storeName: formData.storeName,
                description: formData.description,
                bannerUrl: store.bannerUrl,
                profilePhotoUrl: store.profilePhotoUrl,
            });
            setStore(updated);
            setIsEditing(false);
        } catch (err) {
            setError(err.message || "Failed to update store");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Delete your store? This can't be undone.")) return;
        setSaving(true);
        setError(null);
        try {
            await deleteStore();
            setStore(null);
        } catch (err) {
            setError(err.message || "Failed to delete store");
        } finally {
            setSaving(false);
        }
    };

    const bannerImgUrl = getImageUrl(store?.bannerUrl);
    const profileImgUrl = getImageUrl(store?.profilePhotoUrl);

    return (
        <div className="sd-shell">
            <Sidebar storeName={store?.storeName} />

            <main className="sd-main">
                <div className="si-topbar">
                    <h1 className="si-page-title">Store Information</h1>
                    <div className="si-topbar-right">
                        <button className="si-account-btn" type="button">
                            <span className="si-account-avatar">
                                <Icon name="user" size={16} />
                            </span>
                            <span>{currentUser?.name || "Seller"}</span>
                            <Icon name="chevron" size={14} />
                        </button>
                    </div>
                </div>

                {loading && <p>Loading...</p>}
                {error && <div className="si-error">{error}</div>}

                {!loading && store && (
                    <div className="si-card">
                        <div
                            className="si-banner"
                            style={bannerImgUrl ? { backgroundImage: `url("${bannerImgUrl}")` } : undefined}
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
                                onClick={() => bannerInputRef.current?.click()}
                                disabled={saving}
                            >
                                <Icon name="camera" size={14} /> Update Banner
                            </button>
                            <input
                                ref={bannerInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={(e) => handleImageChange("bannerUrl", e.target.files[0])}
                            />
                        </div>

                        {/* Avatar + name row, overlapping the banner on the left */}
                        <div className="si-header-row">
                            <div className="si-avatar-wrap">
                                <div
                                    className="si-avatar"
                                    onClick={() => photoInputRef.current?.click()}
                                    style={profileImgUrl ? { backgroundImage: `url("${profileImgUrl}")` } : undefined}
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

                            <div className="si-title-block">
                                <div className="si-heading-row">
                                    <h2 className="si-store-name">{store.storeName}</h2>
                                </div>
                                <span className="si-store-id">Store ID: ST{String(store.id).padStart(8, "0")}</span>
                            </div>
                        </div>

                        {/* Details list */}
                        {!isEditing ? (
                            <>
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
                                    <button className="si-btn si-btn-outline-primary" onClick={() => setIsEditing(true)}>
                                        <Icon name="edit" size={15} /> Update Store
                                    </button>
                                    <button className="si-btn si-btn-outline-danger" onClick={handleDelete} disabled={saving}>
                                        <Icon name="trash" size={15} />
                                        {saving ? "Deleting..." : "Delete Store"}
                                    </button>
                                </div>
                            </>
                        ) : (
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
                                        onClick={() => setIsEditing(false)}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {!loading && !store && !error && (
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