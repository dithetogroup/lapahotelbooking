<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$sql = "SELECT 
    r.room_no,
    rt.room_name,
    rt.discounted_price,
    rt.week_price,
    rt.weekend_price
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.booking_status = 0
ORDER BY r.room_no";

$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Room query failed: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to load rooms"]);
    exit();
}

$rooms = [];
while ($row = $result->fetch_assoc()) {
    $rooms[] = [
        "room_no" => $row["room_no"],
        "room_name" => $row["room_name"],
        "discountedPrice" => (float) $row["discounted_price"],
        "weekPrice" => (float) $row["week_price"],
        "weekendPrice" => (float) $row["weekend_price"],
    ];
}

echo json_encode(["status" => "success", "data" => $rooms]);
$mysqli->close();
?>
