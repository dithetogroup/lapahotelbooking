<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");

$data = json_decode(file_get_contents("php://input"), true);
$id = isset($data['id']) ? intval($data['id']) : 0;

if ($id > 0) {
    $stmt = $mysqli->prepare("DELETE FROM spa_bookings WHERE id = ?");
    $stmt->bind_param("i", $id);
    $success = $stmt->execute();
    if (!$success) {
        error_log("[ERROR] Failed to delete spa booking: " . $stmt->error);
    }
    $stmt->close();
    echo json_encode(['status' => $success ? 'success' : 'error']);
} else {
    error_log("[ERROR] No valid id provided for deletion");
    echo json_encode(['status' => 'error', 'message' => 'Invalid ID']);
}
?>
