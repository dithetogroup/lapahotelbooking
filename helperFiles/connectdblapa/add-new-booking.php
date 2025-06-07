<?php
include_once("headers.php");
include_once("db_connect.php");
require_once 'EmailHelper.php';
require_once 'PDFInvoiceSender.php';

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$data = json_decode(file_get_contents("php://input"), true);
error_log("[INFO] Received booking data: " . json_encode($data));

function generateBookingReference(): string {
    return "LH-" . strtoupper(substr(date('l'), 0, 1)) . date('ymdHs');
}

$roomNos = $data['roomNos'] ?? [];
$mainRoomNo = trim($data['roomNo'] ?? '');
$packageIds = $data['package_id'] ?? [];

$guest_title = trim($data['guest_title'] ?? '');
$guest_name = trim($data['guest_name'] ?? '');
$guest_surname = trim($data['guest_surname'] ?? '');
$guest_email = trim($data['guest_email'] ?? '');
$guest_phone = trim($data['guest_phone'] ?? '');
$guest_address = trim($data['guest_address'] ?? '');
$special_requests = trim($data['special_requests'] ?? '');

$checkInDate = trim($data['checkInDate'] ?? '');
$checkOutDate = trim($data['checkOutDate'] ?? '');
$bookingStatus = trim($data['booking_status'] ?? 'Booked');
$paymentStatus = trim($data['payment_status'] ?? '');
$paymentTypes = trim($data['payment_types'] ?? '');
$paymentAmount = trim($data['payment_amount'] ?? 0);
$guestInvoice = (int)($data['guest_invoice'] ?? 0);
$bookedBy = isset($data['booked_by']) ? trim($data['booked_by']) : 'Lethabo';


$allRoomNos = array_merge([$mainRoomNo], $roomNos);

if (!$guest_name || !$checkInDate || !$checkOutDate || empty($allRoomNos)) {
    error_log("[ERROR] Missing required fields.");
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit();
}

try {
    $mysqli->begin_transaction();
    $bookingReference = generateBookingReference();
    $firstBookingId = null;

    $roomTypeNames = [];
    $roomPrices = [];
    foreach ($allRoomNos as $roomNo) {
        $roomQuery = $mysqli->prepare("SELECT r.id, r.room_type_id, rt.room_name, rt.week_price FROM rooms r JOIN room_types rt ON r.room_type_id = rt.id WHERE r.room_no = ?");
        $roomQuery->bind_param("s", $roomNo);
        $roomQuery->execute();
        $roomResult = $roomQuery->get_result();
        if ($row = $roomResult->fetch_assoc()) {
            $roomId = $row['id'];
            $roomTypeNames[] = $row['room_name'] ?? 'N/A';
            $roomPrices[] = (float)$row['week_price'];
        } else {
            throw new Exception("Room not found: $roomNo");
        }
        $roomQuery->close();

        error_log("[INFO] INSERTING Bookings ROOM ID: $roomId...");
        $insertBooking = $mysqli->prepare("INSERT INTO guest_bookings (room_id, checkInDate, checkOutDate, booking_state, booking_status, payment_types, payment_status, booking_reference, payment_amount) VALUES (?, ?, ?, 'Confirmed', ?, ?, ?, ?, ?)");
        $insertBooking->bind_param("issssssd", $roomId, $checkInDate, $checkOutDate, $bookingStatus, $paymentTypes, $paymentStatus, $bookingReference, $paymentAmount);
        $insertBooking->execute();
        $bookingId = $insertBooking->insert_id;
        $insertBooking->close();

        if ($firstBookingId === null) {
            $firstBookingId = $bookingId;
        }

        foreach ($packageIds as $pkgId) {
            $insertPkg = $mysqli->prepare("INSERT INTO booking_packages (booking_id, package_id) VALUES (?, ?)");
            $insertPkg->bind_param("ii", $bookingId, $pkgId);
            $insertPkg->execute();
            $insertPkg->close();
        }

        $updateRoom = $mysqli->prepare("UPDATE rooms SET booking_status = 1 WHERE id = ?");
        $updateRoom->bind_param("i", $roomId);
        $updateRoom->execute();
        $updateRoom->close();
    }

    if ($firstBookingId !== null) {
        error_log("[INFO] Inserting Guest details linked to booking ...");
        $insertGuest = $mysqli->prepare("INSERT INTO guest_details (booking_id, guest_title, guest_name, guest_surname, guest_email, guest_address, guest_phone, special_requests, guest_invoice, booked_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $insertGuest->bind_param("isssssssis", $firstBookingId, $guest_title, $guest_name, $guest_surname, $guest_email, $guest_address, $guest_phone, $special_requests, $guestInvoice, $bookedBy);
        $insertGuest->execute();
        $insertGuest->close();
    }

    $packageNames = [];
    $packageRates = [];
    foreach ($packageIds as $pkgId) {
        $stmt = $mysqli->prepare("SELECT package_name, package_price FROM packages WHERE id = ?");
        $stmt->bind_param("i", $pkgId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            $packageNames[] = $row['package_name'];
            $packageRates[$row['package_name']] = (float)$row['package_price'];
        }
        $stmt->close();
    }

    if ($guestInvoice === 1 && !empty($guest_email)) {
        error_log("[INFO] Generating and sending styled PDF invoice...");
        $pdfSent = sendStyledPDFInvoiceWithAttachment(
            $guest_email,
            'lebo@dithetogroup.co.za',
            $bookingReference,
            [
                'guest_title'      => $guest_title,
                'guest_name'       => $guest_name,
                'guest_surname'    => $guest_surname,
                'guest_email'      => $guest_email,
                'guest_phone'      => $guest_phone,
                'checkInDate'      => $checkInDate,
                'checkOutDate'     => $checkOutDate,
                'special_requests' => $special_requests,
                'payment_types'    => $paymentTypes,
                'payment_status'   => $paymentStatus,
                'payment_amount'   => $paymentAmount,
                'roomNos'          => $allRoomNos,
                'roomTypes'        => $roomTypeNames,
                'roomPrices'       => $roomPrices,
                'packageNames'     => $packageNames,
                'packageRates'     => $packageRates
            ]
        );
        if (!$pdfSent) {
            error_log("[WARN] Booking saved, but email failed to send to guest or admin.");
        }
        
    }

    $mysqli->commit();
    echo json_encode(["status" => "success", "message" => "Booking saved successfully."]);

} catch (Exception $e) {
    $mysqli->rollback();
    error_log("[TRANSACTION ERROR] " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Transaction failed: " . $e->getMessage()]);
}

$mysqli->close();
?>
