import { pgTable, varchar, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Definisi tabel
export const folders = pgTable('folders', {
  id: uuid('id').primaryKey().defaultRandom(), // uuid sebagai primary key, otomatis di-generate
  name: varchar('name', { length: 256 }).notNull(),
  parentId: uuid('parent_id'), // ID folder induk, bisa NULL untuk folder root
});

// Definisi relasi antar tabel
export const folderRelations = relations(folders, ({ one, many }) => ({
  
  // Sebuah folder bisa memiliki satu parent (jika parentId ada)
  parent: one(folders, {
    fields: [folders.parentId],
    references: [folders.id],
    relationName: 'folder_children', // Nama relasi
  }),

  // Sebuah folder bisa memiliki banyak children
  children: many(folders, {
    relationName: 'folder_children', // Harus sama dengan relationName di 'parent'
  }),
}));