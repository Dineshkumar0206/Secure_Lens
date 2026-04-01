package com.securelens.service;

import com.securelens.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String frontendUrl;
    private final String fromAddress;
    private final long resetTokenHours;
    private final boolean enabled;

    public EmailService(JavaMailSender mailSender,
                        @Value("${app.email.enabled:false}") boolean enabled,
                        @Value("${app.frontend-url:http://localhost:3000}") String frontendUrl,
                        @Value("${app.email.from:no-reply@securelens.local}") String fromAddress,
                        @Value("${app.reset-token-hours:1}") long resetTokenHours) {
        this.mailSender = mailSender;
        this.frontendUrl = normalize(frontendUrl);
        this.fromAddress = fromAddress;
        this.resetTokenHours = resetTokenHours;
        this.enabled = enabled;
    }

    public void sendPasswordReset(User user, String token) {
        if (!enabled) {
            logger.info("Email is disabled. Reset link for {}: {}", user.getEmail(),
                    String.format("%s/reset-password?token=%s", frontendUrl, token));
            return;
        }

        String resetLink = String.format("%s/reset-password?token=%s", frontendUrl, token);
        MimeMessage mimeMessage = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(
                    mimeMessage,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromAddress);
            helper.setTo(user.getEmail());
            helper.setSubject("SecureLens password reset");
            helper.setText(buildPlainBody(user.getUsername(), resetLink),
                    buildHtmlBody(user.getUsername(), resetLink));

            mailSender.send(mimeMessage);
            logger.info("Sent password reset email to {}", user.getEmail());
        } catch (MessagingException | MailException exception) {
            logger.error("Failed to send password reset email to {}", user.getEmail(), exception);
        }
    }

    private String buildPlainBody(String username, String resetLink) {
        String safeName = (username == null || username.isBlank()) ? "SecureLens user" : username;
        return String.format(
                "Hi %s,%n%n" +
                        "We received a request to reset the password for your SecureLens account.%n" +
                        "Click the link below within %d hour(s):%n%n" +
                        "%s%n%n" +
                        "If you did not request this, you can safely ignore this email.%n%n" +
                        "Stay safe,%n" +
                        "SecureLens Team",
                safeName,
                resetTokenHours,
                resetLink);
    }

    private String buildHtmlBody(String username, String resetLink) {
        String safeName = (username == null || username.isBlank()) ? "SecureLens user" : username;
        return String.format("""
                        <p>Hi %s,</p>
                        <p>We received a request to reset the password for your SecureLens account.</p>
                        <p><a href="%s" style="background:#00d4ff;color:#000;padding:0.65rem 1.2rem;border-radius:8px;text-decoration:none;font-weight:700;">Reset password</a></p>
                        <p>The link expires in %d hour(s).</p>
                        <p>If you did not request this, you can safely ignore this email.</p>
                        <p>Stay safe,<br/>SecureLens Team</p>
                        <p style="font-size:0.85rem;color:#94a3b8;">If the button does not work, paste this URL into your browser:<br/>%s</p>
                        """,
                safeName,
                resetLink,
                resetTokenHours,
                resetLink);
    }

    private String normalize(String url) {
        if (url == null || url.isBlank()) {
            return "http://localhost:3000";
        }
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }
}
