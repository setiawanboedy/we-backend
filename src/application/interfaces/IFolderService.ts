import type { FolderEntity, FolderWithChildren } from "../../domain/entities/Folder";

export interface IFolderService {
    getAllFolders(): Promise<FolderWithChildren[]>;
    getFolderById(id: string): Promise<FolderEntity | null>;
    getFolderChildren(id: string): Promise<FolderEntity[]>;
    getRootFolders(): Promise<FolderEntity[]>;
}