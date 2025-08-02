import { eq } from 'drizzle-orm';
import { db, schema } from '../config/database';
import { buildFolderTree, sanitizeFolderName } from '../utils/folderUtils';
import type { Folder, CreateFolderRequest, UpdateFolderRequest } from '../types/folder.types';

export class FolderService {
  
  static async getAllFoldersTree(): Promise<Folder[]> {
    const allFolders = await db.query.folders.findMany();
    return buildFolderTree(allFolders);
  }

  static async getFolderChildren(folderId: string): Promise<Folder[]> {
    const children = await db.query.folders.findMany({
      where: (folders, { eq }) => eq(folders.parentId, folderId),
    });

    return children.sort((a, b) => a.name.localeCompare(b.name));
  }

  static async createFolder(data: CreateFolderRequest): Promise<Folder> {
    const { name, parentId } = data;

    // Validate parent folder exists if parentId is provided
    if (parentId) {
      const parentExists = await db.query.folders.findFirst({
        where: (folders, { eq }) => eq(folders.id, parentId),
      });

      if (!parentExists) {
        throw new Error('Parent folder not found');
      }
    }

    const [newFolder]: any = await db
      .insert(schema.folders)
      .values({
        name: sanitizeFolderName(name),
        parentId: parentId || null,
      })
      .returning();

    return newFolder;
  }

  static async searchFolders(query: string): Promise<Folder[]> {
    const searchTerm = `%${query.trim()}%`;

    const foundFolders = await db.query.folders.findMany({
      where: (folders, { ilike }) => ilike(folders.name, searchTerm),
      orderBy: (folders, { asc }) => asc(folders.name),
    });

    return foundFolders;
  }

  static async deleteFolder(folderId: string): Promise<void> {
    const existingFolder = await db.query.folders.findFirst({
      where: eq(schema.folders.id, folderId),
    });

    if (!existingFolder) {
      throw new Error('Folder not found');
    }

    await db.delete(schema.folders).where(eq(schema.folders.id, folderId));
  }

  static async updateFolder(folderId: string, data: UpdateFolderRequest): Promise<Folder> {
    const { name } = data;

    // Check if folder exists
    const existingFolder = await db.query.folders.findFirst({
      where: eq(schema.folders.id, folderId),
    });

    if (!existingFolder) {
      throw new Error('Folder not found');
    }

    // Update folder name
    const [updatedFolder]: any = await db
      .update(schema.folders)
      .set({ name: sanitizeFolderName(name) })
      .where(eq(schema.folders.id, folderId))
      .returning();

    return updatedFolder;
  }

  //Seed database with initial data
  static async seedDatabase(): Promise<void> {
    console.log('Seeding database...');

    // Clear existing data
    await db.delete(schema.folders);

    // Insert root folders
    const [rootDocs] = await db.insert(schema.folders).values({ name: 'Documents' }).returning();
    const [rootPics] = await db.insert(schema.folders).values({ name: 'Pictures' }).returning();
    const [rootMusic] = await db.insert(schema.folders).values({ name: 'Music' }).returning();

    if (!rootDocs || !rootPics || !rootMusic) {
      throw new Error('Failed to insert root folders during seeding');
    }

    // Insert subfolders for Documents
    const [work] = await db.insert(schema.folders).values({ name: 'Work', parentId: rootDocs.id }).returning();
    await db.insert(schema.folders).values({ name: 'Personal', parentId: rootDocs.id });
    const [downloads] = await db.insert(schema.folders).values({ name: 'Downloads', parentId: rootDocs.id }).returning();

    if (!work || !downloads) {
      throw new Error('Failed to insert subfolders for Documents during seeding');
    }

    // Insert subfolders for Work
    await db.insert(schema.folders).values({ name: 'Reports', parentId: work.id });
    await db.insert(schema.folders).values({ name: 'Presentations', parentId: work.id });

    // Insert subfolders for Downloads
    await db.insert(schema.folders).values({ name: 'Software', parentId: downloads.id });
    await db.insert(schema.folders).values({ name: 'Images', parentId: downloads.id });

    // Insert subfolders for Pictures
    await db.insert(schema.folders).values({ name: 'Vacation', parentId: rootPics.id });
    await db.insert(schema.folders).values({ name: 'Family', parentId: rootPics.id });

    // Insert subfolders for Music
    await db.insert(schema.folders).values({ name: 'Pop', parentId: rootMusic.id });
    await db.insert(schema.folders).values({ name: 'Rock', parentId: rootMusic.id });

    console.log('Database seeded successfully!');
  }
}