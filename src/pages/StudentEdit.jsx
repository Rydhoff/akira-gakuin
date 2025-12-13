import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

export default function StudentEdit() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  const blank = {
    angkatan: "",
    tanggal_masuk: "",
    nis: "",
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
    alamat_ktp_jalan: "",
    alamat_ktp_rt: "",
    alamat_ktp_rw: "",
    alamat_ktp_kelurahan: "",
    alamat_ktp_kecamatan: "",
    alamat_ktp_kota: "",
    tinggi_badan: "",
    berat_badan: "",
    lingkar_pinggang: "",
    ukuran_kaki: "",
    dominan_tangan: "Kanan",
    hobi: [],
    keahlian: [],
    kelebihan: [],
    tujuan_ke_jepang: [],
    tujuan_pulang: [],
    pendidikan: {
      sd: { nama: "", tahun_masuk: "", tahun_lulus: "" },
      smp: { nama: "", tahun_masuk: "", tahun_lulus: "" },
      sma: { nama: "", jurusan: "", tahun_masuk: "", tahun_lulus: "" },
      universitas: { nama: "", jurusan: "", tahun_masuk: "", tahun_lulus: "" }
    },
    pekerjaan: Array.from({ length: 5 }).map(() => ({ nama_perusahaan: "", jenis_pekerjaan: "", tahun_masuk: "", bulan_masuk: "", tahun_keluar: "", bulan_keluar: "" })),
    keluarga: { ayah: { nama: "", usia: "", pekerjaan: "", nomor_hp: "" }, ibu: { nama: "", usia: "", pekerjaan: "", nomor_hp: "" }, saudara: Array.from({ length: 5 }).map(() => ({ jenis: "", nama: "", usia: "", pekerjaan: "" })) },
    health: { merokok: false, alkohol: false, paspor: false, sehat: true, penyakit_bawaan: "", pernah_operasi: "", alergi: "" },
    dokumen_surat: "",
    program: "Magang",
    rencana_pembayaran: "Biaya Mandiri",
    pasangan: { nama: "", nomor_hp: "" },
    gaji_terakhir: "",
    pernah_tes_so: "",
    kekurangan: "",
    status: "Aktif",
    cuti_mulai: "",
    cuti_selesai: "",
    tanggal_pengunduran: "",
  };

  const [form, setForm] = useState(blank);
  const [tempHobi, setTempHobi] = useState((blank.hobi || []).join(", "));
  const [tempKeahlian, setTempKeahlian] = useState((blank.keahlian || []).join(", "));
  const [tempKelebihan, setTempKelebihan] = useState((blank.kelebihan || []).join(", "));
  const [tempTujuanKeJepang, setTempTujuanKeJepang] = useState((blank.tujuan_ke_jepang || []).join(", "));
  const [tempTujuanPulang, setTempTujuanPulang] = useState((blank.tujuan_pulang || []).join(", "));
  const [nisAuto, setNisAuto] = useState(true);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const handleNestedField = (parent, child, value) => setForm((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
  const handleNestedArray = (parent, index, child, value) => {
    const arr = Array.isArray(form[parent]) ? [...form[parent]] : [];
    arr[index] = { ...(arr[index] || {}), [child]: value };
    setForm((prev) => ({ ...prev, [parent]: arr }));
  };
  const handleKeluargaSaudara = (index, child, value) => {
    const keluarga = { ...(form.keluarga || {}) };
    const arr = Array.isArray(keluarga.saudara) ? [...keluarga.saudara] : [];
    arr[index] = { ...(arr[index] || {}), [child]: value };
    keluarga.saudara = arr;
    setForm((prev) => ({ ...prev, keluarga }));
  };

  useEffect(() => {
    let mounted = true;

    const fetchStudent = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("students")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!mounted) return;

        const s = data;

        setForm((p) => ({
          ...p,
            id: s.id,
            nis: s.nis || "",
            angkatan: s.angkatan || "",
            tanggal_masuk: s.tanggal_masuk || "",
            nama: s.nama_lengkap || s.nama || "",
            nomor_ktp: s.nomor_ktp ? String(s.nomor_ktp) : "",
            jenis_kelamin: s.jenis_kelamin || "Laki-laki",
            tempat_lahir: s.tempat_lahir || "",
            tanggal_lahir: s.tanggal_lahir || "",
            usia: s.usia || "",
            agama: s.agama || "Islam",
            golongan_darah: s.golongan_darah || "",
            status_pernikahan: s.status_pernikahan || "Belum Menikah",
            nomor_wa: s.nomor_wa || "",
            email: s.email || "",
            asal_daerah: s.asal_daerah || "",
            alamat_ktp_jalan: s.alamat_jalan || "",
            alamat_ktp_rt: s.alamat_rt || "",
            alamat_ktp_rw: s.alamat_rw || "",
            alamat_ktp_kelurahan: s.alamat_kelurahan || "",
            alamat_ktp_kecamatan: s.alamat_kecamatan || "",
            alamat_ktp_kota: s.alamat_kabupaten || "",
            tinggi_badan: s.tinggi_badan || "",
            berat_badan: s.berat_badan || "",
            lingkar_pinggang: s.lingkar_pinggang || "",
            ukuran_kaki: s.ukuran_kaki || "",
            dominan_tangan: s.dominan_tangan || "Kanan",
            hobi: s.hobi ? (typeof s.hobi === "string" ? s.hobi.split(/,\s*/) : s.hobi) : [],
            keahlian: s.keahlian ? (typeof s.keahlian === "string" ? s.keahlian.split(/,\s*/) : s.keahlian) : [],
            kelebihan: s.tiga_kelebihan ? (typeof s.tiga_kelebihan === "string" ? s.tiga_kelebihan.split(/,\s*/) : s.tiga_kelebihan) : [],
            tujuan_ke_jepang: s.tiga_tujuan_jepang ? (typeof s.tiga_tujuan_jepang === "string" ? s.tiga_tujuan_jepang.split(/,\s*/) : s.tiga_tujuan_jepang) : [],
            tujuan_pulang: s.tujuan_pulang ? (typeof s.tujuan_pulang === "string" ? s.tujuan_pulang.split(/,\s*/) : s.tujuan_pulang) : [],
            pendidikan: {
              sd: { nama: s.sd_nama || "", tahun_masuk: s.sd_tahun_masuk || "", tahun_lulus: s.sd_tahun_lulus || "" },
              smp: { nama: s.smp_nama || "", tahun_masuk: s.smp_tahun_masuk || "", tahun_lulus: s.smp_tahun_lulus || "" },
              sma: { nama: s.sma_nama || "", jurusan: s.sma_jurusan || "", tahun_masuk: s.sma_tahun_masuk || "", tahun_lulus: s.sma_tahun_lulus || "" },
              universitas: { nama: s.univ_nama || "", jurusan: s.univ_jurusan || "", tahun_masuk: s.univ_tahun_masuk || "", tahun_lulus: s.univ_tahun_lulus || "" }
            },
            pekerjaan: [
              { nama_perusahaan: s.pekerjaan1_nama_perusahaan || "", jenis_pekerjaan: s.pekerjaan1_jenis || "", tahun_masuk: s.pekerjaan1_tahun_masuk || "", bulan_masuk: s.pekerjaan1_bulan_masuk || "", tahun_keluar: s.pekerjaan1_tahun_keluar || "", bulan_keluar: s.pekerjaan1_bulan_keluar || "" },
              { nama_perusahaan: s.pekerjaan2_nama_perusahaan || "", jenis_pekerjaan: s.pekerjaan2_jenis || "", tahun_masuk: s.pekerjaan2_tahun_masuk || "", bulan_masuk: s.pekerjaan2_bulan_masuk || "", tahun_keluar: s.pekerjaan2_tahun_keluar || "", bulan_keluar: s.pekerjaan2_bulan_keluar || "" },
              { nama_perusahaan: s.pekerjaan3_nama_perusahaan || "", jenis_pekerjaan: s.pekerjaan3_jenis || "", tahun_masuk: s.pekerjaan3_tahun_masuk || "", bulan_masuk: s.pekerjaan3_bulan_masuk || "", tahun_keluar: s.pekerjaan3_tahun_keluar || "", bulan_keluar: s.pekerjaan3_bulan_keluar || "" },
              { nama_perusahaan: s.pekerjaan4_nama_perusahaan || "", jenis_pekerjaan: s.pekerjaan4_jenis || "", tahun_masuk: s.pekerjaan4_tahun_masuk || "", bulan_masuk: s.pekerjaan4_bulan_masuk || "", tahun_keluar: s.pekerjaan4_tahun_keluar || "", bulan_keluar: s.pekerjaan4_bulan_keluar || "" },
              { nama_perusahaan: s.pekerjaan5_nama_perusahaan || "", jenis_pekerjaan: s.pekerjaan5_jenis || "", tahun_masuk: s.pekerjaan5_tahun_masuk || "", bulan_masuk: s.pekerjaan5_bulan_masuk || "", tahun_keluar: s.pekerjaan5_tahun_keluar || "", bulan_keluar: s.pekerjaan5_bulan_keluar || "" }
            ],
            keluarga: {
              ayah: { nama: s.ayah_nama || "", usia: s.ayah_usia || "", pekerjaan: s.ayah_pekerjaan || "", nomor_hp: s.ayah_hp || "" },
              ibu: { nama: s.ibu_nama || "", usia: s.ibu_usia || "", pekerjaan: s.ibu_pekerjaan || "", nomor_hp: s.ibu_hp || "" },
              saudara: [
                { jenis: s.saudara1_jenis || "", nama: s.saudara1_nama || "", usia: s.saudara1_usia || "", pekerjaan: s.saudara1_pekerjaan || "" },
                { jenis: s.saudara2_jenis || "", nama: s.saudara2_nama || "", usia: s.saudara2_usia || "", pekerjaan: s.saudara2_pekerjaan || "" },
                { jenis: s.saudara3_jenis || "", nama: s.saudara3_nama || "", usia: s.saudara3_usia || "", pekerjaan: s.saudara3_pekerjaan || "" },
                { jenis: s.saudara4_jenis || "", nama: s.saudara4_nama || "", usia: s.saudara4_usia || "", pekerjaan: s.saudara4_pekerjaan || "" },
                { jenis: s.saudara5_jenis || "", nama: s.saudara5_nama || "", usia: s.saudara5_usia || "", pekerjaan: s.saudara5_pekerjaan || "" }
              ]
            },
            health: { merokok: s.merokok === "Ya", alkohol: s.minum_alkohol === "Ya", paspor: s.memiliki_paspor === "Ya", sehat: s.sehat === "Ya", penyakit_bawaan: s.penyakit_bawaan || "", pernah_operasi: s.pernah_operasi || "", alergi: s.alergi || "" },
            dokumen_surat: (typeof s.dokumen_surat === "string" ? s.dokumen_surat : (Array.isArray(s.dokumen_surat) ? s.dokumen_surat[0] || "" : "")),
            program: s.program || "Magang",
            rencana_pembayaran: s.rencana_pembayaran || "Biaya Mandiri",
            pasangan: { nama: s.pasangan_nama || "", nomor_hp: s.pasangan_hp || "" },
            gaji_terakhir: s.gaji_terakhir ?? "",
            pernah_tes_so: s.pernah_tes_so ?? "",
            kekurangan: s.satu_kekurangan ?? s.kekurangan ?? "",
            status: s.status || "Aktif",
            cuti_mulai: s.cuti_mulai || "",
            cuti_selesai: s.cuti_selesai || "",
            tanggal_pengunduran: s.tanggal_pengunduran || "",
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
    return () => (mounted = false);
  }, [id]);

  // keep text area temp fields in sync if `form` gets populated (e.g., after load)
  useEffect(() => {
    setTempHobi((form.hobi || []).join(", "));
    setTempKeahlian((form.keahlian || []).join(", "));
    setTempKelebihan((form.kelebihan || []).join(", "));
    setTempTujuanKeJepang((form.tujuan_ke_jepang || []).join(", "));
    setTempTujuanPulang((form.tujuan_pulang || []).join(", "));
    if (form.tanggal_lahir) {
      try {
        const birth = new Date(form.tanggal_lahir);
        const age = new Date().getFullYear() - birth.getFullYear();
        setForm((p) => ({ ...p, usia: age }));
      } catch (err) { /* ignore */ }
    }
  }, [form.hobi, form.keahlian, form.kelebihan, form.tujuan_ke_jepang, form.tujuan_pulang, form.tanggal_lahir]);

  const emptyToNull = (v) =>
    v === "" || v === undefined ? null : v;

  const save = async (e) => {
    e && e.preventDefault();
    try {
      setError("");
      // basic validations
      if (!form.nama) return setError("Nama harus diisi");
      const ktpStr = String(form.nomor_ktp || "").trim();
      if (!/^[0-9]{1,16}$/.test(ktpStr)) return setError("Nomor KTP harus berupa angka, maksimum 16 digit");
      if (form.dokumen_surat && String(form.dokumen_surat).trim() !== "") {
        try { new URL(form.dokumen_surat); } catch (err) { return setError("Link dokumen tidak valid"); }
      }

      // numeric validation helpers
      const parseNum = (v) => {
        if (v === null || v === undefined || v === "") return null;
        const n = Number(String(v).replace(/[^\d.-]+/g, ""));
        return Number.isNaN(n) ? null : n;
      };

      const checkNonNegative = (val, label) => {
        const n = parseNum(val);
        if (n !== null && n < 0) throw new Error(`${label} tidak boleh negatif`);
      };

      // pekerjaan month validations: must be 1..12 if provided
      (form.pekerjaan || []).forEach((job, idx) => {
        ["bulan_masuk", "bulan_keluar"].forEach((k) => {
          const v = job[k];
          if (v !== undefined && v !== null && String(v).trim() !== "") {
            const n = Number(String(v));
            if (!Number.isInteger(n) || n < 1 || n > 12) {
              throw new Error(`Bulan ${k.replace("_", " ")} pada pekerjaan ${idx + 1} harus antara 01 dan 12`);
            }
          }
        });
      });

      ["angkatan", "tinggi_badan", "berat_badan", "lingkar_pinggang", "ukuran_kaki"].forEach((k) => checkNonNegative(form[k], k.replace(/_/g, " ")));

      // pendidikan years must be numeric if provided
      ["sd", "smp", "sma", "universitas"].forEach((lev) => {
        const p = form.pendidikan?.[lev] || {};
        ["tahun_masuk", "tahun_lulus"].forEach((yr) => {
          if (p[yr] !== undefined && p[yr] !== null && String(p[yr]).trim() !== "") checkNonNegative(p[yr], `${lev.toUpperCase()} ${yr}`);
        });
      });

      setSaving(true);

      // prepare arrays from temp fields
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
        angkatan: toNumber(form.angkatan),
        tanggal_masuk: form.tanggal_masuk || null,
        nis: form.nis || null,

        nama_lengkap: form.nama || null,
        nomor_ktp: form.nomor_ktp ? toNumber(form.nomor_ktp) : null,
        jenis_kelamin: form.jenis_kelamin || "Laki-laki",
        tempat_lahir: form.tempat_lahir || null,
        tanggal_lahir: form.tanggal_lahir || null,
        usia: toNumber(form.usia),
        agama: form.agama || "Islam",
        golongan_darah: form.golongan_darah || null,
        status_pernikahan: form.status_pernikahan || "Belum Menikah",
        nomor_wa: form.nomor_wa || null,
        email: form.email || null,
        asal_daerah: form.asal_daerah || null,
        alamat_jalan: form.alamat_ktp_jalan || null,
        alamat_rt: form.alamat_ktp_rt || null,
        alamat_rw: form.alamat_ktp_rw || null,
        alamat_kelurahan: form.alamat_ktp_kelurahan || null,
        alamat_kecamatan: form.alamat_ktp_kecamatan || null,
        alamat_kabupaten: form.alamat_ktp_kota || null,

        tinggi_badan: toNumber(form.tinggi_badan),
        berat_badan: toNumber(form.berat_badan),
        lingkar_pinggang: toNumber(form.lingkar_pinggang),
        ukuran_kaki: toNumber(form.ukuran_kaki),
        dominan_tangan: form.dominan_tangan || "Kanan",
        hobi: joinArr(hobi),
        keahlian: joinArr(keahlian),
        tiga_kelebihan: joinArr(kelebihan),
        tiga_tujuan_jepang: joinArr(tujuan_ke_jepang),
        tujuan_pulang: joinArr(tujuan_pulang),

        sd_nama: form.pendidikan?.sd?.nama || null,
        sd_tahun_masuk: toNumber(form.pendidikan?.sd?.tahun_masuk),
        sd_tahun_lulus: toNumber(form.pendidikan?.sd?.tahun_lulus),

        smp_nama: form.pendidikan?.smp?.nama || null,
        smp_tahun_masuk: toNumber(form.pendidikan?.smp?.tahun_masuk),
        smp_tahun_lulus: toNumber(form.pendidikan?.smp?.tahun_lulus),

        sma_nama: form.pendidikan?.sma?.nama || null,
        sma_tahun_masuk: toNumber(form.pendidikan?.sma?.tahun_masuk),
        sma_tahun_lulus: toNumber(form.pendidikan?.sma?.tahun_lulus),
        sma_jurusan: form.pendidikan?.sma?.jurusan || null,

        univ_nama: form.pendidikan?.universitas?.nama || null,
        univ_tahun_masuk: toNumber(form.pendidikan?.universitas?.tahun_masuk) || null,
        univ_tahun_lulus: toNumber(form.pendidikan?.universitas?.tahun_lulus) || null,
        univ_jurusan: form.pendidikan?.universitas?.jurusan || null,

        pekerjaan1_nama_perusahaan: form.pekerjaan[0]?.nama_perusahaan || null,
        pekerjaan1_jenis: form.pekerjaan[0]?.jenis_pekerjaan || null,
        pekerjaan1_tahun_masuk: form.pekerjaan[0]?.tahun_masuk || null,
        pekerjaan1_bulan_masuk: form.pekerjaan[0]?.bulan_masuk || null,
        pekerjaan1_tahun_keluar: form.pekerjaan[0]?.tahun_keluar || null,
        pekerjaan1_bulan_keluar: form.pekerjaan[0]?.bulan_keluar || null,

        pekerjaan2_nama_perusahaan: form.pekerjaan[1]?.nama_perusahaan || null,
        pekerjaan2_jenis: form.pekerjaan[1]?.jenis_pekerjaan || null,
        pekerjaan2_tahun_masuk: form.pekerjaan[1]?.tahun_masuk || null,
        pekerjaan2_bulan_masuk: form.pekerjaan[1]?.bulan_masuk || null,
        pekerjaan2_tahun_keluar: form.pekerjaan[1]?.tahun_keluar || null,
        pekerjaan2_bulan_keluar: form.pekerjaan[1]?.bulan_keluar || null,

        pekerjaan3_nama_perusahaan: form.pekerjaan[2]?.nama_perusahaan || null,
        pekerjaan3_jenis: form.pekerjaan[2]?.jenis_pekerjaan || null,
        pekerjaan3_tahun_masuk: form.pekerjaan[2]?.tahun_masuk || null,
        pekerjaan3_bulan_masuk: form.pekerjaan[2]?.bulan_masuk || null,
        pekerjaan3_tahun_keluar: form.pekerjaan[2]?.tahun_keluar || null,
        pekerjaan3_bulan_keluar: form.pekerjaan[2]?.bulan_keluar || null,

        pekerjaan4_nama_perusahaan: form.pekerjaan[3]?.nama_perusahaan || null,
        pekerjaan4_jenis: form.pekerjaan[3]?.jenis_pekerjaan || null,
        pekerjaan4_tahun_masuk: form.pekerjaan[3]?.tahun_masuk || null,
        pekerjaan4_bulan_masuk: form.pekerjaan[3]?.bulan_masuk || null,
        pekerjaan4_tahun_keluar: form.pekerjaan[3]?.tahun_keluar || null,
        pekerjaan4_bulan_keluar: form.pekerjaan[3]?.bulan_keluar || null,

        pekerjaan5_nama_perusahaan: form.pekerjaan[4]?.nama_perusahaan || null,
        pekerjaan5_jenis: form.pekerjaan[4]?.jenis_pekerjaan || null,
        pekerjaan5_tahun_masuk: form.pekerjaan[4]?.tahun_masuk || null,
        pekerjaan5_bulan_masuk: form.pekerjaan[4]?.bulan_masuk || null,
        pekerjaan5_tahun_keluar: form.pekerjaan[4]?.tahun_keluar || null,
        pekerjaan5_bulan_keluar: form.pekerjaan[4]?.bulan_keluar || null,

        ayah_nama: form.keluarga?.ayah?.nama || null,
        ayah_usia: form.keluarga?.ayah?.usia || null,
        ayah_pekerjaan: form.keluarga?.ayah?.pekerjaan || null,
        ayah_hp: form.keluarga?.ayah?.nomor_hp || null,

        ibu_nama: form.keluarga?.ibu?.nama || null,
        ibu_usia: form.keluarga?.ibu?.usia || null,
        ibu_pekerjaan: form.keluarga?.ibu?.pekerjaan || null,
        ibu_hp: form.keluarga?.ibu?.nomor_hp || null,

        saudara1_jenis: emptyToNull(form.keluarga?.saudara?.[0]?.jenis),
        saudara1_nama: form.keluarga?.saudara?.[0]?.nama || null,
        saudara1_usia: form.keluarga?.saudara?.[0]?.usia || null,
        saudara1_pekerjaan: form.keluarga?.saudara?.[0]?.pekerjaan || null,

        saudara2_jenis: emptyToNull(form.keluarga?.saudara?.[1]?.jenis),
        saudara2_nama: form.keluarga?.saudara?.[1]?.nama || null,
        saudara2_usia: form.keluarga?.saudara?.[1]?.usia || null,
        saudara2_pekerjaan: form.keluarga?.saudara?.[1]?.pekerjaan || null,

        saudara3_jenis: emptyToNull(form.keluarga?.saudara?.[2]?.jenis),
        saudara3_nama: form.keluarga?.saudara?.[2]?.nama || null,
        saudara3_usia: form.keluarga?.saudara?.[2]?.usia || null,
        saudara3_pekerjaan: form.keluarga?.saudara?.[2]?.pekerjaan || null,

        saudara4_jenis: emptyToNull(form.keluarga?.saudara?.[3]?.jenis),
        saudara4_nama: form.keluarga?.saudara?.[3]?.nama || null,
        saudara4_usia: form.keluarga?.saudara?.[3]?.usia || null,
        saudara4_pekerjaan: form.keluarga?.saudara?.[3]?.pekerjaan || null,

        saudara5_jenis: emptyToNull(form.keluarga?.saudara?.[4]?.jenis),
        saudara5_nama: form.keluarga?.saudara?.[4]?.nama || null,
        saudara5_usia: form.keluarga?.saudara?.[4]?.usia || null,
        saudara5_pekerjaan: form.keluarga?.saudara?.[4]?.pekerjaan || null,

        merokok: boolToYesNo(form.health?.merokok),
        minum_alkohol: boolToYesNo(form.health?.alkohol),
        memiliki_paspor: boolToYesNo(form.health?.paspor),
        sehat: boolToYesNo(form.health?.sehat),
        penyakit_bawaan: form.health?.penyakit_bawaan || null,
        pernah_operasi: form.health?.pernah_operasi || null,
        alergi: form.health?.alergi || null,

        gaji_terakhir: toNumber(form.gaji_terakhir),
        pernah_tes_so: toNumber(form.pernah_tes_so) || 0,
        satu_kekurangan: form.kekurangan || null,

        program: form.program || "Magang",
        rencana_pembayaran: form.rencana_pembayaran || "Biaya Mandiri",
        pasangan_nama: form.pasangan?.nama || null,
        pasangan_hp: form.pasangan?.nomor_hp || null,

        status: form.status || "Aktif",
        dokumen_surat: form.dokumen_surat || null,

        cuti_mulai: form.cuti_mulai || null,
        cuti_selesai: form.cuti_selesai || null,
        tanggal_pengunduran: form.tanggal_pengunduran || null,
      };

      const { data, error } = await supabase.from("students").update(payload).eq("id", form.id).select().single();
      if (error) throw error;

      navigate("/students");
    } catch (err) {
      console.error(err);
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 card shadow-sm rounded-2xl p-6 bg-white">
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

      <h2 className="text-2xl font-bold text-left mb-6">Edit Data Siswa</h2>
      {loading ? <div>Loading...</div> : (
        <form onSubmit={save} className="grid grid-cols-1 gap-3">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">NIS</label>
              <input value={form.nis} readOnly className="p-2 border rounded w-full bg-slate-100" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Angkatan</label>
              <input value={form.angkatan} onChange={(e) => setField("angkatan", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Tanggal Masuk</label>
              <input type="date" value={form.tanggal_masuk} onChange={(e) => setField("tanggal_masuk", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Status</label>
              <select value={form.status} onChange={(e) => setField("status", e.target.value)} className="p-2 border rounded w-full">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Diklat SO">Diklat SO</option>
                <option value="Diterima SO">Diterima SO</option>
                <option value="Cuti">Cuti</option>
                <option value="Pengunduran Diri">Pengunduran Diri</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Cuti Mulai</label>
              <input
                type="date"
                value={form.cuti_mulai}
                onChange={(e) => setField("cuti_mulai", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Cuti Selesai</label>
              <input
                type="date"
                value={form.cuti_selesai}
                onChange={(e) => setField("cuti_selesai", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Tanggal Pengunduran</label>
              <input
                type="date"
                value={form.tanggal_pengunduran}
                onChange={(e) => setField("tanggal_pengunduran", e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 text-sm font-medium">Nama Lengkap</label>
              <input value={form.nama} onChange={(e) => setField("nama", e.target.value)} className="p-2 border rounded w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Hobi (pisahkan dengan koma)</label>
              <textarea value={tempHobi} onChange={(e) => setTempHobi(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Keahlian (pisahkan dengan koma)</label>
              <textarea value={tempKeahlian} onChange={(e) => setTempKeahlian(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Tiga Kelebihan (pisahkan dengan koma)</label>
              <textarea value={tempKelebihan} onChange={(e) => setTempKelebihan(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Tiga Tujuan ke Jepang (pisahkan dengan koma)</label>
              <textarea value={tempTujuanKeJepang} onChange={(e) => setTempTujuanKeJepang(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Tujuan Pulang (pisahkan dengan koma)</label>
              <textarea value={tempTujuanPulang} onChange={(e) => setTempTujuanPulang(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1.5 text-sm font-medium">Nomor KTP</label>
              <input value={form.nomor_ktp} onChange={(e) => setField("nomor_ktp", e.target.value.replace(/\D/g, ""))} maxLength={16} className="p-2 border rounded w-full" />
            </div>
            <div className="w-48">
              <label className="mb-1.5 text-sm font-medium">Nomor WA</label>
              <input value={form.nomor_wa} onChange={(e) => setField("nomor_wa", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div className="w-64">
              <label className="mb-1.5 text-sm font-medium">Email</label>
              <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} className="p-2 border rounded w-full" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Tinggi Badan (cm)</label>
              <input value={form.tinggi_badan} onChange={(e) => setField("tinggi_badan", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Berat Badan (kg)</label>
              <input value={form.berat_badan} onChange={(e) => setField("berat_badan", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Ukuran Kaki</label>
              <input value={form.ukuran_kaki} onChange={(e) => setField("ukuran_kaki", e.target.value)} className="p-2 border rounded w-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Hobi (pisahkan dengan koma)</label>
              <textarea value={tempHobi} onChange={(e) => setTempHobi(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Keahlian (pisahkan dengan koma)</label>
              <textarea value={tempKeahlian} onChange={(e) => setTempKeahlian(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Tiga Kelebihan (pisahkan dengan koma)</label>
              <textarea value={tempKelebihan} onChange={(e) => setTempKelebihan(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Tiga Tujuan ke Jepang (pisahkan dengan koma)</label>
              <textarea value={tempTujuanKeJepang} onChange={(e) => setTempTujuanKeJepang(e.target.value)} className="p-2 border rounded w-full" rows={2} />
            </div>
          </div>
          <div className="mt-2">
            <label className="mb-1.5 text-sm font-medium">Satu Kekurangan</label>
          </div>

          <div>
            <label className="mb-1.5 text-sm font-medium">Tujuan Pulang (pisahkan dengan koma)</label>
            <textarea value={tempTujuanPulang} onChange={(e) => setTempTujuanPulang(e.target.value)} className="p-2 border rounded w-full" rows={2} />
          </div>

          <div className="mt-3">
            <h3 className="text-xl font-semibold">Pendidikan</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="mb-1.5 text-sm font-medium">SD Nama</label>
                <input value={form.pendidikan.sd.nama} onChange={(e) => handleNestedField("pendidikan", "sd", { ...form.pendidikan.sd, nama: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SD Tahun Masuk</label>
                <input value={form.pendidikan.sd.tahun_masuk} onChange={(e) => handleNestedField("pendidikan", "sd", { ...form.pendidikan.sd, tahun_masuk: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SD Tahun Lulus</label>
                <input value={form.pendidikan.sd.tahun_lulus} onChange={(e) => handleNestedField("pendidikan", "sd", { ...form.pendidikan.sd, tahun_lulus: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMP Nama</label>
                <input value={form.pendidikan.smp.nama} onChange={(e) => handleNestedField("pendidikan", "smp", { ...form.pendidikan.smp, nama: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMP Tahun Masuk</label>
                <input value={form.pendidikan.smp.tahun_masuk} onChange={(e) => handleNestedField("pendidikan", "smp", { ...form.pendidikan.smp, tahun_masuk: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMP Tahun Lulus</label>
                <input value={form.pendidikan.smp.tahun_lulus} onChange={(e) => handleNestedField("pendidikan", "smp", { ...form.pendidikan.smp, tahun_lulus: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMA Nama</label>
                <input value={form.pendidikan.sma.nama} onChange={(e) => handleNestedField("pendidikan", "sma", { ...form.pendidikan.sma, nama: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMA Jurusan</label>
                <input value={form.pendidikan.sma.jurusan} onChange={(e) => handleNestedField("pendidikan", "sma", { ...form.pendidikan.sma, jurusan: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMA Tahun Masuk</label>
                <input value={form.pendidikan.sma.tahun_masuk} onChange={(e) => handleNestedField("pendidikan", "sma", { ...form.pendidikan.sma, tahun_masuk: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">SMA Tahun Lulus</label>
                <input value={form.pendidikan.sma.tahun_lulus} onChange={(e) => handleNestedField("pendidikan", "sma", { ...form.pendidikan.sma, tahun_lulus: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">Universitas Nama</label>
                <input value={form.pendidikan.universitas.nama} onChange={(e) => handleNestedField("pendidikan", "universitas", { ...form.pendidikan.universitas, nama: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">Univ Tahun Masuk</label>
                <input value={form.pendidikan.universitas.tahun_masuk} onChange={(e) => handleNestedField("pendidikan", "universitas", { ...form.pendidikan.universitas, tahun_masuk: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">Univ Tahun Lulus</label>
                <input value={form.pendidikan.universitas.tahun_lulus} onChange={(e) => handleNestedField("pendidikan", "universitas", { ...form.pendidikan.universitas, tahun_lulus: e.target.value })} className="p-2 border rounded w-full" />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-xl font-semibold">Riwayat Pekerjaan (Maks 5)</h3>
            {(Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-3 mt-2">
                <div>
                  <label className="mb-1.5 text-sm font-medium">Nama Perusahaan #{idx + 1}</label>
                  <input value={form.pekerjaan[idx]?.nama_perusahaan || ""} onChange={(e) => handleNestedArray("pekerjaan", idx, "nama_perusahaan", e.target.value)} className="p-2 border rounded w-full" />
                </div>
                <div>
                  <label className="mb-1.5 text-sm font-medium">Jenis Pekerjaan</label>
                  <input value={form.pekerjaan[idx]?.jenis_pekerjaan || ""} onChange={(e) => handleNestedArray("pekerjaan", idx, "jenis_pekerjaan", e.target.value)} className="p-2 border rounded w-full" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input placeholder="Th Masuk" value={form.pekerjaan[idx]?.tahun_masuk || ""} onChange={(e) => handleNestedArray("pekerjaan", idx, "tahun_masuk", e.target.value)} className="p-2 border rounded w-full" />
                  <input placeholder="Bln Masuk" value={form.pekerjaan[idx]?.bulan_masuk || ""} onChange={(e) => handleNestedArray("pekerjaan", idx, "bulan_masuk", e.target.value)} className="p-2 border rounded w-full" />
                  <input placeholder="Th Keluar" value={form.pekerjaan[idx]?.tahun_keluar || ""} onChange={(e) => handleNestedArray("pekerjaan", idx, "tahun_keluar", e.target.value)} className="p-2 border rounded w-full" />
                </div>
              </div>
            )))}
          </div>

          <div className="mt-3">
            <h3 className="text-xl font-semibold">Keluarga</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className="mb-1.5 text-sm font-medium">Nama Ayah</label>
                <input value={form.keluarga?.ayah?.nama || ""} onChange={(e) => handleNestedField("keluarga", "ayah", { ...form.keluarga.ayah, nama: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">Usia Ayah</label>
                <input value={form.keluarga?.ayah?.usia || ""} onChange={(e) => handleNestedField("keluarga", "ayah", { ...form.keluarga.ayah, usia: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">Nama Ibu</label>
                <input value={form.keluarga?.ibu?.nama || ""} onChange={(e) => handleNestedField("keluarga", "ibu", { ...form.keluarga.ibu, nama: e.target.value })} className="p-2 border rounded w-full" />
              </div>
              <div>
                <label className="mb-1.5 text-sm font-medium">Usia Ibu</label>
                <input value={form.keluarga?.ibu?.usia || ""} onChange={(e) => handleNestedField("keluarga", "ibu", { ...form.keluarga.ibu, usia: e.target.value })} className="p-2 border rounded w-full" />
              </div>
            </div>

            <div className="mt-2">
              <h4 className="font-medium">Saudara</h4>
              {(Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 mt-2">
                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium">Jenis</label>
                    <select value={form.keluarga?.saudara?.[idx]?.jenis || ""} onChange={(e) => handleKeluargaSaudara(idx, "jenis", e.target.value)} className="p-2 border rounded">
                      <option value="">Pilih</option>
                      <option value="Adik Laki-laki">Adik Laki-laki</option>
                      <option value="Adik Perempuan">Adik Perempuan</option>
                      <option value="Kakak Laki-laki">Kakak Laki-laki</option>
                      <option value="Kakak Perempuan">Kakak Perempuan</option>
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium">Nama</label>
                    <input placeholder="Nama" value={form.keluarga?.saudara?.[idx]?.nama || ""} onChange={(e) => handleKeluargaSaudara(idx, "nama", e.target.value)} className="p-2 border rounded" />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium">Usia</label>
                    <input placeholder="Usia" value={form.keluarga?.saudara?.[idx]?.usia || ""} onChange={(e) => handleKeluargaSaudara(idx, "usia", e.target.value)} className="p-2 border rounded" />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1.5 text-sm font-medium">Pekerjaan</label>
                    <input placeholder="Pekerjaan" value={form.keluarga?.saudara?.[idx]?.pekerjaan || ""} onChange={(e) => handleKeluargaSaudara(idx, "pekerjaan", e.target.value)} className="p-2 border rounded" />
                  </div>
                </div>
              )))}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Gaji Terakhir</label>
              <input value={form.gaji_terakhir || ""} onChange={(e) => setField("gaji_terakhir", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Pernah Tes SO (0/1)</label>
              <input value={form.pernah_tes_so || ""} onChange={(e) => setField("pernah_tes_so", e.target.value)} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">Program</label>
              <select value={form.program} onChange={(e) => setField("program", e.target.value)} className="p-2 border rounded w-full">
                <option value="Magang">Magang</option>
                <option value="Kontrak">Kontrak</option>
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 text-sm font-medium">Nama Pasangan</label>
              <input value={form.pasangan?.nama || ""} onChange={(e) => setField("pasangan", { ...(form.pasangan || {}), nama: e.target.value })} className="p-2 border rounded w-full" />
            </div>
            <div>
              <label className="mb-1.5 text-sm font-medium">HP Pasangan</label>
              <input value={form.pasangan?.nomor_hp || ""} onChange={(e) => setField("pasangan", { ...(form.pasangan || {}), nomor_hp: e.target.value })} className="p-2 border rounded w-full" />
            </div>
          </div>

          <div className="mt-3">
            <h3 className="text-xl font-semibold">Health & Dokumentasi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Merokok?</label>
                <select value={form.health?.merokok} onChange={(e) => handleNestedField("health", "merokok", e.target.value === "true")} className="p-2 border rounded">
                  <option value={true}>Ya</option>
                  <option value={false}>Tidak</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Minum Alkohol?</label>
                <select value={form.health?.alkohol} onChange={(e) => handleNestedField("health", "alkohol", e.target.value === "true")} className="p-2 border rounded">
                  <option value={true}>Ya</option>
                  <option value={false}>Tidak</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Memiliki Paspor?</label>
                <select value={form.health?.paspor} onChange={(e) => handleNestedField("health", "paspor", e.target.value === "true")} className="p-2 border rounded">
                  <option value={true}>Ya</option>
                  <option value={false}>Tidak</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Sehat?</label>
                <select value={form.health?.sehat} onChange={(e) => handleNestedField("health", "sehat", e.target.value === "true")} className="p-2 border rounded">
                  <option value={true}>Ya</option>
                  <option value={false}>Tidak</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Penyakit Bawaan (jika ada)</label>
                <input placeholder="Penyakit Bawaan" value={form.health?.penyakit_bawaan || ""} onChange={(e) => handleNestedField("health", "penyakit_bawaan", e.target.value)} className="p-2 border rounded" />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Pernah Operasi (jika ada)</label>
                <input placeholder="Pernah Operasi" value={form.health?.pernah_operasi || ""} onChange={(e) => handleNestedField("health", "pernah_operasi", e.target.value)} className="p-2 border rounded" />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Alergi (jika ada)</label>
                <input placeholder="Alergi" value={form.health?.alergi || ""} onChange={(e) => handleNestedField("health", "alergi", e.target.value)} className="p-2 border rounded" />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Link Dokumen</label>
                <input placeholder="https://drive.google.com/..." value={form.dokumen_surat} onChange={(e) => setField("dokumen_surat", e.target.value)} className="p-2 border rounded w-full" />
              </div>
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex flex-col items-end gap-3 mt-4">
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-4 py-2 rounded-xl border border-(--akira-border) text-(--akira-gray) hover:bg-gray-100 transition"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl font-medium text-white bg-(--akira-red) hover:bg-(--akira-red-dark) active:bg-(--akira-gray) shadow-sm transition disabled:opacity-60"
              >
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
