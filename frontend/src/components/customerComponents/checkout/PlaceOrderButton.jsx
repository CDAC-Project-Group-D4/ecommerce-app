function PlaceOrderButton({
                              loading,
                              handlePlaceOrder
                          }) {

    return (

        <button
            className="btn btn-warning w-100"
            disabled={loading}
            onClick={handlePlaceOrder}
        >
            {loading ? "Placing Order..." : "Place Order"}
        </button>

    );
}

export default PlaceOrderButton;