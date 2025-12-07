import React from "react";

export default function ProgramTable({ rows = [] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="p-2 text-red-900">NIS</th>
          <th className="p-2 text-red-900">Nama</th>
          <th className="p-2 text-red-900">Shiken</th>
          <th className="p-2 text-red-900">Ujian</th>
          <th className="p-2 text-red-900">Kompetensi</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="odd:bg-slate-50">
            <td className="p-2">{r.nis}</td>
            <td className="p-2">{r.nama}</td>

            <td className="p-2 whitespace-pre">
              {r.shiken ? JSON.stringify(r.shiken, null, 2) : "-"}
            </td>

            <td className="p-2">
              {r.ujian?.level || "-"}
            </td>

            <td className="p-2 whitespace-pre">
              {r.kompetensi ? JSON.stringify(r.kompetensi, null, 2) : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
