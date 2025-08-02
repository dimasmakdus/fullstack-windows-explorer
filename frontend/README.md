# Frontend Windows Explorer

**Deskripsi Proyek**

Proyek ini adalah implementasi **frontend** dari sebuah penjelajah berkas (file explorer) berbasis web. Aplikasi ini memungkinkan pengguna untuk menelusuri, mengelola, dan berinteraksi dengan struktur berkas dan folder layaknya pada sistem operasi desktop, seperti Windows Explorer. Tujuannya adalah untuk menyediakan antarmuka pengguna yang intuitif dan responsif untuk manajemen berkas.

## Fitur Utama

* **Vue 3:** Menggunakan Vue.js versi terbaru dengan **Composition API** untuk pengembangan yang lebih terstruktur dan reaktif.

* **TypeScript:** Peningkatan kualitas kode dan deteksi kesalahan dini dengan pengetikan statis.

* **Bun:** Penggunaan runtime JavaScript yang sangat cepat untuk menjalankan, menguji, dan mem-bundel proyek.

## Pra-syarat

Pastikan Anda telah menginstal **Bun** di sistem Anda. Anda bisa menginstalnya dengan perintah berikut:

```sh
curl -fsSL https://bun.sh/install | bash
```

## Instalasi

1. **Clone repositori ini:**

```sh
git clone https://github.com/dimasmakdus/fullstack-windows-explorer.git
cd fullstack-windows-explorer
cd frontend
```

2. **Instal dependensi:**
Bun bertindak sebagai package manager yang cepat. Cukup jalankan:

```sh
bun install
```

3.  **Konfigurasi environment:**
Salin file `.env.example` ke `.env` dan isi konfigurasi API Anda.

```sh
cp .env.example .env
```

Isi variabel berikut di file `.env`:

```sh
VITE_API_BASE_URL=http://localhost:3000/api/v1 # API Configuration
VITE_APP_TITLE=Folder Explorer
VITE_APP_VERSION=1.0.0
VITE_ENABLE_DEVTOOLS=true
```

## Penggunaan

### Mode Pengembangan (Development)

Untuk menjalankan server pengembangan dengan hot-reloading:

```sh
bun run dev
```

Aplikasi akan tersedia di `http://localhost:5173`.

## Struktur Proyek

Berikut adalah gambaran umum struktur direktori utama:

```sh
├── public/                 # Aset statis
├── src/
│   ├── assets/             # Gambar, ikon, dll.
│   ├── components/         # Komponen Vue yang dapat digunakan kembali
│   ├── composables/        # Logic Vue Composition Functions
│   ├── services/           # HTTP calls ke backend
│   ├── stores/             # Global state management dengan Pinia
│   ├── types/              # Halaman-halaman aplikasi
│   ├── styles/             # CSS Styles
│   ├── utils/              # Helper functions
│   ├── views/              # Halaman-halaman aplikasi
│   ├── App.vue             # Komponen utama aplikasi
│   └── main.ts             # Entri utama aplikasi
├── package.json
├── bun.lockb               # Lockfile Bun
├── tsconfig.json           # Konfigurasi TypeScript
├── vite.config.ts          # Konfigurasi Vite
└── README.md
```

## Lisensi

Proyek ini dilisensikan di bawah **MIT License**.

## Kontak

* **Nama:** Dimas Mohammad Makdus (GitHub, LinkedIn, Twitter)
* **Email:** dimasmakdus@gmail.com
