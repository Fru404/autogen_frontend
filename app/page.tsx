"use client";

import { useMemo, useState } from "react";

import FileUpload from "@/components/FileUpload";
import DataTable from "@/components/DataTable";
import StatusBadge from "@/components/StatusBadge";

import { inspectFiles, generateDocuments, InspectionResult } from "@/lib/api";

export default function Home() {
  const [templateFile, setTemplateFile] = useState<File | null>(null);

  const [excelFile, setExcelFile] = useState<File | null>(null);

  const [inspection, setInspection] = useState<InspectionResult | null>(null);

  const [rows, setRows] = useState<Record<string, string>[]>([]);

  const [search, setSearch] = useState("");

  const [generatePdf, setGeneratePdf] = useState(false);

  const [loading, setLoading] = useState(false);

  const [generating, setGenerating] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const [progress, setProgress] = useState(0);

  const [progressMessage, setProgressMessage] = useState("");

  const [progressCompleted, setProgressCompleted] = useState(0);

  const [progressTotal, setProgressTotal] = useState(0);

  // ==========================================================
  // INSPECT
  // ==========================================================

  async function handleInspect() {
    if (!templateFile || !excelFile) {
      setError("Please upload both the Word template and Excel file.");

      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await inspectFiles(templateFile, excelFile);

      setInspection(result);

      setRows(result.excel.rows);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not inspect files.",
      );

      setInspection(null);
    } finally {
      setLoading(false);
    }
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  const visibleRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const query = search.toLowerCase();

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query),
      ),
    );
  }, [rows, search]);

  // ==========================================================
  // GENERATE
  // ==========================================================

  async function handleGenerate() {
    if (!templateFile) {
      return;
    }

    if (!rows.length) {
      return;
    }

    try {
      setIsGenerating(true);

      setProgress(0);

      setProgressCompleted(0);

      setProgressTotal(rows.length);

      setProgressMessage("Preparing receipts...");

      const blob = await generateDocuments(
        templateFile,

        rows,

        generatePdf,

        (data) => {
          setProgress(data.progress);

          setProgressMessage(data.message);

          setProgressCompleted(data.completed);

          setProgressTotal(data.total);
        },
      );

      // ======================================================
      // DOWNLOAD ZIP
      // ======================================================

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = "Autogen_Receipts.zip";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);

      setProgress(100);

      setProgressMessage("All receipts completed.");
    } catch (error) {
      console.error(error);

      alert(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  }

  // ==========================================================
  // RESET
  // ==========================================================

  function reset() {
    setTemplateFile(null);
    setExcelFile(null);
    setInspection(null);
    setRows([]);
    setSearch("");
    setGeneratePdf(false);
    setError("");
    setSuccess("");
  }

  const ready = Boolean(
    templateFile &&
    excelFile &&
    inspection &&
    inspection.validation.ready &&
    rows.length > 0,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7e7a8]">
      {/* ================================================== */}
      {/* BACKGROUND ARC SYSTEM */}
      {/* ================================================== */}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <svg
          className="absolute bottom-[-180px] left-[-220px] h-[900px] w-[1150px] opacity-[0.42]"
          viewBox="0 0 1150 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ARC 1 */}

          <path
            d="M -120 850
               C 100 390, 430 100, 950 70"
            stroke="#d95f59"
            strokeWidth="2"
            strokeDasharray="1 13"
            strokeLinecap="round"
          />

          {/* ARC 2 */}

          <path
            d="M -160 850
               C 120 450, 470 170, 1010 130"
            stroke="#e5a83b"
            strokeWidth="2"
            strokeDasharray="1 12"
            strokeLinecap="round"
          />

          {/* ARC 3 */}

          <path
            d="M -190 850
               C 130 500, 510 230, 1070 190"
            stroke="#d9c83f"
            strokeWidth="2"
            strokeDasharray="1 12"
            strokeLinecap="round"
          />

          {/* ARC 4 */}

          <path
            d="M -220 850
               C 150 550, 560 290, 1090 250"
            stroke="#6ca56c"
            strokeWidth="2"
            strokeDasharray="1 13"
            strokeLinecap="round"
          />

          {/* ARC 5 */}

          <path
            d="M -240 850
               C 180 600, 610 350, 1120 310"
            stroke="#5791a8"
            strokeWidth="2"
            strokeDasharray="1 13"
            strokeLinecap="round"
          />

          {/* ARC 6 */}

          <path
            d="M -260 850
               C 200 650, 650 410, 1140 370"
            stroke="#7169a8"
            strokeWidth="2"
            strokeDasharray="1 14"
            strokeLinecap="round"
          />
        </svg>

        {/* subtle grain */}

        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#000_0.6px,transparent_0.6px)] [background-size:8px_8px]" />
      </div>

      {/* ================================================== */}
      {/* CONTENT */}
      {/* ================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-8 lg:px-10">
        {/* ================================================= */}
        {/* BRAND */}
        {/* ================================================= */}

        <div className="flex items-center justify-between">
          <div className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#202020] text-sm font-bold text-[#f7e7a8] shadow-sm transition-transform duration-300 group-hover:rotate-[-4deg]">
              Ag
            </div>

            <div>
              <div className="text-[17px] font-bold tracking-[-0.03em] text-[#202020]">
                Autogen
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#6e653d]">
                Document automation
              </div>
            </div>
          </div>
          <p className="text-[14px] font-bold tracking-[-0.03em] text-[#6e653d]">
            {" "}
            A product by frungwa
          </p>
        </div>

        {/* ================================================= */}
        {/* HERO */}
        {/* ================================================= */}

        <section className="max-w-3xl pb-14 pt-20 lg:pt-24">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7c77e] bg-[#fffdf3]/70 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#202020]" />

            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#625b38]">
              Generate anything
            </span>
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[0.98] tracking-[-0.055em] text-[#202020] sm:text-6xl lg:text-7xl">
            Turn your data into
            <span className="block">finished documents.</span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-7 text-[#625b38] sm:text-lg">
            Upload a Word template and your client data. Autogen fills
            everything in and gives you a ready-to-download ZIP.{" "}
            <p className="text-[#8B0000]">
              Files uploaded are not stored by the site.
            </p>
          </p>
        </section>

        {/* ================================================= */}
        {/* UPLOAD AREA */}
        {/* ================================================= */}

        <section className="grid gap-5 lg:grid-cols-2">
          {/* WORD */}

          <div className="rounded-[28px] border border-[#e1d49b] bg-[#fffdf3]/90 p-6 shadow-[0_20px_60px_rgba(83,67,20,0.07)] backdrop-blur-md">
            <FileUpload
              title="Word template"
              description="Upload a .docx containing your {{placeholders}}."
              accept=".docx"
              file={templateFile}
              onFileChange={(file) => {
                setTemplateFile(file);
                setInspection(null);
                setError("");
                setSuccess("");
              }}
            />
          </div>

          {/* EXCEL */}

          <div className="rounded-[28px] border border-[#e1d49b] bg-[#fffdf3]/90 p-6 shadow-[0_20px_60px_rgba(83,67,20,0.07)] backdrop-blur-md">
            <FileUpload
              title="Client data"
              description="Upload an Excel spreadsheet containing your records."
              accept=".xlsx,.xls"
              file={excelFile}
              onFileChange={(file) => {
                setExcelFile(file);
                setInspection(null);
                setError("");
                setSuccess("");
              }}
            />
          </div>
        </section>

        {/* ================================================= */}
        {/* START OVER / ANALYZE */}
        {/* ================================================= */}

        <div className="mt-4 flex items-center justify-end gap-3">
          {/* START OVER TOGGLE */}

          {(templateFile || excelFile || inspection) && (
            <button
              type="button"
              onClick={reset}
              className="group flex h-10 items-center gap-0 overflow-hidden rounded-full border border-[#d7c77e] bg-[#fffdf3]/70 pl-2 pr-2 text-[#625b38] shadow-sm backdrop-blur transition-all duration-300 hover:gap-2 hover:pr-4"
              title="Start over"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ece2b3] text-xs transition group-hover:bg-[#202020] group-hover:text-[#f7e7a8]">
                ↻
              </span>

              <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[80px] group-hover:opacity-100">
                Start over
              </span>
            </button>
          )}

          {/* ANALYZE */}

          <button
            type="button"
            disabled={loading || !templateFile || !excelFile}
            onClick={handleInspect}
            className="rounded-full bg-[#202020] px-6 py-3 text-sm font-semibold text-[#f7e7a8] shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-[#343434] disabled:cursor-not-allowed disabled:opacity-30"
          >
            {loading ? "Analyzing..." : "Analyze files →"}
          </button>
        </div>

        {/* ================================================= */}
        {/* STATUS */}
        {/* ================================================= */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <strong>Something went wrong.</strong> {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <strong>Done.</strong> {success}
          </div>
        )}

        {/* ================================================= */}
        {/* INSPECTION */}
        {/* ================================================= */}

        {inspection && (
          <section className="mt-10 space-y-5">
            {/* TEMPLATE */}

            <div className="rounded-[28px] border border-[#e1d49b] bg-[#fffdf3]/95 p-7 shadow-[0_20px_60px_rgba(83,67,20,0.07)]">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#93875b]">
                    Template detected
                  </div>

                  <h2 className="mt-2 text-xl font-bold tracking-tight text-[#202020]">
                    {inspection.template.filename}
                  </h2>
                </div>

                <StatusBadge
                  type={inspection.validation.ready ? "success" : "error"}
                >
                  {inspection.validation.ready
                    ? "Ready to generate"
                    : "Needs attention"}
                </StatusBadge>
              </div>

              <div className="mt-7">
                <p className="mb-3 text-sm font-semibold text-[#49442d]">
                  Fields detected
                </p>

                <div className="flex flex-wrap gap-2">
                  {inspection.template.fields.map((field) => {
                    const missing =
                      inspection.validation.missing_fields.includes(field);

                    return (
                      <span
                        key={field}
                        className={`
                            rounded-xl
                            border
                            px-3
                            py-2
                            font-mono
                            text-xs
                            ${
                              missing
                                ? "border-red-200 bg-red-50 text-red-700"
                                : "border-[#e1d9b9] bg-[#f7f2d9] text-[#4c4731]"
                            }
                          `}
                      >
                        {`{{${field}}}`}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* VALIDATION */}

            {(inspection.validation.missing_fields.length > 0 ||
              inspection.validation.extra_columns.length > 0) && (
              <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-7">
                <h3 className="font-semibold text-amber-900">
                  Data validation
                </h3>

                {inspection.validation.missing_fields.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-red-700">
                      Missing Excel columns
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {inspection.validation.missing_fields.map((field) => (
                        <span
                          key={field}
                          className="rounded-lg bg-red-100 px-3 py-1.5 font-mono text-xs text-red-700"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {inspection.validation.extra_columns.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-amber-800">
                      Extra Excel columns
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {inspection.validation.extra_columns.map((field) => (
                        <span
                          key={field}
                          className="rounded-lg bg-amber-100 px-3 py-1.5 font-mono text-xs text-amber-800"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================= */}
            {/* CLIENT TABLE */}
            {/* ================================================= */}

            <div className="rounded-[28px] border border-[#e1d49b] bg-[#fffdf3]/95 p-7 shadow-[0_20px_60px_rgba(83,67,20,0.07)]">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#93875b]">
                    Data
                  </div>

                  <h2 className="mt-2 text-xl font-bold tracking-tight text-[#202020]">
                    Client records
                  </h2>

                  <p className="mt-1 text-sm text-[#77704e]">
                    Edit the information before generating.
                  </p>
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search records..."
                  className="rounded-full border border-[#ded5ae] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#8e845b] md:w-64"
                />
              </div>

              <DataTable
                columns={inspection.excel.columns}
                rows={visibleRows}
                onRowsChange={(newRows) => {
                  if (!search.trim()) {
                    setRows(newRows);

                    return;
                  }

                  const query = search.toLowerCase();

                  const matchingIndexes = rows
                    .map((row, index) => ({
                      row,
                      index,
                    }))
                    .filter(({ row }) =>
                      Object.values(row).some((value) =>
                        String(value).toLowerCase().includes(query),
                      ),
                    )
                    .map(({ index }) => index);

                  const updated = [...rows];

                  newRows.forEach((row, index) => {
                    const originalIndex = matchingIndexes[index];

                    if (originalIndex !== undefined) {
                      updated[originalIndex] = row;
                    }
                  });

                  setRows(updated);
                }}
              />
            </div>

            {/* ================================================= */}
            {/* GENERATE */}
            {/* ================================================= */}

            <div className="rounded-[28px] border border-[#e1d49b] bg-[#202020] p-7 text-[#f7e7a8] shadow-[0_20px_60px_rgba(30,25,5,0.16)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#aaa16e]">
                    Output
                  </div>

                  <h2 className="mt-2 text-xl font-bold tracking-tight">
                    Generate documents
                  </h2>

                  <p className="mt-1 text-sm text-[#bdb578]">
                    {rows.length} document
                    {rows.length === 1 ? "" : "s"} will be generated.
                  </p>
                </div>

                {/* PDF TOGGLE */}

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold">PDF copies</p>

                    <p className="text-xs text-[#aaa16e]">Generate PDFs too</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGeneratePdf(!generatePdf)}
                    disabled={true}
                    className={`
                        relative
                        h-7
                        w-12
                        rounded-full
                        transition
                        ${generatePdf ? "bg-[#f7e7a8]" : "bg-[#5a5742]"}
                      `}
                  >
                    <span
                      className={`
                        absolute
                        top-1
                        h-5
                        w-5
                        rounded-full
                        bg-[#202020]
                        transition
                        ${generatePdf ? "left-6" : "left-1"}
                      `}
                    />
                  </button>
                </div>
              </div>
              <div className="mt-4 text-sm text-[#bdb578]">
                {isGenerating && (
                  <div className="mt-6">
                    <div className="mb-2 flex items-end justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#302d20]">
                          Generating receipts
                        </p>

                        <p className="mt-1 text-xs text-[#777052]">
                          {progressMessage}
                        </p>
                      </div>

                      <span className="text-2xl font-bold text-[#302d20]">
                        {progress}%
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-[#e5dfc4]">
                      <div
                        className="h-full rounded-full bg-[#302d20] transition-[width] duration-300 ease-out"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>

                    <div className="mt-2 flex justify-between text-xs text-[#777052]">
                      <span>
                        {progressCompleted} of {progressTotal}
                      </span>

                      {progress > 0 && progress < 100 && (
                        <span>Please wait...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-7 flex justify-end border-t border-[#46442f] pt-6">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !templateFile || rows.length === 0}
                  className="rounded-xl bg-[#302d20] px-6 py-3 text-sm font-semibold text-[#fffbea] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {isGenerating ? "Generating..." : "Generate receipts"}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
