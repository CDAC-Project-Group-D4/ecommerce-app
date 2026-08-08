import api from "./axiosInstance";

export const adminApi = {
  // --- CATEGORIES ---
  getCategories: () => api.get("/v1/admin/categories"),
  createCategory: (data) => api.post("/v1/admin/categories", data),
  updateCategory: (catId, data) => api.put(`/v1/admin/categories/${catId}`, data),
  deleteCategory: (catId) => api.delete(`/v1/admin/categories/${catId}`),
  addCategoryAttribute: (catId, data) =>
    api.post(`/v1/admin/categories/${catId}/attributes`, data),

  // --- CUSTOMER COMPLAINTS ---
  getComplaints: (resolved = null, page = 0, size = 10) => {
    const params = { page, size };
    if (resolved !== null) {
      params.resolved = resolved;
    }
    return api.get("/v1/admin/complaints", { params });
  },
  resolveComplaint: (id, data) =>
    api.patch(`/v1/admin/complaints/${id}/resolve`, data),

  // --- ORDERS ---
  getAllOrders: () => api.get("/v1/admin/orders"),
  markOutForDelivery: (orderId) =>
    api.patch(`/v1/admin/orders/${orderId}/out-for-delivery`),
  markDelivered: (orderId) => api.patch(`/v1/admin/orders/${orderId}/delivered`),

  // --- DISPUTED RETURNS ---

  getReturnsByStatus: (status) => {
    const url = status && status !== "ALL" 
      ? `/v1/admin/returns?status=${status}` 
      : `/v1/admin/returns`;
    return api.get(url);
  },

  getDisputedReturns: () => api.get("/v1/admin/returns?status=DISPUTED"),
  
  acceptDispute: (returnId, payload = {}) =>
    api.patch(`/v1/admin/returns/${returnId}/accept-dispute`, payload),
    
  rejectDispute: (returnId, payload = {}) =>
    api.patch(`/v1/admin/returns/${returnId}/reject-dispute`, payload),

  // --- FINANCIAL & COMMISSION SETTINGS ---
  getCommissionSetting: () => api.get("/v1/admin/settings/commission"),
  updateCommissionSetting: (percentageValue) =>
    api.post("/v1/admin/settings/commission", { percentage: percentageValue }),

  setSellerCommissionOverride: (sellerId, percentageValue) =>
    api.post(`/v1/admin/sellers/${sellerId}/commission-override`, {
      percentage: percentageValue,
    }),

  // --- SELLERS ---

  getSellers: () => api.get("/v1/admin/sellers"),

  // 2. Block/Unblock actions (matches @PatchMapping in Controller)
  blockSeller: (sellerId) => api.patch(`/v1/admin/sellers/${sellerId}/block`),
  unblockSeller: (sellerId) =>
    api.patch(`/v1/admin/sellers/${sellerId}/unblock`),

  // 3. Delete action (matches @DeleteMapping in Controller)
  deleteSeller: (sellerId) => api.delete(`/v1/admin/sellers/${sellerId}`),

  // --- PAYOUTS ---
  getPayouts: (status = null, page = 0, size = 10) => {
    const params = { page, size };
    if (status) {
      params.status = status; // Expected enum: PENDING, COMPLETED, FAILED, etc.
    }
    return api.get("/v1/admin/payouts", { params });
  },
  releasePayout: (sellerId) => api.post(`/v1/admin/payouts/${sellerId}/release`),

  // --- AUDIT LOGS ---
  getAuditLogs: (params) => api.get("/v1/admin/audit-logs", { params }),
};
