<?php
include_once("headers.php");
include_once("db_connect.php");


header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$data = json_decode(file_get_contents("php://input"), true);



$roomNo = $_GET['roomNo'] ?? null;

if (!$roomNo) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'No room number specified']);
    exit();
}

// Find the room id
$stmt = $mysqli->prepare("SELECT id FROM rooms WHERE room_no = ?");
$stmt->bind_param("s", $roomNo);
$stmt->execute();
$res = $stmt->get_result();
if (!$row = $res->fetch_assoc()) {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Room not found']);
    exit();
}
$roomId = $row['id'];
$stmt->close();

// Get all bookings for this room (not cancelled)
$sql = "SELECT checkInDate, checkOutDate FROM guest_bookings
        WHERE room_id = ? AND booking_status = 'Booked'";
$stmt = $mysqli->prepare($sql);
$stmt->bind_param("i", $roomId);
$stmt->execute();
$result = $stmt->get_result();
$dates = [];
while ($r = $result->fetch_assoc()) {
    $dates[] = [
        'checkInDate' => $r['checkInDate'],
        'checkOutDate' => $r['checkOutDate'],
    ];
}
$stmt->close();

echo json_encode(['status' => 'success', 'data' => $dates]);
$mysqli->close();
?>
