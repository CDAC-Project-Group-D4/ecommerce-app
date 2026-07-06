-- CUSTOMERS (10 more unique users)
INSERT IGNORE INTO users (full_name, email, phone, image_url, password, roles, is_active, is_blocked, created_at, updated_at) VALUES
('Alice Johnson', 'alice.j@example.com', '+12025550143', 'https://example.com/images/alice.jpg', '$2a$10$eXpAnDlEpAsSwOrD000001', 'CUSTOMER', 1, 0, NOW(), NOW()),
('Michael Brown', 'mbrown@example.com', '+12025550172', NULL, '$2a$10$eXpAnDlEpAsSwOrD000002', 'CUSTOMER', 1, 0, NOW(), NOW()),
('Emily Davis', 'emily.davis@example.com', '+12025550198', 'https://example.com/images/emily.jpg', '$2a$10$eXpAnDlEpAsSwOrD000003', 'CUSTOMER', 1, 0, NOW(), NOW()),
('David Wilson', 'dwilson@example.com', '+12025550111', NULL, '$2a$10$eXpAnDlEpAsSwOrD000004', 'CUSTOMER', 1, 0, NOW(), NOW()),
('Sarah Martinez', 'sarah.m@example.com', '+12025550155', 'https://example.com/images/sarah.jpg', '$2a$10$eXpAnDlEpAsSwOrD000005', 'CUSTOMER', 1, 0, NOW(), NOW()),
('James Taylor', 'jtaylor@example.com', '+12025550166', NULL, '$2a$10$eXpAnDlEpAsSwOrD000006', 'CUSTOMER', 1, 0, NOW(), NOW()),
('Linda Anderson', 'linda.a@example.com', '+12025550122', 'https://example.com/images/linda.jpg', '$2a$10$eXpAnDlEpAsSwOrD000007', 'CUSTOMER', 0, 0, NOW(), NOW()), -- Inactive user
('Robert Thomas', 'rthomas@example.com', '+12025550188', NULL, '$2a$10$eXpAnDlEpAsSwOrD000008', 'CUSTOMER', 1, 0, NOW(), NOW()),
('Barbara White', 'bwhite@example.com', '+12025550133', 'https://example.com/images/barbara.jpg', '$2a$10$eXpAnDlEpAsSwOrD000009', 'CUSTOMER', 1, 0, NOW(), NOW()),
('William Harris', 'wharris@example.com', '+12025550144', NULL, '$2a$10$eXpAnDlEpAsSwOrD000010', 'CUSTOMER', 1, 1, NOW(), NOW()); -- Blocked user

-- SELLERS (4 more unique users)
INSERT IGNORE INTO users (full_name, email, phone, image_url, password, roles, is_active, is_blocked, created_at, updated_at) VALUES
('Global Tech Corp', 'vendor.tech@example.com', '+18005550199', 'https://example.com/images/tech_logo.jpg', '$2a$10$eXpAnDlEpAsSwOrD000011', 'SELLER', 1, 0, NOW(), NOW()),
('Fashion Hub', 'vendor.fashion@example.com', '+18005550188', 'https://example.com/images/fashion_logo.jpg', '$2a$10$eXpAnDlEpAsSwOrD000012', 'SELLER', 1, 0, NOW(), NOW()),
('Organic Grocer', 'vendor.grocer@example.com', '+18005550177', NULL, '$2a$10$eXpAnDlEpAsSwOrD000013', 'SELLER', 1, 0, NOW(), NOW()),
('Book Worm LLC', 'vendor.books@example.com', '+18005550166', 'https://example.com/images/books_logo.jpg', '$2a$10$eXpAnDlEpAsSwOrD000014', 'SELLER', 0, 0, NOW(), NOW()); -- Pending approval/Inactive seller

-- ADMIN (1 more backup Admin)
INSERT IGNORE INTO users (full_name, email, phone, image_url, password, roles, is_active, is_blocked, created_at, updated_at) VALUES
('System Admin 2', 'admin2@ecommerce.com', '+19995551122', NULL, '$2a$10$eXpAnDlEpAsSwOrD000015', 'ADMIN', 1, 0, NOW(), NOW());