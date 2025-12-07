import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// ===== BADGE STATUS =====
const statusBadge = (status) => {
  const color = {
    "Aktif": "bg-green-100 text-green-700 text-sm",
    "Tidak Aktif": "bg-red-100 text-red-700 text-sm",
    "Diklat SO": "bg-blue-100 text-blue-700 text-sm",
    "Diterima SO": "bg-yellow-100 text-yellow-700 text-sm",
  }[status] || "bg-gray-100 text-gray-600 text-sm";

  return (
    <span className={`px-2 py-1 text-sm rounded-lg font-medium ${color}`}>
      {status || "Belum Diisi"}
    </span>
  );
};

// Card reusable
function Card({ title, data }) {
  return (
    <div className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white/90 hover:shadow-md transition">
      {title && (
        <p className="text-[#B30707] font-semibold mb-2 tracking-wide">
          {title}
        </p>
      )}
      <div className="space-y-1 text-[15px] text-gray-700">
        {Object.entries(data).map(([key, value]) => (
          <div key={key}>
            <span className="font-medium capitalize">
              {key.replace(/_/g, " ")}:
            </span>{" "}
            {Array.isArray(value)
            ? value.join(", ")
            : typeof value === "boolean"
            ? value ? "Ya" : "Tidak"
            : value?.toString() || "-"
            }
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .single();

      !error ? setStudent(data) : console.error(error);
      setLoading(false);
    };
    loadStudent();
  }, [id]);

  if (loading)
    return <div className="p-6 text-gray-600 animate-pulse">Loading data...</div>;
  if (!student)
    return <div className="p-6 text-red-600">Student tidak ditemukan</div>;

  const {
    nis, nama, nomor_ktp, jenis_kelamin, tempat_lahir, tanggal_lahir, usia, agama,
    golongan_darah, status_pernikahan, nomor_wa, email, asal_daerah, alamat_ktp,
    tinggi_badan, berat_badan, lingkar_pinggang, ukuran_kaki, dominan_tangan,
    tanggal_masuk, angkatan, hobi, keahlian,
    pendidikan, pekerjaan, keluarga, health, program_info,
    shiken, ujian, kompetensi, keberangkatan, dokumen_surat, status
  } = student;


  // Format Alamat KTP (JSON or string)
  const formatAlamat = () => {
    if (!alamat_ktp) return "-";

    try {
      const obj = typeof alamat_ktp === "string" ? JSON.parse(alamat_ktp) : alamat_ktp;
      if (typeof obj === "object") {
        return `${obj.jalan || ""}, RT ${obj.rt || "-"}, RW ${obj.rw || "-"}, ${
          obj.kelurahan || ""
        }, ${obj.kecamatan || ""}, ${obj.kota || ""}`;
      }
    } catch {
      return alamat_ktp; // return as plain text
    }
    return alamat_ktp;
  };

  return (
    <div className="page-container p-6 md:px-10 min-h-screen space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl text-gray-700 font-medium shadow-sm"
        >
          ← Kembali
        </button>

        <button
          onClick={() => navigate(`/students/edit/${id}`)}
          className="px-5 py-2 rounded-xl bg-[#B30707] text-white font-medium shadow-md hover:bg-[#8d0606] transition"
        >
          Edit Data
        </button>
      </div>

      {/* Title */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <h1 className="text-3xl font-extrabold text-[#0B2E4E] tracking-wide">
          {nama}
        </h1>

        <p className="text-gray-600 mt-1 text-lg flex items-center gap-3">
          Nomor Induk Siswa: <span className="font-semibold">{nis}</span>
          {statusBadge(status)}
        </p>
      </div>

      {/* Data Pribadi */}
      <Section title="Data Pribadi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-[15px]">
          <Info label="Nomor KTP" value={nomor_ktp} />
          <Info label="Jenis Kelamin" value={jenis_kelamin} />
          <Info label="Tempat Lahir" value={tempat_lahir} />
          <Info label="Tanggal Lahir" value={tanggal_lahir} />
          <Info label="Usia" value={`${usia} Tahun`} />
          <Info label="Agama" value={agama} />
          <Info label="Golongan Darah" value={golongan_darah} />
          <Info label="Status Pernikahan" value={status_pernikahan} />
          <Info label="Nomor WA" value={nomor_wa} />
          <Info label="Email" value={email} />
          <Info label="Tinggi Badan" value={`${tinggi_badan} cm`} />
          <Info label="Berat Badan" value={`${berat_badan} kg`} />
          <Info label="Lingkar Pinggang" value={`${lingkar_pinggang} cm`} />
          <Info label="Ukuran Kaki" value={ukuran_kaki} />
          <Info label="Dominan Tangan" value={dominan_tangan} />
          <Info label="Tanggal Masuk" value={tanggal_masuk} />
          <Info label="Angkatan" value={angkatan} />
          <Info label="Hobi" value={Array.isArray(hobi) ? hobi.join(", ") : hobi} />
          <Info label="Keahlian" value={Array.isArray(keahlian) ? keahlian.join(", ") : keahlian} />
          <Info span label="Asal Daerah" value={asal_daerah} />
          <Info span label="Alamat KTP" value={formatAlamat()} />
        </div>
      </Section>

      {/* Pendidikan */}
      <Section title="Pendidikan">
        <Grid>
          {pendidikan?.sd && <Card title="SD" data={pendidikan.sd} />}
          {pendidikan?.smp && <Card title="SMP" data={pendidikan.smp} />}
          {pendidikan?.sma && <Card title="SMA" data={pendidikan.sma} />}
          {pendidikan?.universitas && (
            <Card
              title="Universitas"
              data={{
                nama: pendidikan.universitas.nama,
                jurusan: pendidikan.universitas.jurusan,
                tahun_masuk: pendidikan.universitas.tahun_masuk,
                tahun_lulus: pendidikan.universitas.tahun_lulus
              }}
            />
          )}
        </Grid>
      </Section>

      {/* Riwayat Pekerjaan */}
      <Section title="Riwayat Pekerjaan">
        {pekerjaan?.length ? (
          <Grid>
            {pekerjaan.map((job, i) => (
              <Card key={i} title={job.jenis_pekerjaan} data={job} />
            ))}
          </Grid>
        ) : (
          <NoData />
        )}
      </Section>

      {/* Data Keluarga */}
      <Section title="Data Keluarga">
        <Grid>
          {keluarga?.ayah && <Card title="Ayah" data={keluarga.ayah} />}
          {keluarga?.ibu && <Card title="Ibu" data={keluarga.ibu} />}
          {keluarga?.saudara?.map((s, i) => (
            <Card key={i} title={`Saudara (${s.jenis})`} data={s} />
          ))}
        </Grid>
      </Section>

      {/* Health & Program */}
      <Section title="Health & Program Info">
        <Grid>
          {health && <Card title="Health" data={health} />}
          {program_info && (
            <Card
                title="Program Info"
                data={{
                "Jenis Program": program_info?.jenis_program || "-",
                "Rencana Pembayaran": program_info?.rencana_pembayaran || "-"
                }}
            />
            )}
        </Grid>
      </Section>

      {/* Shiken & Ujian */}
      <Section title="Shiken & Ujian">
        <Grid>
          {shiken ? <Card title="Shiken" data={shiken} /> : <NoData />}
          {/* {ujian ? <Card title="Ujian" data={ujian} /> : <NoData />}
          {kompetensi ? <Card title="Kompetensi" data={kompetensi} /> : <NoData />} */}
        </Grid>
      </Section>

      {/* Keberangkatan */}
      <Section title="Keberangkatan">
        {keberangkatan ? <Card data={keberangkatan} /> : <NoData />}
      </Section>

      {/* Dokumen */}
      <Section title="Dokumen">
        {dokumen_surat?.length ? (
          <ul className="list-disc space-y-1 pl-5">
            {dokumen_surat.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  className="text-blue-600 hover:underline"
                >
                  Dokumen {i + 1}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <NoData />
        )}
      </Section>
    </div>
  );
}

// ========== Reusable Components ==========

function Section({ title, children }) {
  return (
    <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
      <h2 className="text-lg font-bold text-[#B30707] border-l-4 border-[#B30707] pl-3 mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>;
}

function Info({ label, value, span }) {
  return (
    <div className={`${span ? "col-span-2" : ""}`}>
      <span className="font-medium">{label}:</span> {value || "-"}
    </div>
  );
}

function NoData() {
  return <p className="text-gray-500 italic">Tidak ada data tersedia</p>;
}
