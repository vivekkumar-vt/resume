package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "experiences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(name = "job_title", nullable = false)
    private String jobTitle;

    @Column(nullable = false)
    private String company;

    @Column(name = "employment_type")
    private String employmentType;

    private String industry;
    private String location;

    @Column(name = "work_mode")
    private String workMode; // e.g. REMOTE, HYBRID, ONSITE

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_current_job")
    @Builder.Default
    private Boolean isCurrentJob = false;

    @Column(columnDefinition = "TEXT")
    private String responsibilities; // Serialized JSON string of string arrays

    @Column(columnDefinition = "TEXT")
    private String achievements; // Serialized JSON string of string arrays

    private String technologies; // Comma-separated list of tech strings

    @Column(name = "team_size")
    private Integer teamSize;

    @Column(name = "list_order")
    @Builder.Default
    private Integer listOrder = 0;
}
