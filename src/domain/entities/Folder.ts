export interface FolderEntity {
    id: string;
    name: string;
    path: string;
    parentId: string | null;
    size?: number | null;
    createAt: Date;
    updatedAt: Date;
}

export interface FolderWithChildren extends FolderEntity{
    children: FolderWithChildren[];
}

