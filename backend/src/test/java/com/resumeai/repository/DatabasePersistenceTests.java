package com.resumeai.repository;

import com.resumeai.model.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class DatabasePersistenceTests {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ResumeVersionRepository resumeVersionRepository;

    @Test
    public void testUserAndResumePersistence() {
        // 1. Create and save a User
        User user = User.builder()
                .email("test.candidate@example.com")
                .password("encoded_secure_password")
                .role(Role.REGISTERED)
                .build();

        User savedUser = userRepository.save(user);
        assertNotNull(savedUser.getId());
        assertEquals("test.candidate@example.com", savedUser.getEmail());

        // 2. Create a Resume with children
        Resume resume = Resume.builder()
                .title("Software Engineer Resume v1")
                .targetJobRole("Full Stack Developer")
                .templateId("modern")
                .user(savedUser)
                .build();

        // 3. Add PersonalDetails
        PersonalDetails personalDetails = PersonalDetails.builder()
                .firstName("first name")
                .lastName("last name")
                .email("[EMAIL_ADDRESS]")
                .phone("phone")
                .linkedin("linkedin")
                .github("github")
                .build();
        resume.setPersonalDetails(personalDetails);

        // 4. Add Experience
        Experience experience = Experience.builder()
                .jobTitle("Senior Dev")
                .company("Tech Corp")
                .startDate(LocalDate.of(2022, 1, 1))
                .isCurrentJob(true)
                .responsibilities("[\"Developed core ResumeAI service\", \"Led a team of 4 engineers\"]")
                .technologies("Java,Spring Boot,PostgreSQL")
                .listOrder(0)
                .build();
        resume.addExperience(experience);

        // 5. Add Project
        Project project = Project.builder()
                .name("project ka name ")
                .techStack("React,Node.js,MongoDB")
                .githubUrl("github")
                .listOrder(0)
                .build();
        resume.addProject(project);

        // 6. Add Education
        Education education = Education.builder()
                .degree("course name here")
                .course("field")
                .college("University/school")
                .startYear(2018)
                .endYear(2022)
                .cgpa(9.2f)
                .listOrder(0)
                .build();
        resume.addEducation(education);

        // 7. Add Skill
        Skill skill = Skill.builder()
                .category("Languages")
                .items("Java,TypeScript,Python,SQL")
                .listOrder(0)
                .build();
        resume.addSkill(skill);

        // 8. Add Certification
        Certification cert = Certification.builder()
                .name("certificate name")
                .issuer("issuing authority")
                .issueDate(LocalDate.of(2023, 6, 15))
                .listOrder(0)
                .build();
        resume.addCertification(cert);

        // Save Resume (Cascading should persist all child elements)
        Resume savedResume = resumeRepository.save(resume);
        assertNotNull(savedResume.getId());

        // Flush and clear persistence context to force loading from database
        resumeRepository.flush();

        // 9. Fetch saved Resume and assert
        Optional<Resume> retrievedOpt = resumeRepository.findById(savedResume.getId());
        assertTrue(retrievedOpt.isPresent());
        Resume retrievedResume = retrievedOpt.get();

        assertEquals("Software Engineer Resume v1", retrievedResume.getTitle());
        assertEquals("Full Stack Developer", retrievedResume.getTargetJobRole());

        // Assert Personal Details
        assertNotNull(retrievedResume.getPersonalDetails());
        assertEquals("John", retrievedResume.getPersonalDetails().getFirstName());
        assertEquals("john.doe@example.com", retrievedResume.getPersonalDetails().getEmail());

        // Assert Work Experiences
        assertEquals(1, retrievedResume.getExperiences().size());
        assertEquals("Senior Dev", retrievedResume.getExperiences().get(0).getJobTitle());
        assertEquals("Tech Corp", retrievedResume.getExperiences().get(0).getCompany());
        assertTrue(retrievedResume.getExperiences().get(0).getIsCurrentJob());

        // Assert Projects
        assertEquals(1, retrievedResume.getProjects().size());
        assertEquals("E-Commerce Portal", retrievedResume.getProjects().get(0).getName());

        // Assert Education
        assertEquals(1, retrievedResume.getEducations().size());
        assertEquals("Bachelor of Technology", retrievedResume.getEducations().get(0).getDegree());

        // Assert Skills
        assertEquals(1, retrievedResume.getSkills().size());
        assertEquals("Languages", retrievedResume.getSkills().get(0).getCategory());

        // Assert Certifications
        assertEquals(1, retrievedResume.getCertifications().size());
        assertEquals("AWS Certified Solutions Architect", retrievedResume.getCertifications().get(0).getName());

        // 10. Test ResumeVersion persistence
        ResumeVersion version = ResumeVersion.builder()
                .resume(retrievedResume)
                .versionName("Backup July 2026")
                .resumeDataJson("{\"title\": \"Backup Resume Snapshot JSON\"}")
                .build();
        
        ResumeVersion savedVersion = resumeVersionRepository.save(version);
        assertNotNull(savedVersion.getId());
        
        List<ResumeVersion> versions = resumeVersionRepository.findByResumeIdOrderByCreatedAtDesc(retrievedResume.getId());
        assertEquals(1, versions.size());
        assertEquals("Backup July 2026", versions.get(0).getVersionName());
    }
}
