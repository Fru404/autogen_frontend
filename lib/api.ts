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
// GENERATION PROGRESS
// ============================================================

export interface GenerationProgress {
  request_id: string;
  status: "processing" | "completed" | "failed";
  percent: number;
  message: string;
  completed: number;
  total: number;
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

// ============================================================
// GENERATE DOCUMENTS - DIRECT ZIP + SERVER PROGRESS
// ============================================================

export async function generateDocuments(
  template: File,
  rows: Record<string, string>[],
  generatePdf: boolean,
  onProgress?: (progress: GenerationProgress) => void,
): Promise<Blob> {
  const requestId = crypto.randomUUID();
  const formData = new FormData();

  formData.append("template", template);
  formData.append("data_json", JSON.stringify(rows));
  formData.append("generate_pdf", String(generatePdf));
  formData.append("request_id", requestId);

  // Poll the lightweight progress endpoint while /generate creates the ZIP.
  // The ZIP itself is still returned directly by the same POST request.
  let stopPolling = false;
  const pollProgress = async () => {
    while (!stopPolling) {
      try {
        const progressResponse = await fetch(
          `${API_URL}/generate/progress/${requestId}`,
          { cache: "no-store" },
        );

        if (progressResponse.ok) {
          const progress: GenerationProgress = await progressResponse.json();
          onProgress?.(progress);

          if (progress.status === "completed" || progress.status === "failed") {
            return;
          }
        }
      } catch (error) {
        // A temporary polling failure should not cancel ZIP generation.
        console.warn("Could not retrieve generation progress:", error);
      }

      if (!stopPolling) await delay(500);
    }
  };

  const pollingTask = pollProgress();
  let response: Response;

  try {
    response = await fetch(`${API_URL}/generate`, {
      method: "POST",
      body: formData,
    });
  } finally {
    stopPolling = true;
    await pollingTask;
  }

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

  // Do not parse the successful response as JSON: it is the ZIP binary.
  const blob = await response.blob();
  onProgress?.({
    request_id: requestId,
    status: "completed",
    percent: 100,
    message: "ZIP archive ready.",
    completed: rows.length,
    total: rows.length,
  });

  return blob;
}
