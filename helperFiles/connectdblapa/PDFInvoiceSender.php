<?php
require_once 'vendor/autoload.php';
require_once 'EmailHelper.php';

use Dompdf\Dompdf;
use Dompdf\Options;

function sendStyledPDFInvoiceWithAttachment(string $guestEmail, string $adminEmail, string $invoiceNo, array $data): void {
    error_log("[INFO] Generating and sending styled PDF invoice...");


    $invoiceTemplatePath = __DIR__ . "/email_templates/invoice_template.html";
    $outputPdfPath = __DIR__ . "/invoices/invoice_{$invoiceNo}.pdf";

    if (!file_exists($invoiceTemplatePath)) {
        error_log("[ERROR] Invoice template not found at $invoiceTemplatePath");
        return;
    }

    error_log("[INFO] Load invoice Template....");
    $templateHtml = file_get_contents($invoiceTemplatePath);


    $base64FilePath = __DIR__ . "/email_templates/lapa_logo_base64.txt"; 

    if (file_exists($base64FilePath)) {
        error_log("[INFO] Logo found for invoice ....");
        $logoSrc = preg_replace('/\s+/', '', file_get_contents($base64FilePath));
    } else {
        error_log("[WARNING] Base64 logo file not found at $base64FilePath");
        $logoSrc = ''; // Fallback
    }

    $placeholders = [
        '{guest_name}' => $data['guest_title'] . ' ' . $data['guest_name'] . ' ' . $data['guest_surname'],
        '{guest_email}' => $data['guest_email'],
        '{guest_phone}' => $data['guest_phone'],
        '{checkin}' => $data['checkInDate'],
        '{checkout}' => $data['checkOutDate'],
        '{payment_type}' => $data['payment_types'],
        '{payment_status}' => $data['payment_status'],
        '{total_amount}' => number_format((float)$data['payment_amount'], 2),
        '{invoice_no}' => $invoiceNo,
        '{date}' => date('d F Y'),
        '{items}' => '',
        '{logo}' => $logoSrc
    ];

    $nights = 0;
    if (!empty($data['checkInDate']) && !empty($data['checkOutDate'])) {
        $start = new DateTime($data['checkInDate']);
        $end = new DateTime($data['checkOutDate']);
        $nights = $start->diff($end)->days;
    }

    $itemsHtml = '';
    foreach ($data['roomNos'] as $index => $roomNo) {
        $roomType = $data['roomTypes'][$index] ?? 'N/A';
        $total = (float)($data['roomPrices'][$index] ?? 0);
        $rate = $nights > 0 ? $total / $nights : $total;
        $itemsHtml .= "<tr><td>Room</td><td>{$roomType} ({$roomNo})</td><td>R" . number_format($rate, 2) . "</td><td>{$nights}</td><td>R" . number_format($total, 2) . "</td></tr>";
    }

    foreach ($data['packageNames'] ?? [] as $pkgName) {
        $pkgPrice = $data['packageRates'][$pkgName] ?? 0;
        $itemsHtml .= "<tr><td>Package</td><td>{$pkgName}</td><td>R" . number_format($pkgPrice, 2) . "</td><td>1</td><td>R" . number_format($pkgPrice, 2) . "</td></tr>";
    }

    $placeholders['{items}'] = $itemsHtml;

    foreach ($placeholders as $key => $value) {
        $templateHtml = str_replace($key, $value, $templateHtml);
    }

    $options = new Options();
    $options->set('defaultFont', 'DejaVu Sans');
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($templateHtml);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    $pdfOutput = $dompdf->output();
    file_put_contents($outputPdfPath, $pdfOutput);
    error_log("[INFO] Invoice saved to this path : $outputPdfPath");

    $emailBody = file_get_contents(__DIR__ . '/email_templates/guest_invoice.html');
    foreach ([
        '{{NAME}}' => $data['guest_name'],
        '{{SURNAME}}' => $data['guest_surname'],
        '{{BOOKING_REFERENCE}}' => $invoiceNo,
        '{{CHECKIN}}' => $data['checkInDate'],
        '{{CHECKOUT}}' => $data['checkOutDate'],
        '{{AMOUNT}}' => number_format((float)$data['payment_amount'], 2)
    ] as $k => $v) {
        $emailBody = str_replace($k, $v, $emailBody);
    }

    $guestSent = EmailHelper::sendWithAttachment(
        $guestEmail,
        "Lapa Hotel Invoice: $invoiceNo",
        $emailBody,
        $outputPdfPath
    );
    if (!$guestSent) {
        error_log("[EMAIL ERROR] Failed sending to guest: $guestEmail");
    }

    $adminSent = EmailHelper::sendWithAttachment(
        $adminEmail,
        "Copy: Lapa Hotel Invoice: $invoiceNo",
        $emailBody,
        $outputPdfPath
    );
    if (!$adminSent) {
        error_log("[EMAIL ERROR] Failed sending to admin: $adminEmail");
    }
}
