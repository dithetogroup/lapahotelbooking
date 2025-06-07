<?php
include_once("headers.php");
include_once("db_connect.php");
include_once('config.php');
require_once 'EmailHelper.php';

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$raw = file_get_contents("php://input");
error_log("[INFO] Raw cancellation input: " . $raw);

$data = json_decode($raw, true);

if (!$data) {
    error_log("[ERROR] Failed to decode JSON input.");
    echo json_encode(["status" => "error", "message" => "Invalid JSON format."]);
    exit;
}

$bookingRef = isset($data['booking_reference']) ? trim($data['booking_reference']) : '';
$reason = isset($data['cancellation_reason']) ? trim($data['cancellation_reason']) : '';
$refund = isset($data['refund_status']) ? trim($data['refund_status']) : '';
$cancelledBy = isset($data['cancelled_by']) ? trim($data['cancelled_by']) : 'system';

if (empty($bookingRef) || empty($reason)) {
    error_log("[ERROR] Missing booking_reference or cancellation_reason.");
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

error_log("[INFO] Attempting to cancel bookings for reference: $bookingRef");

$sql = "SELECT 
    gb.id AS booking_id, 
    gb.room_id, 
    gb.checkInDate,
    gb.checkOutDate,
    gd.guest_title,
    gd.guest_name, 
    gd.guest_surname, 
    gd.guest_email,
    gd.guest_phone,
    gd.guest_address,
    gd.booked_by,
    gb.payment_types,
    gb.payment_status,
    gb.payment_amount
FROM guest_bookings gb
LEFT JOIN guest_details gd ON gd.booking_id = gb.id
WHERE gb.booking_reference = ?";

$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error_log("[ERROR] Prepare failed: " . $mysqli->error);
    echo json_encode(["status" => "error", "message" => "Server error preparing booking query."]);
    exit;
}

$stmt->bind_param("s", $bookingRef);
$stmt->execute();
$result = $stmt->get_result();

$cancelled = 0;
$roomIds = [];
$sentEmails = []; // ✅ to avoid duplicate emails

while ($row = $result->fetch_assoc()) {
    $bookingId = $row['booking_id'];
    $roomId = $row['room_id'];
    $guestName = $row['guest_name'];
    $guestSurname = $row['guest_surname'];
    $guesttitle = $row['guest_title'];
    $bookedBy = $row['booked_by'];
    $checkInDate = $row['checkInDate'];
    $checkOutDate = $row['checkOutDate'];
    $guestphone = $row['guest_phone'];
    $guestEmail = $row['guest_email'];
    $guestAddress = $row['guest_address'];
    $paymentTypes = $row['payment_types'] ?? '';
    $paymentStatus = $row['payment_status'] ?? '';
    $paymentAmount = $row['payment_amount'] ?? 0.00;


    error_log("[INFO] Processing booking ID: $bookingId, Room ID: $roomId");

    $roomIds[] = $roomId;

    // Insert into cancelled_rooms
    $insert = $mysqli->prepare("INSERT INTO cancelled_rooms 
    (booking_reference, room_id, guest_name, guest_email,
     payment_types, payment_status, payment_amount, cancellation_reason,
     cancelled_by, refund_status, guest_title, guest_phone, guest_surname, booked_by, booking_id, checkInDate, checkOutDate, guest_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    if (!$insert) {
        error_log("[ERROR] Failed to prepare insert into cancelled_rooms: " . $mysqli->error);
        continue;
    }
    $insert->bind_param("sissssdsssssssisss", 
    $bookingRef, 
    $roomId, 
    $guestName, 
    $guestEmail, 
    $paymentTypes, 
    $paymentStatus, 
    $paymentAmount, 
    $reason, 
    $cancelledBy, 
    $refund, 
    $guesttitle, 
    $guestphone, 
    $guestSurname, 
    $bookedBy,
    $bookingId,
    $checkInDate,
    $checkOutDate,
    $guestAddress
    );  
    if (!$insert->execute()) {
        error_log("[ERROR] Failed to insert into cancelled_rooms for room $roomId: " . $insert->error);
    } else {
        error_log("[INFO] Inserted cancelled room ID $roomId into cancelled_rooms.");
        $cancelled++;
    }
    $insert->close();

    // Delete guest_details
    if (!$mysqli->query("DELETE FROM guest_details WHERE booking_id = $bookingId")) {
        error_log("[WARNING] Failed to delete guest_details for booking_id $bookingId: " . $mysqli->error);
    } else {
        error_log("[INFO] Deleted guest_details for booking_id $bookingId.");
    }

    // Delete from guest_bookings
    if (!$mysqli->query("DELETE FROM guest_bookings WHERE id = $bookingId")) {
        error_log("[WARNING] Failed to delete guest_bookings for booking_id $bookingId: " . $mysqli->error);
    } else {
        error_log("[INFO] Deleted guest_bookings row ID $bookingId.");
    }

    // ✅ Send email if not already sent
    if ($guestEmail && !in_array($guestEmail, $sentEmails)) {
        $sentEmails[] = $guestEmail; // mark as sent

        $templatePath = __DIR__ . '/email_templates/booking_cancelled.html';
        $placeholders = [
            '{{GUEST_NAME}}'    => $guestName,
            '{{BOOKING_REF}}'   => $bookingRef,
            '{{CANCEL_REASON}}' => $reason
        ];

        $emailSent = EmailHelper::sendTemplateEmail($guestEmail, "Your Booking Has Been Cancelled", $templatePath, $placeholders);
        if ($emailSent) {
            error_log("[INFO] Cancellation email sent to {$guestEmail}");
        } else {
            error_log("[WARNING] Failed to send cancellation email to {$guestEmail}");
        }
    }
}

$stmt->close();

// Update room availability
foreach ($roomIds as $rid) {
    $update = $mysqli->prepare("UPDATE rooms SET booking_status = 0 WHERE id = ?");
    if (!$update) {
        error_log("[ERROR] Failed to prepare update for room $rid: " . $mysqli->error);
        continue;
    }

    $update->bind_param("i", $rid);
    if (!$update->execute()) {
        error_log("[WARNING] Failed to update booking_status for room $rid: " . $update->error);
    } else {
        error_log("[INFO] Room $rid marked as available.");
    }
    $update->close();
}

if ($cancelled > 0) {
    error_log("[INFO] Successfully cancelled $cancelled booking(s) for reference $bookingRef.");
    echo json_encode(["status" => "success", "message" => "Booking cancelled and moved to cancelled_rooms."]);
} else {
    error_log("[WARNING] No bookings found or moved. Cancellation may have failed.");
    echo json_encode(["status" => "error", "message" => "No bookings found to cancel."]);
}
?>
