import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

// ===== BADGE STATUS =====
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
    nis,
    nama_lengkap,
    nomor_ktp,
    jenis_kelamin,
    tempat_lahir,
    tanggal_lahir,
    usia,
    agama,
    golongan_darah,
    status_pernikahan,
    nomor_wa,
    email,
    asal_daerah,
    alamat_jalan,
    alamat_rt,
    alamat_rw,
    alamat_kelurahan,
    alamat_kecamatan,
    alamat_kabupaten,
    tinggi_badan,
    berat_badan,
    lingkar_pinggang,
    ukuran_kaki,
    dominan_tangan,
    tanggal_masuk,
    angkatan,
    hobi,
    keahlian,
    tiga_kelebihan,
    satu_kekurangan,
    tiga_tujuan_jepang,
    tujuan_pulang,

    sd_nama,
    sd_tahun_masuk,
    sd_tahun_lulus,
    smp_nama,
    smp_tahun_masuk,
    smp_tahun_lulus,
    sma_nama,
    sma_tahun_masuk,
    sma_tahun_lulus,
    sma_jurusan,
    univ_nama,
    univ_tahun_masuk,
    univ_tahun_lulus,
    univ_jurusan,

    pekerjaan1_nama_perusahaan,
    pekerjaan1_jenis,
    pekerjaan1_tahun_masuk,
    pekerjaan1_bulan_masuk,
    pekerjaan1_tahun_keluar,
    pekerjaan1_bulan_keluar,

    pekerjaan2_nama_perusahaan,
    pekerjaan2_jenis,
    pekerjaan2_tahun_masuk,
    pekerjaan2_bulan_masuk,
    pekerjaan2_tahun_keluar,
    pekerjaan2_bulan_keluar,

    pekerjaan3_nama_perusahaan,
    pekerjaan3_jenis,
    pekerjaan3_tahun_masuk,
    pekerjaan3_bulan_masuk,
    pekerjaan3_tahun_keluar,
    pekerjaan3_bulan_keluar,

    pekerjaan4_nama_perusahaan,
    pekerjaan4_jenis,
    pekerjaan4_tahun_masuk,
    pekerjaan4_bulan_masuk,
    pekerjaan4_tahun_keluar,
    pekerjaan4_bulan_keluar,

    pekerjaan5_nama_perusahaan,
    pekerjaan5_jenis,
    pekerjaan5_tahun_masuk,
    pekerjaan5_bulan_masuk,
    pekerjaan5_tahun_keluar,
    pekerjaan5_bulan_keluar,

    gaji_terakhir,
    pernah_tes_so,

    ayah_nama,
    ayah_usia,
    ayah_pekerjaan,
    ayah_hp,

    ibu_nama,
    ibu_usia,
    ibu_pekerjaan,
    ibu_hp,

    saudara1_jenis,
    saudara1_nama,
    saudara1_usia,
    saudara1_pekerjaan,

    saudara2_jenis,
    saudara2_nama,
    saudara2_usia,
    saudara2_pekerjaan,

    saudara3_jenis,
    saudara3_nama,
    saudara3_usia,
    saudara3_pekerjaan,

    saudara4_jenis,
    saudara4_nama,
    saudara4_usia,
    saudara4_pekerjaan,

    saudara5_jenis,
    saudara5_nama,
    saudara5_usia,
    saudara5_pekerjaan,

    merokok,
    minum_alkohol,
    memiliki_paspor,
    sehat,
    penyakit_bawaan,
    pernah_operasi,
    alergi,
    dokumen_surat,

    program,
    rencana_pembayaran,
    pasangan_nama,
    pasangan_hp,

    shiken,
    ujian,
    kompetensi,
    keberangkatan,
    status,

    cuti_mulai,
    cuti_selesai,
    tanggal_pengunduran,

    foto_url,

    // Dokumen Pribadi
    link_ktp,
    link_kk,
    link_akta_kelahiran,
    link_ijazah,
    link_transkrip_nilai,
    link_skck,
    link_npwp,

    // Dokumen Keuangan
    link_sertifikat_tanah,
    link_sertifikat_rumah,
    link_pbb,
    link_ktp_ayah,
    link_ktp_ibu,
    link_buku_nikah_ortu,
    link_surat_penghasilan,
    link_sktm,

    // Dokumen Keberangkatan
    link_paspor,
    link_coe,
    link_visa,
    link_tiket_pesawat,
    link_asuransi_perjalanan,
    link_surat_sehat,

  } = student;


  // Format Alamat from flat fields
  const formatAlamat = () => {
    const parts = [];
    if (alamat_jalan) parts.push(alamat_jalan);
    const rt = alamat_rt || "-";
    const rw = alamat_rw || "-";
    parts.push(`RT ${rt}, RW ${rw}`);
    if (alamat_kelurahan) parts.push(alamat_kelurahan);
    if (alamat_kecamatan) parts.push(alamat_kecamatan);
    if (alamat_kabupaten) parts.push(alamat_kabupaten);
    const joined = parts.filter(Boolean).join(", ");
    return joined || "-";
  };

  // Helper: gather pekerjaan up to 5 (uses vars in component scope)
  const getJobs = () => {
    const jobs = [];
    if (pekerjaan1_nama_perusahaan || pekerjaan1_jenis || pekerjaan1_tahun_masuk || pekerjaan1_bulan_masuk || pekerjaan1_tahun_keluar || pekerjaan1_bulan_keluar) {
      jobs.push({ nama_perusahaan: pekerjaan1_nama_perusahaan, jenis: pekerjaan1_jenis, tahun_masuk: pekerjaan1_tahun_masuk, bulan_masuk: pekerjaan1_bulan_masuk, tahun_keluar: pekerjaan1_tahun_keluar, bulan_keluar: pekerjaan1_bulan_keluar });
    }
    if (pekerjaan2_nama_perusahaan || pekerjaan2_jenis || pekerjaan2_tahun_masuk || pekerjaan2_bulan_masuk || pekerjaan2_tahun_keluar || pekerjaan2_bulan_keluar) {
      jobs.push({ nama_perusahaan: pekerjaan2_nama_perusahaan, jenis: pekerjaan2_jenis, tahun_masuk: pekerjaan2_tahun_masuk, bulan_masuk: pekerjaan2_bulan_masuk, tahun_keluar: pekerjaan2_tahun_keluar, bulan_keluar: pekerjaan2_bulan_keluar });
    }
    if (pekerjaan3_nama_perusahaan || pekerjaan3_jenis || pekerjaan3_tahun_masuk || pekerjaan3_bulan_masuk || pekerjaan3_tahun_keluar || pekerjaan3_bulan_keluar) {
      jobs.push({ nama_perusahaan: pekerjaan3_nama_perusahaan, jenis: pekerjaan3_jenis, tahun_masuk: pekerjaan3_tahun_masuk, bulan_masuk: pekerjaan3_bulan_masuk, tahun_keluar: pekerjaan3_tahun_keluar, bulan_keluar: pekerjaan3_bulan_keluar });
    }
    if (pekerjaan4_nama_perusahaan || pekerjaan4_jenis || pekerjaan4_tahun_masuk || pekerjaan4_bulan_masuk || pekerjaan4_tahun_keluar || pekerjaan4_bulan_keluar) {
      jobs.push({ nama_perusahaan: pekerjaan4_nama_perusahaan, jenis: pekerjaan4_jenis, tahun_masuk: pekerjaan4_tahun_masuk, bulan_masuk: pekerjaan4_bulan_masuk, tahun_keluar: pekerjaan4_tahun_keluar, bulan_keluar: pekerjaan4_bulan_keluar });
    }
    if (pekerjaan5_nama_perusahaan || pekerjaan5_jenis || pekerjaan5_tahun_masuk || pekerjaan5_bulan_masuk || pekerjaan5_tahun_keluar || pekerjaan5_bulan_keluar) {
      jobs.push({ nama_perusahaan: pekerjaan5_nama_perusahaan, jenis: pekerjaan5_jenis, tahun_masuk: pekerjaan5_tahun_masuk, bulan_masuk: pekerjaan5_bulan_masuk, tahun_keluar: pekerjaan5_tahun_keluar, bulan_keluar: pekerjaan5_bulan_keluar });
    }
    return jobs;
  };

  // Helper: gather siblings
  const getSiblings = () => {
    const siblings = [];
    if (saudara1_nama || saudara1_jenis || saudara1_usia || saudara1_pekerjaan) siblings.push({ nama: saudara1_nama, jenis: saudara1_jenis, usia: saudara1_usia, pekerjaan: saudara1_pekerjaan });
    if (saudara2_nama || saudara2_jenis || saudara2_usia || saudara2_pekerjaan) siblings.push({ nama: saudara2_nama, jenis: saudara2_jenis, usia: saudara2_usia, pekerjaan: saudara2_pekerjaan });
    if (saudara3_nama || saudara3_jenis || saudara3_usia || saudara3_pekerjaan) siblings.push({ nama: saudara3_nama, jenis: saudara3_jenis, usia: saudara3_usia, pekerjaan: saudara3_pekerjaan });
    if (saudara4_nama || saudara4_jenis || saudara4_usia || saudara4_pekerjaan) siblings.push({ nama: saudara4_nama, jenis: saudara4_jenis, usia: saudara4_usia, pekerjaan: saudara4_pekerjaan });
    if (saudara5_nama || saudara5_jenis || saudara5_usia || saudara5_pekerjaan) siblings.push({ nama: saudara5_nama, jenis: saudara5_jenis, usia: saudara5_usia, pekerjaan: saudara5_pekerjaan });
    return siblings;
  };

  const isCategoryComplete = (links = []) => {
    return links.every(link => !!link);
  };

  // Helper: render dokumen_surat as a single link (legacy arrays will use the first link)
  const renderDokumen = () => {
    if (!dokumen_surat) return <NoData />;
    let link = dokumen_surat || null;
    return (
      <a href={link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Drive ({nama_lengkap})</a>
    );
  };

  const formatTanggal = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // bulan 0-indexed
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatRupiah = (number) => {
    if (!number) return "-";
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const dokumenKategori = [
    {
      title: "Dokumen Pribadi",
      links: {
        KTP: link_ktp,
        KK: link_kk,
        "Akta Kelahiran": link_akta_kelahiran,
        Ijazah: link_ijazah,
        "Transkrip Nilai": link_transkrip_nilai,
        SKCK: link_skck,
        NPWP: link_npwp,
      }
    },
    {
      title: "Dokumen Keuangan",
      links: {
        "Sertifikat Tanah": link_sertifikat_tanah,
        "Sertifikat Rumah": link_sertifikat_rumah,
        PBB: link_pbb,
        "KTP Ayah": link_ktp_ayah,
        "KTP Ibu": link_ktp_ibu,
        "Buku Nikah Ortu": link_buku_nikah_ortu,
        "Surat Penghasilan": link_surat_penghasilan,
        SKTM: link_sktm,
      }
    },
    {
      title: "Dokumen Keberangkatan",
      links: {
        Paspor: link_paspor,
        COE: link_coe,
        Visa: link_visa,
        "Tiket Pesawat": link_tiket_pesawat,
        "Asuransi Perjalanan": link_asuransi_perjalanan,
        "Surat Sehat": link_surat_sehat,
      }
    }
  ];

  const CategoryStatus = ({ complete }) => (
    complete ? (
      <span className="flex items-center gap-1 text-green-600 font-medium">
        ✔️ Completed
      </span>
    ) : (
      <span className="flex items-center gap-1 text-red-600 font-medium">
        ❌ Uncompleted
      </span>
    )
  );


  return (
    <div className="page-container p-6 md:px-10 min-h-screen space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl 
                    bg-gray-200 hover:bg-gray-300 
                    text-gray-700 font-medium shadow-sm 
                    transition active:scale-95"
        >
          <ArrowLeft size={18} />
          Kembali
        </button>

        <button
          onClick={() => navigate(`/students/edit/${id}`)}
          className="px-5 py-2 rounded-xl bg-[#B30707] text-white font-medium shadow-md hover:bg-[#8d0606] transition"
        >
          Edit Data
        </button>
      </div>

      {/* Title */}
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 flex gap-6">
        {/* FOTO SISWA */}
        <div className="w-[150px] h-[200px] rounded-xl overflow-hidden border border-gray-300 bg-gray-100 flex items-center justify-center">
          {foto_url ? (
            <img
              src={foto_url}
              alt={`Foto ${nama_lengkap}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-sm text-center">
              Tidak ada foto
            </span>
          )}
        </div>

        {/* INFO UTAMA */}
        <div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-[#0B2E4E] tracking-wide">
              {nama_lengkap || "-"}
            </h1>
          </div>

          <p className="text-gray-600 mt-1 text-lg gap-3">
            NIS: <span className="font-semibold">{nis}</span>
            <p className="mt-2 flex gap-2">
              {statusBadge(status)}
              {status == "Cuti" ? (<span className="text-gray-600 mt-1 text-sm font-semibold flex items-center gap-3 h-full">{cuti_mulai && cuti_selesai
                ? `${new Date(cuti_mulai).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })} - ${new Date(cuti_selesai).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}`
                : '-'}</span>) : ""}
              {status == "Pengunduran Diri" ? (<span className="text-gray-600 mt-1 text-sm font-semibold flex items-center gap-3 h-full">{tanggal_pengunduran
                ? new Date(tanggal_pengunduran).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })
                : '-'}
              </span>) : ""}
              {status == "Aktif" ? (<span className="text-gray-600 mt-1 text-sm font-semibold flex items-center gap-3 h-full">{tanggal_masuk
                ? new Date(tanggal_masuk).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })
                : '-'}
              </span>) : ""}
            </p>
          </p>
        </div>
      </div>

      {/* Data Pribadi */}
      <Section title="Data Pribadi">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-700 text-[15px]">
          <Info label="Nomor KTP" value={nomor_ktp ? String(nomor_ktp) : "-"} />
          <Info label="Jenis Kelamin" value={jenis_kelamin} />
          <Info label="Tempat Lahir" value={tempat_lahir} />
          <Info label="Tanggal Lahir" value={formatTanggal(tanggal_lahir)} />
          <Info label="Usia" value={`${usia} Tahun`} />
          <Info label="Agama" value={agama} />
          <Info label="Golongan Darah" value={golongan_darah} />
          <Info label="Status Pernikahan" value={status_pernikahan} />
          <Info label="Nomor WA" value={nomor_wa} />
          <Info label="Email" value={email} />
          <Info label="Tinggi Badan" value={tinggi_badan ? `${tinggi_badan} cm` : "-"} />
          <Info label="Berat Badan" value={berat_badan ? `${berat_badan} kg` : "-"} />
          <Info label="Lingkar Pinggang" value={lingkar_pinggang ? `${lingkar_pinggang} cm` : "-"} />
          <Info label="Ukuran Kaki" value={ukuran_kaki} />
          <Info label="Dominan Tangan" value={dominan_tangan} />
          <Info label="Tanggal Masuk" value={tanggal_masuk} />
          <Info label="Angkatan" value={angkatan} />
          <Info label="Hobi" value={hobi} />
          <Info label="Keahlian" value={keahlian} />
          <Info label="Tiga Kelebihan" value={tiga_kelebihan} />
          <Info label="Satu Kekurangan" value={satu_kekurangan} />
          <Info label="Tiga Tujuan Jepang" value={tiga_tujuan_jepang} />
          <Info label="Tujuan Pulang" value={tujuan_pulang} />
          <Info span label="Asal Daerah" value={asal_daerah} />
          <Info span label="Alamat KTP" value={formatAlamat()} />
        </div>
      </Section>

      {/* Pendidikan */}
      <Section title="Pendidikan">
        <Grid>
          {(sd_nama || sd_tahun_masuk || sd_tahun_lulus) ? (
            <Card
              title="SD"
              data={{ nama: sd_nama, tahun_masuk: sd_tahun_masuk, tahun_lulus: sd_tahun_lulus }}
            />
          ) : null}

          {(smp_nama || smp_tahun_masuk || smp_tahun_lulus) ? (
            <Card
              title="SMP"
              data={{ nama: smp_nama, tahun_masuk: smp_tahun_masuk, tahun_lulus: smp_tahun_lulus }}
            />
          ) : null}

          {(sma_nama || sma_tahun_masuk || sma_tahun_lulus) ? (
            <Card
              title="SMA"
              data={{ nama: sma_nama, jurusan: sma_jurusan, tahun_masuk: sma_tahun_masuk, tahun_lulus: sma_tahun_lulus }}
            />
          ) : null}

          {(univ_nama || univ_tahun_masuk || univ_tahun_lulus) ? (
            <Card
              title="Universitas"
              data={{ nama: univ_nama, jurusan: univ_jurusan, tahun_masuk: univ_tahun_masuk, tahun_lulus: univ_tahun_lulus }}
            />
          ) : null}
        </Grid>
      </Section>

      {/* Riwayat Pekerjaan */}
      <Section title="Riwayat Pekerjaan">
        <Grid>
          {getJobs().length ? (
            getJobs().map((job, i) => (
              <Card key={i} title={job.nama_perusahaan || `Pekerjaan ${i + 1}`} data={job} />
            ))
          ) : (
            <NoData />
          )}
        </Grid>
      </Section>

      <Section title="Pengalaman & Tes">
        <Grid>
          <Info label="Gaji Terakhir" value={gaji_terakhir ? `Rp ${formatRupiah(gaji_terakhir)}` : "-"} />
          <Info label="Pernah Tes SO" value={pernah_tes_so ? pernah_tes_so + " kali" : "Tidak"} />
        </Grid>
      </Section>

      {/* Data Keluarga */}
      <Section title="Data Keluarga">
        <Grid>
          {(ayah_nama || ayah_pekerjaan || ayah_hp) && (
            <Card title="Ayah" data={{ nama: ayah_nama, usia: ayah_usia, pekerjaan: ayah_pekerjaan, hp: ayah_hp }} />
          )}

          {(ibu_nama || ibu_pekerjaan || ibu_hp) && (
            <Card title="Ibu" data={{ nama: ibu_nama, usia: ibu_usia, pekerjaan: ibu_pekerjaan, hp: ibu_hp }} />
          )}

          {getSiblings().length ? getSiblings().map((s, i) => (
            <Card key={i} title={`Saudara (${s.jenis})`} data={s} />
          )) : null}
        </Grid>
      </Section>

      {/* Health & Program */}
      <Section title="Health & Program Info">
        <Grid>
          <Card title="Health" data={{ merokok, minum_alkohol, memiliki_paspor, sehat, penyakit_bawaan, pernah_operasi, alergi }} />

          <Card
            title="Program Info"
            data={{ program, rencana_pembayaran, pasangan: pasangan_nama, pasangan_hp }}
          />
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
        <div className="space-y-4">
          {dokumenKategori.map((kategori, idx) => {
            const values = Object.values(kategori.links);
            const isComplete = isCategoryComplete(values);

            return (
              <div
                key={idx}
                className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white/90"
              >
                {/* Header kategori */}
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-[#0B2E4E] tracking-wide">
                    {kategori.title}
                  </p>

                  {isComplete ? (
                    <span className="px-3 py-1 text-sm rounded-lg font-medium bg-green-100 text-green-700">
                      ✔️ Completed
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-sm rounded-lg font-medium bg-red-100 text-red-700">
                      ❌ Uncompleted
                    </span>
                  )}
                </div>

                {/* Isi dokumen */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-[15px]">
                  {Object.entries(kategori.links).map(([label, link]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 min-w-[160px]">
                        {label}
                      </span>

                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          Lihat Dokumen
                        </a>
                      ) : (
                        <span className="text-red-500 italic text-sm">
                          Belum diupload
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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
