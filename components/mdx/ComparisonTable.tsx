import React from 'react';

interface ComparisonTableProps {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export function ComparisonTable({ headers, rows, caption }: ComparisonTableProps) {
  return (
    <div className="my-8 overflow-hidden rounded-xl border border-forest-700/60 bg-forest-850 shadow-md">
      {caption && (
        <div className="bg-forest-800/90 px-4 py-2.5 text-xs font-medium text-warm-accent uppercase tracking-wider border-b border-forest-700/50">
          {caption}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-cream-400">
          <thead className="bg-forest-800/60 text-xs uppercase text-botanical-muted border-b border-forest-700/60">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} scope="col" className="px-5 py-3 font-semibold tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-forest-750">
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-forest-800/40 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className={`px-5 py-3.5 ${cellIdx === 0 ? 'font-medium text-cream-200' : 'text-cream-400/90'}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
