<?php
include_once("headers.php");
include_once("db_connect.php");
require 'vendor/autoload.php';
include_once('config.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

error_log('[DEBUG] Incoming JSON: ' . file_get_contents("php://input"));

$data = json_decode(file_get_contents("php://input"), true);
error_log("[INFO] Received input: " . json_encode($data));

if (!isset($data['roomName'], $data['roomCode'], $data['weekendRate'], $data['discountedRate'], $data['bedType'], $data['weekRate'])) {
    error_log("[ERROR] Missing required fields in input.");
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
    exit;
}

$roomName = $mysqli->real_escape_string($data['roomName']);
$roomCode = $mysqli->real_escape_string($data['roomCode']);
$weekPrice = $mysqli->real_escape_string($data['weekRate']);
$weekendPrice = $mysqli->real_escape_string($data['weekendRate']);
$discountedPrice = $mysqli->real_escape_string($data['discountedRate']);
$bedTypeName = $mysqli->real_escape_string($data['bedType']);
$roomTypeId = isset($data['roomTypeId']) ? (int)$data['roomTypeId'] : null;

error_log("[INFO] Parsed values - RoomTypeID: $roomTypeId, RoomName: $roomName, RoomCode: $roomCode");

// 1. Insert or find bed type
$bedTypeId = null;
$bedTypeQuery = "SELECT id FROM bed_types WHERE bed_type = ? LIMIT 1";
$stmt = $mysqli->prepare($bedTypeQuery);
$stmt->bind_param("s", $bedTypeName);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows > 0) {
    $bedTypeId = $result->fetch_assoc()['id'];
    error_log("[INFO] Found existing bed_type_id: $bedTypeId");
} else {
    $insertBedType = "INSERT INTO bed_types (bed_type, created_at) VALUES (?, NOW())";
    $stmt = $mysqli->prepare($insertBedType);
    $stmt->bind_param("s", $bedTypeName);
    if (!$stmt->execute()) {
        error_log("[ERROR] Failed to insert bed type: " . $stmt->error);
    }
    $bedTypeId = $stmt->insert_id;
    error_log("[INFO] Inserted new bed_type_id: $bedTypeId");
}

if ($roomTypeId) {
    // 2a. UPDATE existing room_type
    $updateRoomType = "UPDATE room_types SET room_name = ?, room_code = ?, bed_type_id = ?, week_price = ?, weekend_price = ?, discounted_price = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $mysqli->prepare($updateRoomType);
    $stmt->bind_param("ssiddsi", $roomName, $roomCode, $bedTypeId, $weekPrice, $weekendPrice, $discountedPrice, $roomTypeId);
    if (!$stmt->execute()) {
        error_log("[ERROR] Failed to update room_types: " . $stmt->error);
        echo json_encode(["status" => "error", "message" => "Failed to update room type."]);
        exit;
    }
    error_log("[INFO] Successfully updated room_types ID: $roomTypeId");
    echo json_encode(["status" => "success", "message" => "Room type updated successfully."]);
    exit;
} else {
    // 2b. INSERT new room_type
    $insertRoomType = "INSERT INTO room_types (room_name, room_code, bed_type_id, week_price, weekend_price, discounted_price, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())";
    $stmt = $mysqli->prepare($insertRoomType);
    $stmt->bind_param("ssidds", $roomName, $roomCode, $bedTypeId, $weekPrice, $weekendPrice, $discountedPrice);
    if (!$stmt->execute()) {
        error_log("[ERROR] Failed to insert room_types: " . $stmt->error);
        echo json_encode(["status" => "error", "message" => "Failed to insert room type."]);
        exit;
    }
    $newId = $stmt->insert_id;
    error_log("[INFO] Inserted new room_type ID: $newId");
    echo json_encode(["status" => "success", "message" => "Room type added successfully."]);
    exit;
}