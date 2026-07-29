import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { getMyStore } from "../api/storeApi";

const SellerContext = createContext(null);

export const SellerProvider = ({ children }) => {
    const [store, setStore] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const [errorStore, setErrorStore] = useState(null);

    const refreshStore = useCallback(async () => {
        try {
            setLoadingStore(true);
            setErrorStore(null);
            const data = await getMyStore();
            setStore(data);
            return data;
        } catch (err) {
            console.error("SellerContext load store error:", err);
            setErrorStore(err.message || "Could not load store");
        } finally {
            setLoadingStore(false);
        }
    }, []);

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            refreshStore();
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
