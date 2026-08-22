"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";

interface FileUploadProps {
  title: string;
  description: string;
  accept: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

export default function FileUpload({
  title,
  description,
  accept,
  file,
  onFileChange,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);

  function handleFile(selectedFile: File | undefined) {
    if (!selectedFile) {
      return;
    }

    onFileChange(selectedFile);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    setDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>

        <p className="text-xs text-slate-500">{description}</p>
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => {
          setDragging(false);
        }}
        onDrop={handleDrop}
        onClick={() => {
          inputRef.current?.click();
        }}
        className={`
          cursor-pointer
          rounded-2xl
          border-2
          border-dashed
          p-8
          text-center
          transition
          ${
            dragging
              ? "border-slate-900 bg-slate-100"
              : "border-slate-300 hover:border-slate-500 hover:bg-slate-50"
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {file ? (
          <div className="space-y-2">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white">
              ✓
            </div>

            <p className="font-medium text-slate-900">{file.name}</p>

            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();

                onFileChange(null);
              }}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-2xl">
              ↑
            </div>

            <p className="font-medium text-slate-800">Drop your file here</p>

            <p className="text-sm text-slate-500">or click to browse</p>
          </div>
        )}
      </div>
    </div>
  );
}
