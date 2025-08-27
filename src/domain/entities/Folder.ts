export interface FolderEntity {
    id: string;
    name: string;
    path: string;
    parentId: string | null;
    size?: number | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface FolderWithChildren extends FolderEntity{
    children: FolderWithChildren[];
}

export interface CreateFolderData {
    name: string;
    path: string;
    parentId?: string;
}

export interface UpdateFolderData {
    name?: string;
    path?: string;
    parentId?: string;
}