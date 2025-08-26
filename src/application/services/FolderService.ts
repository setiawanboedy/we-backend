import type { FolderEntity, FolderWithChildren } from "../../domain/entities/Folder";
import type { FolderRepository } from "../../domain/repositories/FolderRepository";
import type { IFolderService } from "../interfaces/IFolderService";

export class FolderService implements IFolderService {
    constructor (
        private readonly folderRepository: FolderRepository,
    ){}
    async getAllFolders(): Promise<FolderWithChildren[]> {
        const allFolders = await this.folderRepository.findAll();
        return this.buildHierarchy(allFolders);
    }
    async getFolderById(id: string): Promise<FolderEntity | null> {
        return await this.folderRepository.findById(id);
    }
    async getFolderChildren(id: string): Promise<FolderEntity[]> {
        const parentFolder = await this.folderRepository.findById(id);
        if (!parentFolder) {
            throw "Parent folder not found";
        }

        return await this.folderRepository.findByParentId(id)
    }
    async getRootFolders(): Promise<FolderEntity[]> {
        return await this.folderRepository.findRootFolders();
    }


    private buildHierarchy(folders: FolderEntity[]): FolderWithChildren[] {
        const folderMap = new Map<string, FolderWithChildren>();
        const rootFolder: FolderWithChildren[] = [];

        folders.forEach(folder => {
            folderMap.set(folder.id, {...folder, children: []});
        });

        folders.forEach(folder => {
            const folderWithChildren = folderMap.get(folder.id)!;

            if (folder.parentId) {
                const parent = folderMap.get(folder.parentId);

                if (parent) {
                    parent.children.push(folderWithChildren);
                }
            }else {
                rootFolder.push(folderWithChildren);
            }
        });
        return rootFolder;
    }

}