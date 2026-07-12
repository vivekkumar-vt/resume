package com.resumeai.service;

import com.resumeai.dto.ResumeDto;
import com.resumeai.model.*;
import com.resumeai.repository.ResumeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ResumeService {

    private final ResumeRepository resumeRepository;

    public ResumeService(ResumeRepository resumeRepository) {
        this.resumeRepository = resumeRepository;
    }

    public List<ResumeDto> getAllResumes(User user) {
        List<Resume> resumes = resumeRepository.findByUser(user);
        return resumes.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public ResumeDto getResumeById(UUID id, User user) {
        Resume resume = getResumeEntity(id, user);
        return mapToDto(resume);
    }

    public ResumeDto createResume(ResumeDto dto, User user) {
        Resume resume = new Resume();
        resume.setUser(user);
        updateResumeFields(resume, dto);
        Resume saved = resumeRepository.save(resume);
        return mapToDto(saved);
    }

    public ResumeDto updateResume(UUID id, ResumeDto dto, User user) {
        Resume resume = getResumeEntity(id, user);
        updateResumeFields(resume, dto);
        Resume saved = resumeRepository.save(resume);
        return mapToDto(saved);
    }

    public void deleteResume(UUID id, User user) {
        Resume resume = getResumeEntity(id, user);
        resumeRepository.delete(resume);
    }

    public Resume getResumeEntity(UUID id, User user) {
        Resume resume = resumeRepository.findById(id)
                .orElseThrow(() -> new com.resumeai.exception.ResourceNotFoundException("Resume not found with ID: " + id));
        if (resume.getUser() != null && !resume.getUser().getId().equals(user.getId())) {
            throw new SecurityException("Access denied: You do not own this resume");
        }
        return resume;
    }

    private void updateResumeFields(Resume entity, ResumeDto dto) {
        entity.setTitle(dto.getTitle());
        entity.setTargetJobRole(dto.getTargetJobRole());
        entity.setTemplateId(dto.getTemplateId());
        entity.setFont(dto.getFont());
        entity.setFontSize(dto.getFontSize());
        entity.setLineSpacing(dto.getLineSpacing());
        entity.setMargins(dto.getMargins());
        entity.setPaperSize(dto.getPaperSize());
        entity.setAccentColor(dto.getAccentColor());
        entity.setShowIcons(dto.getShowIcons());
        entity.setShowPhoto(dto.getShowPhoto());
        entity.setSectionOrder(dto.getSectionOrder());

        // Update Personal Details
        if (dto.getPersonalDetails() != null) {
            PersonalDetails details = entity.getPersonalDetails();
            if (details == null) {
                details = new PersonalDetails();
                entity.setPersonalDetails(details);
            }
            ResumeDto.PersonalDetailsDto pdDto = dto.getPersonalDetails();
            details.setFirstName(pdDto.getFirstName());
            details.setMiddleName(pdDto.getMiddleName());
            details.setLastName(pdDto.getLastName());
            details.setPreferredName(pdDto.getPreferredName());
            details.setProfessionalTitle(pdDto.getProfessionalTitle());
            details.setCurrentPosition(pdDto.getCurrentPosition());
            details.setEmail(pdDto.getEmail());
            details.setPhone(pdDto.getPhone());
            details.setAlternatePhone(pdDto.getAlternatePhone());
            details.setAddress(pdDto.getAddress());
            details.setCity(pdDto.getCity());
            details.setState(pdDto.getState());
            details.setCountry(pdDto.getCountry());
            details.setPostalCode(pdDto.getPostalCode());
            details.setDateOfBirth(pdDto.getDateOfBirth());
            details.setNationality(pdDto.getNationality());
            details.setLinkedin(pdDto.getLinkedin());
            details.setGithub(pdDto.getGithub());
            details.setPortfolio(pdDto.getPortfolio());
            details.setWebsite(pdDto.getWebsite());
            details.setTwitter(pdDto.getTwitter());
            details.setLeetcode(pdDto.getLeetcode());
            details.setHackerrank(pdDto.getHackerrank());
            details.setCodeforces(pdDto.getCodeforces());
            details.setCodechef(pdDto.getCodechef());
            details.setGeeksforgeeks(pdDto.getGeeksforgeeks());
            details.setKaggle(pdDto.getKaggle());
            details.setBehance(pdDto.getBehance());
            details.setDribbble(pdDto.getDribbble());
            details.setStackoverflow(pdDto.getStackoverflow());
            details.setMedium(pdDto.getMedium());
            details.setCustomLinks(pdDto.getCustomLinks());
            details.setPhotoUrl(pdDto.getPhotoUrl());
        }

        // Update Experiences
        entity.getExperiences().clear();
        if (dto.getExperiences() != null) {
            for (ResumeDto.ExperienceDto expDto : dto.getExperiences()) {
                Experience exp = Experience.builder()
                        .jobTitle(expDto.getJobTitle())
                        .company(expDto.getCompany())
                        .employmentType(expDto.getEmploymentType())
                        .industry(expDto.getIndustry())
                        .location(expDto.getLocation())
                        .workMode(expDto.getWorkMode())
                        .startDate(expDto.getStartDate())
                        .endDate(expDto.getEndDate())
                        .isCurrentJob(expDto.getIsCurrentJob())
                        .responsibilities(expDto.getResponsibilities())
                        .achievements(expDto.getAchievements())
                        .technologies(expDto.getTechnologies())
                        .teamSize(expDto.getTeamSize())
                        .listOrder(expDto.getListOrder())
                        .build();
                entity.addExperience(exp);
            }
        }

        // Update Projects
        entity.getProjects().clear();
        if (dto.getProjects() != null) {
            for (ResumeDto.ProjectDto projDto : dto.getProjects()) {
                Project proj = Project.builder()
                        .name(projDto.getName())
                        .shortDescription(projDto.getShortDescription())
                        .detailedDescription(projDto.getDetailedDescription())
                        .techStack(projDto.getTechStack())
                        .githubUrl(projDto.getGithubUrl())
                        .liveDemoUrl(projDto.getLiveDemoUrl())
                        .playStoreUrl(projDto.getPlayStoreUrl())
                        .appStoreUrl(projDto.getAppStoreUrl())
                        .teamSize(projDto.getTeamSize())
                        .duration(projDto.getDuration())
                        .role(projDto.getRole())
                        .features(projDto.getFeatures())
                        .challenges(projDto.getChallenges())
                        .learnings(projDto.getLearnings())
                        .achievements(projDto.getAchievements())
                        .listOrder(projDto.getListOrder())
                        .build();
                entity.addProject(proj);
            }
        }

        // Update Educations
        entity.getEducations().clear();
        if (dto.getEducations() != null) {
            for (ResumeDto.EducationDto eduDto : dto.getEducations()) {
                Education edu = Education.builder()
                        .degree(eduDto.getDegree())
                        .course(eduDto.getCourse())
                        .specialization(eduDto.getSpecialization())
                        .college(eduDto.getCollege())
                        .university(eduDto.getUniversity())
                        .board(eduDto.getBoard())
                        .city(eduDto.getCity())
                        .country(eduDto.getCountry())
                        .startYear(eduDto.getStartYear())
                        .endYear(eduDto.getEndYear())
                        .cgpa(eduDto.getCgpa())
                        .percentage(eduDto.getPercentage())
                        .grade(eduDto.getGrade())
                        .listOrder(eduDto.getListOrder())
                        .build();
                entity.addEducation(edu);
            }
        }

        // Update Skills
        entity.getSkills().clear();
        if (dto.getSkills() != null) {
            for (ResumeDto.SkillDto skillDto : dto.getSkills()) {
                Skill skill = Skill.builder()
                        .category(skillDto.getCategory())
                        .items(skillDto.getItems())
                        .listOrder(skillDto.getListOrder())
                        .build();
                entity.addSkill(skill);
            }
        }

        // Update Certifications
        entity.getCertifications().clear();
        if (dto.getCertifications() != null) {
            for (ResumeDto.CertificationDto certDto : dto.getCertifications()) {
                Certification cert = Certification.builder()
                        .name(certDto.getName())
                        .issuer(certDto.getIssuer())
                        .issueDate(certDto.getIssueDate())
                        .expirationDate(certDto.getExpirationDate())
                        .credentialId(certDto.getCredentialId())
                        .credentialUrl(certDto.getCredentialUrl())
                        .listOrder(certDto.getListOrder())
                        .build();
                entity.addCertification(cert);
            }
        }
    }

    private ResumeDto mapToDto(Resume entity) {
        ResumeDto.PersonalDetailsDto pdDto = null;
        if (entity.getPersonalDetails() != null) {
            PersonalDetails pd = entity.getPersonalDetails();
            pdDto = ResumeDto.PersonalDetailsDto.builder()
                    .firstName(pd.getFirstName())
                    .middleName(pd.getMiddleName())
                    .lastName(pd.getLastName())
                    .preferredName(pd.getPreferredName())
                    .professionalTitle(pd.getProfessionalTitle())
                    .currentPosition(pd.getCurrentPosition())
                    .email(pd.getEmail())
                    .phone(pd.getPhone())
                    .alternatePhone(pd.getAlternatePhone())
                    .address(pd.getAddress())
                    .city(pd.getCity())
                    .state(pd.getState())
                    .country(pd.getCountry())
                    .postalCode(pd.getPostalCode())
                    .dateOfBirth(pd.getDateOfBirth())
                    .nationality(pd.getNationality())
                    .linkedin(pd.getLinkedin())
                    .github(pd.getGithub())
                    .portfolio(pd.getPortfolio())
                    .website(pd.getWebsite())
                    .twitter(pd.getTwitter())
                    .leetcode(pd.getLeetcode())
                    .hackerrank(pd.getHackerrank())
                    .codeforces(pd.getCodeforces())
                    .codechef(pd.getCodechef())
                    .geeksforgeeks(pd.getGeeksforgeeks())
                    .kaggle(pd.getKaggle())
                    .behance(pd.getBehance())
                    .dribbble(pd.getDribbble())
                    .stackoverflow(pd.getStackoverflow())
                    .medium(pd.getMedium())
                    .customLinks(pd.getCustomLinks())
                    .photoUrl(pd.getPhotoUrl())
                    .build();
        }

        List<ResumeDto.ExperienceDto> expDtos = entity.getExperiences().stream().map(exp ->
                ResumeDto.ExperienceDto.builder()
                        .id(exp.getId())
                        .jobTitle(exp.getJobTitle())
                        .company(exp.getCompany())
                        .employmentType(exp.getEmploymentType())
                        .industry(exp.getIndustry())
                        .location(exp.getLocation())
                        .workMode(exp.getWorkMode())
                        .startDate(exp.getStartDate())
                        .endDate(exp.getEndDate())
                        .isCurrentJob(exp.getIsCurrentJob())
                        .responsibilities(exp.getResponsibilities())
                        .achievements(exp.getAchievements())
                        .technologies(exp.getTechnologies())
                        .teamSize(exp.getTeamSize())
                        .listOrder(exp.getListOrder())
                        .build()
        ).collect(Collectors.toList());

        List<ResumeDto.ProjectDto> projDtos = entity.getProjects().stream().map(proj ->
                ResumeDto.ProjectDto.builder()
                        .id(proj.getId())
                        .name(proj.getName())
                        .shortDescription(proj.getShortDescription())
                        .detailedDescription(proj.getDetailedDescription())
                        .techStack(proj.getTechStack())
                        .githubUrl(proj.getGithubUrl())
                        .liveDemoUrl(proj.getLiveDemoUrl())
                        .playStoreUrl(proj.getPlayStoreUrl())
                        .appStoreUrl(proj.getAppStoreUrl())
                        .teamSize(proj.getTeamSize())
                        .duration(proj.getDuration())
                        .role(proj.getRole())
                        .features(proj.getFeatures())
                        .challenges(proj.getChallenges())
                        .learnings(proj.getLearnings())
                        .achievements(proj.getAchievements())
                        .listOrder(proj.getListOrder())
                        .build()
        ).collect(Collectors.toList());

        List<ResumeDto.EducationDto> eduDtos = entity.getEducations().stream().map(edu ->
                ResumeDto.EducationDto.builder()
                        .id(edu.getId())
                        .degree(edu.getDegree())
                        .course(edu.getCourse())
                        .specialization(edu.getSpecialization())
                        .college(edu.getCollege())
                        .university(edu.getUniversity())
                        .board(edu.getBoard())
                        .city(edu.getCity())
                        .country(edu.getCountry())
                        .startYear(edu.getStartYear())
                        .endYear(edu.getEndYear())
                        .cgpa(edu.getCgpa())
                        .percentage(edu.getPercentage())
                        .grade(edu.getGrade())
                        .listOrder(edu.getListOrder())
                        .build()
        ).collect(Collectors.toList());

        List<ResumeDto.SkillDto> skillDtos = entity.getSkills().stream().map(skill ->
                ResumeDto.SkillDto.builder()
                        .id(skill.getId())
                        .category(skill.getCategory())
                        .items(skill.getItems())
                        .listOrder(skill.getListOrder())
                        .build()
        ).collect(Collectors.toList());

        List<ResumeDto.CertificationDto> certDtos = entity.getCertifications().stream().map(cert ->
                ResumeDto.CertificationDto.builder()
                        .id(cert.getId())
                        .name(cert.getName())
                        .issuer(cert.getIssuer())
                        .issueDate(cert.getIssueDate())
                        .expirationDate(cert.getExpirationDate())
                        .credentialId(cert.getCredentialId())
                        .credentialUrl(cert.getCredentialUrl())
                        .listOrder(cert.getListOrder())
                        .build()
        ).collect(Collectors.toList());

        return ResumeDto.builder()
                .id(entity.getId())
                .title(entity.getTitle())
                .targetJobRole(entity.getTargetJobRole())
                .templateId(entity.getTemplateId())
                .font(entity.getFont())
                .fontSize(entity.getFontSize())
                .lineSpacing(entity.getLineSpacing())
                .margins(entity.getMargins())
                .paperSize(entity.getPaperSize())
                .accentColor(entity.getAccentColor())
                .showIcons(entity.getShowIcons())
                .showPhoto(entity.getShowPhoto())
                .sectionOrder(entity.getSectionOrder())
                .personalDetails(pdDto)
                .experiences(expDtos)
                .projects(projDtos)
                .educations(eduDtos)
                .skills(skillDtos)
                .certifications(certDtos)
                .build();
    }
}
