import type { CreateFileData, FileEntity, UpdateFileData, SearchFileParams } from "../../domain/entities/File";

export interface IFileService {
  getFileById(id: string): Promise<FileEntity | null>;
  getFilesByFolderId(folderId: string): Promise<FileEntity[]>;
  searchFiles(query: SearchFileParams): Promise<FileEntity[]>;

  createFile(data: CreateFileData): Promise<FileEntity>;
  updateFile(id: string, data: UpdateFileData): Promise<FileEntity>;
  deleteFile(id: string): Promise<FileEntity>;
}
