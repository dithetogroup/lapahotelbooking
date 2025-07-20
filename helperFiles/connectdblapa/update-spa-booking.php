<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json; charset=UTF-8");

// Read input
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    error_log("[ERROR] No input data received in save-spa-booking.php");
    echo json_encode(['status' => 'error', 'message' => 'No input data received']);
    exit;
}

// Extract fields
$therapist_id = $data['therapist_id'] ?? null;
$title = $data['spbooking_title'] ?? '';
$name = $data['spbooking_name'] ?? '';
$surname = $data['spbooking_surname'] ?? '';
$email = $data['spbooking_email'] ?? '';
$contact = $data['spbooking_contact'] ?? '';
$info = $data['spbooking_addtionalinfo'] ?? '';
$allergies = $data['spbooking_allergies'] ?? '';
$reason = $data['spbooking_reason'] ?? '';
$noofvisitors = isset($data['spbooking_noofvisitors']) ? intval($data['spbooking_noofvisitors']) : 1;
$date = $data['spbooking_date'] ?? '';
$time = $data['spbooking_time'] ?? null;
$promotions = isset($data['spbooking_promotions']) ? (int)$data['spbooking_promotions'] : 0;
$bookedby = $data['spbooking_bookedby'] ?? '';
$id = isset($data['id']) ? intval($data['id']) : 0;
$package_ids = isset($data['package_id']) && is_array($data['package_id']) ? $data['package_id'] : [];
$frontend_total = isset($data['total_amount']) ? floatval($data['total_amount']) : 0.0;

if (!empty($date)) {
    $dateObj = date_create($date);
    if ($dateObj) {
        $date = $dateObj->format('Y-m-d');
    } else {
        $date = substr($date, 0, 10);
    }
}

// Calculate backend total for security
$total_price = 0.0;
if (!empty($package_ids)) {
    $in = implode(',', array_map('intval', $package_ids));
    $priceRes = $mysqli->query("SELECT SUM(package_price) as total FROM packages WHERE id IN ($in)");
    $row = $priceRes->fetch_assoc();
    $package_sum = floatval($row['total']);
    $total_price = $package_sum * $noofvisitors; 
}

// Log data for troubleshooting
error_log("[INFO] Received Data: " . json_encode($data));
error_log("[INFO] Prepared Values: title=$title, name=$name, surname=$surname, email=$email, contact=$contact, date=$date, time=$time, visitors=$noofvisitors, package_ids=" . json_encode($package_ids) . ", therapist_id=$therapist_id, reason=$reason, allergies=$allergies, bookedby=$bookedby, id=$id");

// ========== SLOT COLLISION CHECK ==========
$total_minutes = 0;
if (!empty($package_ids)) {
    $in = implode(',', array_map('intval', $package_ids));
    $durResult = $mysqli->query("SELECT SUM(package_time) as total FROM packages WHERE id IN ($in)");
    $row = $durResult->fetch_assoc();
    $total_minutes = intval($row['total']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'At least one package is required.']);
    exit;
}

list($start_hour, $start_min) = explode(':', $time);
$desired_start = intval($start_hour) * 60 + intval($start_min);
$desired_end = $desired_start + $total_minutes;

// Fetch all bookings for therapist on this date (except this booking in update)
$sql = "SELECT sb.id, sb.spbooking_time, GROUP_CONCAT(sbp.package_id) as package_ids
        FROM spa_bookings sb
        JOIN spa_booking_packages sbp ON sb.id = sbp.spa_booking_id
        WHERE sb.spbooking_date = ? AND sb.therapist_id = ? AND sb.id != ?
        GROUP BY sb.id";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("sii", $date, $therapist_id, $id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $b_time = $row['spbooking_time'];
    $b_packages = explode(',', $row['package_ids']);
    if (empty($b_time) || empty($b_packages)) continue;
    $b_in = implode(',', array_map('intval', $b_packages));
    $b_durRes = $mysqli->query("SELECT SUM(package_time) as total FROM packages WHERE id IN ($b_in)");
    $b_durRow = $b_durRes->fetch_assoc();
    $b_total = intval($b_durRow['total']);
    list($b_hour, $b_min) = explode(':', $b_time);
    $b_start = intval($b_hour) * 60 + intval($b_min);
    $b_end = $b_start + $b_total;

    // Overlap if: startA < endB && endA > startB
    if ($desired_start < $b_end && $desired_end > $b_start) {
        error_log("[ERROR] Slot collision with booking at $b_time ($b_start-$b_end min, duration $b_total min)");
        echo json_encode(['status' => 'error', 'message' => 'Slot already booked for this therapist and time!']);
        exit;
    }
}
$stmt->close();
// ========== END SLOT COLLISION CHECK ==========

// ========== SAVE OR UPDATE BOOKING ==========
if ($id > 0) {
    // UPDATE
    $stmt = $mysqli->prepare("UPDATE spa_bookings SET 
        therapist_id=?, spbooking_title=?, spbooking_name=?, spbooking_surname=?, spbooking_email=?,
        spbooking_contact=?, spbooking_addtionalinfo=?, spbooking_allergies=?, spbooking_reason=?,
        spbooking_noofvisitors=?, spbooking_date=?, spbooking_time=?, spbooking_promotions=?,
        spbooking_bookedby=?, spbooking_totalprice=?, updated_at=NOW()
        WHERE id=?");
    if (!$stmt) {
        error_log("[ERROR] Prepare failed: " . $mysqli->error);
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
        exit;
    }
    $stmt->bind_param(
        "issssssssissidsi",
        $therapist_id, $title, $name, $surname, $email, $contact, $info, $allergies,
        $reason, $noofvisitors, $date, $time, $promotions, $bookedby, $total_price, $id
    );
    $success = $stmt->execute();
    $stmt->close();

    // Remove old package links
    $mysqli->query("DELETE FROM spa_booking_packages WHERE spa_booking_id = $id");
    // Insert new package links
    foreach ($package_ids as $pkgid) {
        $mysqli->query("INSERT INTO spa_booking_packages (spa_booking_id, package_id) VALUES ($id, " . intval($pkgid) . ")");
    }
    echo json_encode([
        'status' => $success ? 'success' : 'error',
        'message' => $success ? 'Booking updated' : 'Failed to update booking',
        'id' => $id
    ]);
} else {
    // INSERT
    $stmt = $mysqli->prepare("INSERT INTO spa_bookings (
        therapist_id, spbooking_title, spbooking_name, spbooking_surname, spbooking_email,
        spbooking_contact, spbooking_addtionalinfo, spbooking_allergies, spbooking_reason,
        spbooking_noofvisitors, spbooking_date, spbooking_time, spbooking_promotions,
        spbooking_bookedby, spbooking_totalprice, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
    if (!$stmt) {
        error_log("[ERROR] Prepare failed: " . $mysqli->error);
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
        exit;
    }
    $stmt->bind_param(
        "issssssssissids",
        $therapist_id, $title, $name, $surname, $email, $contact, $info, $allergies,
        $reason, $noofvisitors, $date, $time, $promotions, $bookedby, $total_price
    );
    $success = $stmt->execute();
    $insert_id = $stmt->insert_id;
    $stmt->close();

    // Insert package links
    foreach ($package_ids as $pkgid) {
        $mysqli->query("INSERT INTO spa_booking_packages (spa_booking_id, package_id) VALUES ($insert_id, " . intval($pkgid) . ")");
    }
    echo json_encode([
        'status' => $success ? 'success' : 'error',
        'message' => $success ? 'Booking saved' : 'Failed to save booking',
        'id' => $insert_id
    ]);
}
?>
