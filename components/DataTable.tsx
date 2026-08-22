"use client";

import React from "react";

interface DataTableProps {
  columns: string[];
  rows: Record<string, string>[];
  onRowsChange: (rows: Record<string, string>[]) => void;
}

export default function DataTable({
  columns,
  rows,
  onRowsChange,
}: DataTableProps) {
  function updateCell(rowIndex: number, column: string, value: string) {
    const updatedRows = [...rows];

    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [column]: value,
    };

    onRowsChange(updatedRows);
  }

  function deleteRow(rowIndex: number) {
    const updatedRows = rows.filter((_, index) => index !== rowIndex);

    onRowsChange(updatedRows);
  }

  function addRow() {
    const newRow: Record<string, string> = {};

    columns.forEach((column) => {
      newRow[column] = "";
    });

    onRowsChange([...rows, newRow]);
  }

  return (
    <div className="space-y-4">
      {/* TABLE */}

      <div className="overflow-hidden rounded-2xl border border-[#e1d9b9]">
        <div className="max-h-[520px] overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-[#f4edcf]">
              <tr>
                <th className="w-12 border-b border-[#e1d9b9] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#817950]">
                  #
                </th>

                {columns.map((column) => (
                  <th
                    key={column}
                    className="border-b border-[#e1d9b9] px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-[#817950]"
                  >
                    {column}
                  </th>
                ))}

                <th className="w-20 border-b border-[#e1d9b9] px-4 py-3" />
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-[#eee8cf] last:border-0 hover:bg-[#faf7e8]"
                >
                  <td className="px-4 py-2 text-xs text-[#a39a72]">
                    {rowIndex + 1}
                  </td>

                  {columns.map((column) => (
                    <td key={column} className="px-2 py-1.5">
                      <input
                        type="text"
                        value={String(row[column] ?? "")}
                        onChange={(event) =>
                          updateCell(rowIndex, column, event.target.value)
                        }
                        className="w-full min-w-[120px] rounded-lg border border-transparent bg-transparent px-2 py-2 text-sm text-[#302e22] outline-none transition hover:border-[#ded5ae] focus:border-[#aaa06d] focus:bg-white"
                      />
                    </td>
                  ))}

                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => deleteRow(rowIndex)}
                      className="rounded-lg px-2 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-[#817950]">No client records.</p>

            <button
              type="button"
              onClick={addRow}
              className="mt-3 text-sm font-semibold text-[#302e22] underline"
            >
              Add the first row
            </button>
          </div>
        )}
      </div>

      {/* ADD ROW */}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={addRow}
          className="rounded-full border border-[#d6cc9f] bg-[#faf6df] px-4 py-2 text-xs font-bold text-[#514b32] transition hover:border-[#aaa06d] hover:bg-[#f3eccd]"
        >
          + Add row
        </button>
      </div>
    </div>
  );
}
