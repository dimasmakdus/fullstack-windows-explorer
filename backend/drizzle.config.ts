import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts', // Sesuaikan dengan lokasi file schema Anda
  out: './migrations', // Folder untuk migrasi
  dialect: 'postgresql', //  Pilih dialek PostgreSQL
  dbCredentials: {
    url: process.env.DATABASE_URL!, 
  },
})