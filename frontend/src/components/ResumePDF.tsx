import React from "react";
import { 
  Document, Page, View, Text, Link, StyleSheet, Image 
} from "@react-pdf/renderer";
import {
  ExecutiveClassicTemplate,
  ElegantMinimalTemplate,
  NeoGradientTemplate,
  ProfessionalTimelineTemplate
} from "./PremiumTemplates";

interface ResumePDFProps {
  data: any;
}

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

export default function ResumePDF({ data }: ResumePDFProps) {
  if (!data) return null;

  const font = data.font || "Helvetica";
  const fontSize = parseFloat(data.fontSize || "10pt");
  const lineSpacing = data.lineSpacing || 1.15;
  const margins = (data.margins || 1.0) * 28.34; // Convert inches to points (1 in = 72 pt, let's use 28.34 pt per cm, so 1.0 approx 36pt)
  const accentColor = (data.accentColor === "#4f46e5" || !data.accentColor) ? "#000000" : data.accentColor;
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
      flex: 1,
      marginRight: 10,
    },
    entrySubtitle: {
      fontStyle: "italic",
      color: "#4b5563",
      fontSize: fontSize * 0.9,
      lineHeight: 1.2,
      marginTop: 3,
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
      marginRight: 4,
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
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => String(item).trim()).filter(item => item !== "");
      }
      return [jsonStr.trim()].filter(item => item !== "");
    } catch (e) {
      return [jsonStr.trim()].filter(item => item !== "");
    }
  };

  const isPremiumTemplate = [
    "executive-classic",
    "modern-corporate",
    "elegant-minimal",
    "neo-gradient",
    "professional-timeline",
    "premium-blocks",
  ].includes(templateId);

  const getOrderedSections = (orderStr: string | undefined): string[] => {
    const defaultOrder = ["personal", "summary", "experience", "projects", "education", "skills", "certifications", "languages"];
    if (!orderStr) return defaultOrder;
    const list = orderStr.split(",");
    if (!list.includes("languages")) {
      list.push("languages");
    }
    return list;
  };

  const templateProps = {
    data,
    details,
    accentColor,
    fontFamily: font === "Times New Roman" ? "Times-Roman" : font === "Courier" ? "Courier" : "Helvetica",
    fontSize,
    lineSpacing,
    margins,
    hasContactInfo,
    parseJsonArray,
    orderedSections: getOrderedSections(data.sectionOrder)
  };

  return (
    <Document>
      {templateId === "executive-classic" && <ExecutiveClassicTemplate {...templateProps} />}
      {templateId === "elegant-minimal" && <ElegantMinimalTemplate {...templateProps} />}
      {templateId === "neo-gradient" && <NeoGradientTemplate {...templateProps} />}
      {(templateId === "professional-timeline" || !["executive-classic", "elegant-minimal", "neo-gradient"].includes(templateId)) && <ProfessionalTimelineTemplate {...templateProps} />}
    </Document>
  );
}
