import React from "react";
import { 
  Document, Page, View, Text, Link, StyleSheet 
} from "@react-pdf/renderer";

interface ResumePDFProps {
  data: any;
}

export default function ResumePDF({ data }: ResumePDFProps) {
  if (!data) return null;

  const font = data.font || "Helvetica";
  const fontSize = parseFloat(data.fontSize || "10pt");
  const lineSpacing = data.lineSpacing || 1.15;
  const margins = (data.margins || 1.0) * 28.34; // Convert inches to points (1 in = 72 pt, let's use 28.34 pt per cm, so 1.0 approx 36pt)
  const accentColor = data.accentColor || "#0b0b0bff";
  const showIcons = data.showIcons !== false;
  const templateId = data.templateId || "classic";

  // Create stylesheet dynamically based on customization settings
  const styles = StyleSheet.create({
    page: {
      padding: margins,
      fontFamily: font === "Times New Roman" ? "Times-Roman" : font === "Courier" ? "Courier" : "Helvetica",
      fontSize: fontSize,
      color: "#1f2937",
    },
    // Header
    headerContainer: {
      marginBottom: 15,
      textAlign: templateId === "classic" ? "center" : "left",
      borderBottom: templateId === "modern" ? `3px solid ${accentColor}` : "none",
      paddingBottom: templateId === "modern" ? 8 : 0,
    },
    name: {
      fontSize: fontSize * 2.0,
      fontWeight: "bold",
      color: templateId === "minimal" ? "#000" : accentColor,
      textTransform: "uppercase",
      letterSpacing: 1,
      lineHeight: 1.1,
    },
    title: {
      fontSize: fontSize * 1.15,
      color: "#4b5563",
      marginTop: 2,
      fontStyle: "italic",
      lineHeight: 1.2,
    },
    contactRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: templateId === "classic" ? "center" : "flex-start",
      gap: 8,
      marginTop: 6,
      fontSize: fontSize * 0.85,
      color: "#4b5563",
      lineHeight: 1.2,
    },
    contactItem: {
      marginRight: 6,
    },
    // Section Layouts
    section: {
      marginTop: 12,
    },
    sectionTitle: {
      fontSize: fontSize * 1.1,
      fontWeight: "bold",
      color: templateId === "minimal" ? "#1f2937" : accentColor,
      textTransform: "uppercase",
      borderBottom: templateId === "minimal" ? "none" : `1px solid ${accentColor}`,
      paddingBottom: 2,
      marginBottom: 6,
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },
    summaryText: {
      fontSize: fontSize,
      color: "#374151",
      textAlign: "justify",
      lineHeight: lineSpacing,
    },
    // List Items
    entry: {
      marginBottom: 8,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      fontWeight: "bold",
    },
    entryTitle: {
      fontWeight: "bold",
      color: "#111827",
    },
    entrySubtitle: {
      fontStyle: "italic",
      color: "#4b5563",
      fontSize: fontSize * 0.9,
      lineHeight: 1.2,
    },
    entryMeta: {
      color: "#6b7280",
      fontSize: fontSize * 0.9,
      textAlign: "right",
      lineHeight: 1.2,
    },
    bulletList: {
      marginTop: 3,
      paddingLeft: 10,
    },
    bulletItem: {
      flexDirection: "row",
      marginBottom: 2,
      alignItems: "flex-start",
    },
    bulletPoint: {
      width: 8,
      fontSize: fontSize,
      color: accentColor,
    },
    bulletText: {
      flex: 1,
      fontSize: fontSize * 0.95,
      color: "#374151",
      lineHeight: lineSpacing,
    },
    // Skills
    skillCategory: {
      marginBottom: 4,
      flexDirection: "row",
    },
    skillCategoryName: {
      fontWeight: "bold",
      color: "#1f2937",
      width: 100,
    },
    skillItems: {
      flex: 1,
      color: "#4b5563",
      lineHeight: lineSpacing,
    },
  });

  const details = data.personalDetails || {};
  const hasContactInfo = details.email || details.phone || details.linkedin || details.github || details.website;

  // Safe JSON Parsing for Bullet lists stored as serialized JSON strings
  const parseJsonArray = (jsonStr: string): string[] => {
    if (!jsonStr) return [];
    try {
      const parsed = JSON.parse(jsonStr);
      return Array.isArray(parsed) ? parsed : [jsonStr];
    } catch (e) {
      return [jsonStr];
    }
  };

  return (
    <Document>
      <Page size={data.paperSize === "Letter" ? "LETTER" : "A4"} style={styles.page}>
        {/* 1. Header (Personal Details) */}
        <View style={styles.headerContainer}>
          <Text style={styles.name}>
            {details.firstName || ""} {details.middleName ? details.middleName + " " : ""}{details.lastName || ""}
          </Text>
          {details.professionalTitle && (
            <Text style={styles.title}>{details.professionalTitle}</Text>
          )}
          
          {hasContactInfo && (
            <View style={styles.contactRow}>
              {details.email && <Text style={styles.contactItem}>{details.email}</Text>}
              {details.phone && <Text style={styles.contactItem}>|  {details.phone}</Text>}
              {details.city && (
                <Text style={styles.contactItem}>
                  |  {details.city}{details.state ? `, ${details.state}` : ""}{details.country ? `, ${details.country}` : ""}
                </Text>
              )}
              {details.linkedin && <Text style={styles.contactItem}>|  LinkedIn: {details.linkedin.replace(/^https?:\/\/(www\.)?/, "")}</Text>}
              {details.github && <Text style={styles.contactItem}>|  GitHub: {details.github.replace(/^https?:\/\/(www\.)?/, "")}</Text>}
              {details.portfolio && <Text style={styles.contactItem}>|  Portfolio: {details.portfolio.replace(/^https?:\/\/(www\.)?/, "")}</Text>}
            </View>
          )}
        </View>

        {/* Dynamic Section Ordering rendering */}
        {(data.sectionOrder || "personal,summary,experience,projects,education,skills,certifications")
          .split(",")
          .filter((sec: string) => sec !== "personal")
          .map((secId: string) => {
            switch (secId) {
              case "summary":
                const summaryText = data.summary !== undefined && data.summary !== null && data.summary !== ""
                  ? data.summary
                  : (data.targetJobRole ? `Experienced professional specializing in ${data.targetJobRole}. Proven track record of delivering clean architectures and modern solutions with high performance standards.` : "");
                return summaryText ? (
                  <View style={styles.section} key="summary">
                    <Text style={styles.sectionTitle}>Professional Summary</Text>
                    <Text style={styles.summaryText}>
                      {summaryText}
                    </Text>
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
                      <View key={exp.id || index} style={styles.entry}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>
                            {exp.jobTitle && exp.company 
                              ? `${exp.jobTitle} at ${exp.company}` 
                              : (exp.jobTitle || exp.company || "")}
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
                      <View key={proj.id || index} style={styles.entry}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>{proj.name || ""}</Text>
                          {proj.duration && <Text style={styles.entryMeta}>{proj.duration}</Text>}
                        </View>
                        {proj.techStack && (
                          <Text style={styles.entrySubtitle}>Tech Stack: {proj.techStack}</Text>
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
                      <View key={edu.id || index} style={styles.entry}>
                        <View style={styles.entryHeader}>
                          <Text style={styles.entryTitle}>
                            {edu.degree && edu.course 
                              ? `${edu.degree} in ${edu.course}` 
                              : (edu.degree || edu.course || "")}
                          </Text>
                          {(edu.startYear || edu.endYear) && (
                            <Text style={styles.entryMeta}>
                              {edu.startYear ? edu.startYear : ""} - {edu.endYear ? edu.endYear : ""}
                            </Text>
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
                    {validSkills.map((skill: any, index: number) => (
                      <View key={skill.id || index} style={styles.skillCategory}>
                        <Text style={styles.skillCategoryName}>{skill.category ? `${skill.category}:` : ""}</Text>
                        <Text style={styles.skillItems}>{skill.items || ""}</Text>
                      </View>
                    ))}
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

              default:
                return null;
            }
          })}
      </Page>
    </Document>
  );
}
