import React from "react";
import { Page, View, Text, StyleSheet, Image, Link } from "@react-pdf/renderer";

const formatContactLink = (type: "linkedin" | "github" | "portfolio", value: string): string => {
  if (!value) return "";
  const trimmed = value.trim();
  if (type === "linkedin") {
    if (/linkedin\.com/i.test(trimmed)) {
      return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    }
    return `https://linkedin.com/in/${trimmed}`;
  }
  if (type === "github") {
    if (/github\.com/i.test(trimmed)) {
      return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    }
    return `https://github.com/${trimmed}`;
  }
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
};

export interface TemplateProps {
  data: any;
  details: any;
  accentColor: string;
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  margins: number;
  hasContactInfo: boolean;
  parseJsonArray: (str: string) => string[];
  orderedSections: string[];
}

// 1. Executive Classic
export const ExecutiveClassicTemplate = ({ data, details, accentColor, fontFamily, fontSize, lineSpacing, margins, parseJsonArray, orderedSections }: TemplateProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: margins,
      fontFamily: fontFamily,
      fontSize: fontSize,
      color: "#1f2937",
      backgroundColor: "#ffffff",
    },
    headerContainer: {
      marginBottom: 10,
      textAlign: "center",
    },
    name: {
      fontSize: fontSize * 2.2,
      fontWeight: "bold",
      color: "#111827",
      textTransform: "uppercase",
      letterSpacing: 1,
      lineHeight: 1.1,
    },
    title: {
      fontSize: fontSize * 1.1,
      color: "#4b5563",
      marginTop: 3,
      fontStyle: "italic",
      lineHeight: 1.2,
    },
    contactRow: {
      marginTop: 6,
      fontSize: fontSize * 0.85,
      color: "#4b5563",
      lineHeight: 1.3,
      textAlign: "center",
    },
    divider: {
      borderBottomWidth: 1.5,
      borderBottomColor: "#374151",
      marginTop: 8,
      marginBottom: 12,
    },
    section: {
      marginTop: 10,
    },
    sectionHeader: {
      borderBottomWidth: 1,
      borderBottomColor: "#111827",
      paddingBottom: 2,
      marginBottom: 6,
      width: "100%",
    },
    sectionTitle: {
      fontSize: fontSize * 1.0,
      fontWeight: "bold",
      color: "#111827",
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    summaryText: {
      fontSize: fontSize * 0.95,
      color: "#374151",
      textAlign: "justify",
      lineHeight: lineSpacing,
    },
    entry: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    entryTitle: {
      fontWeight: "bold",
      fontSize: fontSize * 0.95,
      color: "#111827",
      flex: 1,
      marginRight: 10,
    },
    entryMeta: {
      fontSize: fontSize * 0.9,
      color: "#4b5563",
      fontStyle: "italic",
    },
    entrySubHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 3,
    },
    entryCompany: {
      fontSize: fontSize * 0.9,
      fontWeight: "bold",
      color: "#4b5563",
    },
    entryLocation: {
      fontSize: fontSize * 0.9,
      color: "#6b7280",
    },
    bulletList: {
      marginTop: 3,
      paddingLeft: 8,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    bulletPoint: {
      width: 8,
      fontSize: fontSize * 0.95,
      color: "#4b5563",
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize * 0.92,
      color: "#374151",
      lineHeight: lineSpacing,
    },
    skillsContainer: {
      flexDirection: "row",
    },
    skillsColumn: {
      flex: 1,
      paddingRight: 10,
    },
    skillRow: {
      marginBottom: 4,
    },
    skillCategory: {
      fontWeight: "bold",
      fontSize: fontSize * 0.9,
      color: "#1f2937",
    },
    skillItems: {
      fontSize: fontSize * 0.9,
      color: "#4b5563",
      lineHeight: lineSpacing,
    },
  });

  const contactItems = [];
  if (details.email) contactItems.push(<Text key="email">{details.email}</Text>);
  if (details.phone) contactItems.push(<Text key="phone">{details.phone}</Text>);
  if (details.city) {
    contactItems.push(
      <Text key="city">
        {details.city}{details.state ? `, ${details.state}` : ""}{details.country ? `, ${details.country}` : ""}
      </Text>
    );
  }
  if (details.linkedin) {
    contactItems.push(
      <Link key="linkedin" src={formatContactLink("linkedin", details.linkedin)} style={{ color: "#2563eb", textDecoration: "underline" }}>
        LinkedIn
      </Link>
    );
  }
  if (details.github) {
    contactItems.push(
      <Link key="github" src={formatContactLink("github", details.github)} style={{ color: "#2563eb", textDecoration: "underline" }}>
        GitHub
      </Link>
    );
  }
  if (details.portfolio) {
    contactItems.push(
      <Link key="portfolio" src={formatContactLink("portfolio", details.portfolio)} style={{ color: "#2563eb", textDecoration: "underline" }}>
        Portfolio
      </Link>
    );
  }

  const renderedContactRow = contactItems.reduce((acc: any[], item, index) => {
    if (index > 0) {
      acc.push(<Text key={`bullet-${index}`}>  •  </Text>);
    }
    acc.push(item);
    return acc;
  }, []);

  return (
    <Page size={data.paperSize === "Letter" ? "LETTER" : "A4"} style={styles.page}>
      <View style={styles.headerContainer}>
        {details.photoUrl && data.showPhoto !== false && (
          <View style={{ alignItems: "center", marginBottom: 6 }}>
            <Image src={details.photoUrl} style={{ width: 50, height: 50, borderRadius: 25 }} />
          </View>
        )}
        <Text style={styles.name}>
          {details.firstName || ""} {details.middleName ? details.middleName + " " : ""}{details.lastName || ""}
        </Text>
        {details.professionalTitle && (
          <Text style={styles.title}>{details.professionalTitle}</Text>
        )}
        {contactItems.length > 0 && (
          <Text style={styles.contactRow}>{renderedContactRow}</Text>
        )}
        <View style={styles.divider} />
      </View>

      {orderedSections.filter(sec => sec !== "personal").map((secId) => {
        switch (secId) {
          case "summary":
            const summaryText = data.summary !== undefined && data.summary !== null && data.summary !== ""
              ? data.summary
              : (data.targetJobRole ? `Experienced professional specializing in ${data.targetJobRole}. Proven track record of delivering clean architectures and modern solutions with high performance standards.` : "");
            return summaryText ? (
              <View style={styles.section} key="summary">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Professional Summary</Text>
                </View>
                <Text style={styles.summaryText}>{summaryText}</Text>
              </View>
            ) : null;

          case "experience":
            const validExperiences = (data.experiences || []).filter((e: any) => 
              e.jobTitle?.trim() || e.company?.trim() || e.location?.trim() || e.responsibilities?.trim()
            );
            return validExperiences.length > 0 ? (
              <View style={styles.section} key="experience">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Work Experience</Text>
                </View>
                {validExperiences.map((exp: any, index: number) => (
                  <View key={exp.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{exp.jobTitle || ""}</Text>
                      {(exp.startDate || exp.endDate) && (
                        <Text style={styles.entryMeta}>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""} -{" "}
                          {exp.isCurrentJob ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""}
                        </Text>
                      )}
                    </View>
                    <View style={styles.entrySubHeader}>
                      <Text style={styles.entryCompany}>{exp.company || ""}</Text>
                      {exp.location && (
                        <Text style={styles.entryLocation}>{exp.location} {exp.workMode ? `(${exp.workMode})` : ""}</Text>
                      )}
                    </View>
                    {exp.responsibilities && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(exp.responsibilities).map((resp, rIdx) => (
                          <View key={rIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{resp}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "projects":
            const validProjects = (data.projects || []).filter((p: any) => 
              p.name?.trim() || p.techStack?.trim() || p.detailedDescription?.trim()
            );
            return validProjects.length > 0 ? (
              <View style={styles.section} key="projects">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                </View>
                {validProjects.map((proj: any, index: number) => (
                  <View key={proj.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      {proj.liveDemoUrl ? (
                        <Link src={formatContactLink("portfolio", proj.liveDemoUrl)} style={[styles.entryTitle, { color: "#2563eb", textDecoration: "underline" }]}>
                          {proj.name || ""}
                        </Link>
                      ) : (
                        <Text style={styles.entryTitle}>{proj.name || ""}</Text>
                      )}
                      {proj.duration && <Text style={styles.entryMeta}>{proj.duration}</Text>}
                    </View>
                    {proj.techStack && (
                      <Text style={{ fontSize: fontSize * 0.9, fontStyle: "italic", color: "#4b5563", marginTop: 3, marginBottom: 2 }}>
                        Tech Stack: {proj.techStack}
                      </Text>
                    )}
                    {proj.githubUrl && (
                      <Text style={{ fontSize: fontSize * 0.9, fontStyle: "italic", color: "#4b5563", marginTop: 3, marginBottom: 2 }}>
                        GitHub: <Link src={formatContactLink("github", proj.githubUrl)} style={{ color: "#2563eb", textDecoration: "underline" }}>{proj.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, "")}</Link>
                      </Text>
                    )}
                    {proj.detailedDescription && (
                      <Text style={styles.summaryText}>{proj.detailedDescription}</Text>
                    )}
                    {proj.achievements && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(proj.achievements).map((ach, aIdx) => (
                          <View key={aIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{ach}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "education":
            const validEducations = (data.educations || []).filter((e: any) => 
              e.degree?.trim() || e.course?.trim() || e.college?.trim() || e.university?.trim()
            );
            return validEducations.length > 0 ? (
              <View style={styles.section} key="education">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Education</Text>
                </View>
                {validEducations.map((edu: any, index: number) => (
                  <View key={edu.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {edu.degree && edu.course ? `${edu.degree} in ${edu.course}` : (edu.degree || edu.course || "")}
                      </Text>
                      {(edu.startYear || edu.endYear) && (
                        <Text style={styles.entryMeta}>{edu.startYear} - {edu.endYear}</Text>
                      )}
                    </View>
                    <View style={styles.entrySubHeader}>
                      <Text style={styles.entryCompany}>{edu.college || edu.university || ""}{edu.city ? `, ${edu.city}` : ""}</Text>
                      {(edu.cgpa || edu.percentage) && (
                        <Text style={styles.entryLocation}>
                          {edu.cgpa ? `CGPA: ${edu.cgpa}` : `${edu.percentage}%`}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            ) : null;

          case "skills":
            const validSkills = (data.skills || []).filter((s: any) => 
              s.category?.trim() || s.items?.trim()
            );
            if (validSkills.length === 0) return null;
            const half = Math.ceil(validSkills.length / 2);
            const leftSkills = validSkills.slice(0, half);
            const rightSkills = validSkills.slice(half);
            return (
              <View style={styles.section} key="skills">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                </View>
                <View style={styles.skillsContainer}>
                  <View style={styles.skillsColumn}>
                    {leftSkills.map((skill: any, idx: number) => (
                      <View key={idx} style={styles.skillRow}>
                        <Text style={styles.skillCategory}>{skill.category ? `${skill.category}: ` : ""}</Text>
                        <Text style={styles.skillItems}>{skill.items || ""}</Text>
                      </View>
                    ))}
                  </View>
                  <View style={styles.skillsColumn}>
                    {rightSkills.map((skill: any, idx: number) => (
                      <View key={idx} style={styles.skillRow}>
                        <Text style={styles.skillCategory}>{skill.category ? `${skill.category}: ` : ""}</Text>
                        <Text style={styles.skillItems}>{skill.items || ""}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );

          case "certifications":
            const validCertifications = (data.certifications || []).filter((c: any) => 
              c.name?.trim() || c.issuer?.trim()
            );
            return validCertifications.length > 0 ? (
              <View style={styles.section} key="certifications">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                </View>
                {validCertifications.map((cert: any, index: number) => (
                  <View key={cert.id || index} style={{ marginBottom: 4 }}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{cert.name || ""}</Text>
                      {cert.issueDate && (
                        <Text style={styles.entryMeta}>
                          Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </Text>
                      )}
                    </View>
                    {cert.issuer && (
                      <Text style={{ fontSize: fontSize * 0.9, color: "#4b5563", fontStyle: "italic", marginTop: 3 }}>
                        Issuer: {cert.issuer}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "languages":
            const validLanguages = (data.languages || []).filter((l: any) => 
              l.name?.trim()
            );
            return validLanguages.length > 0 ? (
              <View style={styles.section} key="languages">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {validLanguages.map((lang: any, index: number) => (
                    <View key={lang.id || index} style={{ backgroundColor: "#e2e8f0", borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: fontSize * 0.8, color: "#1f2937", fontWeight: "bold" }}>
                        {lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          default:
            return null;
        }
      })}
    </Page>
  );
};

// 3. Elegant Minimal
export const ElegantMinimalTemplate = ({ data, details, fontSize, lineSpacing, margins, hasContactInfo, parseJsonArray, orderedSections }: TemplateProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: margins,
      fontFamily: "Helvetica",
      fontSize: fontSize,
      color: "#1f2937",
      backgroundColor: "#ffffff",
    },
    headerContainer: {
      marginBottom: 10,
      alignItems: "center",
    },
    name: {
      fontSize: fontSize * 2.2,
      fontFamily: "Times-Bold",
      color: "#111827",
      textTransform: "uppercase",
      letterSpacing: 1,
      textAlign: "center",
    },
    title: {
      fontSize: fontSize * 1.1,
      fontFamily: "Times-Italic",
      color: "#4b5563",
      marginTop: 2,
      textAlign: "center",
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 12,
      marginTop: 6,
      fontSize: fontSize * 0.85,
      color: "#6b7280",
      justifyContent: "center",
    },
    divider: {
      height: 0.5,
      backgroundColor: "#111827",
      marginTop: 8,
      marginBottom: 12,
    },
    section: {
      marginTop: 14,
    },
    sectionHeader: {
      borderBottomWidth: 1,
      borderBottomColor: "#111827",
      paddingBottom: 2,
      marginBottom: 6,
      width: "100%",
    },
    sectionTitle: {
      fontSize: fontSize * 1.05,
      fontFamily: "Times-Bold",
      color: "#111827",
      textTransform: "uppercase",
      letterSpacing: 1.2,
    },
    summaryText: {
      fontSize: fontSize * 0.95,
      color: "#374151",
      textAlign: "justify",
      lineHeight: lineSpacing,
    },
    entry: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    entryTitle: {
      fontFamily: "Times-Bold",
      fontSize: fontSize * 0.95,
      color: "#111827",
      flex: 1,
      marginRight: 10,
    },
    entryMeta: {
      fontSize: fontSize * 0.85,
      color: "#6b7280",
    },
    entrySubtitle: {
      fontStyle: "italic",
      color: "#4b5563",
      fontSize: fontSize * 0.85,
      marginTop: 3,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    bulletPoint: {
      width: 8,
      fontSize: fontSize * 0.95,
      color: "#9ca3af",
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize * 0.9,
      color: "#374151",
      lineHeight: lineSpacing,
    },
    skillsContainer: {
      flexDirection: "column",
      gap: 4,
    },
    skillRow: {
      flexDirection: "row",
    },
    skillCategory: {
      fontFamily: "Times-Bold",
      color: "#1f2937",
      marginRight: 4,
    },
    skillItems: {
      flex: 1,
      color: "#4b5563",
    },
  });

  return (
    <Page size={data.paperSize === "Letter" ? "LETTER" : "A4"} style={styles.page}>
      <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%" }}>
          {details.photoUrl && data.showPhoto !== false && (
            <Image src={details.photoUrl} style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }} />
          )}
          <View style={{ alignItems: "center" }}>
            <Text style={styles.name}>
              {details.firstName || ""} {details.middleName ? details.middleName + " " : ""}{details.lastName || ""}
            </Text>
            {details.professionalTitle && (
              <Text style={styles.title}>{details.professionalTitle}</Text>
            )}
          </View>
        </View>
        {hasContactInfo && (
          <View style={styles.contactRow}>
            {details.email && <Text>{details.email}</Text>}
            {details.phone && <Text>/  {details.phone}</Text>}
            {details.city && (
              <Text>
                /  {details.city}{details.state ? `, ${details.state}` : ""}{details.country ? `, ${details.country}` : ""}
              </Text>
            )}
            {details.linkedin && (
              <Text>
                /  <Link src={formatContactLink("linkedin", details.linkedin)} style={{ color: "#2563eb", textDecoration: "underline" }}>LinkedIn</Link>
              </Text>
            )}
            {details.github && (
              <Text>
                /  <Link src={formatContactLink("github", details.github)} style={{ color: "#2563eb", textDecoration: "underline" }}>GitHub</Link>
              </Text>
            )}
            {details.portfolio && (
              <Text>
                /  <Link src={formatContactLink("portfolio", details.portfolio)} style={{ color: "#2563eb", textDecoration: "underline" }}>Portfolio</Link>
              </Text>
            )}
          </View>
        )}
        <View style={styles.divider} />
      </View>

      {orderedSections.filter(sec => sec !== "personal").map((secId) => {
        switch (secId) {
          case "summary":
            const summaryText = data.summary !== undefined && data.summary !== null && data.summary !== ""
              ? data.summary
              : (data.targetJobRole ? `Experienced professional specializing in ${data.targetJobRole}. Proven track record of delivering clean architectures and modern solutions with high performance standards.` : "");
            return summaryText ? (
              <View style={styles.section} key="summary">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Professional Summary</Text>
                </View>
                <Text style={styles.summaryText}>{summaryText}</Text>
              </View>
            ) : null;

          case "experience":
            const validExperiences = (data.experiences || []).filter((e: any) => 
              e.jobTitle?.trim() || e.company?.trim() || e.location?.trim() || e.responsibilities?.trim()
            );
            return validExperiences.length > 0 ? (
              <View style={styles.section} key="experience">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Work Experience</Text>
                </View>
                {validExperiences.map((exp: any, index: number) => (
                  <View key={exp.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {exp.jobTitle && exp.company ? `${exp.jobTitle} at ${exp.company}` : (exp.jobTitle || exp.company || "")}
                      </Text>
                      {(exp.startDate || exp.endDate) && (
                        <Text style={styles.entryMeta}>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""} -{" "}
                          {exp.isCurrentJob ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""}
                        </Text>
                      )}
                    </View>
                    {exp.location && (
                      <Text style={styles.entrySubtitle}>{exp.location} {exp.workMode ? `(${exp.workMode})` : ""}</Text>
                    )}
                    {exp.responsibilities && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(exp.responsibilities).map((resp, rIdx) => (
                          <View key={rIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>-</Text>
                            <Text style={styles.bulletText}>{resp}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "projects":
            const validProjects = (data.projects || []).filter((p: any) => 
              p.name?.trim() || p.techStack?.trim() || p.detailedDescription?.trim()
            );
            return validProjects.length > 0 ? (
              <View style={styles.section} key="projects">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Projects</Text>
                </View>
                {validProjects.map((proj: any, index: number) => (
                  <View key={proj.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      {proj.liveDemoUrl ? (
                        <Link src={formatContactLink("portfolio", proj.liveDemoUrl)} style={[styles.entryTitle, { color: "#2563eb", textDecoration: "underline" }]}>
                          {proj.name || ""}
                        </Link>
                      ) : (
                        <Text style={styles.entryTitle}>{proj.name || ""}</Text>
                      )}
                      {proj.duration && <Text style={styles.entryMeta}>{proj.duration}</Text>}
                    </View>
                    {proj.techStack && (
                      <Text style={styles.entrySubtitle}>Tech Stack: {proj.techStack}</Text>
                    )}
                    {proj.githubUrl && (
                      <Text style={styles.entrySubtitle}>
                        GitHub: <Link src={formatContactLink("github", proj.githubUrl)} style={{ color: "#2563eb", textDecoration: "underline" }}>{proj.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, "")}</Link>
                      </Text>
                    )}
                    {proj.detailedDescription && (
                      <Text style={[styles.summaryText, { marginTop: 3 }]}>{proj.detailedDescription}</Text>
                    )}
                    {proj.achievements && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(proj.achievements).map((ach, aIdx) => (
                          <View key={aIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>-</Text>
                            <Text style={styles.bulletText}>{ach}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "education":
            const validEducations = (data.educations || []).filter((e: any) => 
              e.degree?.trim() || e.course?.trim() || e.college?.trim() || e.university?.trim()
            );
            return validEducations.length > 0 ? (
              <View style={styles.section} key="education">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Education</Text>
                </View>
                {validEducations.map((edu: any, index: number) => (
                  <View key={edu.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {edu.degree && edu.course ? `${edu.degree} in ${edu.course}` : (edu.degree || edu.course || "")}
                      </Text>
                      {(edu.startYear || edu.endYear) && (
                        <Text style={styles.entryMeta}>{edu.startYear} - {edu.endYear}</Text>
                      )}
                    </View>
                    <Text style={styles.entrySubtitle}>
                      {edu.college || edu.university || ""}{edu.city ? `, ${edu.city}` : ""}
                      {edu.cgpa ? ` (CGPA: ${edu.cgpa})` : edu.percentage ? ` (${edu.percentage}%)` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null;

          case "skills":
            const validSkills = (data.skills || []).filter((s: any) => 
              s.category?.trim() || s.items?.trim()
            );
            return validSkills.length > 0 ? (
              <View style={styles.section} key="skills">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Skills</Text>
                </View>
                <View style={styles.skillsContainer}>
                  {validSkills.map((skill: any, index: number) => (
                    <View key={index} style={styles.skillRow}>
                      <Text style={styles.skillCategory}>{skill.category ? `${skill.category}:` : ""}</Text>
                      <Text style={styles.skillItems}>{skill.items || ""}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          case "certifications":
            const validCertifications = (data.certifications || []).filter((c: any) => 
              c.name?.trim() || c.issuer?.trim()
            );
            return validCertifications.length > 0 ? (
              <View style={styles.section} key="certifications">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Certifications</Text>
                </View>
                {validCertifications.map((cert: any, index: number) => (
                  <View key={cert.id || index} style={{ marginBottom: 4 }}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{cert.name || ""}</Text>
                      {cert.issueDate && (
                        <Text style={styles.entryMeta}>
                          Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </Text>
                      )}
                    </View>
                    {cert.issuer && <Text style={styles.entrySubtitle}>Issuer: {cert.issuer}</Text>}
                  </View>
                ))}
              </View>
            ) : null;

          case "languages":
            const validLanguages = (data.languages || []).filter((l: any) => 
              l.name?.trim()
            );
            return validLanguages.length > 0 ? (
              <View style={styles.section} key="languages">
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Languages</Text>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {validLanguages.map((lang: any, index: number) => (
                    <View key={lang.id || index} style={{ backgroundColor: "#e2e8f0", borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: fontSize * 0.8, color: "#1f2937", fontWeight: "bold" }}>
                        {lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          default:
            return null;
        }
      })}
    </Page>
  );
};

// 4. Neo Gradient
export const NeoGradientTemplate = ({ data, details, accentColor, fontFamily, fontSize, lineSpacing, parseJsonArray, orderedSections }: TemplateProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: 30,
      fontFamily: fontFamily,
      fontSize: fontSize,
      color: "#334155",
      backgroundColor: "#ffffff",
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      gap: 15,
    },
    photo: {
      width: 65,
      height: 75,
      objectFit: "cover",
      borderWidth: 1,
      borderColor: "#cbd5e1",
    },
    headerRight: {
      flex: 1,
    },
    name: {
      fontSize: fontSize * 2.1,
      fontWeight: "bold",
      color: "#0f172a",
      textTransform: "uppercase",
      marginBottom: 3,
    },
    title: {
      fontSize: fontSize * 1.1,
      fontWeight: "bold",
      color: accentColor,
      marginTop: 2,
    },
    contactGrid: {
      backgroundColor: "#f8fafc",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 4,
      padding: 6,
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 6,
    },
    contactGridItem: {
      width: "50%",
      fontSize: fontSize * 0.82,
      color: "#334155",
      marginBottom: 2,
      flexDirection: "row",
    },
    contactLabel: {
      fontWeight: "bold",
      width: 55,
      color: "#475569",
    },
    contactValue: {
      flex: 1,
      color: "#334155",
    },
    section: {
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: fontSize * 1.05,
      fontWeight: "bold",
      color: accentColor,
      textTransform: "uppercase",
      letterSpacing: 0.5,
      borderBottomWidth: 1.5,
      borderBottomColor: accentColor,
      paddingBottom: 2,
      marginTop: 12,
      marginBottom: 8,
    },
    summaryText: {
      fontSize: fontSize * 0.95,
      color: "#334155",
      textAlign: "justify",
      lineHeight: lineSpacing,
    },
    card: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    entryTitle: {
      fontWeight: "bold",
      fontSize: fontSize * 0.92,
      color: "#0f172a",
      flex: 1,
      marginRight: 10,
    },
    entryMeta: {
      fontSize: fontSize * 0.85,
      color: "#64748b",
    },
    entrySubtitle: {
      fontStyle: "italic",
      color: "#475569",
      fontSize: fontSize * 0.85,
      marginTop: 3,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    bulletPoint: {
      width: 8,
      fontSize: fontSize * 0.95,
      color: accentColor,
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize * 0.9,
      color: "#334155",
      lineHeight: lineSpacing,
    },
  });

  return (
    <Page size={data.paperSize === "Letter" ? "LETTER" : "A4"} style={styles.page}>
      <View style={styles.headerContainer}>
        {details.photoUrl && data.showPhoto !== false ? (
          <Image src={details.photoUrl} style={styles.photo} />
        ) : null}
        <View style={styles.headerRight}>
          <Text style={styles.name}>
            {details.firstName || ""} {details.middleName ? details.middleName + " " : ""}{details.lastName || ""}
          </Text>
          {details.professionalTitle && (
            <Text style={styles.title}>{details.professionalTitle}</Text>
          )}
          
          <View style={styles.contactGrid}>
            {details.city && (
              <View style={styles.contactGridItem}>
                <Text style={styles.contactLabel}>Address:</Text>
                <Text style={styles.contactValue}>
                  {details.city}{details.state ? `, ${details.state}` : ""}{details.country ? `, ${details.country}` : ""}
                </Text>
              </View>
            )}
            {details.phone && (
              <View style={styles.contactGridItem}>
                <Text style={styles.contactLabel}>Phone:</Text>
                <Text style={styles.contactValue}>{details.phone}</Text>
              </View>
            )}
            {details.email && (
              <View style={styles.contactGridItem}>
                <Text style={styles.contactLabel}>Email:</Text>
                <Text style={styles.contactValue}>{details.email}</Text>
              </View>
            )}
            {details.portfolio && (
              <View style={styles.contactGridItem}>
                <Text style={styles.contactLabel}>Website:</Text>
                <Text style={styles.contactValue}>
                  <Link src={formatContactLink("portfolio", details.portfolio)} style={{ color: "#2563eb", textDecoration: "underline" }}>Portfolio</Link>
                </Text>
              </View>
            )}
            {details.linkedin && (
              <View style={styles.contactGridItem}>
                <Text style={styles.contactLabel}>LinkedIn:</Text>
                <Text style={styles.contactValue}>
                  <Link src={formatContactLink("linkedin", details.linkedin)} style={{ color: "#2563eb", textDecoration: "underline" }}>LinkedIn</Link>
                </Text>
              </View>
            )}
            {details.github && (
              <View style={styles.contactGridItem}>
                <Text style={styles.contactLabel}>GitHub:</Text>
                <Text style={styles.contactValue}>
                  <Link src={formatContactLink("github", details.github)} style={{ color: "#2563eb", textDecoration: "underline" }}>GitHub</Link>
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {orderedSections.filter(sec => sec !== "personal").map((secId) => {
        switch (secId) {
          case "summary":
            const summaryText = data.summary !== undefined && data.summary !== null && data.summary !== ""
              ? data.summary
              : (data.targetJobRole ? `Experienced professional specializing in ${data.targetJobRole}. Proven track record of delivering clean architectures and modern solutions with high performance standards.` : "");
            return summaryText ? (
              <View style={styles.section} key="summary">
                <Text style={styles.sectionTitle}>Summary</Text>
                <Text style={styles.summaryText}>{summaryText}</Text>
              </View>
            ) : null;

          case "experience":
            const validExperiences = (data.experiences || []).filter((e: any) => 
              e.jobTitle?.trim() || e.company?.trim() || e.location?.trim() || e.responsibilities?.trim()
            );
            return validExperiences.length > 0 ? (
              <View style={styles.section} key="experience">
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {validExperiences.map((exp: any, index: number) => (
                  <View key={exp.id || index} style={styles.card}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {exp.jobTitle && exp.company ? `${exp.jobTitle}, ${exp.company}` : (exp.jobTitle || exp.company || "")}
                      </Text>
                      {(exp.startDate || exp.endDate) && (
                        <Text style={styles.entryMeta}>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""} -{" "}
                          {exp.isCurrentJob ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""}
                        </Text>
                      )}
                    </View>
                    {exp.location && (
                      <Text style={styles.entrySubtitle}>{exp.location} {exp.workMode ? `(${exp.workMode})` : ""}</Text>
                    )}
                    {exp.responsibilities && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(exp.responsibilities).map((resp, rIdx) => (
                          <View key={rIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{resp}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "projects":
            const validProjects = (data.projects || []).filter((p: any) => 
              p.name?.trim() || p.techStack?.trim() || p.detailedDescription?.trim()
            );
            return validProjects.length > 0 ? (
              <View style={styles.section} key="projects">
                <Text style={styles.sectionTitle}>Projects</Text>
                {validProjects.map((proj: any, index: number) => (
                  <View key={proj.id || index} style={styles.card}>
                    <View style={styles.entryHeader}>
                      {proj.liveDemoUrl ? (
                        <Link src={formatContactLink("portfolio", proj.liveDemoUrl)} style={[styles.entryTitle, { color: "#2563eb", textDecoration: "underline" }]}>
                          {proj.name || ""}
                        </Link>
                      ) : (
                        <Text style={styles.entryTitle}>{proj.name || ""}</Text>
                      )}
                      {proj.duration && <Text style={styles.entryMeta}>{proj.duration}</Text>}
                    </View>
                    {proj.techStack && (
                      <Text style={styles.entrySubtitle}>Tech Stack: {proj.techStack}</Text>
                    )}
                    {proj.githubUrl && (
                      <Text style={styles.entrySubtitle}>
                        GitHub: <Link src={formatContactLink("github", proj.githubUrl)} style={{ color: "#2563eb", textDecoration: "underline" }}>{proj.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, "")}</Link>
                      </Text>
                    )}
                    {proj.detailedDescription && (
                      <Text style={[styles.summaryText, { marginTop: 3 }]}>{proj.detailedDescription}</Text>
                    )}
                    {proj.achievements && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(proj.achievements).map((ach, aIdx) => (
                          <View key={aIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{ach}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "education":
            const validEducations = (data.educations || []).filter((e: any) => 
              e.degree?.trim() || e.course?.trim() || e.college?.trim() || e.university?.trim()
            );
            return validEducations.length > 0 ? (
              <View style={styles.section} key="education">
                <Text style={styles.sectionTitle}>Education</Text>
                {validEducations.map((edu: any, index: number) => (
                  <View key={edu.id || index} style={styles.card}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {edu.degree && edu.course ? `${edu.degree} in ${edu.course}` : (edu.degree || edu.course || "")}
                      </Text>
                      {(edu.startYear || edu.endYear) && (
                        <Text style={styles.entryMeta}>{edu.startYear} - {edu.endYear}</Text>
                      )}
                    </View>
                    <Text style={styles.entrySubtitle}>
                      {edu.college || edu.university || ""}{edu.city ? `, ${edu.city}` : ""}
                      {edu.cgpa ? ` (CGPA: ${edu.cgpa})` : edu.percentage ? ` (${edu.percentage}%)` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null;

          case "skills":
            const validSkills = (data.skills || []).filter((s: any) => 
              s.category?.trim() || s.items?.trim()
            );
            return validSkills.length > 0 ? (
              <View style={styles.section} key="skills">
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={{ gap: 4 }}>
                  {validSkills.map((skill: any, index: number) => (
                    <View key={index} style={{ flexDirection: "row" }}>
                      <Text style={{ fontWeight: "bold", color: "#1e293b", marginRight: 4 }}>{skill.category ? `${skill.category}:` : ""}</Text>
                      <Text style={{ flex: 1, color: "#475569" }}>{skill.items || ""}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          case "certifications":
            const validCertifications = (data.certifications || []).filter((c: any) => 
              c.name?.trim() || c.issuer?.trim()
            );
            return validCertifications.length > 0 ? (
              <View style={styles.section} key="certifications">
                <Text style={styles.sectionTitle}>Certifications</Text>
                {validCertifications.map((cert: any, index: number) => (
                  <View key={cert.id || index} style={{ marginBottom: 4 }}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{cert.name || ""}</Text>
                      {cert.issueDate && (
                        <Text style={styles.entryMeta}>
                          Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </Text>
                      )}
                    </View>
                    {cert.issuer && <Text style={styles.entrySubtitle}>Issuer: {cert.issuer}</Text>}
                  </View>
                ))}
              </View>
            ) : null;

          case "languages":
            const validLanguages = (data.languages || []).filter((l: any) => 
              l.name?.trim()
            );
            return validLanguages.length > 0 ? (
              <View style={styles.section} key="languages">
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {validLanguages.map((lang: any, index: number) => (
                    <View key={lang.id || index} style={{ backgroundColor: "#e2e8f0", borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: fontSize * 0.8, color: "#1f2937", fontWeight: "bold" }}>
                        {lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          default:
            return null;
        }
      })}
    </Page>
  );
};

// 5. Professional Timeline
export const ProfessionalTimelineTemplate = ({ data, details, accentColor, fontFamily, fontSize, lineSpacing, margins, hasContactInfo, parseJsonArray, orderedSections }: TemplateProps) => {
  const styles = StyleSheet.create({
    page: {
      padding: margins,
      fontFamily: "Times-Roman",
      fontSize: fontSize,
      color: "#111827",
      backgroundColor: "#ffffff",
    },
    headerContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 10,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      alignItems: "flex-end",
    },
    name: {
      fontSize: fontSize * 2.2,
      fontFamily: "Times-Bold",
      color: accentColor,
    },
    contactItem: {
      fontSize: fontSize * 0.85,
      color: "#374151",
      marginTop: 2,
    },
    section: {
      marginTop: 10,
    },
    sectionTitle: {
      fontSize: fontSize * 1.05,
      fontFamily: "Times-Bold",
      color: "#111827",
      textTransform: "uppercase",
      marginTop: 8,
    },
    sectionLine: {
      borderBottomWidth: 1,
      borderBottomColor: "#111827",
      marginTop: 2,
      marginBottom: 8,
    },
    summaryText: {
      fontSize: fontSize * 0.95,
      color: "#374151",
      textAlign: "justify",
      lineHeight: lineSpacing,
    },
    entry: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    entryTitle: {
      fontFamily: "Times-Bold",
      fontSize: fontSize * 0.95,
      color: "#111827",
      flex: 1,
      marginRight: 10,
    },
    entryMeta: {
      fontSize: fontSize * 0.85,
      color: "#374151",
    },
    entrySubtitle: {
      fontStyle: "italic",
      color: "#4b5563",
      fontSize: fontSize * 0.85,
      marginTop: 3,
    },
    bulletList: {
      marginTop: 2,
      paddingLeft: 8,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    bulletPoint: {
      width: 8,
      fontSize: fontSize * 0.95,
      color: "#111827",
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize * 0.9,
      color: "#374151",
      lineHeight: lineSpacing,
    },
  });

  return (
    <Page size={data.paperSize === "Letter" ? "LETTER" : "A4"} style={styles.page}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.name}>
            {details.firstName || ""} {details.middleName ? details.middleName + " " : ""}{details.lastName || ""}
          </Text>
          {details.professionalTitle && (
            <Text style={[styles.contactItem, { fontStyle: "italic" }]}>{details.professionalTitle}</Text>
          )}
          {details.linkedin && (
            <Text style={styles.contactItem}>
              LinkedIn: <Link src={formatContactLink("linkedin", details.linkedin)} style={{ color: "#2563eb", textDecoration: "underline" }}>LinkedIn</Link>
            </Text>
          )}
          {details.github && (
            <Text style={styles.contactItem}>
              GitHub: <Link src={formatContactLink("github", details.github)} style={{ color: "#2563eb", textDecoration: "underline" }}>GitHub</Link>
            </Text>
          )}
        </View>
        <View style={styles.headerRight}>
          {details.email && <Text style={styles.contactItem}>Email: {details.email}</Text>}
          {details.phone && <Text style={styles.contactItem}>Mobile: {details.phone}</Text>}
          {details.city && (
            <Text style={styles.contactItem}>
              Address: {details.city}{details.state ? `, ${details.state}` : ""}{details.country ? `, ${details.country}` : ""}
            </Text>
          )}
          {details.portfolio && (
            <Text style={styles.contactItem}>
              Portfolio: <Link src={formatContactLink("portfolio", details.portfolio)} style={{ color: "#2563eb", textDecoration: "underline" }}>Portfolio</Link>
            </Text>
          )}
        </View>
      </View>

      {orderedSections.filter(sec => sec !== "personal").map((secId) => {
        switch (secId) {
          case "summary":
            const summaryText = data.summary !== undefined && data.summary !== null && data.summary !== ""
              ? data.summary
              : (data.targetJobRole ? `Experienced professional specializing in ${data.targetJobRole}. Proven track record of delivering clean architectures and modern solutions with high performance standards.` : "");
            return summaryText ? (
              <View style={styles.section} key="summary">
                <Text style={styles.sectionTitle}>Summary</Text>
                <View style={styles.sectionLine} />
                <Text style={styles.summaryText}>{summaryText}</Text>
              </View>
            ) : null;

          case "experience":
            const validExperiences = (data.experiences || []).filter((e: any) => 
              e.jobTitle?.trim() || e.company?.trim() || e.location?.trim() || e.responsibilities?.trim()
            );
            return validExperiences.length > 0 ? (
              <View style={styles.section} key="experience">
                <Text style={styles.sectionTitle}>Experience</Text>
                <View style={styles.sectionLine} />
                {validExperiences.map((exp: any, index: number) => (
                  <View key={exp.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {exp.jobTitle || ""}{exp.company ? ` - ${exp.company}` : ""}
                      </Text>
                      {(exp.startDate || exp.endDate) && (
                        <Text style={styles.entryMeta}>
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""} -{" "}
                          {exp.isCurrentJob ? "Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : ""}
                        </Text>
                      )}
                    </View>
                    {exp.location && (
                      <Text style={styles.entrySubtitle}>{exp.location} {exp.workMode ? `(${exp.workMode})` : ""}</Text>
                    )}
                    {exp.responsibilities && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(exp.responsibilities).map((resp, rIdx) => (
                          <View key={rIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{resp}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "projects":
            const validProjects = (data.projects || []).filter((p: any) => 
              p.name?.trim() || p.techStack?.trim() || p.detailedDescription?.trim()
            );
            return validProjects.length > 0 ? (
              <View style={styles.section} key="projects">
                <Text style={styles.sectionTitle}>Projects</Text>
                <View style={styles.sectionLine} />
                {validProjects.map((proj: any, index: number) => (
                  <View key={proj.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      {proj.liveDemoUrl ? (
                        <Link src={formatContactLink("portfolio", proj.liveDemoUrl)} style={[styles.entryTitle, { color: "#2563eb", textDecoration: "underline" }]}>
                          {proj.name || ""}
                        </Link>
                      ) : (
                        <Text style={styles.entryTitle}>{proj.name || ""}</Text>
                      )}
                      {proj.duration && <Text style={styles.entryMeta}>{proj.duration}</Text>}
                    </View>
                    {proj.techStack && (
                      <Text style={styles.entrySubtitle}>Tech Stack: {proj.techStack}</Text>
                    )}
                    {proj.githubUrl && (
                      <Text style={styles.entrySubtitle}>
                        GitHub: <Link src={formatContactLink("github", proj.githubUrl)} style={{ color: "#2563eb", textDecoration: "underline" }}>{proj.githubUrl.replace(/^https?:\/\/(www\.)?github\.com\//i, "")}</Link>
                      </Text>
                    )}
                    {proj.detailedDescription && (
                      <Text style={[styles.summaryText, { marginTop: 3 }]}>{proj.detailedDescription}</Text>
                    )}
                    {proj.achievements && (
                      <View style={styles.bulletList}>
                        {parseJsonArray(proj.achievements).map((ach, aIdx) => (
                          <View key={aIdx} style={styles.bulletItem}>
                            <Text style={styles.bulletPoint}>•</Text>
                            <Text style={styles.bulletText}>{ach}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : null;

          case "education":
            const validEducations = (data.educations || []).filter((e: any) => 
              e.degree?.trim() || e.course?.trim() || e.college?.trim() || e.university?.trim()
            );
            return validEducations.length > 0 ? (
              <View style={styles.section} key="education">
                <Text style={styles.sectionTitle}>Education</Text>
                <View style={styles.sectionLine} />
                {validEducations.map((edu: any, index: number) => (
                  <View key={edu.id || index} style={styles.entry}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>
                        {edu.degree && edu.course ? `${edu.degree} in ${edu.course}` : (edu.degree || edu.course || "")}
                      </Text>
                      {(edu.startYear || edu.endYear) && (
                        <Text style={styles.entryMeta}>{edu.startYear} - {edu.endYear}</Text>
                      )}
                    </View>
                    <Text style={styles.entrySubtitle}>
                      {edu.college || edu.university || ""}{edu.city ? `, ${edu.city}` : ""}
                      {edu.cgpa ? ` (CGPA: ${edu.cgpa})` : edu.percentage ? ` (${edu.percentage}%)` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null;

          case "skills":
            const validSkills = (data.skills || []).filter((s: any) => 
              s.category?.trim() || s.items?.trim()
            );
            return validSkills.length > 0 ? (
              <View style={styles.section} key="skills">
                <Text style={styles.sectionTitle}>Skills Summary</Text>
                <View style={styles.sectionLine} />
                <View style={{ gap: 4 }}>
                  {validSkills.map((skill: any, index: number) => (
                    <View key={index} style={{ flexDirection: "row", marginBottom: 3 }}>
                      <Text style={{ fontFamily: "Times-Bold", marginRight: 4, width: 110 }}>• {skill.category || ""}:</Text>
                      <Text style={{ flex: 1, color: "#374151" }}>{skill.items || ""}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          case "certifications":
            const validCertifications = (data.certifications || []).filter((c: any) => 
              c.name?.trim() || c.issuer?.trim()
            );
            return validCertifications.length > 0 ? (
              <View style={styles.section} key="certifications">
                <Text style={styles.sectionTitle}>Certifications</Text>
                <View style={styles.sectionLine} />
                {validCertifications.map((cert: any, index: number) => (
                  <View key={cert.id || index} style={{ marginBottom: 4 }}>
                    <View style={styles.entryHeader}>
                      <Text style={styles.entryTitle}>{cert.name || ""}</Text>
                      {cert.issueDate && (
                        <Text style={styles.entryMeta}>
                          Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                        </Text>
                      )}
                    </View>
                    {cert.issuer && <Text style={styles.entrySubtitle}>Issuer: {cert.issuer}</Text>}
                  </View>
                ))}
              </View>
            ) : null;

          case "languages":
            const validLanguages = (data.languages || []).filter((l: any) => 
              l.name?.trim()
            );
            return validLanguages.length > 0 ? (
              <View style={styles.section} key="languages">
                <Text style={styles.sectionTitle}>Languages</Text>
                <View style={styles.sectionLine} />
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
                  {validLanguages.map((lang: any, index: number) => (
                    <View key={lang.id || index} style={{ backgroundColor: "#e2e8f0", borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text style={{ fontSize: fontSize * 0.8, color: "#1f2937", fontWeight: "bold" }}>
                        {lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : null;

          default:
            return null;
        }
      })}
    </Page>
  );
};
