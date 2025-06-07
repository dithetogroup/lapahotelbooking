<?php
include_once("headers.php");
include_once("db_connect.php");
include_once('config.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");


// ✅ SQL query to fetch occupacy 
$sql = "SELECT * FROM room_types";


error_log("[INFO] SQL Query Get All Rooms: $sql");

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
