import {Route, Routes} from 'react-router-dom'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Cart from "./pages/Cart.jsx";

function App(){
    return (
        <div>
            <Routes>
                <Route path='/signin' element={<SignIn />} />
                <Route path='/signup' element={<SignUp />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </div>
    )
}

export default App