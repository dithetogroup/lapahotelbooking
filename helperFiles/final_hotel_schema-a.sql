
    -- Drop child tables first
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS guest_details;
DROP TABLE IF EXISTS cancelled_rooms;
DROP TABLE IF EXISTS booking_packages;
DROP TABLE IF EXISTS guest_bookings;
DROP TABLE IF EXISTS packages;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS room_types;
DROP TABLE IF EXISTS bed_types;
DROP TABLE IF EXISTS room_details;
DROP TABLE IF EXISTS users;

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
        package_price DECIMAL(10,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
        user_name VARCHAR(100),
        user_surname VARCHAR(100),
        user_email VARCHAR(100) UNIQUE,
        user_password VARCHAR(100),
        user_role VARCHAR(20),
        user_role_priority INT,
        user_permissions TEXT,
        user_avatar VARCHAR(255),
        user_lastlogin TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
