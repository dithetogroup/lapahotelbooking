<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$sql = "SELECT 
  rt.id AS room_type_id,
  rt.room_name,
  rt.room_code,
  rt.week_price,
  rt.weekend_price,
  rt.discounted_price,
  bt.bed_type,
  COUNT(DISTINCT r.id) AS total_rooms

FROM room_types rt

LEFT JOIN bed_types bt ON rt.bed_type_id = bt.id
LEFT JOIN rooms r ON r.room_type_id = rt.id

GROUP BY 
  rt.id,
  rt.room_name,
  rt.room_code,
  rt.week_price,
  rt.weekend_price,
  rt.discounted_price,
  bt.bed_type;";

$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Query failed: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database query failed"]);
    exit();
}

$RoomRates = [];
while ($row = $result->fetch_assoc()) {
    $RoomRates[] = $row;
}

echo json_encode(["status" => "success", "data" => $RoomRates], JSON_UNESCAPED_UNICODE);
$mysqli->close();
?>
