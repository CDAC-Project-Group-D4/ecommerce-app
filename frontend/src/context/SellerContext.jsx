import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { getMyStore } from "../api/storeApi";

const SellerContext = createContext(null);

export const SellerProvider = ({ children }) => {
    const [store, setStore] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const [errorStore, setErrorStore] = useState(null);

    const refreshStore = useCallback(async () => {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
            setStore(null);
            setLoadingStore(false);
            return null;
        }
        try {
            setLoadingStore(true);
            setErrorStore(null);
            const data = await getMyStore();
            setStore(data || null);
            return data;
        } catch (err) {
            console.error("SellerContext load store error:", err);
            if (err.response && err.response.status === 404) {
                setStore(null);
                setErrorStore(null);
                return null;
            }
            setErrorStore(err.message || "Could not load store");
            return null;
        } finally {
            setLoadingStore(false);
        }
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                
                // 🔑 CRITICAL FIX: Only fetch store if logged-in user is a SELLER
                if (user?.role === "SELLER" || user?.role === "ROLE_SELLER") {
                    refreshStore();
                } else {
                    setLoadingStore(false); // Customer logged in, stop loading store
                }
            } catch (e) {
                console.error("Error parsing user from localStorage", e);
                setLoadingStore(false);
            }
        } else {
            setLoadingStore(false);
        }
    }, [refreshStore]);

    const clearSellerState = () => {
        setStore(null);
        setLoadingStore(false);
        setErrorStore(null);
    };

    return (
        <SellerContext.Provider
            value={{
                store,
                setStore,
                storeName: store?.storeName || "Your Store",
                loadingStore,
                errorStore,
                refreshStore,
                clearSellerState
            }}
        >
            {children}
        </SellerContext.Provider>
    );
};

export const useSeller = () => {
    return useContext(SellerContext);
};