<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require_once 'vendor/autoload.php';
require_once 'email_config.php'; 

class EmailHelper {
    public static function sendWithAttachment($to, $subject, $htmlContent, $attachmentPath): bool {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = SMTP_AUTH;
            $mail->Username   = SMTP_USERNAME;
            $mail->Password   = SMTP_PASSWORD;
            $mail->SMTPSecure = SMTP_ENCRYPTION;
            $mail->Port       = SMTP_PORT;

            // Sender & recipient
            $mail->setFrom(SMTP_USERNAME, 'Lapa Hotel');
            $mail->addAddress($to);
            $mail->addReplyTo(SMTP_USERNAME);

            // Attach PDF
            if (file_exists($attachmentPath)) {
                $mail->addAttachment($attachmentPath);
            }

            // Content
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlContent;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("[EMAIL ERROR] Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }
}
