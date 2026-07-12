package com.resumeai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDto {
    private UUID id;
    private String title;
    private String targetJobRole;
    private String templateId;
    private String font;
    private String fontSize;
    private Float lineSpacing;
    private Float margins;
    private String paperSize;
    private String accentColor;
    private Boolean showIcons;
    private Boolean showPhoto;
    private String sectionOrder;
    private PersonalDetailsDto personalDetails;
    
    @Builder.Default
    private List<ExperienceDto> experiences = new ArrayList<>();
    
    @Builder.Default
    private List<ProjectDto> projects = new ArrayList<>();
    
    @Builder.Default
    private List<EducationDto> educations = new ArrayList<>();
    
    @Builder.Default
    private List<SkillDto> skills = new ArrayList<>();
    
    @Builder.Default
    private List<CertificationDto> certifications = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PersonalDetailsDto {
        private String firstName;
        private String middleName;
        private String lastName;
        private String preferredName;
        private String professionalTitle;
        private String currentPosition;
        private String email;
        private String phone;
        private String alternatePhone;
        private String address;
        private String city;
        private String state;
        private String country;
        private String postalCode;
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
        private String customLinks;
        private String photoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ExperienceDto {
        private Long id;
        private String jobTitle;
        private String company;
        private String employmentType;
        private String industry;
        private String location;
        private String workMode;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean isCurrentJob;
        private String responsibilities; // Serialized JSON list
        private String achievements; // Serialized JSON list
        private String technologies;
        private Integer teamSize;
        private Integer listOrder;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectDto {
        private Long id;
        private String name;
        private String shortDescription;
        private String detailedDescription;
        private String techStack;
        private String githubUrl;
        private String liveDemoUrl;
        private String playStoreUrl;
        private String appStoreUrl;
        private Integer teamSize;
        private String duration;
        private String role;
        private String features; // Serialized JSON list
        private String challenges; // Serialized JSON list
        private String learnings; // Serialized JSON list
        private String achievements; // Serialized JSON list
        private Integer listOrder;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EducationDto {
        private Long id;
        private String degree;
        private String course;
        private String specialization;
        private String college;
        private String university;
        private String board;
        private String city;
        private String country;
        private Integer startYear;
        private Integer endYear;
        private Float cgpa;
        private Float percentage;
        private String grade;
        private Integer listOrder;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillDto {
        private Long id;
        private String category;
        private String items;
        private Integer listOrder;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CertificationDto {
        private Long id;
        private String name;
        private String issuer;
        private LocalDate issueDate;
        private LocalDate expirationDate;
        private String credentialId;
        private String credentialUrl;
        private Integer listOrder;
    }
}
