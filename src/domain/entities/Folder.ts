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

