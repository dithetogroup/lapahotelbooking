<?php
include_once("headers.php");
include_once("db_connect.php");
header('Content-Type: application/json; charset=UTF-8');
$data = json_decode(file_get_contents("php://input"), true);
if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'No input data']);
    exit;
}
$stmt = $mysqli->prepare("INSERT INTO packages (package_name, package_type, package_time, package_price, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())");
$stmt->bind_param("ssdd", $data['package_name'], $data['package_type'], $data['package_time'], $data['package_price']);
$success = $stmt->execute();
$stmt->close();
echo json_encode(['status' => $success ? 'success' : 'error']);
?>
