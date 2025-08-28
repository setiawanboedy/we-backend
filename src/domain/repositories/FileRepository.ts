import type { CreateFileData, FileEntity, UpdateFileData, SearchFileParams } from "../entities/File";

export interface FileRepository {
  findById(id: string): Promise<FileEntity | null>;
  findByFolderId(folderId: string): Promise<FileEntity[]>;
  findByPath(path: string): Promise<FileEntity | null>;
  exists(path: string): Promise<boolean>;
  searchFiles(query: SearchFileParams): Promise<FileEntity[]>;

  create(data: CreateFileData): Promise<FileEntity>;
  update(id: string, data: UpdateFileData): Promise<FileEntity | null>;
  delete(id: string): Promise<FileEntity | null>;
}
