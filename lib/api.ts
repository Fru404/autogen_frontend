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
// PROGRESS TYPE
// ============================================================

export interface GenerationProgress {
  job_id: string;
  status: string;
  progress: number;
  completed: number;
  total: number;
  current: string;
  message: string;
  error: string | null;
  zip_ready: boolean;
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

    throw new Error(
      message
    );
  }


  return response.json();
}


// ============================================================
// GENERATE DOCUMENTS
// ============================================================

export async function generateDocuments(

  template: File,

  rows: Record<string, string>[],

  generatePdf: boolean,

  onProgress?: (
    progress: GenerationProgress
  ) => void

): Promise<Blob> {


  const formData =
    new FormData();


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


  // ==========================================================
  // START GENERATION
  // ==========================================================

  const response =
    await fetch(

      `${API_URL}/generate`,

      {
        method: "POST",
        body: formData,
      }
    );


  if (!response.ok) {

    let message =
      "Could not generate documents.";

    try {

      const error =
        await response.json();

      message =
        error.detail ||
        message;

    } catch {

      // Ignore JSON parsing errors

    }

    throw new Error(
      message
    );
  }


  // ==========================================================
  // GET JOB
  // ==========================================================

  const job = await response.json();

  const jobId =
    job.job_id;


  if (!jobId) {

    throw new Error(
      "Backend did not return a generation job ID."
    );
  }


  // ==========================================================
  // CHECK PROGRESS
  // ==========================================================

  while (true) {

    await new Promise(
      (resolve) =>
        setTimeout(
          resolve,
          500
        )
    );


    const progressResponse =
      await fetch(

        `${API_URL}/generate/${jobId}/progress`,

        {
          cache: "no-store",
        }
      );


    if (!progressResponse.ok) {

      throw new Error(
        "Could not retrieve generation progress."
      );
    }


    const progress:
      GenerationProgress =
        await progressResponse.json();


    // Send progress to page.tsx
    if (onProgress) {

      onProgress(
        progress
      );
    }


    // ========================================================
    // GENERATION FAILED
    // ========================================================

    if (
      progress.status ===
      "error"
    ) {

      throw new Error(

        progress.error ||
        "Receipt generation failed."
      );
    }


    // ========================================================
    // GENERATION FINISHED
    // ========================================================

    if (

      progress.status ===
      "completed"

      &&

      progress.zip_ready

    ) {

      break;
    }

  }


  // ==========================================================
  // DOWNLOAD ZIP
  // ==========================================================

  const downloadResponse =
    await fetch(

      `${API_URL}/generate/${jobId}/download`
    );


  if (!downloadResponse.ok) {

    let message =
      "Could not download generated ZIP.";

    try {

      const error =
        await downloadResponse.json();

      message =
        error.detail ||
        message;

    } catch {

      // Ignore JSON parsing errors

    }

    throw new Error(
      message
    );
  }


  return downloadResponse.blob();
}