export interface InspectionResult {
  template: {
    filename: string;
    fields: string[];
  };

  excel: {
    filename: string;
    columns: string[];
    row_count: number;
    rows: Record<string, string>[];
  };

  validation: {
    missing_fields: string[];
    extra_columns: string[];
    ready: boolean;
  };

  settings: {
    pdf_enabled: boolean;
  };
}

// ============================================================
// API URL
// ============================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://autogen-backend-api.onrender.com";

// ============================================================
// INSPECT FILES
// ============================================================

export async function inspectFiles(
  template: File,
  excel: File,
): Promise<InspectionResult> {
  const formData = new FormData();

  formData.append("template", template);
  formData.append("excel", excel);

  const response = await fetch(`${API_URL}/inspect`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = "Could not inspect files.";

    try {
      const error = JSON.parse(responseText);
      message = error.detail || message;
    } catch {
      if (responseText) message = responseText;
    }

    throw new Error(message);
  }

  return response.json();
}

// ============================================================
// GENERATE DOCUMENTS - DIRECT ZIP DOWNLOAD
// ============================================================

export async function generateDocuments(
  template: File,
  rows: Record<string, string>[],
  generatePdf: boolean,
): Promise<Blob> {
  const formData = new FormData();

  formData.append("template", template);
  formData.append("data_json", JSON.stringify(rows));
  formData.append("generate_pdf", String(generatePdf));

  // The backend processes the request and responds with a ZIP file.
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = "Could not generate documents.";

    try {
      const error = JSON.parse(responseText);
      message = error.detail || message;
    } catch {
      if (responseText) message = responseText;
    }

    throw new Error(message);
  }

  // Do not call response.json(): the successful response is a ZIP binary.
  return response.blob();
}
