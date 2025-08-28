import type { CreateFileData, FileEntity, UpdateFileData } from "../entities/File";

export interface FileRepository {
  findAll(): Promise<FileEntity[]>;
  findById(id: string): Promise<FileEntity | null>;
  findByFolderId(folderId: string): Promise<FileEntity[]>;
  findByPath(path: string): Promise<FileEntity | null>;
  exists(path: string): Promise<boolean>;

  create(data: CreateFileData): Promise<FileEntity>;
  update(id: string, data: UpdateFileData): Promise<FileEntity | null>;
  delete(id: string): Promise<FileEntity | null>;
}
