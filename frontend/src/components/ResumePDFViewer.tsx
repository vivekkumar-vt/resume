"use client";

import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import ResumePDF from "./ResumePDF";

interface ResumePDFViewerProps {
  data: any;
}

export default function ResumePDFViewer({ data }: ResumePDFViewerProps) {
  return (
    <PDFViewer style={{ width: "100%", height: "100%", border: "none" }} showToolbar={false}>
      <ResumePDF data={data} />
    </PDFViewer>
  );
}
