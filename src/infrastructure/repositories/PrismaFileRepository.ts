import type {
  CreateFileData,
  FileEntity,
  UpdateFileData,
} from "../../domain/entities/File";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import { prisma } from "../database/prisma";

export class PrismaFileRepository implements FileRepository {
  async findAll(): Promise<FileEntity[]> {
    const files = await prisma.file.findMany({
      orderBy: [{ folderId: "asc" }, { name: "asc" }],
    });
    return files;
  }

  async findById(id: string): Promise<FileEntity | null> {
    const file = await prisma.file.findUnique({
      where: { id },
    });
    return file;
  }

  async findByFolderId(folderId: string): Promise<FileEntity[]> {
    const files = await prisma.file.findMany({
      where: { folderId },
      orderBy: { name: "asc" },
    });
    return files;
  }

  async findByPath(path: string): Promise<FileEntity | null> {
    const file = await prisma.file.findUnique({
      where: { path },
    });
    return file;
  }

  async exists(path: string): Promise<boolean> {
    const file = await prisma.file.findUnique({
      where: { path },
    });
    return file ? true : false;
  }

  async create(data: CreateFileData): Promise<FileEntity> {
    const file = await prisma.file.create({
      data: {
        name: data.name,
        path: data.path,
        size: data.size,
        mimeType: data.mimeType,
        folderId: data.folderId,
      },
    });
    return file;
  }

  async update(
    id: string,
    data: UpdateFileData
  ): Promise<FileEntity | null> {
    try {
      const file = await prisma.file.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.path && { path: data.path }),
          ...(data.size !== undefined && { size: data.size }),
          ...(data.mimeType !== undefined && { mimeType: data.mimeType }),
          ...(data.folderId && { folderId: data.folderId }),
        },
      });
      return file;
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<FileEntity | null> {
    try {
      const file = await prisma.file.delete({ where: { id } });
      return file;
    } catch (error) {
      return null;
    }
  }
}
