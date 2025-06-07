<?php
require_once 'EmailHelper.php';

// 🔹 Recipient email to test with
$testEmail = 'mathipa@gmail.com';

// ✅ Test HTML email (no attachment)
echo "Testing sendTemplateEmail()...<br>";
$templateSuccess = EmailHelper::sendTemplateEmail(
    $testEmail,
    'Test: HTML Email Only',
    'email_templates/guest_invoice.html',
    [
        "{{NAME}}" => "Test",
        "{{SURNAME}}" => "User",
        "{{BOOKING_REFERENCE}}" => "TEST123",
        "{{ROOM_NO}}" => "101",
        "{{ROOM_TYPE}}" => "Twin Room",
        "{{CHECKIN}}" => "2025-06-01",
        "{{CHECKOUT}}" => "2025-06-05",
        "{{PACKAGE}}" => "Bed & Breakfast",
        "{{PAYMENT_STATUS}}" => "Paid",
        "{{PAYMENT_TYPE}}" => "EFT",
        "{{AMOUNT}}" => "1500.00",
        "{{SPECIAL_REQUESTS}}" => "Late check-in"
    ]
);

echo $templateSuccess ? "✅ Template email sent<br>" : "❌ Failed to send template email<br>";

// ✅ Test PDF email (with or without real attachment)
echo "Testing sendWithAttachment()...<br>";
$attachmentPath = __DIR__ . '/invoices/test_dummy_invoice.pdf';

// Generate a fake PDF for test
if (!file_exists($attachmentPath)) {
    file_put_contents($attachmentPath, "PDF content for testing");
}

$attachmentSuccess = EmailHelper::sendWithAttachment(
    $testEmail,
    'Test: PDF Attachment Email',
    '<p>This is a test email with a dummy PDF attached.</p>',
    $attachmentPath
);

echo $attachmentSuccess ? "✅ Email with attachment sent<br>" : "❌ Failed to send attachment email<br>";
?>
