import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/sellerComponents/Sidebar";
import Icon from "../components/sellerComponents/Icon";
import { getMyStore, uploadStoreMedia } from "../api/storeApi";
import { getStoreProducts, createProduct, updateProduct, deleteProduct } from "../api/productApi";
import "../css/SellerDashboard.css";
import "../css/Product.css";

// Utility to ensure full backend image URL or blob preview
const getImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }
    const cleanPath = url.replace(/\\/g, "/");
    const formattedPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    return `http://localhost:8080${formattedPath}`;
};

function Product() {
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal state for Add Product
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [newProductData, setNewProductData] = useState({
        name: "",
        price: "",
        stock: "",
        low_stock_threshold: "5",
        category_id: "1"
    });

    // Cover Photo File state for Add Product
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);

    // Modal state for Update Product
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [updateProductData, setUpdateProductData] = useState({
        price: "",
        stock: "",
        name: ""
    });
    const [updateCoverFile, setUpdateCoverFile] = useState(null);
    const [updateCoverPreview, setUpdateCoverPreview] = useState(null);

    const coverInputRef = useRef(null);
    const updateCoverInputRef = useRef(null);

    // Auto-clear success message after 2 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    // Fetch Store & Products on Mount
    useEffect(() => {
        setLoading(true);
        Promise.all([
            getMyStore().catch(() => null),
            getStoreProducts().catch(() => [])
        ])
            .then(([storeData, productsData]) => {
                if (storeData) setStore(storeData);
                setProducts(productsData || []);
                setError(null);
            })
            .catch((err) => {
                setError(typeof err === "string" ? err : err.message || "Failed to load product data");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const storeName = store?.storeName || "Your Store";

    // Handle Cover Photo Selection
    const handleCoverFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    // Helper to upload file via uploadStoreMedia
    const uploadSingleImage = async (file) => {
        if (!file) return null;
        try {
            const formData = new FormData();
            formData.append("banner", file);
            const res = await uploadStoreMedia(formData);
            return res.bannerUrl || res.url || null;
        } catch {
            return URL.createObjectURL(file); // fallback preview blob URL
        }
    };

    // Handle Add Product Form Submission
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setAddLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Upload cover photo if selected
            let uploadedCoverUrl = null;
            if (coverFile) {
                uploadedCoverUrl = await uploadSingleImage(coverFile);
            }

            const payload = {
                name: newProductData.name,
                price: parseFloat(newProductData.price),
                stock: parseInt(newProductData.stock, 10),
                low_stock_threshold: parseInt(newProductData.low_stock_threshold || "5", 10),
                category_id: parseInt(newProductData.category_id || "1", 10),
                imageUrl: uploadedCoverUrl || coverPreview || null
            };

            const createdProd = await createProduct(payload);

            const enrichedProd = {
                ...createdProd,
                imageUrl: createdProd.imageUrl || uploadedCoverUrl || coverPreview
            };

            // Add newly created product into the FIRST ROW of table
            setProducts((prev) => [enrichedProd, ...prev]);

            setSuccess(`Product "${enrichedProd.name}" added successfully!`);
            setIsAddModalOpen(false);

            // Reset form & file states
            setNewProductData({
                name: "",
                price: "",
                stock: "",
                low_stock_threshold: "5",
                category_id: "1"
            });
            setCoverFile(null);
            setCoverPreview(null);
        } catch (err) {
            setError(typeof err === "string" ? err : err.message || "Failed to add product");
        } finally {
            setAddLoading(false);
        }
    };

    // Open Update Modal
    const handleOpenUpdateModal = (product) => {
        setSelectedProduct(product);
        setUpdateProductData({
            name: product.name || "",
            price: product.price !== undefined ? String(product.price) : "",
            stock: product.stock !== undefined ? String(product.stock) : ""
        });
        setUpdateCoverFile(null);
        setUpdateCoverPreview(getImageUrl(product.imageUrl));
        setIsUpdateModalOpen(true);
    };

    // Handle Update Submit
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProduct) return;
        setUpdateLoading(true);
        setError(null);
        setSuccess(null);

        try {
            let updatedCoverUrl = selectedProduct.imageUrl;
            if (updateCoverFile) {
                updatedCoverUrl = await uploadSingleImage(updateCoverFile);
            }

            const payload = {
                price: parseFloat(updateProductData.price),
                stock: parseInt(updateProductData.stock, 10),
                imageUrl: updatedCoverUrl
            };

            const updatedProd = await updateProduct(selectedProduct.id, payload);

            setProducts((prev) =>
                prev.map((p) =>
                    p.id === selectedProduct.id
                        ? {
                              ...p,
                              ...updatedProd,
                              name: updateProductData.name || p.name,
                              imageUrl: updatedCoverUrl || p.imageUrl
                          }
                        : p
                )
            );

            setSuccess("Product updated successfully!");
            setIsUpdateModalOpen(false);
            setSelectedProduct(null);
        } catch (err) {
            setError(typeof err === "string" ? err : err.message || "Failed to update product");
        } finally {
            setUpdateLoading(false);
        }
    };

    // Handle Delete Product -> Mark row RED
    const handleDeleteProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to delete this product? It will be marked as inactive (red).")) {
            return;
        }

        setError(null);
        setSuccess(null);

        try {
            const deletedProd = await deleteProduct(productId);

            setProducts((prev) =>
                prev.map((p) =>
                    p.id === productId
                        ? { ...p, ...deletedProd, is_active: false, active: false, _active: false }
                        : p
                )
            );

            setSuccess("Product deleted successfully!");
        } catch (err) {
            setError(typeof err === "string" ? err : err.message || "Failed to delete product");
        }
    };

    // Helper to check if product is deleted
    const isProductDeleted = (product) => {
        if (
            product.is_active === false ||
            product.active === false ||
            product._active === false ||
            product.is_active === "false"
        ) {
            return true;
        }
        return false;
    };

    // Filter products by search term
    const filteredProducts = products.filter((p) => {
        const query = searchTerm.toLowerCase();
        return (
            (p.name && p.name.toLowerCase().includes(query)) ||
            (p.id && String(p.id).toLowerCase().includes(query)) ||
            (p.categoryId && String(p.categoryId).includes(query))
        );
    });

    return (
        <div className="sd-shell">
            {/* Sidebar component */}
            <Sidebar storeName={storeName} />

            {/* Main content area */}
            <main className="sd-main">
                {/* Search & Top Action Bar */}
                <div className="sd-topbar">
                    <div className="sd-search">
                        <Icon name="search" size={16} />
                        <input
                            type="text"
                            placeholder="Search products by name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Notifications */}
                {error && <div className="prd-alert-error">{error}</div>}
                {success && <div className="prd-alert-success">{success}</div>}

                {/* Header Row before Table */}
                <div className="prd-header-action-row">
                    <h2 className="sd-section-title">
                        <Icon name="box" size={20} /> Store Products ({products.length})
                    </h2>
                    <button
                        className="prd-add-btn"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Icon name="plus" size={16} /> Add Products
                    </button>
                </div>

                {/* Products Table */}
                <section className="sd-section">
                    <div className="prd-table-container">
                        <table className="prd-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Cover Photo</th>
                                    <th>Category ID</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Low Stock Limit</th>
                                    <th>Status</th>
                                    <th>Update Product</th>
                                    <th>Delete Product</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="10" className="sd-no-results">
                                            Loading store products...
                                        </td>
                                    </tr>
                                ) : filteredProducts.length > 0 ? (
                                    filteredProducts.map((prod) => {
                                        const deleted = isProductDeleted(prod);
                                        const coverImg = getImageUrl(prod.imageUrl);

                                        return (
                                            <tr
                                                key={prod.id}
                                                className={deleted ? "prd-row-deleted" : ""}
                                            >
                                                {/* Column 1: ID */}
                                                <td className="sd-cell-code">PRD-{prod.id}</td>

                                                {/* Column 2: Name */}
                                                <td className="prd-product-name">{prod.name}</td>

                                                {/* Column 3: Cover Photo */}
                                                <td>
                                                    {coverImg ? (
                                                        <img
                                                            src={coverImg}
                                                            alt="Cover"
                                                            className="prd-cover-thumb"
                                                            onError={(e) => {
                                                                e.target.style.display = "none";
                                                                e.target.nextSibling.style.display = "flex";
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div
                                                        className="prd-no-img"
                                                        style={{ display: coverImg ? "none" : "flex" }}
                                                    >
                                                        <Icon name="camera" size={18} />
                                                    </div>
                                                </td>

                                                {/* Column 4: Category */}
                                                <td className="sd-cell-subcode">CAT-{prod.categoryId || prod.category_id || 1}</td>

                                                {/* Column 5: Price */}
                                                <td style={{ fontWeight: 600 }}>₹{Number(prod.price).toFixed(2)}</td>

                                                {/* Column 6: Stock */}
                                                <td className="sd-cell-qty">{prod.stock}</td>

                                                {/* Column 7: Low Stock Limit */}
                                                <td style={{ textAlign: "center" }}>{prod.low_stock_threshold || prod.lowStockThreshold || 5}</td>

                                                {/* Column 8: Status */}
                                                <td>
                                                    <span className={`prd-badge ${deleted ? "prd-badge-deleted" : "prd-badge-active"}`}>
                                                        {deleted ? "Inactive" : "Active"}
                                                    </span>
                                                </td>

                                                {/* Column 9: Update Product */}
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        className="prd-btn-update"
                                                        onClick={() => handleOpenUpdateModal(prod)}
                                                    >
                                                        <Icon name="edit" size={14} />Update
                                                    </button>
                                                </td>

                                                {/* Column 10: Delete Product */}
                                                <td style={{ textAlign: "center" }}>
                                                    <button
                                                        className="prd-btn-delete"
                                                        onClick={() => handleDeleteProduct(prod.id)}
                                                        disabled={deleted}
                                                    >
                                                        <Icon name="trash" size={14} /> {deleted ? "Deleted" : "Delete"}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="sd-no-results">
                                            {searchTerm ? `No products matching "${searchTerm}"` : "No products found in your store."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            {/* Modal 1: Add Product */}
            {isAddModalOpen && (
                <div className="prd-modal-overlay">
                    <div className="prd-modal-card">
                        <div className="prd-modal-header">
                            <h3 className="prd-modal-title">Add New Product</h3>
                            <button className="prd-modal-close" onClick={() => setIsAddModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="prd-form-grid">
                                <div className="prd-form-group full-width">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="e.g. Wireless Headphones"
                                        value={newProductData.name}
                                        onChange={(e) => setNewProductData({ ...newProductData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="prd-form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        placeholder="999.00"
                                        value={newProductData.price}
                                        onChange={(e) => setNewProductData({ ...newProductData, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="prd-form-group">
                                    <label>Stock Quantity *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="50"
                                        value={newProductData.stock}
                                        onChange={(e) => setNewProductData({ ...newProductData, stock: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="prd-form-group">
                                    <label>Low Stock Limit</label>
                                    <input
                                        type="number"
                                        name="low_stock_threshold"
                                        placeholder="5"
                                        value={newProductData.low_stock_threshold}
                                        onChange={(e) => setNewProductData({ ...newProductData, low_stock_threshold: e.target.value })}
                                    />
                                </div>

                                <div className="prd-form-group">
                                    <label>Category ID *</label>
                                    <input
                                        type="number"
                                        name="category_id"
                                        placeholder="1"
                                        value={newProductData.category_id}
                                        onChange={(e) => setNewProductData({ ...newProductData, category_id: e.target.value })}
                                        required
                                    />
                                </div>

                                {/* Cover Photo Upload */}
                                <div className="prd-form-group full-width">
                                    <label>Upload Cover Photo</label>
                                    <div
                                        className="prd-file-upload-box"
                                        onClick={() => coverInputRef.current?.click()}
                                    >
                                        <input
                                            ref={coverInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleCoverFileChange}
                                        />
                                        <div className="prd-upload-icon">
                                            <Icon name="camera" size={24} />
                                        </div>
                                        <span className="prd-upload-text">
                                            {coverFile ? coverFile.name : "Click to select Cover Photo"}
                                        </span>
                                        <span className="prd-upload-subtext">JPG, PNG, WEBP supported</span>
                                    </div>
                                    {coverPreview && (
                                        <div className="prd-preview-row">
                                            <img
                                                src={coverPreview}
                                                alt="Cover preview"
                                                className="prd-cover-preview-img"
                                            />
                                            <span style={{ fontSize: "12px", color: "#15803d", fontWeight: "600" }}>
                                                Cover photo selected
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="prd-modal-actions">
                                <button
                                    type="button"
                                    className="prd-btn-cancel"
                                    onClick={() => setIsAddModalOpen(false)}
                                    disabled={addLoading}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="prd-btn-submit" disabled={addLoading}>
                                    {addLoading ? "Uploading & Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal 2: Update Product */}
            {isUpdateModalOpen && (
                <div className="prd-modal-overlay">
                    <div className="prd-modal-card">
                        <div className="prd-modal-header">
                            <h3 className="prd-modal-title">Update Product (PRD-{selectedProduct?.id})</h3>
                            <button className="prd-modal-close" onClick={() => setIsUpdateModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="prd-form-grid">
                                <div className="prd-form-group full-width">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={updateProductData.name}
                                        onChange={(e) => setUpdateProductData({ ...updateProductData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="prd-form-group">
                                    <label>Price (₹) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={updateProductData.price}
                                        onChange={(e) => setUpdateProductData({ ...updateProductData, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="prd-form-group">
                                    <label>Stock Quantity *</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={updateProductData.stock}
                                        onChange={(e) => setUpdateProductData({ ...updateProductData, stock: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="prd-form-group full-width">
                                    <label>Update Cover Photo</label>
                                    <div
                                        className="prd-file-upload-box"
                                        onClick={() => updateCoverInputRef.current?.click()}
                                    >
                                        <input
                                            ref={updateCoverInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    setUpdateCoverFile(file);
                                                    setUpdateCoverPreview(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        <span className="prd-upload-text">
                                            {updateCoverFile ? updateCoverFile.name : "Change Cover Photo"}
                                        </span>
                                    </div>
                                    {updateCoverPreview && (
                                        <div className="prd-preview-row">
                                            <img
                                                src={updateCoverPreview}
                                                alt="Cover preview"
                                                className="prd-cover-preview-img"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="prd-modal-actions">
                                <button
                                    type="button"
                                    className="prd-btn-cancel"
                                    onClick={() => setIsUpdateModalOpen(false)}
                                    disabled={updateLoading}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="prd-btn-submit" disabled={updateLoading}>
                                    {updateLoading ? "Saving..." : "Update Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Product;