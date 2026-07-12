package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "resume_versions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(name = "version_name", nullable = false)
    private String versionName;

    @Column(name = "resume_data_json", nullable = false, columnDefinition = "TEXT")
    private String resumeDataJson; // Snapshot of resume state in JSON format

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
    }
}
