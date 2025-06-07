<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

// Today's date for current occupancy calculation
$today = date('Y-m-d');

// 1. Get total number of rooms
$totalSql = "SELECT COUNT(*) AS total FROM rooms";
$totalResult = $mysqli->query($totalSql);
if (!$totalResult) {
    error_log("[ERROR] Failed to query total rooms: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
    exit;
}
$total = $totalResult->fetch_assoc()['total'] ?? 0;

// 2. Get all currently occupied rooms (active booking: today is between checkInDate and checkOutDate, and status is Booked)
$occupiedSql = "
    SELECT COUNT(DISTINCT room_id) AS occupied
    FROM guest_bookings
    WHERE booking_status = 'Booked'
      AND checkInDate <= ? AND checkOutDate > ?
";
$occStmt = $mysqli->prepare($occupiedSql);
$occStmt->bind_param("ss", $today, $today);
$occStmt->execute();
$occResult = $occStmt->get_result();
$occupied = $occResult->fetch_assoc()['occupied'] ?? 0;
$occStmt->close();

// 3. Calculate available as total minus occupied
$free = $total - $occupied;

// Return response
echo json_encode([
    "status" => "success",
    "data" => [
        "total" => (int)$total,
        "occupied" => (int)$occupied,
        "free" => (int)$free
    ]
]);

$mysqli->close();
?>
