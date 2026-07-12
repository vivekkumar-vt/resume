package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(nullable = false)
    private String name;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "detailed_description", columnDefinition = "TEXT")
    private String detailedDescription;

    @Column(name = "tech_stack")
    private String techStack; // Comma-separated tech stack tags

    @Column(name = "github_url")
    private String githubUrl;

    @Column(name = "live_demo_url")
    private String liveDemoUrl;

    @Column(name = "play_store_url")
    private String playStoreUrl;

    @Column(name = "app_store_url")
    private String appStoreUrl;

    @Column(name = "team_size")
    private Integer teamSize;

    private String duration;
    private String role;

    @Column(columnDefinition = "TEXT")
    private String features; // Serialized JSON string of string arrays

    @Column(columnDefinition = "TEXT")
    private String challenges; // Serialized JSON string of string arrays

    @Column(columnDefinition = "TEXT")
    private String learnings; // Serialized JSON string of string arrays

    @Column(columnDefinition = "TEXT")
    private String achievements; // Serialized JSON string of string arrays

    @Column(name = "list_order")
    @Builder.Default
    private Integer listOrder = 0;
}
