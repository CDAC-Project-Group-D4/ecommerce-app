import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import CreateStore from "./pages/CreateStore.jsx";

import Checkout from "./pages/Checkout.jsx";
import Store from "./pages/Store.jsx";
import Product from "./pages/Product.jsx";
import CustomerInfo from './pages/CustomerInfo.jsx';
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AddReview from "./pages/AddReview.jsx";
import CreateReturn from "./pages/CreateReturn.jsx";
import MyReturns from "./pages/MyReturns.jsx";
import SellerReturns from "./pages/SellerReturns.jsx";
import SellerOrders from "./pages/SellerOrders.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import CategoryMgmt from "./pages/admin/CategoryMgmt.jsx";
import SellerMgmt from "./pages/admin/SellerMgmt";
import LogisticsMgmt from "./pages/admin/LogisticsMgmt";
import DisputeMgmt from "./pages/admin/DisputeMgmt";
import PayoutsMgmt from "./pages/admin/PayoutMgmt.jsx";
import AuditLogs from "./pages/admin/AuditLogs.jsx";

import { ProtectedAdminRoute } from "./routes/ProtectedAdminRoute.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";
import AdminComplaints from "./pages/admin/AdminComplaints.jsx";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/create-store" element={<CreateStore />} />
        <Route path="/seller/store-info" element={<Store />} />
        <Route path="/seller/products" element={<Product />} />
        <Route path='/seller/customer-info' element={<CustomerInfo/>}/>
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />

        <Route element={<ProtectedAdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/categories" replace />}
            />
            <Route path="/admin/categories" element={<CategoryMgmt />} />
            <Route path="/admin/sellers" element={<SellerMgmt />} />
            <Route path="/admin/logistics" element={<LogisticsMgmt />} />
            <Route path="/admin/disputes" element={<DisputeMgmt />} />
            <Route path="/admin/payouts" element={<PayoutsMgmt />} />
            <Route path="/admin/audit-logs" element={<AuditLogs />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/reviews/add" element={<AddReview />} />
          <Route path="/returns/new" element={<CreateReturn />} />
          <Route path="/returns" element={<MyReturns />} />
          <Route path="/seller/returns" element={<SellerReturns />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
