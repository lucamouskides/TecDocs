'use client';

import { useState, useCallback, useEffect } from 'react';

interface TableBlockProps {
  id: string;
  content: { headers: string[]; rows: string[][] };
  onContentChange: (id: string, newContent: { headers: string[]; rows: string[][] }) => void;
}

export default function TableBlock({ id, content, onContentChange }: TableBlockProps) {
  const [headers, setHeaders] = useState(content.headers || ['Header 1']);
  const [rows, setRows] = useState(content.rows || [['Cell 1']]);

  useEffect(() => {
    setHeaders(content.headers || ['Header 1']);
    setRows(content.rows || [['Cell 1']]);
  }, [content]);

  const handleSave = () => {
    onContentChange(id, { headers, rows });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex][colIndex] = value;
    setRows(newRows);
  };
  
  const updateHeader = (colIndex: number, value: string) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    setHeaders(newHeaders);
  };
  
  const addRow = () => {
    const newRow = Array(headers.length).fill('');
    const newRows = [...rows, newRow];
    setRows(newRows);
    onContentChange(id, { headers, rows: newRows });
  };

  const removeRow = (index: number) => {
    const newRows = rows.filter((_, i) => i !== index);
    setRows(newRows);
    onContentChange(id, { headers, rows: newRows });
  };

  const addColumn = () => {
    const newHeaders = [...headers, `Header ${headers.length + 1}`];
    setHeaders(newHeaders);
    const newRows = rows.map(row => [...row, '']);
    setRows(newRows);
    onContentChange(id, { headers: newHeaders, rows: newRows });
  };

  const removeColumn = (index: number) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_, i) => i !== index);
    setHeaders(newHeaders);
    const newRows = rows.map(row => row.filter((_, i) => i !== index));
    setRows(newRows);
    onContentChange(id, { headers: newHeaders, rows: newRows });
  };

  return (
    <div className="my-4 group/table relative">
      <div className="border rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-1 border w-12"></th>
              {headers.map((header, colIndex) => (
                <th key={colIndex} className="p-1 border group relative">
                  <input type="text" value={header} onChange={(e) => updateHeader(colIndex, e.target.value)} onBlur={handleSave} className="p-2 w-full font-semibold bg-transparent focus:outline-none focus:bg-gray-100" />
                  <button onClick={() => removeColumn(colIndex)} className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="group">
                <td className="p-1 border text-center relative">
                  {/* Remove button for the row */}
                  <button onClick={() => removeRow(rowIndex)} className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="p-1 border">
                    <input type="text" value={cell} onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)} onBlur={handleSave} className="p-2 w-full bg-transparent focus:outline-none focus:bg-gray-50" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-2 flex space-x-2 opacity-0 group-hover/table:opacity-100 transition-opacity">
        <button onClick={addRow} className="text-xs font-semibold text-blue-600 hover:text-blue-800">+ Add Row</button>
        <button onClick={addColumn} className="text-xs font-semibold text-blue-600 hover:text-blue-800">+ Add Column</button>
      </div>
    </div>
  );
}