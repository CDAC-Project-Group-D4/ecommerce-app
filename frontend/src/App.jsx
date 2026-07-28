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
import CustomerInfo from './pages/CustomerInfo.jsx';
import Orders from "./pages/Orders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";

function App(){
    return (
        <div>
            <Routes>
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
                <Route path='/seller/customer-info' element={<CustomerInfo/>}/>
                <Route path="/orders/:orderId" element={<OrderDetails />} />
            </Routes>
        </div>
    )
}

export default App