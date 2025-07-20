<?php
include_once("headers.php");
include_once("db_connect.php");

header('Content-Type: application/json; charset=UTF-8');

$sql = "SELECT id, therapists_title, therapists_name, therapists_surname, therapists_contacts, created_at, updated_at FROM spa_therapists ORDER BY therapists_name, therapists_surname";

$result = $mysqli->query($sql);

$therapists = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $therapists[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $therapists]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No therapists found', 'data' => []]);
}
?>
