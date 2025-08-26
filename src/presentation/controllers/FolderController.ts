import type { IFolderService } from "../../application/interfaces/IFolderService";
import type { FolderEntity } from "../../domain/entities/Folder";
import { ResponseFormatter, type ApiResponse } from "../utils/ResponseFormatter";

export class FolderController {
    constructor(
        private readonly folderService: IFolderService
    ){}

    async getAllFolders(): Promise<ApiResponse<FolderEntity[]>> {
        try {
            const folders = await this.folderService.getAllFolders();
            return ResponseFormatter.success(folders, 'Folder retrieved successfully');
        } catch (error) {
            return ResponseFormatter.error(error, 'Failed to retieve folders');
        }
    }

    async getFolderById(params: {id: string}): Promise<ApiResponse<FolderEntity>> {
        try {
            const id = params.id;
            const folder = await this.folderService.getFolderById(id);
            if (!folder) {
                return ResponseFormatter.handlerError('Folder not found');
            }
            return ResponseFormatter.success(folder, 'Folder retrieved successfully');
        } catch (error) {
            return ResponseFormatter.error(error, 'Failed retrieve folder');
        }
    }

    async getFolderChildren(params: {id: string}): Promise<ApiResponse<FolderEntity[]>> {
        try {
            const id = params.id;
            const folders = await this.folderService.getFolderChildren(id);
            return ResponseFormatter.success(folders, 'Folders retrieved successfully');
        } catch (error) {
            return ResponseFormatter.error(error, 'Failed retrieve folders');
        }
    }
}