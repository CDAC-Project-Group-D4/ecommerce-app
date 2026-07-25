import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Cart from "./pages/Cart.jsx";
import Wishlist from "./pages/Wishlist.jsx";

function App(){
    return (
        <div>
            <Routes>
                <Route path='/' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path="/cart" element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist/>}/>
            </Routes>
        </div>
    )
}

export default App