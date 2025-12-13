import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import CardStat from "../components/CardStat";
import { Users, CheckCircle, XCircle, PauseCircle, LogOut, ClipboardList, Eye } from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    Aktif: 0,
    "Tidak Aktif": 0,
    Cuti: 0,
    "Pengunduran Diri": 0,
    "Diklat SO": 0,
    "Diterima SO": 0,
  });

  const [cutiList, setCutiList] = useState([]);

  useEffect(() => {
    (async () => {
      const { data, count, error } = await supabase
        .from("students")
        .select("*", { count: "exact" });

      if (error) {
        console.error(error);
        return;
      }

      const newStats = {
        total: count || 0,
        Aktif: data.filter(s => s.status === "Aktif").length,
        "Tidak Aktif": data.filter(s => s.status === "Tidak Aktif").length,
        Cuti: data.filter(s => s.status === "Cuti").length,
        "Pengunduran Diri": data.filter(s => s.status === "Pengunduran Diri").length,
        "Diklat SO": data.filter(s => s.status === "Diklat SO").length,
        "Diterima SO": data.filter(s => s.status === "Diterima SO").length,
      };

      setStats(newStats);

      const cutiStudents = data
        .filter(s => s.status === "Cuti")
        .map(s => {
          const mulai = dayjs(s.cuti_mulai);
          const selesai = dayjs(s.cuti_selesai);
          const sisaHari = selesai.diff(dayjs(), "day") + 1;
          return {
            id: s.id,
            nis: s.nis,
            nama_lengkap: s.nama_lengkap || s.nama,
            jenis_kelamin: s.jenis_kelamin,
            angkatan: s.angkatan,
            nomor_wa: s.nomor_wa,
            status: s.status,
            cuti_mulai: mulai.format("DD-MM-YYYY"),
            cuti_selesai: selesai.format("DD-MM-YYYY"),
            sisaHari: sisaHari > 0 ? sisaHari : 0,
          };
        });

      setCutiList(cutiStudents);
    })();
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Yakin hapus data ini?")) return;
    await supabase.from("students").delete().eq("id", id);
    setCutiList(prev => prev.filter(s => s.id !== id));
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <CardStat icon={<Users size={26} />} label="Total Students" value={stats.total} color="#4A8BFF" />
        <CardStat icon={<CheckCircle size={26} />} label="Aktif" value={stats.Aktif} color="#57C374" />
        <CardStat icon={<XCircle size={26} />} label="Tidak Aktif" value={stats["Tidak Aktif"]} color="#FF6B6B" />
        <CardStat icon={<PauseCircle size={26} />} label="Cuti" value={stats.Cuti} color="#FFA500" />
        <CardStat icon={<LogOut size={26} />} label="Pengunduran Diri" value={stats["Pengunduran Diri"]} color="#FF4500" />
        <CardStat icon={<ClipboardList size={26} />} label="Diklat SO" value={stats["Diklat SO"]} color="#4A8BFF" />
        <CardStat icon={<CheckCircle size={26} />} label="Diterima SO" value={stats["Diterima SO"]} color="#20C997" />
      </div>

      {/* TABLE SISWA CUTI */}
      <h2 className="text-xl font-semibold mb-4">Siswa Sedang Cuti</h2>

      <div className="card shadow-sm rounded-2xl p-6 bg-white overflow-x-auto">
        <table className="min-w-[850px] w-full text-sm text-center">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 text-red-900">NIS</th>
              <th className="p-3 text-red-900">Nama</th>
              <th className="p-3 text-red-900">Jenis Kelamin</th>
              <th className="p-3 text-red-900">Angkatan</th>
              <th className="p-3 text-red-900">No. Telpon</th>
              <th className="p-3 text-red-900">Status</th>
              <th className="p-3 text-red-900">Periode Cuti</th>
              <th className="p-3 text-red-900">Sisa Hari</th>
              <th className="p-3 text-red-900 w-32">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {cutiList.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-gray-500">
                  Tidak ada siswa yang sedang cuti
                </td>
              </tr>
            ) : (
              cutiList.map((r) => (
                <tr key={r.id} className="border-b border-gray-200 hover:bg-slate-50">
                  <td className="p-3">{r.nis}</td>
                  <td className="p-3">{r.nama_lengkap}</td>
                  <td className="p-3">{r.jenis_kelamin}</td>
                  <td className="p-3">{r.angkatan}</td>
                  <td className="p-3">{r.nomor_wa}</td>
                  <td className="p-3">{statusBadge(r.status)}</td>
                  <td className="p-3">{r.cuti_mulai} - {r.cuti_selesai}</td>
                  <td className="p-3">{r.sisaHari}</td>
                  <td className="p-3">
                    <div className="flex gap-2 justify-center">
                      <Link
                        to={`/students/${r.id}`}
                        className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition active:scale-95"
                        title="Detail"
                      >
                        <Eye size={16} />
                      </Link>
                      <button
                        onClick={() => remove(r.id)}
                        className="p-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-600 hover:text-white transition active:scale-95"
                        title="Hapus"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
