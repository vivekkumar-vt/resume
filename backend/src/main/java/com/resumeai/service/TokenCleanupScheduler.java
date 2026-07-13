package com.resumeai.service;

import com.resumeai.repository.PasswordResetTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Slf4j
public class TokenCleanupScheduler {

    private final PasswordResetTokenRepository tokenRepository;

    public TokenCleanupScheduler(PasswordResetTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    // Cron expression: every hour ("0 0 * * * *")
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredTokens() {
        log.info("Starting expired password reset token cleanup...");
        try {
            tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());
            log.info("Expired password reset token cleanup completed.");
        } catch (Exception e) {
            log.error("Failed to clean up expired tokens", e);
        }
    }
}
