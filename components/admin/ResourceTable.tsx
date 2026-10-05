'use client';

import { useEffect, useState } from 'react';

type Row = Record<string, unknown>;
export function ResourceTable({ endpoint, collection, columns, empty }: { endpoint: string; collection: string; columns: { key: string; label: string }[]; empty: string }) {
  const [rows,setRows]=useState<Row[]>([]);const [loading,setLoading]=useState(true);const [error,setError]=useState('');
  useEffect(()=>{let live=true;fetch(endpoint,{cache:'no-store'}).then(async r=>{const b=await r.json();if(!r.ok)throw new Error(b.error||'Could not load records');if(live)setRows(b[collection]||[])}).catch(e=>live&&setError(e.message)).finally(()=>live&&setLoading(false));return()=>{live=false}},[endpoint,collection]);
  if(loading)return <div className="rounded-2xl border border-[#e0e8df] bg-white p-6 text-sm text-[#718276]">Loading records…</div>;
  if(error)return <div role="alert" className="rounded-2xl border border-[#e5c8bf] bg-white p-5 text-sm text-[#873e31]">{error}</div>;
  return <div className="overflow-x-auto rounded-2xl border border-[#e0e8df] bg-white"><table className="w-full text-left text-sm"><thead><tr className="border-b border-[#edf1ec] text-xs uppercase tracking-wide text-[#748579]">{columns.map(c=><th className="px-5 py-3 font-semibold" key={c.key}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={String(row.id||row.key||i)} className="border-b border-[#f0f3ef] last:border-0">{columns.map(c=><td className="max-w-md px-5 py-3 text-[#425d4c]" key={c.key}>{renderCell(row[c.key])}</td>)}</tr>)}</tbody></table>{!rows.length&&<p className="p-8 text-center text-sm text-[#718276]">{empty}</p>}</div>;
}
function renderCell(value:unknown){if(value==null)return <span className="text-[#9aa69d]">—</span>;if(typeof value==='object')return JSON.stringify(value);if(typeof value==='string'&&/^\d{4}-\d\d-\d\dT/.test(value))return new Date(value).toLocaleString();return String(value)}
