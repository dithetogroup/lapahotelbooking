<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$sql = "SELECT 
            COUNT(*) AS total,
            SUM(CASE WHEN booking_status = 1 THEN 1 ELSE 0 END) AS occupied,
            SUM(CASE WHEN booking_status = 0 THEN 1 ELSE 0 END) AS free
        FROM rooms";

$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Failed to query room occupancy: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error"]);
    exit;
}

$data = $result->fetch_assoc();

echo json_encode([
    "status" => "success",
    "data" => [
        "total" => (int)$data['total'],
        "occupied" => (int)$data['occupied'],
        "free" => (int)$data['free']
    ]
]);


$mysqli->close();
