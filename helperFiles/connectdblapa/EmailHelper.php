<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once 'vendor/autoload.php';
require_once 'email_config.php';

class EmailHelper {
    public static function sendTemplateEmail(string $to, string $subject, string $templatePath, array $placeholders): bool {
        if (!file_exists($templatePath)) {
            error_log("[EMAIL TEMPLATE ERROR] Template file not found: {$templatePath}");
            return false;
        }

        $template = file_get_contents($templatePath);
        foreach ($placeholders as $key => $value) {
            $template = str_replace($key, $value, $template);
        }

        return self::sendEmail($to, $subject, $template);
    }

    public static function sendWithAttachment(string $to, string $subject, string $htmlContent, string $attachmentPath): bool {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = SMTP_AUTH;
            $mail->Username   = SMTP_USERNAME;
            $mail->Password   = SMTP_PASSWORD;
            $mail->SMTPSecure = SMTP_ENCRYPTION;
            $mail->Port       = SMTP_PORT;

            $mail->setFrom(SMTP_USERNAME, 'Lapa Hotel');
            $mail->addAddress($to);
            $mail->addReplyTo(SMTP_USERNAME);

            if (file_exists($attachmentPath)) {
                $mail->addAttachment($attachmentPath);
            }

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $htmlContent;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("[EMAIL ERROR] Could not send email. Error: {$mail->ErrorInfo}");
            return false;
        }
    }

    private static function sendEmail(string $to, string $subject, string $body): bool {
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host       = SMTP_HOST;
            $mail->SMTPAuth   = SMTP_AUTH;
            $mail->Username   = SMTP_USERNAME;
            $mail->Password   = SMTP_PASSWORD;
            $mail->SMTPSecure = SMTP_ENCRYPTION;
            $mail->Port       = SMTP_PORT;

            $mail->setFrom(SMTP_USERNAME, 'Lapa Hotel');
            $mail->addAddress($to);
            $mail->addReplyTo(SMTP_USERNAME);

            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body    = $body;

            $mail->send();
            return true;
        } catch (Exception $e) {
            error_log("[EMAIL ERROR] Could not send email to {$to}. PHPMailer error: " . $mail->ErrorInfo);
            return false;
        }
    }
}
?>