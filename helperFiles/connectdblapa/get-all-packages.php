<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

// ✅ Prepare SQL
$sql = "SELECT id, package_name, package_price FROM packages ORDER BY package_name ASC";

//error_log("[INFO] Fetching packages...");
$result = $mysqli->query($sql);

if (!$result) {
    error_log("[ERROR] Failed to fetch packages: " . $mysqli->error);
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Could not fetch packages."]);
    exit();
}

// ✅ Build response
$packages = [];
while ($row = $result->fetch_assoc()) {
    $packages[] = [
        "id" => $row["id"],
        "package_name" => $row["package_name"],
        "package_price" => (float) str_replace(',', '', $row["package_price"])
    ];
}

echo json_encode(["status" => "success", "data" => $packages], JSON_UNESCAPED_UNICODE);
$mysqli->close();
?>
