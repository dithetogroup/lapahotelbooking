<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");


// ✅ SQL query to fetch occupacy 
$sql = "SELECT 
    gb.id AS id,
    gd.guest_title,
    gd.guest_name,
    gd.guest_surname,
    gd.guest_email,
    gd.guest_phone,
    gd.guest_invoice,
    gd.special_requests,
    gb.checkInDate,
    gb.checkOutDate,
    gd.booked_by,
    gb.booking_reference,
    gb.booking_status,
    gb.payment_status,
    gb.booking_state,
    rt.room_name,
    GROUP_CONCAT(DISTINCT p.package_name SEPARATOR ', ') AS package_name,
    GROUP_CONCAT(DISTINCT CONCAT('R', p.package_price) SEPARATOR ', ') AS package -- optional display
FROM guest_bookings gb
LEFT JOIN guest_details gd ON gd.booking_id = gb.id
LEFT JOIN booking_packages bp ON bp.booking_id = gb.id
LEFT JOIN packages p ON p.id = bp.package_id
JOIN rooms r ON gb.room_id = r.id
JOIN room_types rt ON r.room_type_id = rt.id
GROUP BY gb.id
ORDER BY gb.checkInDate DESC;";


//error_log("[INFO] SQL Query Get All Rooms: $sql");

$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Query failed: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database query failed"]);
    exit();
}

$trips = [];
while ($row = $result->fetch_assoc()) {
    $trips[] = $row;
}

echo json_encode(["status" => "success", "data" => $trips], JSON_UNESCAPED_UNICODE);
$mysqli->close();
?>
