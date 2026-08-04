import api from "./axiosInstance";

export const adminApi = {
  // --- CATEGORIES ---
  getCategories: () => api.get("/admin/categories"),
  createCategory: (data) => api.post("/admin/categories", data),
  updateCategory: (catId, data) => api.put(`/admin/categories/${catId}`, data),
  deleteCategory: (catId) => api.delete(`/admin/categories/${catId}`),
  addCategoryAttribute: (catId, data) =>
    api.post(`/admin/categories/${catId}/attributes`, data),

  // --- CUSTOMER COMPLAINTS ---
  getComplaints: (resolved = null, page = 0, size = 10) => {
    const params = { page, size };
    if (resolved !== null) {
      params.resolved = resolved;
    }
    return api.get("/admin/complaints", { params });
  },
  resolveComplaint: (id, data) =>
    api.patch(`/admin/complaints/${id}/resolve`, data),

  // --- ORDERS ---
  getAllOrders: () => api.get("/admin/orders"),
  markOutForDelivery: (orderId) =>
    api.patch(`/admin/orders/${orderId}/out-for-delivery`),
  markDelivered: (orderId) => api.patch(`/admin/orders/${orderId}/delivered`),

  // --- DISPUTED RETURNS ---
  getDisputedReturns: () => api.get("/admin/returns?status=DISPUTED"),
  acceptDispute: (returnId) =>
    api.patch(`/admin/returns/${returnId}/accept-dispute`),
  rejectDispute: (returnId) =>
    api.patch(`/admin/returns/${returnId}/reject-dispute`),

  // --- FINANCIAL & COMMISSION SETTINGS ---
  getCommissionSetting: () => api.get("/admin/settings/commission"),
  updateCommissionSetting: (percentageValue) =>
    api.post("/admin/settings/commission", { percentage: percentageValue }),

  setSellerCommissionOverride: (sellerId, percentageValue) =>
    api.post(`/admin/sellers/${sellerId}/commission-override`, {
      percentage: percentageValue,
    }),

  // --- SELLERS ---

  getSellers: () => api.get("/admin/sellers"),

  // 2. Block/Unblock actions (matches @PatchMapping in Controller)
  blockSeller: (sellerId) => api.patch(`/admin/sellers/${sellerId}/block`),
  unblockSeller: (sellerId) =>
    api.patch(`/v1/admin/sellers/${sellerId}/unblock`),

  // 3. Delete action (matches @DeleteMapping in Controller)
  deleteSeller: (sellerId) => api.delete(`/admin/sellers/${sellerId}`),

  // --- PAYOUTS ---
  getPayouts: (status = null, page = 0, size = 10) => {
    const params = { page, size };
    if (status) {
      params.status = status; // Expected enum: PENDING, COMPLETED, FAILED, etc.
    }
    return api.get("/admin/payouts", { params });
  },
  releasePayout: (sellerId) => api.post(`/admin/payouts/${sellerId}/release`),

  // --- AUDIT LOGS ---
  getAuditLogs: (params) => api.get("/admin/audit-logs", { params }),
};
