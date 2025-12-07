# 🌸 **Akira Gakuin Management System (AGMS)**

**Modern Student & Selection Management Platform**

![Last
Commit](https://img.shields.io/github/last-commit/username/repo-name?color=purple)
![Repo
Size](https://img.shields.io/github/repo-size/username/repo-name?color=blue)
![Issues](https://img.shields.io/github/issues/username/repo-name?color=yellow)
![Stars](https://img.shields.io/github/stars/username/repo-name?style=social)
![License](https://img.shields.io/badge/license-MIT-green)

AGMS adalah platform internal yang digunakan untuk mengelola data siswa,
dokumen administrasi, serta seluruh tahap seleksi di Akira Gakuin.\
Dibangun untuk menggantikan spreadsheet dan meningkatkan kecepatan,
ketepatan, dan kemudahan operasional.

------------------------------------------------------------------------

## ✨ **Fitur Utama**

### 🎓 **1. Student Management**

-   Input, edit, & delete data siswa\
-   Data lengkap: pribadi, kontak, alamat, sekolah, wali\
-   Dynamic form pekerjaan orang tua\
-   Tracking status: *Terdaftar → Lolos Seleksi → Berangkat*

------------------------------------------------------------------------

### 📁 **2. Document Management**

-   Upload foto siswa\
-   Upload KK, raport, sertifikat\
-   File tersimpan aman via **Supabase Storage**

------------------------------------------------------------------------

### 🧪 **3. Selection Process**

-   Input hasil **SO**, **Shiken**, dan **Interview**\
-   Status otomatis berdasarkan hasil\
-   Data bisa diexport

------------------------------------------------------------------------

### 📊 **4. Data Export**

-   Export to Excel (XLSX)\
-   Export per tahap seleksi untuk kebutuhan laporan

------------------------------------------------------------------------

### 🔐 **5. Access & Security**

-   Login via **Supabase Auth**\
-   Route protection untuk admin\
-   Validasi form & keamanan data

------------------------------------------------------------------------

## 🛠️ **Tech Stack**

  Teknologi          Fungsi
  ------------------ -------------------------
  **ReactJS**        Frontend framework
  **Supabase**       Auth, Database, Storage
  **TailwindCSS**    Styling UI
  **React Router**   Navigasi halaman
  **XLSX.js**        Export Excel

------------------------------------------------------------------------

## 📂 **Project Structure**

    src/
     ├── components/     
     ├── pages/          
     ├── hooks/          
     ├── lib/            
     ├── utils/          
     └── App.jsx

------------------------------------------------------------------------

## 📦 **Installation**

``` bash
git clone https://github.com/username/repo-name.git
cd repo-name
npm install
npm run dev
```

------------------------------------------------------------------------

## 🔧 **Environment Variables**

Buat file: `.env`

    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

------------------------------------------------------------------------

## ▶️ **Run the App**

``` bash
npm run dev
```

------------------------------------------------------------------------

## 📝 **Notes**

-   Hanya admin yang memiliki akses penuh\
-   Semua dokumen tersimpan di Supabase\
-   Sistem akan terus dikembangkan
