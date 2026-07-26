import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from "./context/CartContext.jsx";
import {WishlistProvider} from "./context/WishlistContext.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <CartProvider>
                <WishlistProvider>
                    <App />
                </WishlistProvider>
            </CartProvider>
        </BrowserRouter>
    </StrictMode>,
)