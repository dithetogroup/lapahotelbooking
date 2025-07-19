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
    INSERT INTO packages (package_name, package_type, package_time, package_price) VALUES 
    ('BreakFast', 'breakfast', Null, 180.00),
    ('Dinner', 'dinner', Null,180.00),
    ('Lunch', 'lunch', Null, 180.00),
    ('Anti Stress', 'spa', 30, 200.00),
    ('Hot Stone Half Body(30m)', 'spa', 30, 300.00),
    ('Hot Stone Full Body (45m)','spa', 45, 390.00),
    ('Hot Stone Full Body (60m)', 'spa', 60, 530.00),
    ('Facial (45m)', 'spa', 45, 400.00),
    ('Couples Full Body(45m)','spa', 45, 650.00),
    ('None', 'none', NULL, 0.00);

-- 1. Add Users
INSERT INTO users (id, username, password, full_name, surname, email)
VALUES
  (1, 'jason',    '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Mathipa',  'Makgato',   'jason@example.com'),
  (2, 'boni',     '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Boni',     'Dikgale',   'lebo@example.com'),
  (3, 'testing1', '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'testing1', 'testing1',   'testing1@example.com'),
  (4, 'testing2', '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'testing2', 'testing2',   'testing2@example.com'),
  (5, 'testing3', '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'testing3', 'testing3',   'testing3@example.com'),
  (6, 'testing4', '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'testing4', 'testing4',   'testing4@example.com'),
  (7, 'testing5', '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'testing5', 'testing5',   'testing5@example.com'),
  (8, 'ranti',    '$2y$10$npVPRPtYgocXFNk0CREX5uOTuCD3e.aA1fN3x1ucHecOhUtwyiBB.', 'Ranti',    'Dikgale',   'ranti@example.com');

-- 2. Add Roles
INSERT INTO roles (id, name, priority)
VALUES
  (1, 'ADMIN', 1),
  (2, 'EMPLOYEE', 2);

-- 3. Assign Users to Roles
INSERT INTO user_roles (user_id, role_id) VALUES
  (1, 1),  -- Jason as ADMIN
  (1, 2),  -- Jason as EMPLOYEE
  (2, 2),  -- Boni as EMPLOYEE
  (3, 2),  -- testing1 as EMPLOYEE
  (4, 2),  -- testing2 as EMPLOYEE
  (5, 2),  -- testing3 as EMPLOYEE
  (6, 2),  -- testing4 as EMPLOYEE
  (7, 2),  -- testing5 as EMPLOYEE
  (8, 1);  -- Ranti as ADMIN


-- 4. Add Permissions
INSERT INTO permissions (id, name) VALUES
  (1, 'VIEW_DASHBOARD'),
  (2, 'EDIT_PROFILE'),
  (3, 'canAdd'),
  (4, 'canEdit'),
  (5, 'canRead');

-- 5. Assign Permissions to Roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (1, 1), -- ADMIN: VIEW_DASHBOARD
  (1, 2), -- ADMIN: EDIT_PROFILE
  (1, 3), -- ADMIN: canAdd
  (1, 4), -- ADMIN: canEdit
  (1, 5), -- ADMIN: canRead
  (2, 1), -- EMPLOYEE: VIEW_DASHBOARD
  (2, 3), -- EMPLOYEE: canAdd
  (2, 4), -- EMPLOYEE: canEdit
  (2, 5); -- EMPLOYEE: canRead

  INSERT INTO spa_therapists (therapists_title, therapists_name, therapists_surname, therapists_contacts)
VALUES
  ('Ms', 'Lerato', 'Kgopisa', '0821112222'),
  ('Ms', 'Mokgadi', 'Thapedi', '0823334444'),
  ('Ms', 'Motsaro', 'Kgoroshi', '0825556666');

INSERT INTO regular_guests (
    rg_account,
    rg_title,
    rg_name,
    rg_surname,
    rg_company,
    rg_email,
    rg_address,
    rg_phone,
    rg_company_phone,
    rg_company_person,
    rg_company_website,
    rg_isliable,
    rg_company_vat,
    rg_company_type
) VALUES
('LHRJM071722', 'Mr', 'John', 'Mokoena', 'Mokoena Holdings', 'john@mokoena.co.za', '123 Rose Ave, Sandton, JHB', '0821234567', '0113456789', 'Lerato Nkosi', 'www.mokoenaholdings.co.za', 'Company', '22345', 'Goverment'),
('LHRSK071723', 'Mrs', 'Sarah', 'Khumalo', 'Khumalo Trading', 'sarah@khumalo.com', '22 Oxford Rd, Randburg', '0822222222', '0109876543', 'Sipho Nkosi', 'www.khumalotrading.com', 'Company', '22345','Private'),
('LHRMJ071724', 'Ms', 'Mary', 'Jansen', 'Jansen Consulting', 'mary.jansen@consulting.com', '789 Jan Smuts Ave, Rosebank', '0833333333', '0123456789', 'Johannes Zulu', 'www.jansenconsult.com', 'Individual', '22345','Government'),
('LHRMG071725', 'Dr', 'Mandla', 'Gumede', 'Gumede & Partners', 'mandla.gumede@gumede.co.za', '44 4th St, Parktown', '0844444444', '0132468101', 'Phumzile Gwala', 'www.gumedeandpartners.com', 'Company', '22345', 'Private'),
('LHRKB071726', 'Prof', 'Kabelo', 'Bapela', 'Bapela Attorneys', 'kabelo@bapelaattorneys.co.za', '9 West St, Pretoria', '0855555555', '0143579111', 'Katlego Moagi', 'www.bapelaattorneys.co.za', 'Individual', '22345', 'Private');

INSERT INTO spa_bookings (
    package_id, therapist_id, spbooking_title, spbooking_name, spbooking_surname, spbooking_email,
    spbooking_contact, spbooking_addtionalinfo, spbooking_allergies, spbooking_reason,
    spbooking_noofvisitors, spbooking_date, spbooking_promotions, spbooking_bookedby
)
VALUES
  (3, 1, 'Mr', 'David', 'Molefe', 'david.molefe@email.com', '0821234567', 'None', 'Nuts', 'Relaxation', 1, '2025-07-20', false, 'Admin'),
  (4, 2, 'Ms', 'Nadia', 'Sithole', 'nadia.sithole@email.com', '0822345678', 'Bring towel', '', 'Back pain', 1, '2025-07-21', true, 'Receptionist'),
  (7, 3, 'Mrs', 'Lindiwe', 'Baloyi', 'lindiwe.baloyi@email.com', '0823456789', '', '', 'Sports injury', 2, '2025-07-22', false, 'Admin');


INSERT INTO venue_bookings (
    package_id, vbooking_title, vbooking_name, vbooking_surname, vbooking_email, vbooking_contact,
    vbooking_specialrequest, vbooking_reason, vbooking_noofvisitors, vbooking_startdate,
    vbooking_enddate, vbooking_promotions, vbooking_bookedby
)
VALUES
  (6, 'Mr', 'Peter', 'Moagi', 'peter.moagi@email.com', '0825566778', 'Vegan catering', 'Birthday Party', 40, '2025-08-01', '2025-08-01', true, 'Admin'),
  (2, 'Ms', 'Thembi', 'Mashaba', 'thembi.mashaba@email.com', '0829988776', '', 'Business Conference', 20, '2025-08-05', '2025-08-06', false, 'Admin');
