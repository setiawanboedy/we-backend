import { SearchFileParams } from "../../domain/entities/File";
import type {
  CreateFolderData,
  FolderEntity,
  FolderWithChildren,
  UpdateFolderData,
} from "../../domain/entities/Folder";
import { LogicError, NotFoundError } from "../../domain/errors/customErrors";
import type { FolderRepository } from "../../domain/repositories/FolderRepository";
import type { ILogger } from "../../infrastructure/logging/ILogger";
import type { IFolderService } from "../interfaces/IFolderService";

export class FolderService implements IFolderService {
  constructor(
    private readonly folderRepository: FolderRepository,
    private readonly logger: ILogger
  ) {}

  async getAllFolders(): Promise<FolderWithChildren[]> {
    const allFolders = await this.folderRepository.findAll();
    return this.buildHierarchy(allFolders);
  }

  async searchFolders(query: SearchFileParams): Promise<FolderEntity[]> {
    return await this.folderRepository.searchFolders(query);
  }

  async getFolderById(id: string): Promise<FolderEntity | null> {
    return await this.folderRepository.findById(id);
  }

  async getFolderChildren(id: string): Promise<FolderEntity[]> {
    const parentFolder = await this.folderRepository.findById(id);
    if (!parentFolder) {
      this.logger.error("Parent folder not found", { folderId: id });
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
      this.logger.warn("Folder creation failed - path already exists", {
        path: data.path,
      });
      throw new LogicError("A folder with this path already exists");
    }

    if (data.parentId) {
      const parentExists = await this.folderRepository.findById(data.parentId);
      if (!parentExists) {
        this.logger.warn("Folder creation failed - parent not found", {
          parentId: data.parentId,
        });
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
      this.logger.warn("Folder update failed - folder not found", { id: id });
      throw new NotFoundError("Folder not found");
    }

    if (data.path && data.path !== existingFolder.path) {
      const pathExists = await this.folderRepository.exists(data.path);
      if (pathExists) {
        this.logger.warn("Folder update failed - path already exists", {
          path: data.path,
        });
        throw new LogicError("A folder with this path already exists");
      }
    }

    if (data.parentId !== undefined && data.parentId !== null) {
      const parentExists = await this.folderRepository.findById(data.parentId);
      if (!parentExists) {
        this.logger.warn("Folder update failed - Parent folder not found", {
          parentId: data.parentId,
        });
        throw new NotFoundError("Parent folder not found");
      }

      if (data.parentId === id) {
        this.logger.warn(
          "Folder update failed - Folder cannot be its own parent",
          { id: id }
        );
        throw new LogicError("Folder cannot be its own parent");
      }
    }

    const updatedFolder = await this.folderRepository.update(id, data);
    if (!updatedFolder) {
      this.logger.warn("Folder update failed - Failed to update folder", {
        id: id,
      });
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
      this.logger.warn("Folder update failed - Folder not found", {
        id: id,
      });
      throw new NotFoundError("Folder not found");
    }
    return deletedFolder;
  }

  private buildHierarchy(folders: FolderEntity[]): FolderWithChildren[] {
    const folderMap = new Map<string, FolderWithChildren>();
    const rootFolder: FolderWithChildren[] = [];

    for (const folder of folders) {
      if (!folderMap.has(folder.id)) {
        folderMap.set(folder.id, { ...folder, children: [] });
      }

      const folderWithChildren = folderMap.get(folder.id)!;

      if (folder.parentId) {
        if (folderMap.has(folder.parentId)) {
          const parent = folderMap.get(folder.parentId)!;
          parent.children.push(folderWithChildren);
        } else {
          rootFolder.push(folderWithChildren);
        }
      } else {
        rootFolder.push(folderWithChildren);
      }
    }
    return rootFolder;
  }
}
