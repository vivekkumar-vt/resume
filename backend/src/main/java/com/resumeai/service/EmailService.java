package com.resumeai.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String email, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Reset Your Password");
        message.setText(
            "Hello,\n\n" +
            "We received a request to reset your password.\n\n" +
            "Click below:\n" +
            link + "\n\n" +
            "This link expires in 15 minutes.\n\n" +
            "If you did not request this, ignore this email."
        );
        mailSender.send(message);
    }
}
