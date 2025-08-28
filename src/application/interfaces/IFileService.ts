import type { CreateFileData, FileEntity, UpdateFileData } from "../../domain/entities/File";

export interface IFileService {
  getAllFiles(): Promise<FileEntity[]>;
  getFileById(id: string): Promise<FileEntity | null>;
  getFilesByFolderId(folderId: string): Promise<FileEntity[]>;

  createFile(data: CreateFileData): Promise<FileEntity>;
  updateFile(id: string, data: UpdateFileData): Promise<FileEntity>;
  deleteFile(id: string): Promise<FileEntity>;
}
