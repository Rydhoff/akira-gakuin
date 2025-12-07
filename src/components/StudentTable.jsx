import React, { useState } from "react";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabaseClient";

export default function StudentTable({ rows, onEdit, refresh }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");

  const remove = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;
    await supabase.from("students").delete().eq("id", id);
    refresh();
  };

  const statusBadge = (status) => {
    const color = {
      "Aktif": "bg-green-100 text-green-700",
      "Tidak Aktif": "bg-red-100 text-red-700",
      "Diklat SO": "bg-blue-100 text-blue-700",
      "Diterima SO": "bg-yellow-100 text-yellow-700",
    }[status] || "bg-gray-100 text-gray-600";

    return (
      <span className={`px-2 py-1 text-xs rounded-lg font-medium ${color}`}>
        {status || "Belum Diisi"}
      </span>
    );
  };

  // 🔎 Dropdown Dynamic Angkatan
  const angkatanOptions = [
    "",
    ...new Set(rows.map(r => r.angkatan).filter(Boolean)),
  ];

  // 🔥 Export Flatten JSON
    const flattenData = (data) => {
    return data.map((r) => {
      const pendidikan = r.pendidikan || {};
      const pekerjaan = r.pekerjaan || [];
      const keluarga = r.keluarga || {};
      const ibu = keluarga.ibu || {};
      const ayah = keluarga.ayah || {};
      const saudara = keluarga.saudara || [];
      const health = r.health || {};
      const motivasi = r.motivasi || {};
      const program = r.program_info || {};

      return {
        ID: r.id,
        NIS: r.nis,
        Nama: r.nama,
        Jenis_Kelamin: r.jenis_kelamin,
        Nomor_WA: r.nomor_wa,
        Angkatan: r.angkatan,
        Status: r.status,

        // 🏫 Pendidikan
        SD_Nama: pendidikan.sd?.nama || "",
        SD_Masuk: pendidikan.sd?.tahun_masuk || "",
        SD_Lulus: pendidikan.sd?.tahun_lulus || "",

        SMP_Nama: pendidikan.smp?.nama || "",
        SMP_Masuk: pendidikan.smp?.tahun_masuk || "",
        SMP_Lulus: pendidikan.smp?.tahun_lulus || "",

        SMA_Nama: pendidikan.sma?.nama || "",
        SMA_Jurusan: pendidikan.sma?.jurusan || "",
        SMA_Masuk: pendidikan.sma?.tahun_masuk || "",
        SMA_Lulus: pendidikan.sma?.tahun_lulus || "",

        Univ_Nama: pendidikan.universitas?.nama || "",
        Univ_Jurusan: pendidikan.universitas?.jurusan || "",
        Univ_Masuk: pendidikan.universitas?.tahun_masuk || "",
        Univ_Lulus: pendidikan.universitas?.tahun_lulus || "",

        // 🏢 Pekerjaan (max 4)
        ...Array.from({ length: 4 }).reduce((acc, _, i) => ({
          ...acc,
          [`Pekerjaan_${i+1}_Perusahaan`]: pekerjaan[i]?.nama_perusahaan || "",
          [`Pekerjaan_${i+1}_Jabatan`]: pekerjaan[i]?.jenis_pekerjaan || "",
          [`Pekerjaan_${i+1}_Masuk`]: pekerjaan[i]?.tahun_masuk || "",
          [`Pekerjaan_${i+1}_Keluar`]: pekerjaan[i]?.tahun_keluar || "",
        }), {}),

        // 👪 Keluarga
        Ibu_Nama: ibu.nama || "",
        Ibu_Usia: ibu.usia || "",
        Ibu_HP: ibu.nomor_hp || "",

        Ayah_Nama: ayah.nama || "",
        Ayah_Usia: ayah.usia || "",
        Ayah_HP: ayah.nomor_hp || "",

        ...Array.from({ length: 4 }).reduce((acc, _, i) => ({
          ...acc,
          [`Saudara_${i+1}_Nama`]: saudara[i]?.nama || "",
          [`Saudara_${i+1}_Usia`]: saudara[i]?.usia || "",
          [`Saudara_${i+1}_Jenis`]: saudara[i]?.jenis || "",
          [`Saudara_${i+1}_Pekerjaan`]: saudara[i]?.pekerjaan || "",
        }), {}),

        // 🏥 Kesehatan
        Sehat: health.sehat || "",
        Alergi: health.alergi || "",
        Merokok: health.merokok || "",
        Alkohol: health.alkohol || "",
        Pernah_Operasi: health.pernah_operasi || "",
        Penyakit_Bawaan: health.penyakit_bawaan || "",
        Paspor: health.paspor || "",

        // 🎯 Motivasi
        Kelebihan_1: motivasi.kelebihan?.[0] || "",
        Kelebihan_2: motivasi.kelebihan?.[1] || "",
        Kelebihan_3: motivasi.kelebihan?.[2] || "",
        Kekurangan: motivasi.kekurangan || "",
        Tujuan_Pulang_1: motivasi.tujuan_pulang?.[0] || "",
        Tujuan_Pulang_2: motivasi.tujuan_pulang?.[1] || "",
        Tujuan_Ke_Jepang_1: motivasi.tujuan_ke_jepang?.[0] || "",
        Tujuan_Ke_Jepang_2: motivasi.tujuan_ke_jepang?.[1] || "",
        Tujuan_Ke_Jepang_3: motivasi.tujuan_ke_jepang?.[2] || "",

        // 📝 Program Info
        Program: program.jenis_program || "",
      };
    });
  };


  const exportExcel = async () => {
    const { data, error } = await supabase.from("students").select("*");
    if (error) return console.error("Export error:", error);

    const flat = flattenData(data);
    const ws = XLSX.utils.json_to_sheet(flat);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    XLSX.writeFile(wb, "Data_Siswa_Akira.xlsx");
  };

  // FILTER & SORT
  const filteredRows = [...rows]
    .sort((a, b) => Number(b.nis) - Number(a.nis))
    .filter((r) => {
      const s = search.toLowerCase();
      return (
        (filterStatus === "" || r.status === filterStatus) &&
        (filterAngkatan === "" || r.angkatan === filterAngkatan) &&
        (
          String(r.nis || "").toLowerCase().includes(s) ||
          String(r.nama || "").toLowerCase().includes(s)
        )
      );
    });

  const statusOptions = ["", "Aktif", "Tidak Aktif", "Diklat SO", "Diterima SO"];

  return (
    <div className="card shadow-sm rounded-2xl p-6 bg-white overflow-x-auto">

      {/* SEARCH & FILTER & EXPORT */}
      <div className="flex flex-wrap justify-between items-center mb-4 gap-3">

        <input
          type="text"
          placeholder="Cari siswa..."
          className="px-3 py-2 border rounded-lg text-sm w-76 max-w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3">

          <select
            className="px-3 py-2 border rounded-lg text-sm bg-white"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s === "" ? "Semua Status" : s}
              </option>
            ))}
          </select>

          <select
            className="px-3 py-2 border rounded-lg text-sm bg-white"
            value={filterAngkatan}
            onChange={(e) => setFilterAngkatan(e.target.value)}
          >
            {angkatanOptions.map((a) => (
              <option key={a} value={a}>
                {a === "" ? "Semua Angkatan" : a}
              </option>
            ))}
          </select>

          <button
            onClick={exportExcel}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 shadow"
          >
            Export Excel
          </button>

        </div>
      </div>

      <table className="min-w-[850px] w-full text-sm text-center">
        <thead>
          <tr className="bg-slate-100">
            <th className="p-3 text-red-900">NIS</th>
            <th className="p-3 text-red-900">Nama</th>
            <th className="p-3 text-red-900">Jenis Kelamin</th>
            <th className="p-3 text-red-900">Angkatan</th>
            <th className="p-3 text-red-900">No. Telpon</th>
            <th className="p-3 text-red-900">Status</th>
            <th className="p-3 text-red-900 w-32">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {filteredRows.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-6 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          ) : (
            filteredRows.map((r) => (
              <tr key={r.id} className="border-b border-gray-200 hover:bg-slate-50">
                <td className="p-3">{r.nis}</td>
                <td className="p-3">{r.nama}</td>
                <td className="p-3">{r.jenis_kelamin}</td>
                <td className="p-3">{r.angkatan}</td>
                <td className="p-3">{r.nomor_wa}</td>
                <td className="p-3">{statusBadge(r.status)}</td>
                <td className="p-3 flex gap-2 justify-center">
                  {/* <button
                    onClick={() => onEdit(r)}
                    className="px-3 py-1 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => remove(r.id)}
                    className="px-3 py-1 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => window.location.href = `/students/${r.id}`}
                    className="px-3 py-1 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-200"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}