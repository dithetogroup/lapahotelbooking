<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$sql = "SELECT 
    r.id AS room_id,
    r.room_no,
    rt.room_name AS room_type,
    rt.week_price,
    rt.weekend_price,
    rt.discounted_price,
    bt.bed_type,
    r.booking_status,
    gd.guest_name,
    gd.guest_surname,
    gd.guest_title,
    gd.guest_email,
    gd.guest_phone,
    gd.guest_address,
    gd.guest_invoice,
    gb.id AS booking_id,
    gb.checkInDate,
    gb.checkOutDate,
    gb.booking_reference,
    gb.payment_types,
    gb.payment_status,
    gb.payment_amount,
    gb.booking_state,
    gd.special_requests,
    GROUP_CONCAT(DISTINCT p.package_name SEPARATOR ', ') AS package_names,
    SUM(DISTINCT p.package_price) AS total_package_price
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
JOIN bed_types bt ON rt.bed_type_id = bt.id
LEFT JOIN guest_bookings gb ON gb.room_id = r.id
LEFT JOIN guest_details gd ON gd.booking_id = gb.id
LEFT JOIN booking_packages bp ON bp.booking_id = gb.id
LEFT JOIN packages p ON bp.package_id = p.id
GROUP BY r.id
ORDER BY r.room_no ASC;";

$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Query failed: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database query failed"]);
    exit();
}

$bookingMap = []; // Map booking_reference => guestDetails
$rooms = [];

while ($row = $result->fetch_assoc()) {
    $bookingRef = $row['booking_reference'];

    // If booking info exists and hasn't been stored yet, cache it
    if ($bookingRef && !isset($bookingMap[$bookingRef])) {
        $bookingMap[$bookingRef] = [
            "personalInfo" => [
                "title" => $row['guest_title'],
                "name" => $row['guest_name'],
                "surname" => $row['guest_surname'],
                "email" => $row['guest_email'],
                "phone" => $row['guest_phone'],
                "address" => $row['guest_address'],
                "invoice" => $row['guest_invoice'],
            ],
            "reservationInfo" => [
                "bookingReference" => $bookingRef,
                "checkInDate" => $row['checkInDate'],
                "checkOutDate" => $row['checkOutDate'],
                "paymentTypes" => $row['payment_types'],
                "paymentStatus" => $row['payment_status'],
                "paymentAmount" => $row['payment_amount'],
                "bookingState" => $row['booking_state'],
            ],
            "package" => [
                "name" => $row['package_names'],
                "price" => (float) $row['total_package_price']
            ],
            "specialRequests" => $row['special_requests']
        ];
    }

    $rooms[] = [
        "roomId" => $row['room_id'],
        "roomNo" => $row['room_no'],
        "weekPrice" => (float) $row['week_price'],
        "weekendPrice" => (float) $row['weekend_price'],
        "discountedPrice" => (float) $row['discounted_price'],
        "roomType" => $row['room_type'],
        "bedType" => $row['bed_type'],
        "status" => $row['booking_status'] ? "Booked" : "Available",
        "bookingReference" => $bookingRef,
        "guestDetails" => $bookingRef ? $bookingMap[$bookingRef] : null
    ];
}


echo json_encode(["status" => "success", "data" => $rooms], JSON_UNESCAPED_UNICODE);
$mysqli->close();
?>