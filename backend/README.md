# Backend Windows Explorer

Proyek ini adalah backend API RESTful yang dirancang untuk mensimulasikan fungsionalitas dasar dari Windows Explorer. Dengan memanfaatkan **ElysiaJS** dan **Bun**, proyek ini menyediakan antarmuka API yang cepat dan efisien untuk mengelola direktori. Skema database dikelola dengan **Drizzle ORM** dan **PostgreSQL**, memastikan integritas data yang kuat dan ketik-aman (*type-safe*).

## 🚀 Fungsi Utama

Proyek ini menyediakan serangkaian endpoint yang memungkinkan klien untuk berinteraksi dengan sistem file, termasuk:

* **Manajemen Direktori**: Membuat, mengubah nama, dan menghapus direktori.

* **Navigasi**: Mendapatkan daftar isi dari sebuah direktori (file dan sub-direktori).

## ⚙️ Prasyarat

Pastikan Anda telah menginstal **Bun** pada sistem Anda. Jika belum, Anda bisa menginstalnya dengan perintah berikut:

```sh
curl -fsSL https://bun.sh/install | bash
```

## 📦 Instalasi

1.  **Kloning repositori:**

    ```sh
    git clone https://github.com/dimasmakdus/fullstack-windows-explorer.git
    cd backend
    ```

2.  **Instal dependensi:**

    ```sh
    bun install
    ```

3.  **Konfigurasi environment:**
    Salin file `.env.example` ke `.env` dan isi detail koneksi database PostgreSQL Anda.

    ```sh
    cp .env.example .env
    ```

    Isi variabel berikut di file `.env`:

    ```sh
    DATABASE_URL="postgres://user:password@host:port/database"
    ```

## 🏁 Menjalankan Aplikasi

### Mode Pengembangan

Jalankan server dalam mode pengembangan dengan fitur *hot-reloading* untuk pengalaman pengembangan yang lancar.

```sh
bun run dev
```


## 📊 Migrasi Database dengan Drizzle

Proyek ini menggunakan Drizzle Kit untuk mengelola migrasi skema database.

### Membuat Migrasi Baru

Setelah Anda mengubah skema database di `src/db/schema.ts`, buat file migrasi baru:

```sh
bun run db:generate
```

### Menerapkan Migrasi

Terapkan semua migrasi yang tertunda ke database Anda:

```sh
bun run db:migrate
```

Perintah ini akan menjalankan skrip migrasi yang telah Anda buat.

## 📄 Lisensi

Proyek ini dilisensikan di bawah [Lisensi MIT](https://opensource.org/licenses/MIT).