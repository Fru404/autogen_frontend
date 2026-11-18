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
              {isGenerating && (
                <div className="mt-6" aria-live="polite" aria-atomic="true">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-white">
                      {generationMessage || "Generating receipts..."}
                    </p>
                    <p className="shrink-0 text-sm font-bold tabular-nums text-[#f7e7a8]">
                      {generationProgress}%
                    </p>
                  </div>
                  <div
                    className="h-3 w-full overflow-hidden rounded-full bg-[#5a5742]"
                    role="progressbar"
                    aria-label="Receipt generation progress"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={generationProgress}
                  >
                    <div
                      className="h-full rounded-full bg-[#f7e7a8] transition-[width] duration-300 ease-out"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#bdb578]">
                    Progress is updated by the server as receipts are generated, PDFs are converted, and files are added to the ZIP.
                  </p>
                </div>
              )}
              <div className="mt-7 flex justify-end border-t border-[#46442f] pt-6">
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={isGenerating || !templateFile || rows.length === 0}
                  className="rounded-xl bg-[#f7e7a8] px-6 py-3 text-sm font-semibold text-[#202020] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
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
