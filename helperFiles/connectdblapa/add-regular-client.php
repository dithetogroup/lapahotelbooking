<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$data = json_decode(file_get_contents("php://input"), true);

// Log received data for debugging
error_log("[INFO] Received Data: " . json_encode($data));

// Prepare fields with safe defaults
$email           = $mysqli->real_escape_string($data['rg_email']);
$phone           = $mysqli->real_escape_string($data['rg_phone']);
$account         = $mysqli->real_escape_string($data['rg_account']);
$title           = $mysqli->real_escape_string($data['rg_title'] ?? '');
$name            = $mysqli->real_escape_string($data['rg_name']);
$surname         = $mysqli->real_escape_string($data['rg_surname'] ?? '');
$company         = $mysqli->real_escape_string($data['rg_company'] ?? '');
$company_phone   = $mysqli->real_escape_string($data['rg_company_phone'] ?? '');
$company_person  = $mysqli->real_escape_string($data['rg_company_person'] ?? '');
$address         = $mysqli->real_escape_string($data['rg_address'] ?? '');
$company_website = $mysqli->real_escape_string($data['rg_company_website'] ?? '');
$isliable        = $mysqli->real_escape_string($data['rg_isliable'] ?? '');
$company_vat     = $mysqli->real_escape_string($data['rg_company_vat'] ?? '');
$company_type    = $mysqli->real_escape_string($data['rg_company_type'] ?? '');

// 1. Check for existing client by email OR phone
$sql = "SELECT id FROM regular_guests WHERE rg_email = '$email' OR rg_phone = '$phone' LIMIT 1";
$result = $mysqli->query($sql);

if ($result && $result->num_rows > 0) {
    // Client exists
    error_log("[ERROR] Duplicate client by email or phone: $email, $phone");
    echo json_encode([
        'status' => 'client_exists',
        'message' => 'A regular client with this email or phone already exists.'
    ]);
    $mysqli->close();
    exit();
}

// 2. Insert new client (now with all fields!)
$sql = "INSERT INTO regular_guests (
    rg_account, rg_title, rg_name, rg_surname, rg_company, rg_company_phone, rg_company_person, rg_email, rg_address, 
    rg_company_website, rg_phone, rg_isliable, rg_company_vat, rg_company_type
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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

$stmt->bind_param(
    "ssssssssssssss",
    $account,
    $title,
    $name,
    $surname,
    $company,
    $company_phone,
    $company_person,
    $email,
    $address,
    $company_website,
    $phone,
    $isliable,
    $company_vat,
    $company_type
);

if ($stmt->execute()) {
    error_log("[INFO] Client $account added successfully.");
    echo json_encode([
        'status' => 'success',
        'message' => 'Client saved as regular client!'
    ]);
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
