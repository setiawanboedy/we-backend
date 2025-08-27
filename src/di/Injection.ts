import type { IFolderService } from "../application/interfaces/IFolderService";
import { FolderService } from "../application/services/FolderService";
import type { FolderRepository } from "../domain/repositories/FolderRepository";
import { PrismaFolderRepository } from "../infrastructure/repositories/PrismaFolderRepository";
import { BaseController } from "../presentation/controllers/BaseController";
import { FolderController } from "../presentation/controllers/FolderController";

export class Injection {
    private static instance: Injection;

    private _folderRepository: FolderRepository;
    private _folderService: IFolderService;
    private _folderController: FolderController;
    private _baseController: BaseController;

    private constructor() {
        this._folderRepository = new PrismaFolderRepository();
        this._folderService = new FolderService(this._folderRepository);
        this._folderController = new FolderController(this.folderService);
        this._baseController = new BaseController();
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
    
    public get folderController(): FolderController {
        return this._folderController;
    }

    public get baseController(): BaseController {
        return this._baseController;
    }
}