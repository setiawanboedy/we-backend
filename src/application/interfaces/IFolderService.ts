import type { CreateFolderData, FolderEntity, FolderWithChildren, UpdateFolderData } from "../../domain/entities/Folder";

export interface IFolderService {
    getAllFolders(): Promise<FolderWithChildren[]>;
    getFolderById(id: string): Promise<FolderEntity | null>;
    getFolderChildren(id: string): Promise<FolderEntity[]>;
    getRootFolders(): Promise<FolderEntity[]>;

    createFolder(data: CreateFolderData): Promise<FolderEntity>;
    updateFolder(id: string, data: UpdateFolderData): Promise<FolderEntity>;
    deleteFolder(id: string): Promise<FolderEntity>;
}