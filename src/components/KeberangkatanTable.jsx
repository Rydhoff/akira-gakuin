import React from "react";

export default function KeberangkatanTable({ rows = [] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="p-2 text-red-900">NIS</th>
          <th className="p-2 text-red-900">Nama</th>
          <th className="p-2 text-red-900">Prefektur</th>
          <th className="p-2 text-red-900">Perusahaan</th>
          <th className="p-2 text-red-900">Tgl Berangkat</th>
          <th className="p-2 text-red-900">Tgl Pulang</th>
          <th className="p-2 text-red-900">Alasan</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r) => {
          const k = r.keberangkatan || {};
          return (
            <tr className="odd:bg-slate-50" key={r.id}>
              <td className="p-2 text-red-900">{r.nis}</td>
              <td className="p-2 text-red-900">{r.nama}</td>
              <td className="p-2 text-red-900">{k.prefektur || "-"}</td>
              <td className="p-2 text-red-900">{k.perusahaan || "-"}</td>
              <td className="p-2 text-red-900">{k.tanggal_berangkat || "-"}</td>
              <td className="p-2 text-red-900">{k.tanggal_pulang || "-"}</td>
              <td className="p-2 text-red-900">{k.alasan_pulang || "-"}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
