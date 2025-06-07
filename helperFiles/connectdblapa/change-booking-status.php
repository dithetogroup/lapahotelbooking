<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$raw = file_get_contents("php://input");
error_log("[INFO] Raw booking status update: " . $raw);

$data = json_decode($raw, true);

if (!$data || !isset($data['booking_reference']) || !isset($data['status'])) {
    error_log("[ERROR] Missing booking_reference or status.");
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing booking_reference or status"]);
    exit;
}

$bookingRef = $mysqli->real_escape_string($data['booking_reference']);
$status = $mysqli->real_escape_string($data['status']);
$today = date('Y-m-d');

if (!in_array($status, ['CheckIn', 'CheckOut'])) {
    error_log("[ERROR] Invalid status: $status");
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid status value"]);
    exit;
}

$columnToUpdate = $status === 'CheckIn' ? 'checkInDate' : 'checkOutDate';

$sql = "UPDATE guest_bookings 
        SET booking_status = ?, $columnToUpdate = ?, updated_at = NOW() 
        WHERE booking_reference = ?";

$stmt = $mysqli->prepare($sql);
if (!$stmt) {
    error_log("[ERROR] Prepare failed: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to prepare query"]);
    exit;
}

$stmt->bind_param("sss", $status, $today, $bookingRef);

if ($stmt->execute()) {
    error_log("[INFO] Booking status updated to $status for ref $bookingRef");
    echo json_encode(["status" => "success", "message" => "Booking updated to $status"]);
} else {
    error_log("[ERROR] Failed to execute: " . $stmt->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to update booking"]);
}

$stmt->close();
$mysqli->close();