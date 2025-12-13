import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { generateNIS } from "../utils/generateNIS";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
// Note: replaced searchable selects for places with simple text inputs per UX requirement

export default function StudentForm({ onDone, onCancel }) {
  const today = new Date().toISOString().slice(0, 10);
  const navigate = useNavigate();

  const initialData = {
    angkatan: "",
    // default to today's date but still editable
    tanggal_masuk: today,
    nis: "",
    // Data Pribadi
    nama: "",
    nomor_ktp: "",
    jenis_kelamin: "Laki-laki",
    tempat_lahir: "",
    tanggal_lahir: "",
    usia: "",
    agama: "Islam",
    golongan_darah: "",
    status_pernikahan: "Belum Menikah",
    nomor_wa: "",
    email: "",
    asal_daerah: "",
    // KTP address fields — match the rest of the form
    alamat_ktp_jalan: "",
    alamat_ktp_rt: "",
    alamat_ktp_rw: "",
    alamat_ktp_kelurahan: "",
    alamat_ktp_kecamatan: "",
    alamat_ktp_kota: "",
    // Fisik & Kepribadian
    tinggi_badan: "",
    berat_badan: "",
    lingkar_pinggang: "",
    ukuran_kaki: "",
    dominan_tangan: "Kanan",
    // Pendidikan
    sd_tahun_masuk: "",
    sd_tahun_lulus: "",
    smp_tahun_masuk: "",
    smp_tahun_lulus: "",
    sma_tahun_masuk: "",
    sma_tahun_lulus: "",
    univ_tahun_masuk: "",
    univ_tahun_lulus: "",
    pengalaman_kerja: [],
    // arrays and nested objects used throughout the form
    hobi: [],
    keahlian: [],
    kelebihan: [],
    tujuan_ke_jepang: [],
    tujuan_pulang: [],
    kekurangan: "",
    // pendidikan structure
    pendidikan: {
      sd: { nama: "", tahun_masuk: "", tahun_lulus: "" },
      smp: { nama: "", tahun_masuk: "", tahun_lulus: "" },
      sma: { nama: "", tahun_masuk: "", tahun_lulus: "", jurusan: "" },
      universitas: { nama: "", tahun_masuk: "", tahun_lulus: "", jurusan: "" }
    },

    // pekerjaan (default 1 empty entry)
    pekerjaan: [
      { nama_perusahaan: "", jenis_pekerjaan: "", tahun_masuk: "", bulan_masuk: "", tahun_keluar: "", bulan_keluar: "" }
    ],

    gaji_terakhir: "",
    pernah_tes_so: "",

    // Keluarga
    keluarga: {
      ayah: { nama: "", usia: "", pekerjaan: "", nomor_hp: "" },
      ibu: { nama: "", usia: "", pekerjaan: "", nomor_hp: "" },
      saudara: []
    },
    // health & dokumen
    health: { merokok: false, alkohol: false, paspor: false, sehat: true, penyakit_bawaan: "", pernah_operasi: "", alergi: "" },
    dokumen_surat: "",

    // pasangan & program
    program: "Magang",
    rencana_pembayaran: "Biaya Mandiri",
    pasangan: { nama: "", nomor_hp: "" },
    status: "Aktif",
  };

  const [data, setData] = useState(initialData);

  const [tempHobi, setTempHobi] = useState((initialData.hobi || []).join(", "));
  const [tempKeahlian, setTempKeahlian] = useState((initialData.keahlian || []).join(", "));
  const [tempKelebihan, setTempKelebihan] = useState((initialData.kelebihan || []).join(", "));
  const [tempTujuanKeJepang, setTempTujuanKeJepang] = useState((initialData.tujuan_ke_jepang || []).join(", "));
  const [tempTujuanPulang, setTempTujuanPulang] = useState((initialData.tujuan_pulang || []).join(", "));
  const [nisAuto, setNisAuto] = useState(true);

  const setField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));
  const handleArrayField = (field, value) =>
    setData((prev) => ({ ...prev, [field]: value.split(",").map((v) => v.trim()) }));
  const handleNestedField = (parent, child, value) =>
    setData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
  const handleNestedArray = (parent, index, child, value) => {
    const arr = [...data[parent]];
    arr[index][child] = value;
    setData((prev) => ({ ...prev, [parent]: arr }));
  };
  // Helper untuk meng-handle array yang berada di dalam objek (contoh: keluarga.saudara)
  const handleNestedArrayNested = (parentObjKey, arrayKey, index, child, value) => {
    const parentObj = { ...(data[parentObjKey] || {}) };
    const arr = Array.isArray(parentObj[arrayKey]) ? [...parentObj[arrayKey]] : [];
    arr[index] = { ...(arr[index] || {}), [child]: value };
    parentObj[arrayKey] = arr;
    setData((prev) => ({ ...prev, [parentObjKey]: parentObj }));
  };

  // Hitung usia otomatis
  useEffect(() => {
    if (data.tanggal_lahir) {
      const birth = new Date(data.tanggal_lahir);
      const age = new Date().getFullYear() - birth.getFullYear();
      setData((prev) => ({ ...prev, usia: age }));
    }
  }, [data.tanggal_lahir]);

  // keep text area temp fields in sync if `data` gets populated (e.g., edit form)
  useEffect(() => {
    setTempHobi((data.hobi || []).join(", "));
    setTempKeahlian((data.keahlian || []).join(", "));
    setTempKelebihan((data.kelebihan || []).join(", "));
    setTempTujuanKeJepang((data.tujuan_ke_jepang || []).join(", "));
    setTempTujuanPulang((data.tujuan_pulang || []).join(", "));
  }, [data.hobi, data.keahlian, data.kelebihan, data.tujuan_ke_jepang, data.tujuan_pulang]);

  // auto-preview NIS when angkatan / tanggal_masuk changed, unless user manually edited NIS
  useEffect(() => {
    if (!nisAuto) return;
    if (!data.angkatan || !data.tanggal_masuk) return;
    let mounted = true;
    (async () => {
      try {
        const tahun = new Date(data.tanggal_masuk).getFullYear();
        const candidate = await generateNIS(data.angkatan, tahun);
        if (mounted) setField("nis", candidate);
      } catch (err) {
        console.warn("generateNIS preview failed", err);
      }
    })();
    return () => { mounted = false; };
  }, [data.angkatan, data.tanggal_masuk, nisAuto]);

  const save = (e) => { 
    e.preventDefault();
    (async () => {
      try {
        // validate months and non-negative numeric inputs before saving
        setError("");
        const parseNum = (v) => {
          if (v === null || v === undefined || v === "") return null;
          const n = Number(String(v).replace(/[^\d.-]+/g, ""));
          return Number.isNaN(n) ? null : n;
        };

        const errors = [];

        // pekerjaan month validations: must be 1..12 if provided
        (data.pekerjaan || []).forEach((job, idx) => {
          ["bulan_masuk", "bulan_keluar"].forEach((k) => {
            const v = job[k];
            if (v !== undefined && v !== null && String(v).trim() !== "") {
              const n = Number(String(v));
              if (!Number.isInteger(n) || n < 1 || n > 12) {
                errors.push(`Bulan ${k.replace("_", " ")} pada pekerjaan ${idx + 1} harus antara 01 dan 12`);
              }
            }
          });
        });

        // helper to check non-negative numeric-ish values
        const checkNonNegative = (val, label) => {
          const n = parseNum(val);
          if (n !== null && n < 0) errors.push(`${label} tidak boleh negatif`);
        };

        // top-level numeric checks
        ["angkatan", "tinggi_badan", "berat_badan", "lingkar_pinggang", "ukuran_kaki", "pernah_tes_so"].forEach((k) => checkNonNegative(data[k], k.replace(/_/g, " ")));

        // pendidikan years
        ["sd", "smp", "sma", "universitas"].forEach((level) => {
          const p = data.pendidikan?.[level];
          if (p) {
            ["tahun_masuk", "tahun_lulus"].forEach((yr) => checkNonNegative(p[yr], `${level.toUpperCase()} ${yr}`));
          }
        });

        // pekerjaan years
        (data.pekerjaan || []).forEach((job, idx) => {
          ["tahun_masuk", "tahun_keluar"].forEach((yr) => checkNonNegative(job[yr], `Pekerjaan ${idx + 1} ${yr}`));
        });

        // keluarga ages
        ["ayah", "ibu"].forEach((parent) => checkNonNegative(data.keluarga?.[parent]?.usia, `${parent} usia`));
        (data.keluarga?.saudara || []).forEach((s, idx) => checkNonNegative(s.usia, `Saudara ${idx + 1} usia`));

        if (errors.length) {
          setError(errors.join("; "));
          return;
        }

        // Nomor KTP harus 16 digit (tepat)
        if (!/^\d{16}$/.test(String(data.nomor_ktp || "").trim())) {
          setError("Nomor KTP harus terdiri dari tepat 16 digit");
          return;
        }

        setSaving(true);

        // prepare arrays from temp fields (don't rely on setState flush)
        const hobi = tempHobi ? tempHobi.split(/\s*,\s*|\n/) : [];
        const keahlian = tempKeahlian ? tempKeahlian.split(/\s*,\s*|\n/) : [];
        const kelebihan = tempKelebihan ? tempKelebihan.split(/\s*,\s*|\n/) : [];
        const tujuan_ke_jepang = tempTujuanKeJepang ? tempTujuanKeJepang.split(/\s*,\s*|\n/) : [];
        const tujuan_pulang = tempTujuanPulang ? tempTujuanPulang.split(/\s*,\s*|\n/) : [];

        const toNumber = (v) => {
          if (v === null || v === undefined || v === "") return null;
          const n = Number(String(v).replace(/[^\d.-]+/g, ""));
          return Number.isNaN(n) ? null : n;
        };

        const joinArr = (arr) => (Array.isArray(arr) ? arr.join(", ") : arr || null);

        const boolToYesNo = (v) => (v === true || v === "true" || v === "Ya" ? "Ya" : "Tidak");

        const payload = {
          angkatan: toNumber(data.angkatan),
          tanggal_masuk: data.tanggal_masuk || null,
          nis: data.nis || null,

          // personal (DB column names)
          nama_lengkap: data.nama || null,
          nomor_ktp: toNumber(data.nomor_ktp),
          jenis_kelamin: data.jenis_kelamin || "Laki-laki",
          tempat_lahir: data.tempat_lahir || null,
          tanggal_lahir: data.tanggal_lahir || null,
          usia: toNumber(data.usia),
          agama: data.agama || "Islam",
          golongan_darah: data.golongan_darah || null,
          status_pernikahan: data.status_pernikahan || "Belum Menikah",
          nomor_wa: data.nomor_wa || null,
          email: data.email || null,
          asal_daerah: data.asal_daerah || null,
          alamat_jalan: data.alamat_ktp_jalan || null,
          alamat_rt: data.alamat_ktp_rt || null,
          alamat_rw: data.alamat_ktp_rw || null,
          alamat_kelurahan: data.alamat_ktp_kelurahan || null,
          alamat_kecamatan: data.alamat_ktp_kecamatan || null,
          alamat_kabupaten: data.alamat_ktp_kota || null,

          // physical / personality
          tinggi_badan: toNumber(data.tinggi_badan),
          berat_badan: toNumber(data.berat_badan),
          lingkar_pinggang: toNumber(data.lingkar_pinggang),
          ukuran_kaki: toNumber(data.ukuran_kaki),
          dominan_tangan: data.dominan_tangan || "Kanan",
          hobi: joinArr(hobi),
          keahlian: joinArr(keahlian),
          tiga_kelebihan: joinArr(kelebihan),
          satu_kekurangan: data.kekurangan || null,
          tiga_tujuan_jepang: joinArr(tujuan_ke_jepang),
          tujuan_pulang: joinArr(tujuan_pulang),

          // pendidikan
          sd_nama: data.pendidikan?.sd?.nama || null,
          sd_tahun_masuk: toNumber(data.pendidikan?.sd?.tahun_masuk),
          sd_tahun_lulus: toNumber(data.pendidikan?.sd?.tahun_lulus),

          smp_nama: data.pendidikan?.smp?.nama || null,
          smp_tahun_masuk: toNumber(data.pendidikan?.smp?.tahun_masuk),
          smp_tahun_lulus: toNumber(data.pendidikan?.smp?.tahun_lulus),

          sma_nama: data.pendidikan?.sma?.nama || null,
          sma_tahun_masuk: toNumber(data.pendidikan?.sma?.tahun_masuk),
          sma_tahun_lulus: toNumber(data.pendidikan?.sma?.tahun_lulus),
          sma_jurusan: data.pendidikan?.sma?.jurusan || null,

          univ_nama: data.pendidikan?.universitas?.nama || null,
          univ_tahun_masuk: toNumber(data.pendidikan?.universitas?.tahun_masuk) || null,
          // Fix: read tahun_lulus (not tahun_keluar) and default to 0
          univ_tahun_lulus: toNumber(data.pendidikan?.universitas?.tahun_lulus) || null,
          univ_jurusan: data.pendidikan?.universitas?.jurusan || null,

          // pekerjaan (up to 4)
          pekerjaan1_nama_perusahaan: data.pekerjaan[0]?.nama_perusahaan || null,
          pekerjaan1_jenis: data.pekerjaan[0]?.jenis_pekerjaan || null,
          pekerjaan1_tahun_masuk: data.pekerjaan[0]?.tahun_masuk || null,
          pekerjaan1_bulan_masuk: data.pekerjaan[0]?.bulan_masuk || null,
          pekerjaan1_tahun_keluar: data.pekerjaan[0]?.tahun_keluar || null,
          pekerjaan1_bulan_keluar: data.pekerjaan[0]?.bulan_keluar || null,

          pekerjaan2_nama_perusahaan: data.pekerjaan[1]?.nama_perusahaan || null,
          pekerjaan2_jenis: data.pekerjaan[1]?.jenis_pekerjaan || null,
          pekerjaan2_tahun_masuk: data.pekerjaan[1]?.tahun_masuk || null,
          pekerjaan2_bulan_masuk: data.pekerjaan[1]?.bulan_masuk || null,
          pekerjaan2_tahun_keluar: data.pekerjaan[1]?.tahun_keluar || null,
          pekerjaan2_bulan_keluar: data.pekerjaan[1]?.bulan_keluar || null,

          pekerjaan3_nama_perusahaan: data.pekerjaan[2]?.nama_perusahaan || null,
          pekerjaan3_jenis: data.pekerjaan[2]?.jenis_pekerjaan || null,
          pekerjaan3_tahun_masuk: data.pekerjaan[2]?.tahun_masuk || null,
          pekerjaan3_bulan_masuk: data.pekerjaan[2]?.bulan_masuk || null,
          pekerjaan3_tahun_keluar: data.pekerjaan[2]?.tahun_keluar || null,
          pekerjaan3_bulan_keluar: data.pekerjaan[2]?.bulan_keluar || null,

          pekerjaan4_nama_perusahaan: data.pekerjaan[3]?.nama_perusahaan || null,
          pekerjaan4_jenis: data.pekerjaan[3]?.jenis_pekerjaan || null,
          pekerjaan4_tahun_masuk: data.pekerjaan[3]?.tahun_masuk || null,
          pekerjaan4_bulan_masuk: data.pekerjaan[3]?.bulan_masuk || null,
          pekerjaan4_tahun_keluar: data.pekerjaan[3]?.tahun_keluar || null,
          pekerjaan4_bulan_keluar: data.pekerjaan[3]?.bulan_keluar || null,
          
          pekerjaan5_nama_perusahaan: data.pekerjaan[4]?.nama_perusahaan || null,
          pekerjaan5_jenis: data.pekerjaan[4]?.jenis_pekerjaan || null,
          pekerjaan5_tahun_masuk: data.pekerjaan[4]?.tahun_masuk || null,
          pekerjaan5_bulan_masuk: data.pekerjaan[4]?.bulan_masuk || null,
          pekerjaan5_tahun_keluar: data.pekerjaan[4]?.tahun_keluar || null,
          pekerjaan5_bulan_keluar: data.pekerjaan[4]?.bulan_keluar || null,

          gaji_terakhir: toNumber(data.gaji_terakhir),
          pernah_tes_so: toNumber(data.pernah_tes_so) || 0,

          // keluarga
          ayah_nama: data.keluarga?.ayah?.nama || null,
          ayah_usia: data.keluarga?.ayah?.usia || null,
          ayah_pekerjaan: data.keluarga?.ayah?.pekerjaan || null,
          ayah_hp: data.keluarga?.ayah?.nomor_hp || null,

          ibu_nama: data.keluarga?.ibu?.nama || null,
          ibu_usia: data.keluarga?.ibu?.usia || null,
          ibu_pekerjaan: data.keluarga?.ibu?.pekerjaan || null,
          ibu_hp: data.keluarga?.ibu?.nomor_hp || null,

          saudara1_jenis: data.keluarga?.saudara?.[0] ? (data.keluarga.saudara[0].jenis || "Adik Laki-laki") : null,
          saudara1_nama: data.keluarga?.saudara?.[0]?.nama || null,
          saudara1_usia: data.keluarga?.saudara?.[0]?.usia || null,
          saudara1_pekerjaan: data.keluarga?.saudara?.[0]?.pekerjaan || null,

          saudara2_jenis: data.keluarga?.saudara?.[1] ? (data.keluarga.saudara[1].jenis || "Adik Laki-laki") : null,
          saudara2_nama: data.keluarga?.saudara?.[1]?.nama || null,
          saudara2_usia: data.keluarga?.saudara?.[1]?.usia || null,
          saudara2_pekerjaan: data.keluarga?.saudara?.[1]?.pekerjaan || null,

          saudara3_jenis: data.keluarga?.saudara?.[2] ? (data.keluarga.saudara[2].jenis || "Adik Laki-laki") : null,
          saudara3_nama: data.keluarga?.saudara?.[2]?.nama || null,
          saudara3_usia: data.keluarga?.saudara?.[2]?.usia || null,
          saudara3_pekerjaan: data.keluarga?.saudara?.[2]?.pekerjaan || null,

          saudara4_jenis: data.keluarga?.saudara?.[3] ? (data.keluarga.saudara[3].jenis || "Adik Laki-laki") : null,
          saudara4_nama: data.keluarga?.saudara?.[3]?.nama || null,
          saudara4_usia: data.keluarga?.saudara?.[3]?.usia || null,
          saudara4_pekerjaan: data.keluarga?.saudara?.[3]?.pekerjaan || null,

          saudara5_jenis: data.keluarga?.saudara?.[4] ? (data.keluarga.saudara[4].jenis || "Adik Laki-laki") : null,
          saudara5_nama: data.keluarga?.saudara?.[4]?.nama || null,
          saudara5_usia: data.keluarga?.saudara?.[4]?.usia || null,
          saudara5_pekerjaan: data.keluarga?.saudara?.[4]?.pekerjaan || null,

          // health & dokumen
          merokok: boolToYesNo(data.health?.merokok),
          minum_alkohol: boolToYesNo(data.health?.alkohol),
          memiliki_paspor: boolToYesNo(data.health?.paspor),
          sehat: boolToYesNo(data.health?.sehat),
          penyakit_bawaan: data.health?.penyakit_bawaan || null,
          pernah_operasi: data.health?.pernah_operasi || null,
          alergi: data.health?.alergi || null,

          // program & pasangan (flat)
          program: data.program || "Magang",
          rencana_pembayaran: data.rencana_pembayaran || "Biaya Mandiri",
          pasangan_nama: data.pasangan?.nama || null,
          pasangan_hp: data.pasangan?.nomor_hp || null,

          status: data.status || "Aktif",
          dokumen_surat: null,
        };

        // Insert behavior:
        // - if user manually set NIS (nisAuto === false and data.nis present), honor it and try a single insert
        // - otherwise generate NIS and retry on conflicts (to avoid races)
        let inserted = null;
        let lastError = null;

        if (!nisAuto && data.nis) {
          // user-provided NIS - attempt single insert
          payload.nis = data.nis;
          const { data: ins, error: insertError } = await supabase
            .from("students")
            .insert(payload)
            .select()
            .single();

          if (insertError) {
            const msg = (insertError && (insertError.message || insertError.details || "")).toString().toLowerCase();
            if (msg.includes("duplicate") || msg.includes("unique") || msg.includes("23505") || (insertError && insertError.code === "23505")) {
              throw new Error("NIS yang Anda masukkan sudah dipakai, silakan gunakan NIS lain atau biarkan sistem menghasilkan NIS otomatis.");
            }
            throw insertError;
          }

          inserted = ins;
        } else {
          const maxAttempts = 10;
          for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
              const angk = payload.angkatan || data.angkatan || 0;
              const tahun = data.tanggal_masuk ? new Date(data.tanggal_masuk).getFullYear() : undefined;
              const nisCandidate = await generateNIS(angk, tahun);
              payload.nis = nisCandidate;

              const { data: ins, error: insertError } = await supabase
                .from("students")
                .insert(payload)
                .select()
                .single();

              if (insertError) throw insertError;

              inserted = ins;
              break;
            } catch (err) {
              lastError = err;
              const msg = (err && (err.message || err.details || err.error_description || "")).toString().toLowerCase();
              if (msg.includes("duplicate") || msg.includes("unique") || msg.includes("23505") || (err && err.code === "23505")) {
                // conflict on NIS — retry (next generateNIS will pick up updated max)
                continue;
              }
              // other errors: abort
              throw err;
            }
          }

          if (!inserted) {
            throw lastError || new Error("Gagal menyimpan data siswa karena konflik pada NIS, silakan coba lagi.");
          }
        }

        const studentId = inserted.id;

        // activity log
        try {
          const user = await supabase.auth.getUser();
          await supabase.from("activity_logs").insert({
            user_email: user.data.user?.email || null,
            action: "create",
            table_name: "students",
            row_id: studentId,
            details: { nama: data.nama, nis: data.nis }
          });
        } catch (err) {
          console.warn("Activity log failed", err);
        }

        onDone && onDone();
      } catch (err) {
        console.error(err);
        setError(err.message || String(err));
      } finally {
        setSaving(false);
      }
    })();
  };



  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    
    <form
      onSubmit={save}
      className="space-y-6 card shadow-sm rounded-2xl p-6 bg-white"
    >

    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl 
                bg-gray-200 hover:bg-gray-300 
                absolute top-16 right-16
                text-gray-700 font-medium shadow-sm 
                transition active:scale-95"
    >
      <ArrowLeft size={18} />
      Kembali
    </button>
    
    <h2 className="text-2xl font-bold text-left mb-6">Form Pendaftaran & Verifikasi Data Siswa</h2>

      {/* Data Pribadi */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold">1. Data Pribadi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nama Lengkap */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Nama Lengkap</label>
            <input
              type="text"
              value={data.nama}
              onChange={(e) => setField("nama", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: Muhammad Ridho Darmawan"
              required
            />
          </div>

          {/* Nomor KTP */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Nomor KTP (16 digit)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{16}"
              maxLength={16}
              placeholder="Ex: 3215013204304832"
              value={data.nomor_ktp}
              onChange={(e) => {
                // keep only digits in the KTP input
                const onlyDigits = e.target.value.replace(/\D/g, "");
                setField("nomor_ktp", onlyDigits);
              }}
              className="p-2 border rounded"
              required
            />
          </div>

          {/* Jenis Kelamin */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Jenis Kelamin</label>
            <select
              value={data.jenis_kelamin}
              onChange={(e) => setField("jenis_kelamin", e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          {/* Tempat Lahir */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tempat Lahir</label>
            <input
              type="text"
              placeholder="Ex: Karawang"
              value={data.tempat_lahir}
              onChange={(e) => setField("tempat_lahir", e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>

          {/* Tanggal Lahir */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tanggal Lahir</label>
            <input
              type="date"
              value={data.tanggal_lahir}
              onChange={(e) => setField("tanggal_lahir", e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>

          {/* Usia */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Usia</label>
            <input
              type="number"
              value={data.usia}
              disabled
              className="p-2 border rounded bg-slate-100"
            />
          </div>

          {/* Agama */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Agama</label>
            <select
              value={data.agama}
              onChange={(e) => setField("agama", e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="Islam">Islam</option>
              <option value="Kristen">Kristen</option>
              <option value="Katolik">Katolik</option>
              <option value="Hindu">Hindu</option>
              <option value="Buddha">Buddha</option>
              <option value="Konghucu">Konghucu</option>
            </select>
          </div>

          {/* Golongan Darah */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Golongan Darah</label>
            <select
              value={data.golongan_darah}
              onChange={(e) => setField("golongan_darah", e.target.value)}
              className="p-2 border rounded"
            >
              <option value="-">-</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>

          {/* Status Pernikahan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Status Pernikahan</label>
            <select
              value={data.status_pernikahan}
              onChange={(e) => setField("status_pernikahan", e.target.value)}
              className="p-2 border rounded"
            >
              <option value="Belum Menikah">Belum Menikah</option>
              <option value="Menikah">Menikah</option>
            </select>
          </div>

          {/* Nomor WA */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Nomor Telpon / WA</label>
            <input
              type="tel"
              value={data.nomor_wa}
              onChange={(e) => setField("nomor_wa", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: 089134643347"
              required 
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => setField("email", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: ridho@gmail.com"
              required
            />
          </div>

          {/* Asal Daerah */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Asal Daerah</label>
            <input
              type="text"
              placeholder="Ex: Karawang"
              value={data.asal_daerah}
              onChange={(e) => setField("asal_daerah", e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {/* Alamat KTP */}
        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">Alamat sesuai KTP</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Jalan | Ex: Jl. Merdeka No. 10"
              value={data.alamat_ktp_jalan || ""}
              onChange={(e) => setField("alamat_ktp_jalan", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="RT | Ex: 004"
              value={data.alamat_ktp_rt || ""}
              onChange={(e) => setField("alamat_ktp_rt", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="RW | Ex: 005"
              value={data.alamat_ktp_rw || ""}
              onChange={(e) => setField("alamat_ktp_rw", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Kelurahan / Desa | Ex: Sukamaju"
              value={data.alamat_ktp_kelurahan || ""}
              onChange={(e) => setField("alamat_ktp_kelurahan", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Kecamatan | Ex: Telukjambe"
              value={data.alamat_ktp_kecamatan || ""}
              onChange={(e) => setField("alamat_ktp_kecamatan", e.target.value)}
              className="p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Kota / Kabupaten | Ex: Karawang"
              value={data.alamat_ktp_kota || ""}
              onChange={(e) => setField("alamat_ktp_kota", e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
        </div>
      </section>
      {/* Fisik & Kepribadian */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold">2. Fisik & Kepribadian</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Tinggi Badan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tinggi Badan (cm)</label>
            <input
              type="number"
              min={0}
              value={data.tinggi_badan}
              onChange={(e) => setField("tinggi_badan", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: 172"
              required
            />
          </div>

          {/* Berat Badan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Berat Badan (kg)</label>
            <input
              type="number"
              min={0}
              value={data.berat_badan}
              onChange={(e) => setField("berat_badan", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: 66"
              required
            />
          </div>

          {/* Lingkar Pinggang */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Lingkar Pinggang (cm)</label>
            <input
              type="number"
              min={0}
              value={data.lingkar_pinggang}
              onChange={(e) => setField("lingkar_pinggang", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: 76"
              required
            />
          </div>

          {/* Ukuran Panjang Kaki */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Ukuran Panjang Kaki (cm)</label>
            <input
              type="number"
              min={0}
              value={data.ukuran_kaki}
              onChange={(e) => setField("ukuran_kaki", e.target.value)}
              className="p-2 border rounded"
              placeholder="Ex: 26"
              required
            />
          </div>

          {/* Dominan Tangan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Dominan Tangan</label>
            <select
              value={data.dominan_tangan}
              onChange={(e) => setField("dominan_tangan", e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="Kanan">Kanan</option>
              <option value="Kiri">Kiri</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Hobi */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Hobi (pisah koma)</label>
            <textarea
              rows={1}
              placeholder="Ex: Membaca, Olahraga, Musik"
              value={tempHobi}
              onChange={(e) => setTempHobi(e.target.value)}
              className="p-2 border rounded resize-none"
              required
            />
          </div>

          {/* Keahlian / Bakat */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Keahlian / Bakat Khusus (pisah koma)</label>
            <textarea
              rows={1}
              placeholder="Ex: Memasak, Menyanyi, Desain Grafis"
              value={tempKeahlian}
              onChange={(e) => setTempKeahlian(e.target.value)}
              className="p-2 border rounded resize-none"
              required
            />
          </div>

          {/* Kelebihan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tiga Kelebihan (pisah koma)</label>
            <textarea
              rows={1}
              placeholder="Ex: Rajin, Disiplin, Kreatif"
              value={tempKelebihan}
              onChange={(e) => setTempKelebihan(e.target.value)}
              className="p-2 border rounded resize-none"
              required
            />
          </div>

          {/* Kekurangan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Satu Kekurangan</label>
            <input
              type="text"
              placeholder="Ex: Pemalu"
              value={data.kekurangan}
              onChange={(e) => setField("kekurangan", e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>

          {/* Tujuan ke Jepang */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tiga Tujuan ke Jepang (pisah koma)</label>
            <textarea
              rows={2}
              placeholder="Ex: Belajar Bahasa, Wisata, Kerja"
              value={tempTujuanKeJepang}
              onChange={(e) => setTempTujuanKeJepang(e.target.value)}
              className="p-2 border rounded resize-none"
              required
            />
          </div>

          {/* Tujuan Pulang */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tujuan Saat Pulang ke Indonesia (pisah koma)</label>
            <textarea
              rows={2}
              placeholder="Ex: Bekerja, Mengembangkan Usaha"
              value={tempTujuanPulang}
              onChange={(e) => setTempTujuanPulang(e.target.value)}
              className="p-2 border rounded resize-none"
              required
            />
          </div>
        </div>
      </section>
      {/* 4. Riwayat Pendidikan */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">3. Riwayat Pendidikan</h3>

        {["sd", "smp", "sma", "universitas"].map((level) => (
          <div key={level} className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              {/* Nama Sekolah / Universitas */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Nama {level.toUpperCase()}</label>
                <input
                  type="text"
                  value={data.pendidikan[level].nama}
                  placeholder={level == "sd" ? `Ex: SD Negeri 1 Jakarta` : level == "smp" ? `Ex: SMP Negeri 5 Bandung` : level == "sma" ? `Ex: SMA Negeri 3 Surabaya` : `Ex: Universitas Indonesia`}
                  onChange={(e) =>
                    handleNestedField("pendidikan", level, { ...data.pendidikan[level], nama: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>

              {/* Tahun Masuk */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Tahun Masuk</label>
                <input
                  type="number"
                  min={0}
                  value={data.pendidikan[level].tahun_masuk}
                  placeholder={level == "sd" ? `Ex: 2005` : level == "smp" ? `Ex: 2011` : level == "sma" ? `Ex: 2014` : `Ex: 2017`}
                  onChange={(e) =>
                    handleNestedField("pendidikan", level, { ...data.pendidikan[level], tahun_masuk: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>

              {/* Tahun Lulus */}
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Tahun Lulus</label>
                <input
                  type="number"
                  min={0}
                  value={data.pendidikan[level].tahun_lulus}
                  placeholder={level == "sd" ? `Ex: 2011` : level == "smp" ? `Ex: 2014` : level == "sma" ? `Ex: 2017` : `Ex: 2021`}
                  onChange={(e) =>
                    handleNestedField("pendidikan", level, { ...data.pendidikan[level], tahun_lulus: e.target.value })
                  }
                  className="p-2 border rounded"
                />
              </div>

              {/* Jurusan, hanya untuk SMA dan Universitas */}
              {(level === "sma" || level === "universitas") && (
                <div className="flex flex-col">
                  <label className="mb-1.5 text-sm font-medium">Jurusan</label>
                  <input
                    type="text"
                    value={data.pendidikan[level].jurusan}
                    placeholder={level == "sma" ? `Ex: IPA` : `Ex: Teknik Informatika`}
                    onChange={(e) =>
                      handleNestedField("pendidikan", level, { ...data.pendidikan[level], jurusan: e.target.value })
                    }
                    className="p-2 border rounded"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
      {/* 5. Riwayat Pekerjaan */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">4. Riwayat Pekerjaan (Maks 5)</h3>

        {/* Input Jumlah Perusahaan */}
        <div className="flex items-center">
          <label className="mb-1.5 text-sm font-medium mr-5">Jumlah Perusahaan :</label>
          <input
            type="number"
            min={1}
            max={5}
            value={data.pekerjaan.length}
            onChange={(e) => {
              let n = Math.max(1, Math.min(5, parseInt(e.target.value) || 1));
              const pekerjaanBaru = Array.from({ length: n }, (_, i) =>
                data.pekerjaan[i] || {
                  nama_perusahaan: "",
                  jenis_pekerjaan: "",
                  tahun_masuk: "",
                  bulan_masuk: "",
                  tahun_keluar: "",
                  bulan_keluar: "",
                }
              );
              setField("pekerjaan", pekerjaanBaru);
            }}
            className="w-fit border rounded"
            required
          />
        </div>

        {/* Form Pekerjaan Dinamis */}
        {data.pekerjaan.map((job, idx) => (
          <div key={idx} className="space-y-2 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium">Pekerjaan {idx + 1}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Nama Perusahaan</label>
                <input
                  type="text"
                  value={job.nama_perusahaan}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "nama_perusahaan", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Jenis Pekerjaan</label>
                <input
                  type="text"
                  value={job.jenis_pekerjaan}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "jenis_pekerjaan", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Tahun Masuk</label>
                <input
                  type="number"
                  min={0}
                  value={job.tahun_masuk}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "tahun_masuk", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Bulan Masuk</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  step={1}
                  placeholder="MM"
                  value={job.bulan_masuk}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "bulan_masuk", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Tahun Keluar</label>
                <input
                  type="number"
                  min={0}
                  value={job.tahun_keluar}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "tahun_keluar", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Bulan Keluar</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  step={1}
                  placeholder="MM"
                  value={job.bulan_keluar}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "bulan_keluar", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Input tambahan untuk gaji dan pengalaman tes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Gaji Terakhir</label>
            <input
              type="text"
              placeholder="Gaji Terakhir"
              value={data.gaji_terakhir}
              onChange={(e) => setField("gaji_terakhir", e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Berapa Kali Pernah Tes SO Lain</label>
            <input
              type="number"
              placeholder="Pernah Tes SO"
              min={0}
              value={data.pernah_tes_so}
              onChange={(e) => setField("pernah_tes_so", e.target.value)}
              className="p-2 border rounded"
              required
            />
          </div>
        </div>
      </section>
      {/* 6. Data Keluarga Dinamis */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">5. Data Keluarga</h3>

        {/* Ayah & Ibu */}
        {["ayah", "ibu"].map((parent) => (
          <div key={parent} className="space-y-2 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium">{parent.toUpperCase()}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Nama</label>
                <input
                  type="text"
                  value={data.keluarga[parent].nama}
                  onChange={(e) =>
                    handleNestedField("keluarga", parent, { ...data.keluarga[parent], nama: e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Usia</label>
                <input
                  type="number"
                  value={data.keluarga[parent].usia}
                  min={0}
                  onChange={(e) =>
                    handleNestedField("keluarga", parent, { ...data.keluarga[parent], usia: e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Pekerjaan</label>
                <input
                  type="text"
                  value={data.keluarga[parent].pekerjaan}
                  onChange={(e) =>
                    handleNestedField("keluarga", parent, { ...data.keluarga[parent], pekerjaan: e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Nomor HP</label>
                <input
                  type="text"
                  value={data.keluarga[parent].nomor_hp}
                  onChange={(e) =>
                    handleNestedField("keluarga", parent, { ...data.keluarga[parent], nomor_hp: e.target.value })
                  }
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        ))}

        {/* Input Jumlah Saudara */}
        <div className="flex items-center">
          <label className="mb-1.5 text-sm font-medium mr-5">Jumlah Saudara</label>
          <input
            type="number"
            min={0}
            max={5}
            value={data.keluarga.saudara.length}
            onChange={(e) => {
              let n = Math.max(0, Math.min(5, parseInt(e.target.value) || 0));
              const saudaraBaru = Array.from({ length: n }, (_, i) =>
                data.keluarga.saudara[i] || { jenis: "Adik Laki-laki", nama: "", usia: "", pekerjaan: "" }
              );
              setField("keluarga", { ...data.keluarga, saudara: saudaraBaru });
            }}
            className="w-fit border rounded"
            required
          />
        </div>

        {/* Form Saudara Dinamis */}
        {data.keluarga.saudara.map((s, idx) => (
          <div key={idx} className="space-y-2 border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium">Saudara {idx + 1}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Jenis</label>
                <select
                  value={s.jenis || "Adik Laki-laki"}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "jenis", e.target.value)}
                  className="p-2 border rounded"
                  required
                >
                  <option value="Adik Laki-laki">Adik Laki-laki</option>
                  <option value="Adik Perempuan">Adik Perempuan</option>
                  <option value="Kakak Laki-laki">Kakak Laki-laki</option>
                  <option value="Kakak Perempuan">Kakak Perempuan</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Nama</label>
                <input
                  type="text"
                  value={s.nama}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "nama", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Usia</label>
                <input
                  type="number"
                  min={0}
                  value={s.usia}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "usia", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Pekerjaan</label>
                <input
                  type="text"
                  value={s.pekerjaan}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "pekerjaan", e.target.value)}
                  className="p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* 7. Health & Dokumen */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">6. Health & Dokumen</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Merokok?</label>
            <select
              value={data.health.merokok}
              onChange={(e) => setField("health", { ...data.health, merokok: e.target.value === "true" })}
              className="p-2 border rounded"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Minum Alkohol?</label>
            <select
              value={data.health.alkohol}
              onChange={(e) => setField("health", { ...data.health, alkohol: e.target.value === "true" })}
              className="p-2 border rounded"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Memiliki Paspor?</label>
            <select
              value={data.health.paspor}
              onChange={(e) => setField("health", { ...data.health, paspor: e.target.value === "true" })}
              className="p-2 border rounded"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Sehat?</label>
            <select
              value={data.health.sehat}
              onChange={(e) => setField("health", { ...data.health, sehat: e.target.value === "true" })}
              className="p-2 border rounded"
              required
            >
              <option value="true">Ya</option>
              <option value="false">Tidak</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Penyakit Bawaan (jika ada)</label>
            <input
              type="text"
              value={data.health.penyakit_bawaan}
              onChange={(e) => setField("health", { ...data.health, penyakit_bawaan: e.target.value })}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Pernah Operasi (jika ada)</label>
            <input
              type="text"
              value={data.health.pernah_operasi}
              onChange={(e) => setField("health", { ...data.health, pernah_operasi: e.target.value })}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Alergi (jika ada)</label>
            <input
              type="text"
              value={data.health.alergi}
              onChange={(e) => setField("health", { ...data.health, alergi: e.target.value })}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col col-span-1">
            <label className="mb-1.5 text-sm font-medium">Link Dokumen</label>
            <input
              type="text"
              rows={4}
              placeholder="Contoh: https://drive.google.com/..."
              value={data.dokumen_surat}
              onChange={(e) => setField("dokumen_surat", e.target.value)}
              className="p-2 border rounded resize-none"
              required
            />
          </div>
        </div>
      </section>

      {/* 8. Program & Pasangan */}
      <section className="space-y-4">
        <h3 className="text-xl font-semibold">7. Program & Pasangan / Keluarga</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Program</label>
            <select
              value={data.program}
              onChange={(e) => setField("program", e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="Magang">Magang</option>
              <option value="Kerja">Kerja</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Rencana Pembayaran Biaya Pemberangkatan</label>
            <select
              value={data.rencana_pembayaran}
              onChange={(e) => setField("rencana_pembayaran", e.target.value)}
              className="p-2 border rounded"
              required
            >
              <option value="Biaya Mandiri">Biaya Mandiri</option>
              <option value="Dana Talang">Dana Talang</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Nama Suami/Istri (jika ada)</label>
            <input
              type="text"
              value={data.pasangan.nama}
              onChange={(e) => handleNestedField("pasangan", "nama", e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Nomor HP Suami/Istri</label>
            <input
              type="text"
              value={data.pasangan.nomor_hp}
              onChange={(e) => handleNestedField("pasangan", "nomor_hp", e.target.value)}
              className="p-2 border rounded"
            />
          </div>
        </div>
      </section>

      <hr className="border border-gray-200" />

      {/* Angkatan, Tanggal Masuk, NIS */}
      <section className="grid grid-cols-3 gap-4 mb-14">
        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">Angkatan</label>
          <input
            type="number"
            min={0}
            value={data.angkatan}
            onChange={(e) => setField("angkatan", e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">Tanggal Masuk</label>
          <input
            type="date"
            value={data.tanggal_masuk}
            onChange={(e) => setField("tanggal_masuk", e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">NIS</label>
          <input
            value={data.nis}
            onChange={(e) => { setNisAuto(false); setField("nis", e.target.value); }}
            className="p-2 border rounded bg-slate-100"
            required
          />
        </div>
      </section>

      {/* Submit */}
        <div className="flex flex-col items-end gap-3 mt-4">

        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}

        <div className="flex justify-end gap-3">

        {/* Batal */}
        <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-xl border border-(--akira-border) text-(--akira-gray) hover:bg-gray-100 transition"
        >
            Batal
        </button>

        {/* Simpan */}
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl font-medium text-white bg-(--akira-red)
              hover:bg-(--akira-red-dark) active:bg-(--akira-gray)
              shadow-sm transition disabled:opacity-60"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
            </div>
        </div>
    </form>
  );
}
