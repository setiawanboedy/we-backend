import type { IFolderService } from "../../application/interfaces/IFolderService";
import { SearchFileParams } from "../../domain/entities/File";
import type { FolderEntity } from "../../domain/entities/Folder";
import {
  ResponseFormatter,
  type ApiResponse,
} from "../utils/ResponseFormatter";
import { FolderValidator } from "../validators/FolderValidator";

export class FolderController {
  constructor(private readonly folderService: IFolderService) {}

  async getAllFolders(): Promise<ApiResponse<FolderEntity[]>> {
    try {
      const folders = await this.folderService.getAllFolders();
      return ResponseFormatter.success(
        folders,
        "Folder retrieved successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to retieve folders");
    }
  }

  async searchFolders(
    query: SearchFileParams
  ): Promise<ApiResponse<FolderEntity[]>> {
    try {
      const folders = await this.folderService.searchFolders(query);
      return ResponseFormatter.success(
        folders,
        "Folders search completed successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to search folders");
    }
  }

  async getFolderById(params: {
    id: string;
  }): Promise<ApiResponse<FolderEntity>> {
    try {
      const validId = FolderValidator.validateId(params.id);
      const folder = await this.folderService.getFolderById(validId);
      if (!folder) {
        return ResponseFormatter.handleError("Folder not found");
      }
      return ResponseFormatter.success(folder, "Folder retrieved successfully");
    } catch (error) {
      return ResponseFormatter.error(error, "Failed retrieve folder");
    }
  }

  async getFolderChildren(params: {
    id: string;
  }): Promise<ApiResponse<FolderEntity[]>> {
    try {
      const validId = FolderValidator.validateId(params.id);
      const folders = await this.folderService.getFolderChildren(validId);
      return ResponseFormatter.success(
        folders,
        "Folders retrieved successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed retrieve folders");
    }
  }

  async getRootFolders(): Promise<ApiResponse<FolderEntity[]>> {
    try {
      const folders = await this.folderService.getRootFolders();
      return ResponseFormatter.success(
        folders,
        "Folders retrieved successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed retrieve folders");
    }
  }

  async createFolder(body: any): Promise<ApiResponse<FolderEntity>> {
    try {
      const validatedData = FolderValidator.validateCreateFolder(body);
      const newFolder = await this.folderService.createFolder(validatedData);
      return ResponseFormatter.success(
        newFolder,
        "Folder created successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to create folder");
    }
  }

  async updateFolder(
    params: { id: string },
    body: any
  ): Promise<ApiResponse<FolderEntity>> {
    try {
      const validId = FolderValidator.validateId(params.id);
      const validatedData = FolderValidator.validateUpdateFolder(body);
      const updatedFolder = await this.folderService.updateFolder(
        validId,
        validatedData
      );
      return ResponseFormatter.success(
        updatedFolder,
        "Folder updated successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to update folder");
    }
  }

  async deleteFolder(params: {
    id: string;
  }): Promise<ApiResponse<FolderEntity>> {
    try {
      const validId = FolderValidator.validateId(params.id);
      const deletedFolder = await this.folderService.deleteFolder(validId);
      return ResponseFormatter.success(
        deletedFolder,
        "Folder deleted successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to delete folder");
    }
  }
}
