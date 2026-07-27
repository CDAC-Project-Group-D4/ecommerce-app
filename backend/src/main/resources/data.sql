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


INSERT INTO categories
(id, parent_id, name, is_active, created_at, updated_at)
VALUES
(1, NULL, 'Electronics', 1, NOW(), NOW()),
(2, NULL, 'Fashion', 1, NOW(), NOW()),
(3, NULL, 'Home & Kitchen', 1, NOW(), NOW()),
(4, NULL, 'Books', 1, NOW(), NOW()),
(5, NULL, 'Sports', 1, NOW(), NOW()),

-- Electronics Children
(6, 1, 'Mobiles', 1, NOW(), NOW()),
(7, 1, 'Laptops', 1, NOW(), NOW()),
(8, 1, 'Televisions', 1, NOW(), NOW()),

-- Fashion Children
(9, 2, 'Men Clothing', 1, NOW(), NOW()),
(10, 2, 'Women Clothing', 1, NOW(), NOW()),

-- Home Children
(11, 3, 'Kitchen Appliances', 1, NOW(), NOW()),
(12, 3, 'Furniture', 1, NOW(), NOW()),

-- Books Children
(13, 4, 'Programming', 1, NOW(), NOW()),
(14, 4, 'Novels', 1, NOW(), NOW()),

-- Sports Children
(15, 5, 'Cricket', 1, NOW(), NOW()),
(16, 5, 'Football', 1, NOW(), NOW());