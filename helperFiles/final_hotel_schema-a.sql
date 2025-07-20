
    -- Drop child tables first
SET FOREIGN_KEY_CHECKS = 0;

-- Child-most
DROP TABLE IF EXISTS guest_details;
DROP TABLE IF EXISTS cancelled_rooms;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS booking_packages;
DROP TABLE IF EXISTS guest_bookings;
DROP TABLE IF EXISTS room_details;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room_types;
DROP TABLE IF EXISTS bed_types;
DROP TABLE IF EXISTS regular_guests;

-- RBAC relationships
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS spa_bookings;
DROP TABLE IF EXISTS venue_bookings;
DROP TABLE IF EXISTS spa_therapists;

SET FOREIGN_KEY_CHECKS = 1;

    -- Bed Types
    CREATE TABLE bed_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bed_type VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    -- Room Types
    CREATE TABLE room_types (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_name VARCHAR(50) UNIQUE,
        room_code VARCHAR(10),
        bed_type_id INT,
        available_rooms INT DEFAULT 0,
        week_price DECIMAL(10,2) DEFAULT 0,
        weekend_price DECIMAL(10,2) DEFAULT 0,
        discounted_price DECIMAL(10,2) DEFAULT 0,
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (bed_type_id) REFERENCES bed_types(id)
    );

    -- Rooms
    CREATE TABLE rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_no VARCHAR(50) UNIQUE,
        room_type_id INT NOT NULL,
        booking_status BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (room_type_id) REFERENCES room_types(id)
    );


    -- Packages
    CREATE TABLE packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_name VARCHAR(100),
        package_type VARCHAR(50),
        package_time INT,           -- time in minutes
        package_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

   

        -- Venue Hire
    CREATE TABLE venue_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        package_id INT,   -- Foreign key to packages.id
        vbooking_title VARCHAR(100),
        vbooking_name VARCHAR(100),
        vbooking_surname VARCHAR(100),
        vbooking_email VARCHAR(100),
        vbooking_contact VARCHAR(100),
        vbooking_specialrequest VARCHAR(100),
        vbooking_reason VARCHAR(100),
        vbooking_noofvisitors INT,
        vbooking_startdate DATE,
        vbooking_enddate DATE,
        vbooking_promotions BOOLEAN,
        vbooking_bookedby VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_venue_package FOREIGN KEY (package_id) REFERENCES packages(id)

    );


    -- Spa Attandants
    CREATE TABLE spa_therapists (
        id INT AUTO_INCREMENT PRIMARY KEY,
        therapists_title VARCHAR(100),
        therapists_name VARCHAR(100),
        therapists_surname VARCHAR(100),
        therapists_contacts VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );



     -- Spa Bookings
    CREATE TABLE spa_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        therapist_id INT,  -- Foreign key to spa_therapists.id
        spbooking_title VARCHAR(100),
        spbooking_name VARCHAR(100),
        spbooking_surname VARCHAR(100),
        spbooking_email VARCHAR(100),
        spbooking_contact VARCHAR(100),
        spbooking_addtionalinfo VARCHAR(100),
        spbooking_allergies VARCHAR(100),
        spbooking_reason VARCHAR(100),
        spbooking_noofvisitors INT,
        spbooking_date DATE,
        spbooking_time TIME NULL,
        spbooking_promotions BOOLEAN,
        spbooking_totalprice DECIMAL(10,2),
        spbooking_bookedby VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_spa_therapist FOREIGN KEY (therapist_id) REFERENCES spa_therapists(id)
    );

    CREATE TABLE spa_booking_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        spa_booking_id INT NOT NULL,
        package_id INT NOT NULL,
        FOREIGN KEY (spa_booking_id) REFERENCES spa_bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
    );


    -- Room Details
    CREATE TABLE room_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bed_type_id INT,
        room_details_list VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (bed_type_id) REFERENCES bed_types(id)
    );

    -- Users
    CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,        -- Use password_hash when saving!
        full_name VARCHAR(100),
        surname VARCHAR(100),
        email VARCHAR(255) NOT NULL UNIQUE,
        user_lastlogin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Roles
    CREATE TABLE roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE,
        priority INT DEFAULT 0
    );

    CREATE TABLE user_roles (
        user_id INT NOT NULL,
        role_id INT NOT NULL,
        PRIMARY KEY(user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
    );

    CREATE TABLE permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );


    CREATE TABLE role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY(role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
    );

    -- Guest Bookings
    CREATE TABLE guest_bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT,
        checkInDate DATE,
        checkOutDate DATE,
        booking_state VARCHAR(20),
        booking_status VARCHAR(20),
        checkInStatus VARCHAR(20),
        payment_types VARCHAR(20),
        payment_status VARCHAR(20),
        payment_amount DECIMAL(10,2),
        booking_reference VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id)
    );

    CREATE TABLE booking_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        package_id INT NOT NULL,
        FOREIGN KEY (booking_id) REFERENCES guest_bookings(id) ON DELETE CASCADE,
        FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
    );


    -- Guest Details
    CREATE TABLE guest_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT,
        guest_title VARCHAR(100),
        guest_name VARCHAR(100),
        guest_surname VARCHAR(100),
        guest_email VARCHAR(100),
        guest_address TEXT,
        guest_phone VARCHAR(20),
        special_requests TEXT,
        booked_by VARCHAR(20),
        guest_invoice BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES guest_bookings(id) ON DELETE CASCADE
    );

    -- Guest Details
    CREATE TABLE regular_guests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        rg_account VARCHAR(100),
        rg_title VARCHAR(100),
        rg_name VARCHAR(100),
        rg_surname VARCHAR(100),
        rg_company VARCHAR(100),
        rg_email VARCHAR(100),
        rg_address TEXT,
        rg_phone VARCHAR(30),
        rg_company_phone VARCHAR(100),
        rg_company_person VARCHAR(100),
        rg_company_website VARCHAR(120),
        rg_isliable VARCHAR(20),
        rg_company_vat VARCHAR(10),
        rg_company_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

    CREATE TABLE cancelled_rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_reference VARCHAR(50) NOT NULL,
        room_id INT NOT NULL,
        booking_id INT,
        checkInDate DATE,
        checkOutDate DATE,
        guest_name VARCHAR(100),
        guest_title VARCHAR(100),
        guest_phone VARCHAR(100),
        guest_surname VARCHAR(100),
        guest_email VARCHAR(100),
        guest_address VARCHAR(100),
        payment_types VARCHAR(20),
        payment_status VARCHAR(20),
        payment_amount DECIMAL(10,2),
        refund_status VARCHAR(20),
        booked_by VARCHAR(20),
        cancellation_reason VARCHAR(255),
        cancelled_by VARCHAR(100),
        cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (room_id) REFERENCES rooms(id)
    );
