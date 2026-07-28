function OrderStatusBadge({ status }) {

    return (

        <span

            className={`status-badge ${status.toLowerCase()}`}

        >

            {status}

        </span>

    );

}

export default OrderStatusBadge;