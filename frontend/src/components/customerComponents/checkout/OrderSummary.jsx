function OrderSummary({
                          cartItems,
                          subtotal,
                          grandTotal
                      }) {

    return (

        <div className="checkout-card summary-card">

            <h3>🧾 Order Summary</h3>

            {

                cartItems.map(item => (

                    <div
                        key={item.cartItemId}
                        className="summary-item"
                    >

                        <img
                            src={item.productImageUrl}
                            alt={item.productName}
                        />

                        <div>

                            <h5>{item.productName}</h5>

                            <p>

                                ₹{item.price} × {item.quantity}

                            </p>

                        </div>

                    </div>

                ))

            }

            <hr />

            <div className="price-row">

                <span>Subtotal</span>

                <span>₹{subtotal}</span>

            </div>

            <div className="price-row">

                <span>Delivery</span>

                <span className="free">FREE</span>

            </div>

            <div className="price-row total">

                <span>Grand Total</span>

                <span>₹{grandTotal}</span>

            </div>

        </div>

    );
}

export default OrderSummary;