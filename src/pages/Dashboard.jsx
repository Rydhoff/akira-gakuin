import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import CardStat from "../components/CardStat";
import {
  Users,
  CheckCircle,
  XCircle,
  PauseCircle,
  LogOut,
  ClipboardList,
  Eye,
} from "lucide-react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

/* ================= HERO IMAGES ================= */
// Tambahin sampai 20 foto bebas
import h1 from "../assets/dashboard/1.jpeg";
import h2 from "../assets/dashboard/2.jpeg";
import h3 from "../assets/dashboard/3.jpeg";
import h4 from "../assets/dashboard/4.jpeg";
import h5 from "../assets/dashboard/5.jpeg";
import h6 from "../assets/dashboard/6.jpeg";
import h7 from "../assets/dashboard/7.jpeg";
import h8 from "../assets/dashboard/8.jpeg";
import h9 from "../assets/dashboard/9.jpeg";
import h10 from "../assets/dashboard/10.jpeg";
import h11 from "../assets/dashboard/11.jpeg";
import h12 from "../assets/dashboard/12.jpeg";
import h13 from "../assets/dashboard/13.jpeg";
import h14 from "../assets/dashboard/14.jpeg";

const heroImages = [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14];

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
  const [activeHero, setActiveHero] = useState(0);

  /* ================= HERO SLIDER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHero((prev) => (prev + 1) % heroImages.length);
    }, 5000); // 8 detik (AMAN)

    return () => clearInterval(interval);
  }, []);

  /* ================= DATA LOAD ================= */
  useEffect(() => {
    (async () => {
      const { data, count, error } = await supabase
        .from("students")
        .select("*", { count: "exact" });

      if (error) {
        console.error(error);
        return;
      }

      setStats({
        total: count || 0,
        Aktif: data.filter((s) => s.status === "Aktif").length,
        "Tidak Aktif": data.filter((s) => s.status === "Tidak Aktif").length,
        Cuti: data.filter((s) => s.status === "Cuti").length,
        "Pengunduran Diri": data.filter((s) => s.status === "Pengunduran Diri").length,
        "Diklat SO": data.filter((s) => s.status === "Diklat SO").length,
        "Diterima SO": data.filter((s) => s.status === "Diterima SO").length,
      });

      const cutiStudents = data
        .filter((s) => s.status === "Cuti")
        .map((s) => {
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

  const statusBadge = (status) => {
    const color = {
      Aktif: "bg-green-100 text-green-700",
      "Tidak Aktif": "bg-red-100 text-red-700",
      Cuti: "bg-purple-100 text-purple-700",
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
    <div className="space-y-8">

      {/* ================= HERO SLIDER ================= */}
      <div className="relative h-[300px] rounded-2xl overflow-hidden">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === activeHero ? "opacity-100" : "opacity-0"
              }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="relative z-10 h-full flex items-end px-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <CardStat icon={<Users size={26} />} label="Total Students" value={stats.total} color="#4A8BFF" />
        <CardStat icon={<CheckCircle size={26} />} label="Aktif" value={stats.Aktif} color="#57C374" />
        <CardStat icon={<XCircle size={26} />} label="Tidak Aktif" value={stats["Tidak Aktif"]} color="#FF6B6B" />
        <CardStat icon={<PauseCircle size={26} />} label="Cuti" value={stats.Cuti} color="#FFA500" />
        <CardStat icon={<LogOut size={26} />} label="Pengunduran Diri" value={stats["Pengunduran Diri"]} color="#FF4500" />
        <CardStat icon={<ClipboardList size={26} />} label="Diklat SO" value={stats["Diklat SO"]} color="#4A8BFF" />
        <CardStat icon={<CheckCircle size={26} />} label="Diterima SO" value={stats["Diterima SO"]} color="#20C997" />
      </div>

      {/* ================= TABLE ================= */}
      <h2 className="text-xl font-semibold">Siswa Sedang Cuti</h2>

      <div className="shadow-sm rounded-2xl p-6 bg-white overflow-x-auto">
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
              <th className="p-3 text-red-900">Aksi</th>
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
                <tr key={r.id} className=" hover:bg-slate-50">
                  <td className="p-3">{r.nis}</td>
                  <td className="p-3">{r.nama_lengkap}</td>
                  <td className="p-3">{r.jenis_kelamin}</td>
                  <td className="p-3">{r.angkatan}</td>
                  <td className="p-3">{r.nomor_wa}</td>
                  <td className="p-3">{statusBadge(r.status)}</td>
                  <td className="p-3">
                    {r.cuti_mulai} - {r.cuti_selesai}
                  </td>
                  <td className="p-3">{r.sisaHari}</td>
                  <td className="p-3">
                    <Link
                      to={`/students/${r.id}`}
                      className="inline-flex p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-200"
                    >
                      <Eye size={16} />
                    </Link>
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
