package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String items; // Comma-separated list of skill items/tags

    @Column(name = "list_order")
    @Builder.Default
    private Integer listOrder = 0;
}
