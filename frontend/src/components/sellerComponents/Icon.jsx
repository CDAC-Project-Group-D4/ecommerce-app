// Small inline icon set (keeps this dependency-free — no icon package required).
// Shared by Sidebar and any page content that needs the same icon style.
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
        case "grid":
            return (<svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>);
        // Storefront — used for "Store Information"
        case "store":
            return (<svg {...props}><path d="M3 7l1.5-4h15L21 7" /><path d="M3 7v13a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V7" /><path d="M3 7h18" /><path d="M9 21v-6h6v6" /></svg>);
        case "message":
            return (<svg {...props}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>);
        // Package/box — used for "Products"
        case "box":
            return (<svg {...props}><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></svg>);
        case "truck":
            return (<svg {...props}><rect x="1" y="6" width="14" height="11" rx="1" /><path d="M15 10h4l3 3v4h-7z" /><circle cx="6" cy="19" r="1.6" /><circle cx="17.5" cy="19" r="1.6" /></svg>);
        case "star":
            return (<svg {...props}><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" /></svg>);
        // Curved return arrow — used for "Returns"
        case "return":
            return (<svg {...props}><path d="M9 14 4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5h-4" /></svg>);
        case "bar":
            return (<svg {...props}><path d="M3 21V9M10 21V3M17 21v-6" /></svg>);
        // Two-person outline — used for "Customer information"
        case "users":
            return (<svg {...props}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><path d="M16.5 5.6a3.2 3.2 0 0 1 0 6.2" /><path d="M15.5 14.2c3 .5 5.3 2.7 5.5 5.8" /></svg>);
        case "wallet":
            return (<svg {...props}><path d="M21 7H5a2 2 0 0 1 0-4h13v4" /><path d="M3 7v12a2 2 0 0 0 2 2h16v-6" /><path d="M17 13h4v4h-4a2 2 0 0 1 0-4Z" /></svg>);
        // Circled X — used for "Cancelled Order"
        case "cancel":
            return (<svg {...props}><circle cx="12" cy="12" r="9" /><path d="m9.5 9.5 5 5" /><path d="m14.5 9.5-5 5" /></svg>);
        case "megaphone":
            return (<svg {...props}><path d="m3 11 18-5v12L3 13v-2Z" /><path d="M11.6 16.8 13 22h-3l-1.5-5" /></svg>);
        case "puzzle":
            return (<svg {...props}><path d="M4 7h3.5a1.5 1.5 0 0 0 0-3H7V3h4v3.5a1.5 1.5 0 0 0 3 0V3h4v4h-3.5a1.5 1.5 0 0 0 0 3H21v4h-3.5a1.5 1.5 0 0 0 0 3H21v4h-4v-3.5a1.5 1.5 0 0 0-3 0V21H7v-4h3.5a1.5 1.5 0 0 0 0-3H7a3 3 0 0 1-3-3Z" /></svg>);
        case "chevron":
            return (<svg {...props}><path d="m6 9 6 6 6-6" /></svg>);
        case "edit":
            return (<svg {...props}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>);
        case "heart":
            return (<svg {...props} fill="currentColor" stroke="none"><path d="M12 21s-6.7-4.35-9.3-8.28C1 10.1 1.6 6.9 4.4 5.4A5.4 5.4 0 0 1 12 7.3a5.4 5.4 0 0 1 7.6-1.9c2.8 1.5 3.4 4.7 1.7 7.32C18.7 16.65 12 21 12 21Z" /></svg>);
        case "cart-fill":
            return (<svg {...props} fill="currentColor" stroke="none"><circle cx="9" cy="21" r="1.4" /><circle cx="20" cy="21" r="1.4" /><path d="M2 2h3l2.4 12.6a2.2 2.2 0 0 0 2.16 1.8h9a2.2 2.2 0 0 0 2.14-1.68L23 6H5" /></svg>);
        case "logout":
            return (<svg {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></svg>);
        case "camera":
            return (<svg {...props}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" /><circle cx="12" cy="13" r="4" /></svg>);
        case "trash":
            return (<svg {...props}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>);
        case "bell":
            return (<svg {...props}><path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6 2 7H4c.5-1 2-2.5 2-7Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>);
        case "mail":
            return (<svg {...props}><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7 10-7" /></svg>);
        case "phone":
            return (<svg {...props}><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 8.81v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.11 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7a2 2 0 0 1 1.72 2.01Z" /></svg>);
        case "calendar":
            return (<svg {...props}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
        case "user":
            return (<svg {...props}><circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" /></svg>);
        case "plus":
            return (<svg {...props}><path d="M12 5v14M5 12h14" /></svg>);
        default:
            return null;
    }
}

export default Icon;