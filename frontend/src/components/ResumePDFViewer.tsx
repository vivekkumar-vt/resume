"use client";

import React, { memo } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";

interface ResumePDFViewerProps {
  data: any;
}

const ResumePDFViewer = memo(
  function ResumePDFViewer({ data }: ResumePDFViewerProps) {
    return (
      <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar={false}>
        <ResumePDF data={data} />
      </PDFViewer>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the resume data has actually changed
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
  }
);

export default ResumePDFViewer;
