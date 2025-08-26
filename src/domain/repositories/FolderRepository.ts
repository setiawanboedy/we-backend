import type { FolderEntity } from "../entities/Folder";

export interface FolderRepository {
    findAll(): Promise<FolderEntity[]>;
    findById(id: string): Promise<FolderEntity | null>;
    findByParentId(parentId: string | null): Promise<FolderEntity[]>;
    findRootFolders(): Promise<FolderEntity[]>;
    exists(path: string): Promise<boolean>;
}