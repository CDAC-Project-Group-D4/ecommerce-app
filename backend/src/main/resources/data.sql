-- =================================================================
-- 1. INSERT USERS (Notice the 'roles' column is removed from users)
-- =================================================================

-- CUSTOMERS (10 users)
INSERT IGNORE INTO users (id, full_name, email, phone, image_url, password, is_active, is_blocked, created_at, updated_at) VALUES
(1, 'Alice Johnson', 'alice.j@example.com', '+12025550143', 'https://example.com/images/alice.jpg', '$2a$10$eXpAnDlEpAsSwOrD000001', 1, 0, NOW(), NOW()),
(2, 'Michael Brown', 'mbrown@example.com', '+12025550172', NULL, '$2a$10$eXpAnDlEpAsSwOrD000002', 1, 0, NOW(), NOW()),
(3, 'Emily Davis', 'emily.davis@example.com', '+12025550198', 'https://example.com/images/emily.jpg', '$2a$10$eXpAnDlEpAsSwOrD000003', 1, 0, NOW(), NOW()),
(4, 'David Wilson', 'dwilson@example.com', '+12025550111', NULL, '$2a$10$eXpAnDlEpAsSwOrD000004', 1, 0, NOW(), NOW()),
(5, 'Sarah Martinez', 'sarah.m@example.com', '+12025550155', 'https://example.com/images/sarah.jpg', '$2a$10$eXpAnDlEpAsSwOrD000005', 1, 0, NOW(), NOW()),
(6, 'James Taylor', 'jtaylor@example.com', '+12025550166', NULL, '$2a$10$eXpAnDlEpAsSwOrD000006', 1, 0, NOW(), NOW()),
(7, 'Linda Anderson', 'linda.a@example.com', '+12025550122', 'https://example.com/images/linda.jpg', '$2a$10$eXpAnDlEpAsSwOrD000007', 0, 0, NOW(), NOW()), -- Inactive user
(8, 'Robert Thomas', 'rthomas@example.com', '+12025550188', NULL, '$2a$10$eXpAnDlEpAsSwOrD000008', 1, 0, NOW(), NOW()),
(9, 'Barbara White', 'bwhite@example.com', '+12025550133', 'https://example.com/images/barbara.jpg', '$2a$10$eXpAnDlEpAsSwOrD000009', 1, 0, NOW(), NOW()),
(10, 'William Harris', 'wharris@example.com', '+12025550144', NULL, '$2a$10$eXpAnDlEpAsSwOrD000010', 1, 1, NOW(), NOW()); -- Blocked user

-- SELLERS (4 users)
INSERT IGNORE INTO users (id, full_name, email, phone, image_url, password, is_active, is_blocked, created_at, updated_at) VALUES
(11, 'Global Tech Corp', 'vendor.tech@example.com', '+18005550199', 'https://example.com/images/tech_logo.jpg', '$2a$10$eXpAnDlEpAsSwOrD000011', 1, 0, NOW(), NOW()),
(12, 'Fashion Hub', 'vendor.fashion@example.com', '+18005550188', 'https://example.com/images/fashion_logo.jpg', '$2a$10$eXpAnDlEpAsSwOrD000012', 1, 0, NOW(), NOW()),
(13, 'Organic Grocer', 'vendor.grocer@example.com', '+18005550177', NULL, '$2a$10$eXpAnDlEpAsSwOrD000013', 1, 0, NOW(), NOW()),
(14, 'Book Worm LLC', 'vendor.books@example.com', '+18005550166', 'https://example.com/images/books_logo.jpg', '$2a$10$eXpAnDlEpAsSwOrD000014', 0, 0, NOW(), NOW()); -- Pending approval/Inactive seller

-- ADMIN (1 user)
INSERT IGNORE INTO users (id, full_name, email, phone, image_url, password, is_active, is_blocked, created_at, updated_at) VALUES
(15, 'System Admin 2', 'admin2@ecommerce.com', '+19995551122', NULL, '$2a$10$eXpAnDlEpAsSwOrD000015', 1, 0, NOW(), NOW());


-- =================================================================
-- 2. INSERT ROLES INTO JOIN TABLE (user_roles)
-- =================================================================

-- Customer Roles
INSERT IGNORE INTO user_roles (user_id, role) VALUES
(1, 'CUSTOMER'),
(2, 'CUSTOMER'),
(3, 'CUSTOMER'),
(4, 'CUSTOMER'),
(5, 'CUSTOMER'),
(6, 'CUSTOMER'),
(7, 'CUSTOMER'),
(8, 'CUSTOMER'),
(9, 'CUSTOMER'),
(10, 'CUSTOMER');

-- Seller Roles (Demonstrating multi-role support: Sellers who are also Customers!)
INSERT IGNORE INTO user_roles (user_id, role) VALUES
(11, 'SELLER'),
(12, 'SELLER'),
(13, 'SELLER'),
(14, 'SELLER'),
-- Optional: If sellers can also buy items as customers, add their customer roles here:
(11, 'CUSTOMER'),
(12, 'CUSTOMER');

-- Admin Role
INSERT IGNORE INTO user_roles (user_id, role) VALUES
(15, 'ADMIN');

-- =================================================================
-- 3. INSERT STORES (Belong to Sellers 11, 12, 13, 14)
-- =================================================================
INSERT IGNORE INTO stores (
    id, store_name, description, banner_url, profile_photo_url, on_holiday, is_active, user_id, created_at, updated_at
) VALUES
(1, 'Tech Zone', 'Your one-stop shop for modern electronics', NULL, NULL, 0, 1, 11, NOW(), NOW()),
(2, 'Vogue Fashion', 'Trendy apparel and modern accessories', NULL, NULL, 0, 1, 12, NOW(), NOW()),
(3, 'Fresh Harvest', 'Organic grocers and home goods', NULL, NULL, 0, 1, 13, NOW(), NOW()),
(4, 'The Bookmark', 'New releases and rare books', NULL, NULL, 0, 0, 14, NOW(), NOW());

-- =================================================================
-- 4. INSERT CATEGORIES (Base & Sub-categories)
-- =================================================================
INSERT IGNORE INTO categories (category_id, name, is_active, parent_id, created_at, updated_at) VALUES
(1, 'Electronics', 1, NULL, NOW(), NOW()),
(2, 'Fashion', 1, NULL, NOW(), NOW()),
(3, 'Home & Living', 1, NULL, NOW(), NOW()),
(4, 'Mobile & Audio', 1, 1, NOW(), NOW()),
(5, 'Wearables', 1, 1, NOW(), NOW()),
(6, 'Men Clothing', 1, 2, NOW(), NOW());

-- =================================================================
-- 5. INSERT PRODUCTS
-- =================================================================
INSERT IGNORE INTO products (id, product_name, price, stock, low_stock_threshold, is_active, image_url, store_id, category_id, created_at, updated_at) VALUES
(101, 'Wireless Noise-Canceling Headphones', 2999.00, 50, 5, 1, 'https://example.com/images/headphones.jpg', 1, 4, NOW(), NOW()),
(102, 'Smart Fitness Tracker Watch', 4999.00, 30, 5, 1, 'https://example.com/images/smartwatch.jpg', 1, 5, NOW(), NOW()),
(103, 'Classic Cotton Denim Jacket', 3500.00, 20, 2, 1, 'https://example.com/images/jacket.jpg', 2, 6, NOW(), NOW()),
(104, 'Ergonomic Mechanical Keyboard', 4200.00, 15, 3, 1, 'https://example.com/images/keyboard.jpg', 1, 4, NOW(), NOW());

-- =================================================================
-- 6. INSERT CUSTOMER ADDRESSES
-- =================================================================
INSERT IGNORE INTO customer_addresses (
    id, user_id, full_name, mobile_number, label,
    address_line_1, address_line_2, pincode, city, state, country, is_active, created_at, updated_at
) VALUES
(1, 1, 'Alice Johnson', '+12025550143', 'HOME', '123 Main Street', 'Apt 4B', '10001', 'New York', 'NY', 'USA', 1, NOW(), NOW()),
(2, 2, 'Michael Brown', '+12025550172', 'OFFICE', '456 Park Avenue', 'Suite 200', '94107', 'San Francisco', 'CA', 'USA', 1, NOW(), NOW()),
(3, 3, 'Emily Davis', '+12025550198', 'HOME', '789 Oak Lane', NULL, '73301', 'Austin', 'TX', 'USA', 1, NOW(), NOW());

-- =================================================================
-- 7. INSERT ORDERS
-- =================================================================

-- =================================================================
-- 7. INSERT ORDERS (Fixed PaymentMethod enum strings)
-- =================================================================

-- Order 1: DELIVERED RECENTLY
INSERT IGNORE INTO orders (
    order_id, user_id, address_id, order_status, payment_method, total_amt,
    payment_ref, tracking_id, placed_at, shipped_at, delivered_at, completed_at, created_at, updated_at
) VALUES (
    1, 1, 1, 'DELIVERED', 'ONLINE', 2999.00,
    'PAY_RAZOR_98765', 'TRK_NY_1001', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 2 DAY, NULL, NOW(), NOW()
);

-- Order 2: DELIVERED EXPIRED (Updated 'COD' -> 'CASH_ON_DELIVERY')
INSERT IGNORE INTO orders (
    order_id, user_id, address_id, order_status, payment_method, total_amt,
    payment_ref, tracking_id, placed_at, shipped_at, delivered_at, completed_at, created_at, updated_at
) VALUES (
    2, 1, 1, 'DELIVERED', 'CASH_ON_DELIVERY', 4999.00,
    NULL, 'TRK_NY_1002', NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 12 DAY, NOW() - INTERVAL 10 DAY, NULL, NOW(), NOW()
);

-- Order 3: SHIPPED
INSERT IGNORE INTO orders (
    order_id, user_id, address_id, order_status, payment_method, total_amt,
    payment_ref, tracking_id, placed_at, shipped_at, delivered_at, completed_at, created_at, updated_at
) VALUES (
    3, 2, 2, 'SHIPPED', 'ONLINE', 3500.00,
    'PAY_RAZOR_99999', 'TRK_SF_3001', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 DAY, NULL, NULL, NOW(), NOW()
);

-- Order 4: OUT_FOR_DELIVERY (Updated 'COD' -> 'CASH_ON_DELIVERY')
INSERT IGNORE INTO orders (
    order_id, user_id, address_id, order_status, payment_method, total_amt,
    payment_ref, tracking_id, placed_at, shipped_at, delivered_at, completed_at, created_at, updated_at
) VALUES (
    4, 3, 3, 'OUT_FOR_DELIVERY', 'CASH_ON_DELIVERY', 7199.00,
    NULL, 'TRK_ATX_4001', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 1 DAY, NULL, NULL, NOW(), NOW()
);

-- Order 5: COMPLETED
INSERT IGNORE INTO orders (
    order_id, user_id, address_id, order_status, payment_method, total_amt,
    payment_ref, tracking_id, placed_at, shipped_at, delivered_at, completed_at, created_at, updated_at
) VALUES (
    5, 2, 2, 'COMPLETED', 'ONLINE', 4200.00,
    'PAY_RAZOR_11111', 'TRK_SF_0001', NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 18 DAY, NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 7 DAY, NOW(), NOW()
);

-- =================================================================
-- 8. INSERT ORDER ITEMS
-- =================================================================
INSERT IGNORE INTO order_items (
    order_item_id, order_id, product_id, quantity, price, line_total, created_at, updated_at
) VALUES
(1, 1, 101, 1, 2999.00, 2999.00, NOW(), NOW()), -- Order #1
(2, 2, 102, 1, 4999.00, 4999.00, NOW(), NOW()), -- Order #2
(3, 3, 103, 1, 3500.00, 3500.00, NOW(), NOW()), -- Order #3
(4, 4, 101, 1, 2999.00, 2999.00, NOW(), NOW()), -- Order #4 (Item 1)
(5, 4, 104, 1, 4200.00, 4200.00, NOW(), NOW()), -- Order #4 (Item 2)
(6, 5, 104, 1, 4200.00, 4200.00, NOW(), NOW()); -- Order #5