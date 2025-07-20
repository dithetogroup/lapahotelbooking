<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['rg_account'])) {
    error_log("[ERROR] Missing rg_account in delete request.");
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing account number.'
    ]);
    $mysqli->close();
    exit();
}

$account = $mysqli->real_escape_string($data['rg_account']);

$sql = "DELETE FROM regular_guests WHERE rg_account = ?";
$stmt = $mysqli->prepare($sql);

if (!$stmt) {
    error_log("[ERROR] Prepare failed: " . $mysqli->error);
    echo json_encode([
        'status' => 'error',
        'message' => 'Prepare failed: ' . $mysqli->error
    ]);
    $mysqli->close();
    exit();
}

$stmt->bind_param("s", $account);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        error_log("[INFO] Client with account $account deleted successfully.");
        echo json_encode([
            'status' => 'success',
            'message' => 'Client deleted successfully.'
        ]);
    } else {
        error_log("[INFO] No client found with account $account to delete.");
        echo json_encode([
            'status' => 'not_found',
            'message' => 'No client found with this account.'
        ]);
    }
} else {
    error_log("[ERROR] Execute failed: " . $stmt->error);
    echo json_encode([
        'status' => 'error',
        'message' => $stmt->error
    ]);
}
$stmt->close();
$mysqli->close();
?>
