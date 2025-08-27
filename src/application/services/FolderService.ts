import type {
  CreateFolderData,
  FolderEntity,
  FolderWithChildren,
  UpdateFolderData,
} from "../../domain/entities/Folder";
import { LogicError, NotFoundError } from "../../domain/errors/customErrors";
import type { FolderRepository } from "../../domain/repositories/FolderRepository";
import type { IFolderService } from "../interfaces/IFolderService";

export class FolderService implements IFolderService {
  constructor(private readonly folderRepository: FolderRepository) {}
  
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
      throw new NotFoundError("Parent folder not found");
    }

    return await this.folderRepository.findByParentId(id);
  }

  async getRootFolders(): Promise<FolderEntity[]> {
    return await this.folderRepository.findRootFolders();
  }

  async createFolder(data: CreateFolderData): Promise<FolderEntity> {
    const pathExists = await this.folderRepository.exists(data.path);
    if (pathExists) {
      throw new LogicError("A folder with this path already exists");
    }

    if (data.parentId) {
      const parentExists = await this.folderRepository.findById(data.parentId);
      if (!parentExists) {
        throw new NotFoundError("Parent folder not found");
      }
    }

    const createdFolder = await this.folderRepository.create(data);
    return createdFolder;
  }

  async updateFolder(
    id: string,
    data: UpdateFolderData
  ): Promise<FolderEntity> {


    const existingFolder = await this.folderRepository.findById(id);
    if (!existingFolder) {
      throw new NotFoundError("Folder not found");
    }

    if (data.path && data.path !== existingFolder.path) {
      const pathExists = await this.folderRepository.exists(data.path);
      if (pathExists) {
        throw new LogicError("A folder with this path already exists");
      }
    }

    if (data.parentId !== undefined && data.parentId !== null) {
      const parentExists = await this.folderRepository.findById(data.parentId);
      if (!parentExists) {
        throw new NotFoundError("Parent folder not found");
      }

      if (data.parentId === id) {
        throw new LogicError("Folder cannot be its own parent");
      }
    }

    const updatedFolder = await this.folderRepository.update(id, data);
    if (!updatedFolder) {
      throw new NotFoundError("Failed to update folder");
    }

    return updatedFolder;
  }

  async deleteFolder(id: string): Promise<FolderEntity> {
    const children = await this.folderRepository.findByParentId(id);
    for (const child of children) {
        await this.deleteFolder(child.id);
    }

    const deletedFolder = await this.folderRepository.delete(id);
    if (!deletedFolder) {
      throw new NotFoundError('Folder not found');
    }
    return deletedFolder;
  }

  private buildHierarchy(folders: FolderEntity[]): FolderWithChildren[] {
    const folderMap = new Map<string, FolderWithChildren>();
    const rootFolder: FolderWithChildren[] = [];

    folders.forEach((folder) => {
      folderMap.set(folder.id, { ...folder, children: [] });
    });

    folders.forEach((folder) => {
      const folderWithChildren = folderMap.get(folder.id)!;

      if (folder.parentId) {
        const parent = folderMap.get(folder.parentId);

        if (parent) {
          parent.children.push(folderWithChildren);
        }
      } else {
        rootFolder.push(folderWithChildren);
      }
    });
    return rootFolder;
  }
}
