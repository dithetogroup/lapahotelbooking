<?php
include_once("headers.php");
include_once("db_connect.php");

header('Content-Type: application/json; charset=UTF-8');
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No package id']);
    exit;
}
$stmt = $mysqli->prepare("DELETE FROM packages WHERE id=?");
$stmt->bind_param("i", $data['id']);
$success = $stmt->execute();
$stmt->close();
echo json_encode(['status' => $success ? 'success' : 'error']);
?>
