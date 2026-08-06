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
INSERT IGNORE INTO products (id, product_name, description,price, stock, low_stock_threshold, is_active, image_url, store_id, category_id, created_at, updated_at) VALUES
(101, 'Wireless Iphone','This is latest Iphone in the world Iphone', 2999.00, 50, 5, 1, '/uploads/images/iphone.jpg', 1, 4, NOW(), NOW()),
(102, 'Smart Fitness Tracker Watch','This is latest Iphone in the world Fitness Tracker', 4999.00, 30, 5, 1, '/uploads/images/watch.png', 1, 5, NOW(), NOW()),
(103, 'Classic Cotton Denim Jacket','This is latest Iphone in the word Denim Jacket', 3500.00, 20, 2, 1, '/uploads/images/menShirt.png', 2, 6, NOW(), NOW()),
(104, 'Fashionables item 1 ','This is latest Iphone in the world Fashionable Item 1 ', 4200.00, 15, 3, 1, '/uploads/images/fashion1.png', 1, 2, NOW(), NOW()),
(105, ' Classy Sofa','This is latest Iphone in the world best classy sofa', 2999.00, 50, 5, 1, '/uploads/images/sofa.png', 1, 3, NOW(), NOW()),
(106, 'Wearables Items','This is latest Iphone in the world wearables Items', 2999.00, 50, 5, 1, '/uploads/images/wearables.png', 1, 5, NOW(), NOW()),
(107, 'Fashionables item 1','This is latest Iphone in the world Iphone', 2999.00, 50, 5, 1, '/uploads/images/fashion2.jpg', 1, 2, NOW(), NOW());

-- =================================================================
-- 6. INSERT CUSTOMER ADDRESSES
-- =================================================================
INSERT IGNORE INTO customer_addresses (
    id, user_id, full_name, mobile_number, label,
    address_line_1, address_line_2, pincode, city, state, country,
    is_active, created_at, updated_at
) VALUES
(1, 1, 'Alice Johnson', '9876543210', 'HOME',
 'Flat 101', 'Near Phoenix Mall', '411014', 'Pune', 'Maharashtra', 'India',
 1, NOW(), NOW()),
(2, 2, 'Michael Brown', '9876543211', 'OFFICE',
 'Rajiv Gandhi Infotech Park', 'Phase 1', '411057', 'Pune', 'Maharashtra', 'India',
 1, NOW(), NOW()),
(3, 3, 'Emily Davis', '9876543212', 'HOME',
 'MG Road', 'Near Metro Station', '560001', 'Bengaluru', 'Karnataka', 'India',
 1, NOW(), NOW()),
(4, 4, 'David Wilson', '9876543213', 'OTHER',
 'Plot No. 56', 'Sector 18', '201301', 'Noida', 'Uttar Pradesh', 'India',
 1, NOW(), NOW());
>>>>>>> c0d488d2adabf20059534eb4300ac78b5ddbe051

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

-- =================================================================
-- 9. INSERT REVIEWS
-- =================================================================
INSERT IGNORE INTO reviews (
    review_id, product_id, user_id, order_id, rating, comment, is_active, created_at, updated_at
) VALUES
-- Review 1: Great review for Product 101 by User 1 (Order 1)
(1, 101, 1, 1, 5, 'Absolutely loved this product! Excellent build quality and fast shipping.', 1, NOW(), NOW()),

-- Review 2: Average review for Product 102 by User 1 (Order 2)
(2, 102, 1, 2, 3, 'Decent quality for the price, but packaging was slightly damaged.', 1, NOW(), NOW()),

-- Review 3: High rating for Product 104 by User 2 (Order 5)
(3, 104, 2, 5, 4, 'Works as advertised. Very happy with the purchase!', 1, NOW(), NOW());

-- =================================================================
-- 10. INSERT RETURN REQUESTS (10 Comprehensive Test Cases)
-- =================================================================
INSERT IGNORE INTO return_requests (
    return_request_id, order_id, order_item_id, user_id, reason, request_type,
    seller_decision, seller_notes, seller_decided_at,
    admin_user_id, admin_decision, admin_notes, admin_decided_at,
    is_active, created_at, updated_at
) VALUES

-- [1] DISPUTED: Item Return - Seller Rejected, Admin Pending (Shows in status=DISPUTED)
(1, 1, 1, 1, 'Product arrived shattered in transit.', 'RETURN',
 'REJECTED', 'Courier proof shows package was delivered intact.', NOW() - INTERVAL 2 DAY,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 3 DAY, NOW()),

-- [2] DISPUTED: Full Order Replace - Seller Rejected, Admin Pending (Shows in status=DISPUTED)
(2, 2, NULL, 1, 'Wrong items sent across the whole shipment.', 'REPLACE',
 'REJECTED', 'Seller claims weight check matched invoice.', NOW() - INTERVAL 1 DAY,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 2 DAY, NOW()),

-- [3] SELLER APPROVED: Item Replacement accepted by seller
(3, 5, 6, 2, 'Keyboard was defective, replacement requested.', 'REPLACE',
 'APPROVED', 'Replacement approved, reverse pickup scheduled.', NOW() - INTERVAL 1 DAY,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 2 DAY, NOW()),

-- [4] SELLER APPROVED: Full Order Return accepted by seller
(4, 1, NULL, 1, 'Entire order is no longer needed.', 'RETURN',
 'APPROVED', 'Accepted late delivery return request.', NOW() - INTERVAL 2 DAY,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 4 DAY, NOW()),

-- [5] PENDING SELLER: Fresh Item Return request awaiting seller action
(5, 2, 2, 1, 'Missing original box accessories.', 'RETURN',
 NULL, NULL, NULL,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 1 DAY, NOW()),

-- [6] PENDING SELLER: Fresh Full Order Replace request awaiting seller action
(6, 5, NULL, 2, 'Received a defective product.', 'REPLACE',
 NULL, NULL, NULL,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 6 HOUR, NOW()),

-- [7] ADMIN RESOLVED (OVERRIDDEN): Admin approved after Seller rejected
(7, 1, 1, 1, 'Headphones stopped working after delivery.', 'RETURN',
 'REJECTED', 'Seller claims physical damage after delivery.', NOW() - INTERVAL 5 DAY,
 15, 'APPROVED', 'Admin reviewed evidence provided by the customer. Refund granted.', NOW() - INTERVAL 1 DAY,
 1, NOW() - INTERVAL 6 DAY, NOW()),

-- [8] ADMIN RESOLVED (UPHELD): Admin rejected after Seller rejected
(8, 2, 2, 1, 'Did not like product aesthetics after opening.', 'RETURN',
 'REJECTED', 'Non-defective items non-returnable per category policy.', NOW() - INTERVAL 4 DAY,
 15, 'REJECTED', 'Admin upheld seller decision based on category terms.', NOW() - INTERVAL 1 DAY,
 1, NOW() - INTERVAL 5 DAY, NOW()),

-- [9] DISPUTED: Item Replacement - Seller Rejected, Admin Pending (Shows in status=DISPUTED)
(9, 5, 6, 2, 'Electrical component non-functional out of box.', 'REPLACE',
 'REJECTED', 'Seller requested service center certificate first.', NOW() - INTERVAL 12 HOUR,
 NULL, NULL, NULL, NULL,
 1, NOW() - INTERVAL 1 DAY, NOW()),

-- [10] INACTIVE / CANCELLED: User cancelled return request
(10, 5, NULL, 2, 'Accidental return request submission.', 'RETURN',
 NULL, NULL, NULL,
 NULL, NULL, NULL, NULL,
<<<<<<< HEAD
 0, NOW() - INTERVAL 7 DAY, NOW());
=======
 0, NOW() - INTERVAL 7 DAY, NOW());

-- =================================================================
-- 11. INSERT CART ITEMS
-- =================================================================
INSERT IGNORE INTO cart_items (id, user_id, product_id, quantity, added_at) VALUES
(1, 3, 101, 1, NOW()),
(2, 3, 103, 2, NOW()),
(3, 4, 102, 1, NOW());

-- =================================================================
-- 12. INSERT WISHLISTS
-- =================================================================
INSERT IGNORE INTO wishlists (
    id, user_id, product_id, created_at, updated_at
) VALUES
(1, 1, 103, NOW(), NOW()),
(2, 2, 101, NOW(), NOW()),
(3, 3, 102, NOW(), NOW()),
(4, 4, 104, NOW(), NOW());

-- =================================================================
-- 13. INSERT CUSTOMER COMPLAINTS
-- =================================================================
INSERT IGNORE INTO customer_complaints (
    id, order_id, customer_id, resolved_by, subject, body,
    resolved_at, is_active, created_at, updated_at
) VALUES
(1, 1, 1, NULL, 'Delivery packaging issue',
 'The outer package was damaged when the order arrived.',
 NULL, 1, NOW() - INTERVAL 2 DAY, NOW()),
(2, 2, 1, 15, 'Payment receipt required',
 'Please provide a payment receipt for this order.',
 NOW() - INTERVAL 1 DAY, 0, NOW() - INTERVAL 3 DAY, NOW()),
(3, 5, 2, NULL, 'Product support required',
 'I need help setting up the keyboard.',
 NULL, 1, NOW() - INTERVAL 1 DAY, NOW());
>>>>>>> c0d488d2adabf20059534eb4300ac78b5ddbe051
