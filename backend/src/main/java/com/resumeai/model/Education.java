package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "educations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(nullable = false)
    private String degree;

    private String course;
    private String specialization;
    private String college;
    private String university;
    private String board;
    private String city;
    private String country;

    @Column(name = "start_year")
    private Integer startYear;

    @Column(name = "end_year")
    private Integer endYear;

    private Float cgpa;
    private Float percentage;
    private String grade;

    @Column(name = "list_order")
    @Builder.Default
    private Integer listOrder = 0;
}
