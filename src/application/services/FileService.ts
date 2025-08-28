import type {
  CreateFileData,
  FileEntity,
  UpdateFileData,
} from "../../domain/entities/File";
import { LogicError, NotFoundError } from "../../domain/errors/customErrors";
import type { FileRepository } from "../../domain/repositories/FileRepository";
import type { FolderRepository } from "../../domain/repositories/FolderRepository";
import type { ILogger } from "../../infrastructure/logging/ILogger";
import type { IFileService } from "../interfaces/IFileService";

export class FileService implements IFileService {
  constructor(
    private readonly fileRepository: FileRepository,
    private readonly folderRepository: FolderRepository,
    private readonly logger: ILogger
  ) {}

  async getAllFiles(): Promise<FileEntity[]> {
    return await this.fileRepository.findAll();
  }

  async getFileById(id: string): Promise<FileEntity | null> {
    return await this.fileRepository.findById(id);
  }

  async getFilesByFolderId(folderId: string): Promise<FileEntity[]> {
    const folder = await this.folderRepository.findById(folderId);
    if (!folder) {
      this.logger.error("Folder not found", { folderId });
      throw new NotFoundError("Folder not found");
    }

    return await this.fileRepository.findByFolderId(folderId);
  }

  async createFile(data: CreateFileData): Promise<FileEntity> {
    const pathExists = await this.fileRepository.exists(data.path);
    if (pathExists) {
      this.logger.warn("File creation failed - path already exists", {
        path: data.path,
      });
      throw new LogicError("A file with this path already exists");
    }

    const folderExists = await this.folderRepository.findById(data.folderId);
    if (!folderExists) {
      this.logger.warn("File creation failed - folder not found", {
        folderId: data.folderId,
      });
      throw new NotFoundError("Parent folder not found");
    }

    const createdFile = await this.fileRepository.create(data);
    this.logger.info("File created successfully", {
      fileId: createdFile.id,
      path: createdFile.path,
    });
    return createdFile;
  }

  async updateFile(
    id: string,
    data: UpdateFileData
  ): Promise<FileEntity> {
    const existingFile = await this.fileRepository.findById(id);
    if (!existingFile) {
      this.logger.warn("File update failed - file not found", { id });
      throw new NotFoundError("File not found");
    }

    if (data.path && data.path !== existingFile.path) {
      const pathExists = await this.fileRepository.exists(data.path);
      if (pathExists) {
        this.logger.warn("File update failed - path already exists", {
          path: data.path,
        });
        throw new LogicError("A file with this path already exists");
      }
    }

    if (data.folderId && data.folderId !== existingFile.folderId) {
      const folderExists = await this.folderRepository.findById(data.folderId);
      if (!folderExists) {
        this.logger.warn("File update failed - folder not found", {
          folderId: data.folderId,
        });
        throw new NotFoundError("Parent folder not found");
      }
    }

    const updatedFile = await this.fileRepository.update(id, data);
    if (!updatedFile) {
      this.logger.error("File update failed - update returned null", { id });
      throw new NotFoundError("File not found");
    }

    this.logger.info("File updated successfully", {
      fileId: updatedFile.id,
      path: updatedFile.path,
    });
    return updatedFile;
  }

  async deleteFile(id: string): Promise<FileEntity> {
    const existingFile = await this.fileRepository.findById(id);
    if (!existingFile) {
      this.logger.warn("File deletion failed - file not found", { id });
      throw new NotFoundError("File not found");
    }

    const deletedFile = await this.fileRepository.delete(id);
    if (!deletedFile) {
      this.logger.error("File deletion failed - delete returned null", { id });
      throw new NotFoundError("File not found");
    }

    this.logger.info("File deleted successfully", {
      fileId: deletedFile.id,
      path: deletedFile.path,
    });
    return deletedFile;
  }
}
