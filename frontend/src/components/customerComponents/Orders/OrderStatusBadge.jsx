function OrderStatusBadge({ status }) {

    return (

        <span

            className={`status-badge ${status.toLowerCase()}`}

        >

            {status.replaceAll("_", " ")}

        </span>

    );

}

export default OrderStatusBadge;
