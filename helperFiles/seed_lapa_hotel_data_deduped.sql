INSERT INTO bed_types (id, bed_type) VALUES (1, '1 Queen Bed');
INSERT INTO bed_types (id, bed_type) VALUES (2, '1 King Bed');
INSERT INTO bed_types (id, bed_type) VALUES (3, '2 Single Beds');
INSERT INTO bed_types (id, bed_type) VALUES (4, '2 Queen Bed');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (1, 'Queen Suite', 'QS', 1, 0, 750, 750, 750, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (2, 'King Suite', 'KS', 2, 0, 870, 870, 870, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (3, 'Balcony Twin', 'BT', 3, 0, 870, 870, 870, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (4, 'Standard Room', 'SR', 1, 0, 575, 575, 575, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (5, 'Double Room', 'DR', 1, 0, 635, 635, 635, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (6, 'Family Room', 'FR', 4, 0, 1035, 1035, 1035, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (7, 'Twin Room', 'TR', 3, 0, 690, 690, 690, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (8, 'Standard King', 'SK', 2, 0, 635, 635, 635, 'Available');
INSERT INTO room_types (id, room_name, room_code, bed_type_id, available_rooms, week_price, weekend_price, discounted_price, status) VALUES (9, 'Two Bedroom Family Room', 'TB', 4, 0, 1840, 1840, 1840, 'Available');
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('1', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('2', 2, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('3', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('4', 2, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('5', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('6', 2, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('7', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('8', 2, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('9', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('10', 2, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('11', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('12', 3, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('13', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('14', 2, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('15', 1, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('16', 3, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('17', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('18', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('19', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('20', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('21', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('22', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('23', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('24', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('25', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('26', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('27', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('28', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('29', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('30', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('31', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('32', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('33', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('35', 6, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('36', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('37', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('38', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('39', 7, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('40', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('41', 7, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('42', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('43', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('44', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('45', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('46', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('47', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('48', 6, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('49', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('50', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('51', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('52', 8, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('53', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('54', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('55', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('56', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('57', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('58', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('59', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('60', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('61', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('62', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('63', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('64', 5, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('65', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('66', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('67', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('68', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('69', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('70', 9, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('71', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('72', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('73', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('74', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('75', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('76', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('77', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('78', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('79', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('80', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('81', 4, 0);
INSERT INTO rooms (room_no, room_type_id, booking_status) VALUES ('82', 4, 0);
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adult 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 child ');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (3, '2 Adults ');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (3, '2 Adults ');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (4, '4 Adults 2 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 2 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (3, '2 Adults ');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (3, '2 Adults ');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (4, '4 Adults 2 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (2, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (4, '4 Adults 2 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child');
INSERT INTO room_details (bed_type_id, room_details_list) VALUES (1, '2 Adults 1 Child ');



    -- Seed Packages
    INSERT INTO packages (package_name, package_price) VALUES 
    ('Bed & BreakFast', 600.00),
    ('All Inclusive', 1200.00),
    ('Head Massage', 300.00),
    ('Full Body Massage', 300.00),
    ('Breakfast In Bed', 300.00),
    ('Venue Hire', 5000.00),
    ('Sonar', 150.00),
    ('Morning Hike', 400.00),
    ('None', 0.00);

-- 1. Add Users
INSERT INTO users (id, username, password, full_name, surname, email)
VALUES
  (1, 'jason',  '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Mathipa', 'Makgato',  'jason@example.com'),
  (2, 'boni',   '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Boni',    'Dikgale',  'lebo@example.com'),
  (3, 'thakgi', '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Thakgi',  'Dikgale',  'thakgi@example.com'),
  (4, 'ranti',  '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Ranti',   'Dikgale',  'ranti@example.com');

-- 2. Add Roles
INSERT INTO roles (id, name, priority)
VALUES
  (1, 'ADMIN', 1),
  (2, 'EMPLOYEE', 2);

-- 3. Assign Users to Roles
INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 1), -- Jason as ADMIN
  (1, 2), -- Jason as EMPLOYEE
  (2, 2), -- Boni as EMPLOYEE
  (3, 2), -- Thakgi as EMPLOYEE
  (4, 1); -- Ranti as ADMIN

-- 4. Add Permissions
INSERT INTO permissions (id, name) VALUES
  (1, 'VIEW_DASHBOARD'),
  (2, 'EDIT_PROFILE'),
  (3, 'canAdd'),
  (4, 'canEdit'),
  (5, 'canRead');

-- 5. Assign Permissions to Roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (2, 1),
  (2, 3),
  (2, 4),
  (2, 5);



