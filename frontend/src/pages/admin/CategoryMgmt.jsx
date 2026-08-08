import React, { useState, useEffect } from "react";
import { adminApi } from "../../api/adminApi";
import {
  FolderPlus,
  Tag,
  ChevronRight,
  ChevronDown,
  PlusCircle,
  Layers,
  CheckCircle,
  AlertCircle,
  Pencil,
  Trash2,
} from "lucide-react";

const CategoryMgmt = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Expand/Collapse state for nested view
  const [expandedRows, setExpandedRows] = useState({});

  // Form State - Add Category
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [selectedParentId, setSelectedParentId] = useState("");

  // Form State - Edit Category
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryData, setEditCategoryData] = useState({
    id: null,
    name: "",
    parentId: "",
  });

  // Form State - Delete Category
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form State - Add Attribute
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [attributeName, setAttributeName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCategories();
      setCategories(response || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildCategoryTree = (items, parentId = null) => {
    return items
      .filter((item) => {
        const itemParent = item.parentId ?? item.parent_id ?? null;
        return itemParent === parentId;
      })
      .map((item) => {
        const itemId = item.id ?? item.categoryId ?? item.category_id;
        return {
          ...item,
          children: buildCategoryTree(items, itemId),
        };
      });
  };

  // Handle Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;
    setError(null);
    setSuccessMsg("");
    try {
      const parsedParentId =
        selectedParentId !== "" && selectedParentId !== null
          ? Number(selectedParentId)
          : null;
      const payload = {
        name: categoryName.trim(),
        parentId: parsedParentId,
        parent_id: parsedParentId,
      };
      await adminApi.createCategory(payload);
      setSuccessMsg(`Category "${categoryName}" created successfully!`);
      setCategoryName("");
      setSelectedParentId("");
      setShowCategoryModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create category.");
    }
  };

  // Handle Update Category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editCategoryData.name.trim() || !editCategoryData.id) return;
    setError(null);
    setSuccessMsg("");
    try {
      const payload = {
        name: editCategoryData.name.trim(),
        parentId: editCategoryData.parentId
          ? Number(editCategoryData.parentId)
          : null,
      };
      await adminApi.updateCategory(editCategoryData.id, payload);
      setSuccessMsg(`Category updated successfully!`);
      setShowEditModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update category.");
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    const targetId =
      categoryToDelete.id ??
      categoryToDelete.categoryId ??
      categoryToDelete.category_id;

    if (targetId === undefined || targetId === null) {
      console.error("Delete attempted without a valid category ID");
      setError("Invalid category ID.");
      return;
    }

    setError(null);
    setSuccessMsg("");

    try {
      await adminApi.deleteCategory(targetId);
      setSuccessMsg(
        `Category "${categoryToDelete.name}" deleted successfully!`
      );
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      setShowDeleteModal(false);
      const apiError = err.response?.data?.message || err.response?.data;
      setError(
        typeof apiError === "string"
          ? apiError
          : "Failed to delete category. Ensure it has no active subcategories or assigned products."
      );
    }
  };

  // Handle Add Attribute
  const handleAddAttribute = async (e) => {
    e.preventDefault();
    if (!attributeName.trim() || !activeCategory) return;
    setError(null);
    setSuccessMsg("");
    try {
      const payload = { name: attributeName.trim() };
      const catId =
        activeCategory.id ??
        activeCategory.categoryId ??
        activeCategory.category_id;
      await adminApi.addCategoryAttribute(catId, payload);
      setSuccessMsg(
        `Attribute "${attributeName}" added to "${activeCategory.name}"!`
      );
      setAttributeName("");
      setShowAttributeModal(false);
      fetchCategories();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add attribute.");
    }
  };

  const categoryTree = buildCategoryTree(categories);

  return (
    <div className="container-fluid p-0">
      {/* Header Banner */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Categories & Specifications</h3>
          <p className="text-muted mb-0">
            Manage product categories and dynamic specifications
          </p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setError(null);
            setSuccessMsg("");
            setShowCategoryModal(true);
          }}
        >
          <FolderPlus size={18} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div
          className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2"
          role="alert"
        >
          <CheckCircle size={18} />
          <div>{successMsg}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMsg("")}
          ></button>
        </div>
      )}
      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2"
          role="alert"
        >
          <AlertCircle size={18} />
          <div>{error}</div>
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          ></button>
        </div>
      )}

      {/* Categories Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="card-title mb-0 d-flex align-items-center gap-2">
            <Layers size={18} className="text-primary" />
            <span>Category Hierarchy</span>
          </h5>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categoryTree.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <p className="mb-0">
                No categories found. Click "Add Category" to create one.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "35%" }}>Category Name</th>
                    <th style={{ width: "15%" }}>Type</th>
                    <th style={{ width: "30%" }}>Attributes / Specs</th>
                    <th style={{ width: "20%" }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryTree.map((cat) => (
                    <CategoryRow
                      key={cat.id ?? cat.categoryId ?? cat.category_id}
                      category={cat}
                      level={0}
                      expandedRows={expandedRows}
                      toggleRow={toggleRow}
                      onAddAttribute={(category) => {
                        setError(null);
                        setSuccessMsg("");
                        setActiveCategory(category);
                        setShowAttributeModal(true);
                      }}
                      onEditCategory={(category) => {
                        setError(null);
                        setSuccessMsg("");
                        setEditCategoryData({
                          id:
                            category.id ??
                            category.categoryId ??
                            category.category_id,
                          name: category.name || "",
                          parentId:
                            category.parentId ?? category.parent_id ?? "",
                        });
                        setShowEditModal(true);
                      }}
                      onDeleteCategory={(category) => {
                        setError(null);
                        setSuccessMsg("");
                        setCategoryToDelete(category);
                        setShowDeleteModal(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Category */}
      {showCategoryModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add New Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCategoryModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Electronics, Laptops, Smartwatches"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Parent Category (Optional)
                    </label>
                    <select
                      className="form-select"
                      value={selectedParentId}
                      onChange={(e) => setSelectedParentId(e.target.value)}
                    >
                      <option value="">None (Set as Root Category)</option>
                      {categories.map((c) => {
                        const catId = c.id ?? c.categoryId ?? c.category_id;
                        return (
                          <option key={catId} value={String(catId)}>
                            {c.name}
                          </option>
                        );
                      })}
                    </select>
                    <div className="form-text">
                      Select a parent if this is a subcategory.
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowCategoryModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Category */}
      {showEditModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Category</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                ></button>
              </div>
              <form onSubmit={handleUpdateCategory}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Category Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={editCategoryData.name}
                      onChange={(e) =>
                        setEditCategoryData({
                          ...editCategoryData,
                          name: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Parent Category
                    </label>
                    <select
                      className="form-select"
                      value={editCategoryData.parentId}
                      onChange={(e) =>
                        setEditCategoryData({
                          ...editCategoryData,
                          parentId: e.target.value,
                        })
                      }
                    >
                      <option value="">None (Root Category)</option>
                      {categories
                        .filter(
                          (c) =>
                            (c.id ?? c.categoryId ?? c.category_id) !==
                            editCategoryData.id
                        )
                        .map((c) => {
                          const cId = c.id ?? c.categoryId ?? c.category_id;
                          return (
                            <option key={cId} value={cId}>
                              {c.name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirm Delete */}
      {showDeleteModal && categoryToDelete && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-danger">
                  Delete Category
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete category{" "}
                  <strong>"{categoryToDelete.name}"</strong>?
                </p>
                <p className="text-muted small mt-2 mb-0">
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCategoryToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDeleteCategory}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Category Attribute */}
      {showAttributeModal && activeCategory && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Add Specification Attribute to{" "}
                  <span className="text-primary">{activeCategory.name}</span>
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAttributeModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddAttribute}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Attribute Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. RAM, Storage, Screen Size, Color"
                      value={attributeName}
                      onChange={(e) => setAttributeName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={() => setShowAttributeModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Save Attribute
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Recursive Tree Row Component
const CategoryRow = ({
  category,
  level,
  expandedRows,
  toggleRow,
  onAddAttribute,
  onEditCategory,
  onDeleteCategory,
}) => {
  const catId = category.id ?? category.categoryId ?? category.category_id;
  const hasChildren =
    Array.isArray(category.children) && category.children.length > 0;
  const isExpanded = !!expandedRows[catId];
  return (
    <>
      <tr>
        <td>
          <div
            className="d-flex align-items-center"
            style={{ paddingLeft: `${level * 24}px` }}
          >
            {hasChildren ? (
              <button
                type="button"
                className="btn btn-link btn-sm p-0 me-2 text-dark text-decoration-none"
                onClick={() => toggleRow(catId)}
              >
                {isExpanded ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>
            ) : (
              <span
                className="d-inline-block"
                style={{ width: "26px" }}
              ></span>
            )}
            <span
              className={level === 0 ? "fw-bold text-dark" : "text-secondary"}
            >
              {category.name}
            </span>
          </div>
        </td>
        <td>
          {level === 0 ? (
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
              Root
            </span>
          ) : (
            <span className="badge bg-secondary-subtle text-secondary border border-secondary-subtle">
              Subcategory
            </span>
          )}
        </td>
        <td>
          <div className="d-flex flex-wrap gap-1">
            {category.attributes && category.attributes.length > 0 ? (
              category.attributes.map((attr, idx) => (
                <span
                  key={idx}
                  className="badge bg-light text-dark border d-flex align-items-center gap-1"
                >
                  <Tag size={12} className="text-muted" />
                  {attr.name || attr}
                </span>
              ))
            ) : (
              <span className="text-muted small fst-italic">
                No specifications set
              </span>
            )}
          </div>
        </td>
        <td className="text-end">
          <div className="d-inline-flex gap-1">
            <button
              type="button"
              className="btn btn-sm btn-outline-primary d-inline-flex align-items-center gap-1"
              onClick={() => onAddAttribute(category)}
              title="Add Spec Attribute"
            >
              <PlusCircle size={14} />
              <span className="d-none d-lg-inline">Add Spec</span>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center p-1"
              onClick={() => onEditCategory(category)}
              title="Edit Category"
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-inline-flex align-items-center p-1"
              onClick={() => onDeleteCategory(category)}
              title="Delete Category"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
      {/* Render Subcategories */}
      {hasChildren &&
        isExpanded &&
        category.children.map((child) => (
          <CategoryRow
            key={child.id ?? child.categoryId ?? child.category_id}
            category={child}
            level={level + 1}
            expandedRows={expandedRows}
            toggleRow={toggleRow}
            onAddAttribute={onAddAttribute}
            onEditCategory={onEditCategory}
            onDeleteCategory={onDeleteCategory}
          />
        ))}
    </>
  );
};

export default CategoryMgmt;