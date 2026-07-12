package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String issuer;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @Column(name = "expiration_date")
    private LocalDate expirationDate;

    @Column(name = "credential_id")
    private String credentialId;

    @Column(name = "credential_url")
    private String credentialUrl;

    @Column(name = "list_order")
    @Builder.Default
    private Integer listOrder = 0;
}
