<?php
include_once("headers.php");
include_once("db_connect.php");
header('Content-Type: application/json; charset=UTF-8');

$data = json_decode(file_get_contents("php://input"), true);

// Log received data
error_log("[INFO] Received Data for Therapist Delete: " . json_encode($data));

if (!$data || !isset($data['id'])) {
    error_log("[ERROR] No therapist id provided in delete-therapist.php");
    echo json_encode(['status' => 'error', 'message' => 'No therapist id']);
    exit;
}

$therapistId = $data['id'];

// First, check if therapist is linked to any bookings
$stmt = $mysqli->prepare("SELECT COUNT(*) FROM spa_bookings WHERE therapist_id=?");
if (!$stmt) {
    error_log("[ERROR] Failed to prepare check query: " . $mysqli->error);
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
    exit;
}
$stmt->bind_param("i", $therapistId);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();
$stmt->close();

error_log("[INFO] Therapist ID $therapistId has $count booking(s) linked.");

if ($count > 0) {
    $msg = "Cannot delete therapist ID $therapistId: assigned to $count booking" . ($count > 1 ? "s." : ".");
    error_log("[ERROR] $msg");
    echo json_encode([
        'status' => 'error',
        'message' => $msg
    ]);
    exit;
}

// Safe to delete
$stmt = $mysqli->prepare("DELETE FROM spa_therapists WHERE id=?");
if (!$stmt) {
    error_log("[ERROR] Failed to prepare delete query: " . $mysqli->error);
    echo json_encode(['status' => 'error', 'message' => 'Database error']);
    exit;
}
$stmt->bind_param("i", $therapistId);
$success = $stmt->execute();

if (!$success) {
    error_log("[ERROR] Failed to delete therapist ID $therapistId: " . $stmt->error);
    echo json_encode(['status' => 'error', 'message' => 'Could not delete therapist.']);
} else {
    error_log("[INFO] Therapist ID $therapistId deleted successfully.");
    echo json_encode(['status' => 'success', 'message' => 'Therapist deleted.']);
}
$stmt->close();

?>
