package com.resumeai.repository;

import com.resumeai.model.Resume;
import com.resumeai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, UUID> {
    List<Resume> findByUser(User user);
    List<Resume> findByUserId(UUID userId);
}
