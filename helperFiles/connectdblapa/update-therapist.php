<?php
include_once("headers.php");
include_once("db_connect.php");
header('Content-Type: application/json; charset=UTF-8');

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data['id'])) {
    echo json_encode(['status' => 'error', 'message' => 'No therapist id']);
    exit;
}

$stmt = $mysqli->prepare(
    "UPDATE spa_therapists
     SET therapists_title=?, therapists_name=?, therapists_surname=?, therapists_contacts=?, updated_at=NOW()
     WHERE id=?"
);

$stmt->bind_param(
    "ssssi",
    $data['therapists_title'],
    $data['therapists_name'],
    $data['therapists_surname'],
    $data['therapists_contacts'],
    $data['id']
);

$success = $stmt->execute();
$stmt->close();

echo json_encode(['status' => $success ? 'success' : 'error']);
?>
