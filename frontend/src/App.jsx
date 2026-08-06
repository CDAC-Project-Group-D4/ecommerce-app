import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import SellerDashboard from './pages/SellerDashboard.jsx';
import CreateStore from './pages/CreateStore.jsx';

import Checkout from "./pages/Checkout.jsx";
import Store from './pages/Store.jsx';
import Product from './pages/Product.jsx';
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import AddReview from "./pages/AddReview.jsx";
import CreateReturn from "./pages/CreateReturn.jsx";
import MyReturns from "./pages/MyReturns.jsx";
import SellerReturns from "./pages/SellerReturns.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
// import './Home.css';
import Home from './pages/Home';
import './css/Home.css';    
import ProductDetail from './pages/ProductDetail.jsx';


function App(){
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                {/* <Route path="/login" element={<Login />} /> */}
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path='/wishlist' element={<Wishlist/>}/>
                <Route path="/orders" element={<Orders />} />
                <Route path='/seller/dashboard' element={<SellerDashboard/>}/>
                <Route path='/create-store' element={<CreateStore/>}/>
                <Route path='/seller/store-info' element={<Store/>}/>
                <Route path='/seller/products' element={<Product/>}/>
               <Route path="/orders/:orderId" element={<OrderDetails />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/order-success" element={<OrderSuccess />} />
                    <Route path="/reviews/add" element={<AddReview />} />
                    <Route path="/returns/new" element={<CreateReturn />} />
                    <Route path="/returns" element={<MyReturns />} />
                    <Route path="/seller/returns" element={<SellerReturns />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
