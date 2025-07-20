<?php
include_once("headers.php");
include_once("db_connect.php");
header('Content-Type: application/json; charset=UTF-8');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(['status' => 'error', 'message' => 'No input data']);
    exit;
}

$stmt = $mysqli->prepare(
    "INSERT INTO spa_therapists (therapists_title, therapists_name, therapists_surname, therapists_contacts, created_at, updated_at)
     VALUES (?, ?, ?, ?, NOW(), NOW())"
);

$stmt->bind_param(
    "ssss",
    $data['therapists_title'],
    $data['therapists_name'],
    $data['therapists_surname'],
    $data['therapists_contacts']
);

$success = $stmt->execute();
$stmt->close();

echo json_encode(['status' => $success ? 'success' : 'error']);
?>
