<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

// Get JSON input
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

error_log("[INFO] Raw refund update input: " . $raw);

// Validate input
$bookingRef = isset($data['booking_reference']) ? trim($data['booking_reference']) : '';
$refundStatus = isset($data['refund_status']) ? trim($data['refund_status']) : '';

if (empty($bookingRef) || empty($refundStatus)) {
    error_log("[ERROR] Missing booking_reference or refund_status.");
    echo json_encode(["status" => "error", "message" => "Missing booking_reference or refund_status."]);
    exit;
}

// Prepare SQL
$sql = "UPDATE cancelled_rooms SET refund_status = ? WHERE booking_reference = ?";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error_log("[ERROR] Failed to prepare refund update: " . $mysqli->error);
    echo json_encode(["status" => "error", "message" => "Database prepare failed."]);
    exit;
}

$stmt->bind_param("ss", $refundStatus, $bookingRef);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        error_log("[INFO] Refund status updated for $bookingRef to $refundStatus");
        echo json_encode(["status" => "success", "message" => "Refund status updated."]);
    } else {
        error_log("[WARNING] No rows updated. Check if booking_reference exists.");
        echo json_encode(["status" => "warning", "message" => "No matching record found."]);
    }
} else {
    error_log("[ERROR] Failed to execute refund update: " . $stmt->error);
    echo json_encode(["status" => "error", "message" => "Execution failed."]);
}

$stmt->close();
$mysqli->close();
?>
