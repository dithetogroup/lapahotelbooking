<?php
include_once("headers.php");
include_once("db_connect.php");
include_once("config.php");

header("Content-Type: application/json; charset=UTF-8");
mysqli_set_charset($mysqli, "utf8");

$invoicesDir = __DIR__ . '/invoices'; // Adjust path as needed
error_log("[INVOICE API] Invoices directory: $invoicesDir");

$files = [];
if (is_dir($invoicesDir)) {
    error_log("[INVOICE API] Directory exists, scanning...");
    foreach (scandir($invoicesDir) as $file) {
        error_log("[INVOICE API] Found file/dir: $file");
        if (preg_match('/\.pdf$/i', $file)) {
            $fullPath = $invoicesDir . DIRECTORY_SEPARATOR . $file;
            error_log("[INVOICE API] Processing PDF: $file, full path: $fullPath");

            // Extract booking_reference from filename
            $bookingRef = preg_replace('/\.pdf$/i', '', $file);
            error_log("[INVOICE API] About to query for booking_reference: $bookingRef");

            $sql = "SELECT gd.guest_name, gd.guest_surname, gd.guest_email, gd.booked_by, gd.guest_invoice
                    FROM guest_details gd
                    JOIN guest_bookings gb ON gb.id = gd.booking_id
                    WHERE gd.guest_invoice = 1 AND gb.booking_reference = ? AND gd.guest_name IS NOT NULL";

            $stmt = $mysqli->prepare($sql);
            if (!$stmt) {
                error_log("[INVOICE API] MySQL prepare failed: " . $mysqli->error);
                continue;
            }
            $stmt->bind_param('s', $bookingRef);
            if (!$stmt->execute()) {
                error_log("[INVOICE API] MySQL execute failed: " . $stmt->error);
                $stmt->close();
                continue;
            }
            $stmt->bind_result($guest_name, $guest_surname, $guest_email, $booked_by, $guest_invoice);

            if ($stmt->fetch() && $guest_name !== null) {
                $files[] = [
                    'filename'      => $file,
                    'modified'      => date('Y-m-d H:i:s', filemtime($fullPath)),
                    'url'           => "/invoices/$file",
                    'guest_name'    => $guest_name,
                    'guest_surname' => $guest_surname,
                    'guest_email'   => $guest_email,
                    'booked_by'     => $booked_by,
                    'guest_invoice' => $guest_invoice,
                ];
                error_log("[INVOICE API] Guest found: $guest_name $guest_surname, Email: $guest_email, Booked by: $booked_by");
            } else {
                error_log("[INVOICE API] No guest found for booking_reference: $bookingRef");
            }
            $stmt->close();
        }
    }
    // Sort by modified date descending
    usort($files, fn($a, $b) => strcmp($b['modified'], $a['modified']));
} else {
    error_log("[INVOICE API] Directory does not exist: $invoicesDir");
}

echo json_encode(['status' => 'success', 'data' => $files]);
?>
