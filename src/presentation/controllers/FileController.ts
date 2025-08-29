import type { IFileService } from "../../application/interfaces/IFileService";
import type { FileEntity, SearchFileParams } from "../../domain/entities/File";
import {
  ResponseFormatter,
  type ApiResponse,
} from "../utils/ResponseFormatter";
import { FileValidator } from "../validators/FileValidator";

export class FileController {
  constructor(private readonly fileService: IFileService) {}

  async getFileById(params: {
    id: string;
  }): Promise<ApiResponse<FileEntity>> {
    try {
      const validId = FileValidator.validateId(params.id);
      const file = await this.fileService.getFileById(validId);
      if (!file) {
        return ResponseFormatter.handleError("File not found");
      }
      return ResponseFormatter.success(file, "File retrieved successfully");
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to retrieve file");
    }
  }

  async getFilesByFolderId(params: {
    folderId: string;
  }): Promise<ApiResponse<FileEntity[]>> {
    try {
      const validFolderId = FileValidator.validateId(params.folderId);
      const files = await this.fileService.getFilesByFolderId(validFolderId);
      return ResponseFormatter.success(
        files,
        "Files retrieved successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to retrieve files");
    }
  }

  async searchFiles(query: SearchFileParams): Promise<ApiResponse<FileEntity[]>> {
    try {

      const files = await this.fileService.searchFiles(query);
      return ResponseFormatter.success(
        files,
        "Files search completed successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to search files");
    }
  }

  async createFile(body: any): Promise<ApiResponse<FileEntity>> {
    try {
      const validatedData = FileValidator.validateCreateFile(body);
      const newFile = await this.fileService.createFile(validatedData);
      return ResponseFormatter.success(
        newFile,
        "File created successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to create file");
    }
  }

  async updateFile(
    params: { id: string },
    body: any
  ): Promise<ApiResponse<FileEntity>> {
    
    try {
      const validId = FileValidator.validateId(params.id);
      const validatedData = FileValidator.validateUpdateFile(body);
      const updatedFile = await this.fileService.updateFile(
        validId,
        validatedData
      );
      return ResponseFormatter.success(
        updatedFile,
        "File updated successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to update file");
    }
  }

  async deleteFile(params: {
    id: string;
  }): Promise<ApiResponse<FileEntity>> {
    try {
      const validId = FileValidator.validateId(params.id);
      const deletedFile = await this.fileService.deleteFile(validId);
      return ResponseFormatter.success(
        deletedFile,
        "File deleted successfully"
      );
    } catch (error) {
      return ResponseFormatter.error(error, "Failed to delete file");
    }
  }
}
