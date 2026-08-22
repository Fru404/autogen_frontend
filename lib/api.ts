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

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://autogen-backend-api.onrender.com";


export async function inspectFiles(
  template: File,
  excel: File
): Promise<InspectionResult> {

  const formData = new FormData();

  formData.append(
    "template",
    template
  );

  formData.append(
    "excel",
    excel
  );

  const response = await fetch(
    `${API_URL}/inspect`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {

    let message =
      "Could not inspect files.";

    try {

      const error =
        await response.json();

      message =
        error.detail ||
        message;

    } catch {
      // Ignore JSON parsing errors
    }

    throw new Error(message);
  }

  return response.json();
}


export async function generateDocuments(
  template: File,
  rows: Record<string, string>[],
  generatePdf: boolean
): Promise<Blob> {

  const formData = new FormData();

  formData.append(
    "template",
    template
  );

  formData.append(
    "data_json",
    JSON.stringify(rows)
  );

  formData.append(
    "generate_pdf",
    String(generatePdf)
  );

  const response = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/generate`,
  {
    method: "POST",
    body: formData,
  }
);

if (!response.ok) {
  let message = `Generation failed (${response.status})`;

  try {
    const errorData = await response.json();

    if (typeof errorData.detail === "string") {
      message = errorData.detail;
    } else if (errorData.detail?.error) {
      message = errorData.detail.error;
    }
  } catch {
    // Backend did not return JSON
  }

  throw new Error(message);
}

return response.blob();
  }

  