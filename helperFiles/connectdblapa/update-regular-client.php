<?php
include_once("headers.php");
include_once("db_connect.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

// Log the received data
$data = json_decode(file_get_contents("php://input"), true);
error_log("[INFO] Received Data: " . json_encode($data));

if (
    !isset($data['rg_account']) ||
    !isset($data['rg_name']) ||
    !isset($data['rg_email'])
) {
    error_log("[ERROR] Missing required fields: " . json_encode($data));
    echo json_encode([
        'status' => 'error',
        'message' => 'Missing required fields.'
    ]);
    $mysqli->close();
    exit();
}

$account         = $mysqli->real_escape_string($data['rg_account']);
$title           = $mysqli->real_escape_string($data['rg_title'] ?? '');
$name            = $mysqli->real_escape_string($data['rg_name']);
$surname         = $mysqli->real_escape_string($data['rg_surname'] ?? '');
$company         = $mysqli->real_escape_string($data['rg_company'] ?? '');
$company_phone   = $mysqli->real_escape_string($data['rg_company_phone'] ?? '');
$company_person  = $mysqli->real_escape_string($data['rg_company_person'] ?? '');
$email           = $mysqli->real_escape_string($data['rg_email']);
$address         = $mysqli->real_escape_string($data['rg_address'] ?? '');
$company_website = $mysqli->real_escape_string($data['rg_company_website'] ?? '');
$phone           = $mysqli->real_escape_string($data['rg_phone'] ?? '');
$isliable        = $mysqli->real_escape_string($data['rg_isliable'] ?? '');
$company_vat     = $mysqli->real_escape_string($data['rg_company_vat'] ?? '');
$company_type    = $mysqli->real_escape_string($data['rg_company_type'] ?? '');

// Log the prepared values
error_log("[INFO] Prepared Values: account=$account, title=$title, name=$name, surname=$surname, company=$company, company_phone=$company_phone, company_person=$company_person, email=$email, address=$address, company_website=$company_website, phone=$phone, isliable=$isliable, company_vat=$company_vat, company_type=$company_type");

$sql = "UPDATE regular_guests 
        SET rg_title=?, rg_name=?, rg_surname=?, rg_company=?, rg_company_phone=?, rg_company_person=?, rg_email=?, rg_address=?, rg_company_website=?, rg_phone=?, rg_isliable=?, rg_company_vat=?, rg_company_type=?, updated_at=NOW()
        WHERE rg_account=?";

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
    $company_type,
    $account
);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        error_log("[INFO] Client with account $account updated successfully.");
        echo json_encode([
            'status' => 'success',
            'message' => 'Client updated successfully.'
        ]);
    } else {
        error_log("[INFO] No client found with account $account to update.");
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
