import type { CreateFolderData, FolderEntity, SearchFolderParams, UpdateFolderData } from "../entities/Folder";

export interface FolderRepository {
    findAll(): Promise<FolderEntity[]>;
    searchFolders(query: SearchFolderParams): Promise<FolderEntity[]>;
    findById(id: string): Promise<FolderEntity | null>;
    findByParentId(parentId: string | null): Promise<FolderEntity[]>;
    findRootFolders(): Promise<FolderEntity[]>;
    exists(path: string): Promise<boolean>;

    create(data: CreateFolderData): Promise<FolderEntity>;
    update(id: string, data: UpdateFolderData): Promise<FolderEntity | null>;
    delete(id: string): Promise<FolderEntity | null>;
}