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
    cr.*,
    r.room_no,
    rt.room_name,
    bt.bed_type
FROM cancelled_rooms cr
LEFT JOIN rooms r ON cr.room_id = r.id
LEFT JOIN room_types rt ON r.room_type_id = rt.id
LEFT JOIN bed_types bt ON rt.bed_type_id = bt.id
ORDER BY cr.booking_reference DESC";


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
