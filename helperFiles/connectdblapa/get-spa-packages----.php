<?php
include_once("headers.php");
include_once("db_connect.php");

header('Content-Type: application/json; charset=UTF-8');

// SQL: Join spa_bookings with spa_booking_packages, packages, and spa_therapists
$sql = "
    SELECT
        sb.id,
        sb.spbooking_title,
        sb.spbooking_name,
        sb.spbooking_surname,
        sb.spbooking_email,
        sb.spbooking_contact,
        sb.spbooking_date,
        sb.spbooking_time,
        sb.spbooking_noofvisitors,
        sb.spbooking_reason,
        sb.spbooking_allergies,
        sb.spbooking_bookedby,
        sb.spbooking_totalprice,
        sb.created_at,
        sb.updated_at,
        GROUP_CONCAT(p.id) AS package_ids,
        GROUP_CONCAT(p.package_name SEPARATOR ', ') AS package_names,
        st.id AS therapist_id,
        CONCAT(st.therapists_title, ' ', st.therapists_name, ' ', st.therapists_surname) AS therapist_name
    FROM spa_bookings sb
    LEFT JOIN spa_booking_packages sbp ON sb.id = sbp.spa_booking_id
    LEFT JOIN packages p ON sbp.package_id = p.id
    LEFT JOIN spa_therapists st ON sb.therapist_id = st.id
    WHERE p.package_type = 'spa'
    GROUP BY sb.id
    ORDER BY sb.created_at DESC
";


$result = $mysqli->query($sql);

$bookings = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Optionally, convert package_ids string to array
        $row['package_ids'] = $row['package_ids'] ? explode(',', $row['package_ids']) : [];
        $bookings[] = $row;
    }
}

echo json_encode(['data' => $bookings]);
?>
