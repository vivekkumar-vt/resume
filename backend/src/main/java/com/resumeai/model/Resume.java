package com.resumeai.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(name = "target_job_role")
    private String targetJobRole;

    @Column(name = "template_id")
    @Builder.Default
    private String templateId = "classic";

    @Builder.Default
    private String font = "Arial";

    @Column(name = "font_size")
    @Builder.Default
    private String fontSize = "11pt";

    @Column(name = "line_spacing")
    @Builder.Default
    private Float lineSpacing = 1.15f;

    @Builder.Default
    private Float margins = 1.0f;

    @Column(name = "paper_size")
    @Builder.Default
    private String paperSize = "A4";

    @Column(name = "accent_color")
    @Builder.Default
    private String accentColor = "#4f46e5";

    @Column(name = "show_icons")
    @Builder.Default
    private Boolean showIcons = true;

    @Column(name = "show_photo")
    @Builder.Default
    private Boolean showPhoto = false;

    @Column(name = "section_order")
    private String sectionOrder;

    @OneToOne(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private PersonalDetails personalDetails;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("listOrder ASC")
    @Builder.Default
    private List<Experience> experiences = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("listOrder ASC")
    @Builder.Default
    private List<Project> projects = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("listOrder ASC")
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("listOrder ASC")
    @Builder.Default
    private List<Skill> skills = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("listOrder ASC")
    @Builder.Default
    private List<Certification> certifications = new ArrayList<>();

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    @Builder.Default
    private List<ResumeVersion> versions = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at")
    private ZonedDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = ZonedDateTime.now();
        updatedAt = ZonedDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = ZonedDateTime.now();
    }

    // Helper methods to maintain bidirectional relationships safely
    public void setPersonalDetails(PersonalDetails personalDetails) {
        if (personalDetails == null) {
            if (this.personalDetails != null) {
                this.personalDetails.setResume(null);
            }
        } else {
            personalDetails.setResume(this);
        }
        this.personalDetails = personalDetails;
    }

    public void addExperience(Experience exp) {
        experiences.add(exp);
        exp.setResume(this);
    }

    public void addProject(Project proj) {
        projects.add(proj);
        proj.setResume(this);
    }

    public void addEducation(Education edu) {
        educations.add(edu);
        edu.setResume(this);
    }

    public void addSkill(Skill skill) {
        skills.add(skill);
        skill.setResume(this);
    }

    public void addCertification(Certification cert) {
        certifications.add(cert);
        cert.setResume(this);
    }
}
