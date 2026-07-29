function PaymentSection({
                            paymentMethod,
                            setPaymentMethod
                        }) {

    return (

        <div className="checkout-card">

            <h3>💳 Payment Method</h3>

            <div className="payment-options">

                <div
                    className={`payment-card ${
                        paymentMethod === "CASH_ON_DELIVERY" ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMethod("CASH_ON_DELIVERY")}
                >

                    <h4>💵 Cash On Delivery</h4>

                    <p>Pay when your order arrives.</p>

                </div>

                <div
                    className={`payment-card ${
                        paymentMethod === "ONLINE" ? "selected" : ""
                    }`}
                    onClick={() => setPaymentMethod("ONLINE")}
                >

                    <h4>💳 Online Payment</h4>

                    <p>Secure payment gateway.</p>

                </div>

            </div>

        </div>

    );
}

export default PaymentSection;