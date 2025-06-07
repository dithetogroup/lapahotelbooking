<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$data = json_decode(file_get_contents("php://input"), true);
error_log("[INFO] Received booking data: " . json_encode($data));

$booking_reference = trim($data['booking_reference'] ?? '');
$guest_title = trim($data['guest_title'] ?? '');
$guest_name = trim($data['guest_name'] ?? '');
$guest_surname = trim($data['guest_surname'] ?? '');
$guest_email = trim($data['guest_email'] ?? '');
$guest_phone = trim($data['guest_phone'] ?? '');
$guest_address = trim($data['guest_address'] ?? '');
$guest_invoice = (int)($data['guest_invoice'] ?? 0);

if (!$booking_reference) {
    echo json_encode(["status" => "error", "message" => "Missing booking reference"]);
    exit;
}


try {
    $mysqli->begin_transaction();

    // Update all related guest_details entries
    $stmt = $mysqli->prepare("
        UPDATE guest_details
        SET guest_title = ?, guest_name = ?, guest_surname = ?, guest_email = ?, guest_phone = ?, guest_address = ?, guest_invoice = ?
        WHERE booking_id IN (
            SELECT id FROM guest_bookings WHERE booking_reference = ?
        )
    ");
    $stmt->bind_param("ssssssis", $guest_title, $guest_name, $guest_surname, $guest_email, $guest_phone, $guest_address, $guest_invoice, $booking_reference);
    $stmt->execute();

    $mysqli->commit();
    echo json_encode(["status" => "success", "message" => "Guest details updated"]);
} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[ERROR] Guest update failed: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Failed to update guest"]);
}
?>
