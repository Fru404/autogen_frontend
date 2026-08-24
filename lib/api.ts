// lib/api.ts

// ============================================================
// TYPES
// ============================================================

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
// PROGRESS TYPES
// ============================================================

export interface GenerationProgress {
  status:
    | "idle"
    | "starting"
    | "processing"
    | "combining"
    | "completed"
    | "error";

  total: number;

  completed: number;

  percentage: number;

  current_file?: string;

  elapsed_seconds: number;

  average_seconds_per_file?: number;

  estimated_remaining_seconds?: number;

  zip_seconds?: number;

  total_seconds?: number;

  coordinator?: {
    completed: number;
    total: number;
  };

  workers?: {
    id: string;
    completed: number;
    total: number;
    status: string;
  }[];

  message?: string;

  error?: string;
}


// ============================================================
// API URL
// ============================================================

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://autogen-backend-api.onrender.com";


// ============================================================
// HELPER
// ============================================================

async function getErrorMessage(
  response: Response,
  fallback: string
): Promise<string> {

  try {

    const error = await response.json();

    return (
      error.detail ||
      error.message ||
      fallback
    );

  } catch {

    return fallback;
  }
}


// ============================================================
// INSPECT FILES
// ============================================================

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

    const message =
      await getErrorMessage(
        response,
        "Could not inspect files."
      );

    throw new Error(message);
  }

  return response.json();
}


// ============================================================
// GENERATE DOCUMENTS
// ============================================================

export async function generateDocuments(
  template: File,
  rows: Record<string, string>[],
  generatePdf: boolean = false
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
    `${API_URL}/generate`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Could not generate documents."
      );

    throw new Error(message);
  }

  return response.blob();
}


// ============================================================
// GET GENERATION PROGRESS
// ============================================================

export async function getGenerationProgress(): Promise<GenerationProgress> {

  const response = await fetch(
    `${API_URL}/progress`,
    {
      method: "GET",

      // Don't allow browser cache to return
      // an old progress value.
      cache: "no-store",
    }
  );

  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Could not retrieve generation progress."
      );

    throw new Error(message);
  }

  return response.json();
}


// ============================================================
// RESET PROGRESS
// ============================================================

export async function resetGenerationProgress(): Promise<void> {

  const response = await fetch(
    `${API_URL}/progress/reset`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {

    const message =
      await getErrorMessage(
        response,
        "Could not reset generation progress."
      );

    throw new Error(message);
  }
}


// ============================================================
// HEALTH CHECK
// ============================================================

export async function checkCoordinator(): Promise<boolean> {

  try {

    const response = await fetch(
      `${API_URL}/health`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return response.ok;

  } catch {

    return false;
  }
}


// ============================================================
// API URL EXPORT
// ============================================================

export { API_URL };