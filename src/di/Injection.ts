import type { IFolderService } from "../application/interfaces/IFolderService";
import { FolderService } from "../application/services/FolderService";
import type { FolderRepository } from "../domain/repositories/FolderRepository";
import { PrismaFolderRepository } from "../infrastructure/repositories/PrismaFolderRepository";

export class Injection {
    private static instance: Injection;

    private _folderRepository: FolderRepository;
    private _folderService: IFolderService;

    private constructor() {
        this._folderRepository = new PrismaFolderRepository();
        this._folderService = new FolderService(this._folderRepository);
    }

    public static getInstance(): Injection{
        if (!Injection.instance) {
            Injection.instance = new Injection();
        }
        return Injection.instance;
    }

    public get folderRepository(): FolderRepository {
        return this._folderRepository;
    }

    public get folderService(): IFolderService {
        return this._folderService;
    }
    
}