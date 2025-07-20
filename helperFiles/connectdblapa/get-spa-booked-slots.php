<?php
include_once("headers.php");
include_once("db_connect.php");
header("Content-Type: application/json; charset=UTF-8");

$date = $_GET['date'] ?? '';
if (!$date) {
    echo json_encode(['status' => 'error', 'message' => 'No date provided', 'data' => []]);
    exit;
}

// We need to return both time and duration
$stmt = $mysqli->prepare("SELECT spbooking_time, package_id FROM spa_bookings WHERE spbooking_date = ?");
$stmt->bind_param("s", $date);
$stmt->execute();
$result = $stmt->get_result();

$booked = [];
while ($row = $result->fetch_assoc()) {
    // You may need to join the packages table to get duration
    // For now, assume package_id is a single value (or take first if multiple)
    $pkgId = explode(',', $row['package_id'])[0];
    $durRes = $mysqli->query("SELECT package_time FROM packages WHERE id = '$pkgId' LIMIT 1");
    $dur = 30; // fallback
    if ($durRes && $durRow = $durRes->fetch_assoc()) {
        $dur = intval($durRow['package_time']);
    }
    $booked[] = [
        'time' => $row['spbooking_time'],
        'duration' => $dur
    ];
}
$stmt->close();

echo json_encode(['status' => 'success', 'data' => $booked]);
?>
