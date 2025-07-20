<?php
include_once("headers.php");
include_once("db_connect.php");
header('Content-Type: application/json; charset=UTF-8');
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No input data']);
    exit;
}
$stmt = $mysqli->prepare("UPDATE packages SET package_name=?, package_type=?, package_time=?, package_price=?, updated_at=NOW() WHERE id=?");
$stmt->bind_param("ssddi", $data['package_name'], $data['package_type'], $data['package_time'], $data['package_price'], $data['id']);
$success = $stmt->execute();
$stmt->close();
echo json_encode(['status' => $success ? 'success' : 'error']);
?>
