import { Link } from "react-router-dom";

function EmptyOrders() {

    return (

        <div className="empty-orders">

            <h2>

                📦

            </h2>

            <h3>

                No Orders Yet

            </h3>

            <p>

                Looks like you haven't placed any order.

            </p>

            <Link

                to="/products"

                className="shop-btn"

            >

                Continue Shopping

            </Link>

        </div>

    );

}

export default EmptyOrders;