import { SearchFileParams } from "../entities/File";
import type { CreateFolderData, FolderEntity, UpdateFolderData } from "../entities/Folder";

export interface FolderRepository {
    findAll(): Promise<FolderEntity[]>;
    searchFolders(query: SearchFileParams): Promise<FolderEntity[]>;
    findById(id: string): Promise<FolderEntity | null>;
    findByParentId(parentId: string | null): Promise<FolderEntity[]>;
    findRootFolders(): Promise<FolderEntity[]>;
    exists(path: string): Promise<boolean>;

    create(data: CreateFolderData): Promise<FolderEntity>;
    update(id: string, data: UpdateFolderData): Promise<FolderEntity | null>;
    delete(id: string): Promise<FolderEntity | null>;
}