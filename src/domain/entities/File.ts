import { SearchParams } from "./Base";

export interface FileEntity {
  id: string;
  name: string;
  path: string;
  size?: number | null;
  mimeType?: string | null;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFileData {
  name: string;
  path: string;
  size?: number;
  mimeType?: string;
  folderId: string;
}

export interface UpdateFileData {
  name?: string;
  path?: string;
  size?: number;
  mimeType?: string;
  folderId?: string;
}

export type SearchFileParams = SearchParams
