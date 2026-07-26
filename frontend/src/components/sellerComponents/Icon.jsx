// Small inline icon set for Seller components.
function Icon({ name, size = 18 }) {
    const props = {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };
    switch (name) {
        case "cart":
            return (<svg {...props}><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>);
        case "search":
            return (<svg {...props}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>);
        case "dashboard":
            return (<svg {...props}><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg>);
        case "store":
            return (<svg {...props}><path d="M3 7l1.5-4h15L21 7" /><path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" /><path d="M3 7h18" /><path d="M9 21v-6h6v6" /></svg>);
        case "message":
            return (<svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
        case "box":
            return (<svg {...props}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></svg>);
        case "truck":
            return (<svg {...props}><rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="1.6" /><circle cx="17.5" cy="19" r="1.6" /></svg>);
        case "return":
            return (<svg {...props}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5h-4" /></svg>);
        case "bar":
            return (<svg {...props}><path d="M3 21V9M10 21V3M17 21v-6" /></svg>);
        case "pie-chart":
            return (<svg {...props}><path d="M21.21 15.89A10 10 0 1 1 8 2.83" /><path d="M22 12A10 10 0 0 0 12 2v10z" /></svg>);
        case "users":
            return (<svg {...props}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.2" /><path d="M15.5 14.2c3 .5 5.3 2.7 5.5 5.8" /></svg>);
        case "cancel":
            return (<svg {...props}><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5" /><path d="m14.5 9.5-5 5" /></svg>);
        case "logout":
            return (<svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>);
        default:
            return null;
    }
}

export default Icon;