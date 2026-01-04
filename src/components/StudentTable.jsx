import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { supabase } from "../lib/supabaseClient";
import { Pencil, Trash2, Eye } from "lucide-react";

export default function StudentTable({ rows, refresh }) {
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
      "Cuti": "bg-purple-100 text-purple-700",
      "Pengunduran Diri": "bg-red-200 text-red-800",
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
    // Helper to safely convert values to numbers where appropriate
    const toNumber = (v) => {
      if (v === null || v === undefined || v === "") return "";
      const n = Number(v);
      return Number.isFinite(n) ? n : v;
    };

    // For very long integer like KTP (16 digit) JS may lose precision,
    // so only convert KTP to number when it's safely representable.
    const ktpToNumberIfSafe = (val) => {
      if (!val && val !== 0) return "";
      const digits = String(val).replace(/\D/g, "");
      if (!digits) return "";
      const n = Number(digits);
      // keep as string if exceeds MAX_SAFE_INTEGER
      return Number.isSafeInteger(n) ? n : digits;
    };

    return data.map((r) => {
      return {
        ID: r.id,

        // DATA DASAR
        NIS: r.nis || "",
        Angkatan: toNumber(r.angkatan),
        Tanggal_Masuk: r.tanggal_masuk || "",

        // 1. DATA PRIBADI
        Nama_Lengkap: r.nama_lengkap || r.nama || "",
        Nomor_KTP: ktpToNumberIfSafe(r.nomor_ktp || r.nomor_ktp),
        Jenis_Kelamin: r.jenis_kelamin || "",
        Tempat_Lahir: r.tempat_lahir || "",
        Tanggal_Lahir: r.tanggal_lahir || "",
        Usia: toNumber(r.usia),
        Agama: r.agama || "",
        Golongan_Darah: r.golongan_darah || "",
        Status_Pernikahan: r.status_pernikahan || "",
        Nomor_WA: r.nomor_wa || "",
        Email: r.email || "",
        Asal_Daerah: r.asal_daerah || "",
        Alamat_Jalan: r.alamat_jalan || "",
        Alamat_RT: r.alamat_rt || "",
        Alamat_RW: r.alamat_rw || "",
        Alamat_Kelurahan: r.alamat_kelurahan || "",
        Alamat_Kecamatan: r.alamat_kecamatan || "",
        Alamat_Kabupaten: r.alamat_kabupaten || "",

        // 2. FISIK & KEPRIBADIAN
        Tinggi_Badan: toNumber(r.tinggi_badan),
        Berat_Badan: toNumber(r.berat_badan),
        Lingkar_Pinggang: toNumber(r.lingkar_pinggang),
        Ukuran_Kaki: toNumber(r.ukuran_kaki),
        Dominan_Tangan: r.dominan_tangan || "",
        Hobi: r.hobi || "",
        Keahlian: r.keahlian || "",
        Tiga_Kelebihan: r.tiga_kelebihan || "",
        Satu_Kekurangan: r.satu_kekurangan || "",
        Tiga_Tujuan_Jepang: r.tiga_tujuan_jepang || "",
        Tujuan_Pulang: r.tujuan_pulang || "",

        // 3. RIWAYAT PENDIDIKAN
        SD_Nama: r.sd_nama || "",
        SD_Tahun_Masuk: toNumber(r.sd_tahun_masuk),
        SD_Tahun_Lulus: toNumber(r.sd_tahun_lulus),

        SMP_Nama: r.smp_nama || "",
        SMP_Tahun_Masuk: toNumber(r.smp_tahun_masuk),
        SMP_Tahun_Lulus: toNumber(r.smp_tahun_lulus),

        SMA_Nama: r.sma_nama || "",
        SMA_Jurusan: r.sma_jurusan || "",
        SMA_Tahun_Masuk: toNumber(r.sma_tahun_masuk),
        SMA_Tahun_Lulus: toNumber(r.sma_tahun_lulus),

        Univ_Nama: r.univ_nama || "",
        Univ_Jurusan: r.univ_jurusan || "",
        Univ_Tahun_Masuk: toNumber(r.univ_tahun_masuk),
        Univ_Tahun_Lulus: toNumber(r.univ_tahun_lulus),

        // 4. RIWAYAT PEKERJAAN (maks 5)
        Pekerjaan_1_Perusahaan: r.pekerjaan1_nama_perusahaan || "",
        Pekerjaan_1_Jabatan: r.pekerjaan1_jenis || "",
        Pekerjaan_1_Tahun_Masuk: toNumber(r.pekerjaan1_tahun_masuk),
        Pekerjaan_1_Bulan_Masuk: r.pekerjaan1_bulan_masuk || "",
        Pekerjaan_1_Tahun_Keluar: toNumber(r.pekerjaan1_tahun_keluar),
        Pekerjaan_1_Bulan_Keluar: r.pekerjaan1_bulan_keluar || "",

        Pekerjaan_2_Perusahaan: r.pekerjaan2_nama_perusahaan || "",
        Pekerjaan_2_Jabatan: r.pekerjaan2_jenis || "",
        Pekerjaan_2_Tahun_Masuk: toNumber(r.pekerjaan2_tahun_masuk),
        Pekerjaan_2_Bulan_Masuk: r.pekerjaan2_bulan_masuk || "",
        Pekerjaan_2_Tahun_Keluar: toNumber(r.pekerjaan2_tahun_keluar),
        Pekerjaan_2_Bulan_Keluar: r.pekerjaan2_bulan_keluar || "",

        Pekerjaan_3_Perusahaan: r.pekerjaan3_nama_perusahaan || "",
        Pekerjaan_3_Jabatan: r.pekerjaan3_jenis || "",
        Pekerjaan_3_Tahun_Masuk: toNumber(r.pekerjaan3_tahun_masuk),
        Pekerjaan_3_Bulan_Masuk: r.pekerjaan3_bulan_masuk || "",
        Pekerjaan_3_Tahun_Keluar: toNumber(r.pekerjaan3_tahun_keluar),
        Pekerjaan_3_Bulan_Keluar: r.pekerjaan3_bulan_keluar || "",

        Pekerjaan_4_Perusahaan: r.pekerjaan4_nama_perusahaan || "",
        Pekerjaan_4_Jabatan: r.pekerjaan4_jenis || "",
        Pekerjaan_4_Tahun_Masuk: toNumber(r.pekerjaan4_tahun_masuk),
        Pekerjaan_4_Bulan_Masuk: r.pekerjaan4_bulan_masuk || "",
        Pekerjaan_4_Tahun_Keluar: toNumber(r.pekerjaan4_tahun_keluar),
        Pekerjaan_4_Bulan_Keluar: r.pekerjaan4_bulan_keluar || "",

        Pekerjaan_5_Perusahaan: r.pekerjaan5_nama_perusahaan || "",
        Pekerjaan_5_Jabatan: r.pekerjaan5_jenis || "",
        Pekerjaan_5_Tahun_Masuk: toNumber(r.pekerjaan5_tahun_masuk),
        Pekerjaan_5_Bulan_Masuk: r.pekerjaan5_bulan_masuk || "",
        Pekerjaan_5_Tahun_Keluar: toNumber(r.pekerjaan5_tahun_keluar),
        Pekerjaan_5_Bulan_Keluar: r.pekerjaan5_bulan_keluar || "",

        Gaji_Terakhir: toNumber(r.gaji_terakhir),
        Pernah_Tes_SO: toNumber(r.pernah_tes_so),

        // 5. DATA KELUARGA (hapus jumlah_saudara dari export sesuai instruksi)
        Ayah_Nama: r.ayah_nama || "",
        Ayah_Usia: r.ayah_usia || "",
        Ayah_Pekerjaan: r.ayah_pekerjaan || "",
        Ayah_HP: r.ayah_hp || "",

        Ibu_Nama: r.ibu_nama || "",
        Ibu_Usia: r.ibu_usia || "",
        Ibu_Pekerjaan: r.ibu_pekerjaan || "",
        Ibu_HP: r.ibu_hp || "",

        Saudara_1_Jenis: r.saudara1_jenis || "",
        Saudara_1_Nama: r.saudara1_nama || "",
        Saudara_1_Usia: r.saudara1_usia || "",
        Saudara_1_Pekerjaan: r.saudara1_pekerjaan || "",

        Saudara_2_Jenis: r.saudara2_jenis || "",
        Saudara_2_Nama: r.saudara2_nama || "",
        Saudara_2_Usia: r.saudara2_usia || "",
        Saudara_2_Pekerjaan: r.saudara2_pekerjaan || "",

        Saudara_3_Jenis: r.saudara3_jenis || "",
        Saudara_3_Nama: r.saudara3_nama || "",
        Saudara_3_Usia: r.saudara3_usia || "",
        Saudara_3_Pekerjaan: r.saudara3_pekerjaan || "",

        Saudara_4_Jenis: r.saudara4_jenis || "",
        Saudara_4_Nama: r.saudara4_nama || "",
        Saudara_4_Usia: r.saudara4_usia || "",
        Saudara_4_Pekerjaan: r.saudara4_pekerjaan || "",

        Saudara_5_Jenis: r.saudara5_jenis || "",
        Saudara_5_Nama: r.saudara5_nama || "",
        Saudara_5_Usia: r.saudara5_usia || "",
        Saudara_5_Pekerjaan: r.saudara5_pekerjaan || "",

        // 6. HEALTH & DOKUMEN
        Merokok: r.merokok || "",
        Minum_Alkohol: r.minum_alkohol || "",
        Memiliki_Paspor: r.memiliki_paspor || "",
        Sehat: r.sehat || "",
        Penyakit_Bawaan: r.penyakit_bawaan || "",
        Pernah_Operasi: r.pernah_operasi || "",
        Alergi: r.alergi || "",

        Link_ktp: r.link_ktp || "",
        Link_kk: r.link_kk || "",
        Link_akta_kelahiran: r.link_akta_kelahiran || "",
        Link_ijazah: r.link_ijazah || "",
        Link_transkrip_nilai: r.link_transkrip_nilai || "",
        Link_skck: r.link_skck || "",
        Link_npwp: r.link_npwp || "",

        Link_sertifikat_tanah: r.link_sertifikat_tanah || "",
        Link_sertifikat_rumah: r.link_sertifikat_rumah || "",
        Link_pbb: r.link_pbb || "",
        Link_ktp_ayah: r.link_ktp_ayah || "",
        Link_ktp_ibu: r.link_ktp_ibu || "",
        Link_buku_nikah_ortu: r.link_buku_nikah_ortu || "",
        Link_surat_penghasilan: r.link_surat_penghasilan || "",
        Link_sktm: r.link_sktm || "",

        Link_paspor: r.link_paspor || "",
        Link_coe: r.link_coe || "",
        Link_visa: r.link_visa || "",
        Link_tiket_pesawat: r.link_tiket_pesawat || "",
        Link_asuransi_perjalanan: r.link_asuransi_perjalanan || "",
        Link_surat_sehat: r.link_surat_sehat || "",

        // 7. PROGRAM & PASANGAN
        Program: r.program || "",
        Rencana_Pembayaran: r.rencana_pembayaran || "",
        Pasangan_Nama: r.pasangan_nama || "",
        Pasangan_HP: r.pasangan_hp || "",

        // SYSTEM
        Status: r.status || "",
        Created_At: r.created_at || "",
        Updated_At: r.updated_at || "",
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
        (filterAngkatan === "" || String(r.angkatan) === filterAngkatan) &&
        (
          String(r.nis || "").toLowerCase().includes(s) ||
          String(r.nama_lengkap || r.nama || "").toLowerCase().includes(s)
        )
      );
    });

  const statusOptions = ["", "Aktif", "Tidak Aktif", "Cuti", "Pengunduran Diri", "Diklat SO", "Diterima SO"];

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
                <td className="p-3">{r.nama_lengkap}</td>
                <td className="p-3">{r.jenis_kelamin}</td>
                <td className="p-3">{r.angkatan}</td>
                <td className="p-3">{r.nomor_wa}</td>
                <td className="p-3">{statusBadge(r.status)}</td>
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <Link
                      to={`/students/${r.id}`}
                      className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition active:scale-95"
                      title="Detail"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      to={`/students/edit/${r.id}`}
                      className="p-2 rounded-lg border border-green-300 text-green-600 hover:bg-green-600 hover:text-white transition active:scale-95"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => remove(r.id)}
                      className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition active:scale-95 "
                      title="Hapus"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

    </div>
  );
}