package com.resumeai.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "personal_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonalDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    @JsonIgnore
    private Resume resume;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "preferred_name")
    private String preferredName;

    @Column(name = "professional_title")
    private String professionalTitle;

    @Column(name = "current_position")
    private String currentPosition;

    private String email;
    private String phone;

    @Column(name = "alternate_phone")
    private String alternatePhone;

    @Column(columnDefinition = "TEXT")
    private String address;

    private String city;
    private String state;
    private String country;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    private String nationality;

    private String linkedin;
    private String github;
    private String portfolio;
    private String website;
    private String twitter;
    private String leetcode;
    private String hackerrank;
    private String codeforces;
    private String codechef;
    private String geeksforgeeks;
    private String kaggle;
    private String behance;
    private String dribbble;
    private String stackoverflow;
    private String medium;

    @Column(name = "custom_links", columnDefinition = "TEXT")
    private String customLinks; // Stored as serialized JSON string of custom link objects

    @Column(name = "photo_url")
    private String photoUrl;
}
