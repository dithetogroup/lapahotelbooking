<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

// ✅ Prepare SQL
$sql = "SELECT id, occupants_list FROM occupants ORDER BY occupants_list ASC";

//error_log("[INFO] Fetching Occupants...");
$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Failed to fetch Occupants: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Could not fetch Occupants."]);
    exit();
}

// ✅ Build response
$occupants = [];
while ($row = $result->fetch_assoc()) {
    $occupants[] = [
        "id" => $row["id"],
        "occupantsList" => $row["occupants_list"]
    ];
}

echo json_encode(["status" => "success", "data" => $occupants], JSON_UNESCAPED_UNICODE);
$mysqli->close();
?>
