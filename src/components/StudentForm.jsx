import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import SearchableSelect from "./SearchableSelect";
import provinsiKotaData from "../data/provinsi_kota.json";

const kotaOptions = provinsiKotaData.map((k) => ({
  label: k.kota, // nama kota
  type: k.tipe, // Kabupaten / Kota
}));

export default function StudentForm({ onDone, onCancel }) {
  const [data, setData] = useState({
    angkatan: "",
    tanggal_masuk: "",
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
    alamat_ktp: "",
    // Fisik & Kepribadian
    tinggi_badan: "",
    berat_badan: "",
    lingkar_pinggang: "",
    ukuran_kaki: "",
    dominan_tangan: "Kanan",
    hobi: [],
    keahlian: [],
    kelebihan: [],
    kekurangan: "",
    tujuan_ke_jepang: [],
    tujuan_pulang: [],
    // Pendidikan
    pendidikan: {
      sd: { nama: "", tahun_masuk: "", tahun_lulus: "" },
      smp: { nama: "", tahun_masuk: "", tahun_lulus: "" },
      sma: { nama: "", jurusan: "", tahun_masuk: "", tahun_lulus: "" },
      universitas: { nama: "", jurusan: "", tahun_masuk: "", tahun_keluar: "" },
    },
    // Pekerjaan
    pekerjaan: Array(1).fill({
      nama_perusahaan: "",
      jenis_pekerjaan: "",
      tahun_masuk: "",
      bulan_masuk: "",
      tahun_keluar: "",
      bulan_keluar: "",
    }),
    gaji_terakhir: "",
    pernah_tes_so: 0,
    // Keluarga
    keluarga: {
      ayah: { nama: "", usia: "", pekerjaan: "", nomor_hp: "" },
      ibu: { nama: "", usia: "", pekerjaan: "", nomor_hp: "" },
      saudara: Array(0).fill({ jenis: "Adik Laki-laki", nama: "", usia: "", pekerjaan: "" }),
    },
    // Health & Dokumen
    health: {
      merokok: false,
      alkohol: false,
      paspor: false,
      sehat: true,
      penyakit_bawaan: "",
      pernah_operasi: "",
      alergi: "",
    },
    // Program & Pasangan
    program: "Magang",
    pasangan: { nama: "", nomor_hp: "" },
    rencana_pembayaran: "Biaya Mandiri",
    dokumen_surat: [],
    // Alamat KTP (flat fields used in UI)
    alamat_ktp_jalan: "",
    alamat_ktp_rt: "",
    alamat_ktp_rw: "",
    alamat_ktp_kelurahan: "",
    alamat_ktp_kecamatan: "",
    alamat_ktp_kota: "",
    // Status record
    status: "Aktif",
  });

  const [tempHobi, setTempHobi] = useState(data.hobi.join(", "));
  const [tempKeahlian, setTempKeahlian] = useState(data.keahlian.join(", "));
  const [tempKelebihan, setTempKelebihan] = useState(data.kelebihan.join(", "));
  const [tempTujuanKeJepang, setTempTujuanKeJepang] = useState(data.tujuan_ke_jepang.join(", "));
  const [tempTujuanPulang, setTempTujuanPulang] = useState(data.tujuan_pulang.join(", "));

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
  const handleFile = (e) => setData((prev) => ({ ...prev, dokumen_surat: Array.from(e.target.files) }));

  // Hitung usia otomatis
  useEffect(() => {
    if (data.tanggal_lahir) {
      const birth = new Date(data.tanggal_lahir);
      const age = new Date().getFullYear() - birth.getFullYear();
      setData((prev) => ({ ...prev, usia: age }));
    }
  }, [data.tanggal_lahir]);

  const save = (e) => {
    e.preventDefault();
    (async () => {
      try {
        setSaving(true);

        // prepare arrays from temp fields (don't rely on setState flush)
        const hobi = tempHobi ? tempHobi.split(/\s*,\s*|\n/) : [];
        const keahlian = tempKeahlian ? tempKeahlian.split(/\s*,\s*|\n/) : [];
        const kelebihan = tempKelebihan ? tempKelebihan.split(/\s*,\s*|\n/) : [];
        const tujuan_ke_jepang = tempTujuanKeJepang ? tempTujuanKeJepang.split(/\s*,\s*|\n/) : [];
        const tujuan_pulang = tempTujuanPulang ? tempTujuanPulang.split(/\s*,\s*|\n/) : [];

        const payload = {
          angkatan: data.angkatan || null,
          tanggal_masuk: data.tanggal_masuk || null,
          nis: data.nis || null,

          // personal
          nama: data.nama || null,
          nomor_ktp: data.nomor_ktp || null,
          jenis_kelamin: data.jenis_kelamin || null,
          tempat_lahir: data.tempat_lahir || null,
          tanggal_lahir: data.tanggal_lahir || null,
          usia: data.usia || null,
          agama: data.agama || null,
          golongan_darah: data.golongan_darah || null,
          status_pernikahan: data.status_pernikahan || null,
          nomor_wa: data.nomor_wa || null,
          email: data.email || null,
          asal_daerah: data.asal_daerah || null,
          // Kirim hanya objek gabungan alamat_ktp (tidak mengirim field-flat)
          alamat_ktp: {
            jalan: data.alamat_ktp_jalan || null,
            rt: data.alamat_ktp_rt || null,
            rw: data.alamat_ktp_rw || null,
            kelurahan: data.alamat_ktp_kelurahan || null,
            kecamatan: data.alamat_ktp_kecamatan || null,
            kota: data.alamat_ktp_kota || null,
          },

          // physical / personality
          tinggi_badan: data.tinggi_badan || null,
          berat_badan: data.berat_badan || null,
          lingkar_pinggang: data.lingkar_pinggang || null,
          ukuran_kaki: data.ukuran_kaki || null,
          dominan_tangan: data.dominan_tangan || null,
          hobi,
          keahlian,
          // Gabungkan motivasi ke satu kolom JSON
          motivasi: {
            kelebihan,
            kekurangan: data.kekurangan || null,
            tujuan_ke_jepang,
            tujuan_pulang,
          },

          // pendidikan / pekerjaan / keluarga as JSON
          pendidikan: data.pendidikan || {},
          pekerjaan: data.pekerjaan || [],
          gaji_terakhir: data.gaji_terakhir || null,
          pernah_tes_so: data.pernah_tes_so || null,
          keluarga: data.keluarga || {},

          // health & program
          health: data.health || {},
          // program_info menyimpan detail program sebagai JSON
          program_info: {
            jenis_program: data.program || null,
            rencana_pembayaran: data.rencana_pembayaran || null,
          },
          pasangan: data.pasangan || {},
          status: "Aktif",
          dokumen_surat: [],
        };

        // insert row
        const { data: inserted, error: insertError } = await supabase
          .from("students")
          .insert(payload)
          .select()
          .single();

        if (insertError) throw insertError;

        const studentId = inserted.id;

        // upload files if any
        if (data.dokumen_surat && data.dokumen_surat.length > 0) {
          const urls = await uploadFiles(data.dokumen_surat, studentId);

          const { error: updateError } = await supabase.from("students").update({ dokumen_surat: urls }).eq("id", studentId);
          if (updateError) console.error("Failed update dokumen_surat", updateError);
        }

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

  // helper: upload files to Supabase storage and return public urls
  const uploadFiles = async (files, studentId) => {
    if (!files || files.length === 0) return [];
    const urls = [];

    for (const f of files) {
      const path = `${studentId}/${Date.now()}_${f.name}`;
      const { data: up, error: upErr } = await supabase.storage.from("student-docs").upload(path, f);
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("student-docs").getPublicUrl(up.path);
      urls.push(pub.publicUrl);
    }

    return urls;
  };

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={save}
      className="space-y-6 p-10 rounded-xl shadow-md bg-white max-h-[90vh] overflow-auto"
    >
    
    <div className="relative">
        <div onClick={onCancel} className="cursor-pointer absolute -top-6 -right-4 text-gray-500 hover:text-gray-700 text-4xl">×</div>
    </div> 
    
    <h2 className="text-2xl font-bold text-left -mt-5 mb-6">Form Pendaftaran & Verifikasi Data Siswa</h2>

      {/* Angkatan, Tanggal Masuk, NIS */}
      <section className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">Angkatan</label>
          <input
            type="number"
            value={data.angkatan}
            onChange={(e) => setField("angkatan", e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">Tanggal Masuk</label>
          <input
            type="date"
            value={data.tanggal_masuk}
            onChange={(e) => setField("tanggal_masuk", e.target.value)}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">NIS</label>
          <input
            value={data.nis}
            onChange={(e) => setField("nis", e.target.value)}
            className="p-2 border rounded bg-slate-100"
          />
        </div>
      </section>

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
              required
            />
          </div>

          {/* Nomor KTP */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Nomor KTP</label>
            <input
              type="number"
              value={data.nomor_ktp}
              onChange={(e) => setField("nomor_ktp", e.target.value)}
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
            <SearchableSelect
              options={kotaOptions}
              value={data.tempat_lahir}
              onChange={(val) => setField("tempat_lahir", val)}
              placeholder="Pilih Kota / Kabupaten"
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
              readOnly
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
            />
          </div>

          {/* Asal Daerah */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Asal Daerah Saat Ini</label>
            <SearchableSelect
              options={kotaOptions}
              value={data.asal_daerah}
              onChange={(val) => setField("asal_daerah", val)}
              placeholder="Pilih Kota / Kabupaten"
            />
          </div>
        </div>

        {/* Alamat KTP */}
        <div className="flex flex-col">
          <label className="mb-1.5 text-sm font-medium">Alamat KTP</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Alamat Jalan"
              value={data.alamat_ktp_jalan || ""}
              onChange={(e) => setField("alamat_ktp_jalan", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="RT"
              value={data.alamat_ktp_rt || ""}
              onChange={(e) => setField("alamat_ktp_rt", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="RW"
              value={data.alamat_ktp_rw || ""}
              onChange={(e) => setField("alamat_ktp_rw", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Kelurahan / Desa"
              value={data.alamat_ktp_kelurahan || ""}
              onChange={(e) => setField("alamat_ktp_kelurahan", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Kecamatan"
              value={data.alamat_ktp_kecamatan || ""}
              onChange={(e) => setField("alamat_ktp_kecamatan", e.target.value)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Kota / Kabupaten"
              value={data.alamat_ktp_kota || ""}
              onChange={(e) => setField("alamat_ktp_kota", e.target.value)}
              className="p-2 border rounded"
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
              value={data.tinggi_badan}
              onChange={(e) => setField("tinggi_badan", e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Berat Badan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Berat Badan (kg)</label>
            <input
              type="number"
              value={data.berat_badan}
              onChange={(e) => setField("berat_badan", e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Lingkar Pinggang */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Lingkar Pinggang (cm)</label>
            <input
              type="number"
              value={data.lingkar_pinggang}
              onChange={(e) => setField("lingkar_pinggang", e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Ukuran Kaki */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Ukuran Kaki</label>
            <input
              type="text"
              value={data.ukuran_kaki}
              onChange={(e) => setField("ukuran_kaki", e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Dominan Tangan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Dominan Tangan</label>
            <select
              value={data.dominan_tangan}
              onChange={(e) => setField("dominan_tangan", e.target.value)}
              className="p-2 border rounded"
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
              placeholder="Contoh: Membaca, Olahraga, Musik"
              value={tempHobi}
              onChange={(e) => setTempHobi(e.target.value)}
              className="p-2 border rounded resize-none"
            />
          </div>

          {/* Keahlian / Bakat */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Keahlian / Bakat Khusus (pisah koma)</label>
            <textarea
              rows={1}
              placeholder="Contoh: Memasak, Menyanyi"
              value={tempKeahlian}
              onChange={(e) => setTempKeahlian(e.target.value)}
              className="p-2 border rounded resize-none"
            />
          </div>

          {/* Kelebihan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tiga Kelebihan (pisah koma)</label>
            <textarea
              rows={1}
              placeholder="Contoh: Rajin, Disiplin, Kreatif"
              value={tempKelebihan}
              onChange={(e) => setTempKelebihan(e.target.value)}
              className="p-2 border rounded resize-none"
            />
          </div>

          {/* Kekurangan */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Satu Kekurangan</label>
            <input
              type="text"
              placeholder="Contoh: Pemalu"
              value={data.kekurangan}
              onChange={(e) => setField("kekurangan", e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Tujuan ke Jepang */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tiga Tujuan ke Jepang (pisah koma)</label>
            <textarea
              rows={2}
              placeholder="Contoh: Belajar Bahasa, Wisata, Kerja"
              value={tempTujuanKeJepang}
              onChange={(e) => setTempTujuanKeJepang(e.target.value)}
              className="p-2 border rounded resize-none"
            />
          </div>

          {/* Tujuan Pulang */}
          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Tujuan Saat Pulang ke Indonesia (pisah koma)</label>
            <textarea
              rows={2}
              placeholder="Contoh: Bekerja, Mengembangkan Usaha"
              value={tempTujuanPulang}
              onChange={(e) => setTempTujuanPulang(e.target.value)}
              className="p-2 border rounded resize-none"
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
                  value={data.pendidikan[level].tahun_masuk}
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
                  value={data.pendidikan[level].tahun_lulus}
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
        <h3 className="text-xl font-semibold">4. Riwayat Pekerjaan (Maks 4)</h3>

        {/* Input Jumlah Perusahaan */}
        <div className="flex items-center">
          <label className="mb-1.5 text-sm font-medium mr-5">Jumlah Perusahaan :</label>
          <input
            type="number"
            min={1}
            max={4}
            value={data.pekerjaan.length}
            onChange={(e) => {
              let n = Math.max(1, Math.min(4, parseInt(e.target.value) || 1));
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
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Jenis Pekerjaan</label>
                <input
                  type="text"
                  value={job.jenis_pekerjaan}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "jenis_pekerjaan", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Tahun Masuk</label>
                <input
                  type="number"
                  value={job.tahun_masuk}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "tahun_masuk", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Bulan Masuk</label>
                <input
                  type="text"
                  value={job.bulan_masuk}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "bulan_masuk", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Tahun Keluar</label>
                <input
                  type="number"
                  value={job.tahun_keluar}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "tahun_keluar", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Bulan Keluar</label>
                <input
                  type="text"
                  value={job.bulan_keluar}
                  onChange={(e) => handleNestedArray("pekerjaan", idx, "bulan_keluar", e.target.value)}
                  className="p-2 border rounded"
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
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-1.5 text-sm font-medium">Berapa Kali Pernah Tes SO Lain</label>
            <input
              type="number"
              placeholder="Pernah Tes SO"
              value={data.pernah_tes_so}
              onChange={(e) => setField("pernah_tes_so", e.target.value)}
              className="p-2 border rounded"
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
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Usia</label>
                <input
                  type="number"
                  value={data.keluarga[parent].usia}
                  onChange={(e) =>
                    handleNestedField("keluarga", parent, { ...data.keluarga[parent], usia: e.target.value })
                  }
                  className="p-2 border rounded"
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
            max={4}
            value={data.keluarga.saudara.length}
            onChange={(e) => {
              let n = Math.max(0, Math.min(4, parseInt(e.target.value) || 0));
              const saudaraBaru = Array.from({ length: n }, (_, i) =>
                data.keluarga.saudara[i] || { jenis: "", nama: "", usia: "", pekerjaan: "" }
              );
              setField("keluarga", { ...data.keluarga, saudara: saudaraBaru });
            }}
            className="w-fit border rounded"
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
                  value={s.jenis}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "jenis", e.target.value)}
                  className="p-2 border rounded"
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
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Usia</label>
                <input
                  type="number"
                  value={s.usia}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "usia", e.target.value)}
                  className="p-2 border rounded"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1.5 text-sm font-medium">Pekerjaan</label>
                <input
                  type="text"
                  value={s.pekerjaan}
                  onChange={(e) => handleNestedArrayNested("keluarga", "saudara", idx, "pekerjaan", e.target.value)}
                  className="p-2 border rounded"
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
            <label className="mb-1.5 text-sm font-medium">Upload Dokumen</label>
            <input type="file" multiple onChange={handleFile} className="p-2 border rounded" />
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

      {/* Submit */}
        <div className="flex flex-col items-end gap-3 mt-4">

        {error && (
          <div className="text-red-600 mb-2">{error}</div>
        )}

        <div className="flex justify-end gap-3">

        {/* Batal */}
        <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-(--akira-border) text-(--akira-gray) hover:bg-gray-100 hover:text-white transition"
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
