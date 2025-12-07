Akira Gakuin Management System (AGMS)

[GitHub last commit] [GitHub repo size] [GitHub issues] [GitHub stars]
[GitHub license]

Akira Gakuin Management System (AGMS) adalah aplikasi internal untuk
mengelola data siswa, dokumen, dan proses seleksi Akira Gakuin.

🚀 Features

1. Student Management

-   Tambah/edit/hapus data siswa
-   Informasi pribadi, alamat, kontak, sekolah, wali murid
-   Dynamic form pekerjaan orang tua
-   Status berdasarkan hasil seleksi

2. Document Management

-   Upload foto, KK, raport, sertifikat
-   Penyimpanan aman di Supabase Storage

3. Selection Process

-   Input hasil SO
-   Input hasil Shiken
-   Input hasil Interview
-   Status otomatis

4. Data Export

-   Export ke Excel (XLSX)
-   Export berdasarkan tahap seleksi

5. Access & Security

-   Login via Supabase Auth
-   Proteksi halaman admin
-   Validasi formulir

🛠️ Tech Stack

-   ReactJS
-   Supabase
-   TailwindCSS
-   React Router
-   XLSX.js

📂 Project Structure

src/ ├── components/ ├── pages/ ├── hooks/ ├── lib/ ├── utils/ └──
App.jsx

📦 Installation

git clone https://github.com/username/repo-name.git cd repo-name npm
install npm run dev

🔧 Environment Variables

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

▶️ Run the App

npm run dev

📝 Notes

-   Admin only access
-   Dokumen tersimpan di Supabase Storage
-   Sistem terus dikembangkan
