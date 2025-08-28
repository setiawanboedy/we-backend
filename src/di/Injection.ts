import type { IFolderService } from "../application/interfaces/IFolderService";
import type { IFileService } from "../application/interfaces/IFileService";
import { FolderService } from "../application/services/FolderService";
import { FileService } from "../application/services/FileService";
import type { FolderRepository } from "../domain/repositories/FolderRepository";
import type { FileRepository } from "../domain/repositories/FileRepository";
import type { ILogger } from "../infrastructure/logging/ILogger";
import { logger } from "../infrastructure/logging/LoggerFactory";
import { RequestLogger } from "../infrastructure/logging/RequestLogger";
import { PrismaFolderRepository } from "../infrastructure/repositories/PrismaFolderRepository";
import { PrismaFileRepository } from "../infrastructure/repositories/PrismaFileRepository";
import { BaseController } from "../presentation/controllers/BaseController";
import { FolderController } from "../presentation/controllers/FolderController";
import { FileController } from "../presentation/controllers/FileController";

export class Injection {
  private static instance: Injection;

  private _folderRepository: FolderRepository;
  private _fileRepository: FileRepository;
  private _folderService: IFolderService;
  private _fileService: IFileService;
  private _folderController: FolderController;
  private _fileController: FileController;
  private _baseController: BaseController;
  private _logger: ILogger;
  private _requestLogger: RequestLogger;

  private constructor() {
    this._logger = logger;
    this._requestLogger = new RequestLogger(this._logger);
    this._folderRepository = new PrismaFolderRepository();
    this._fileRepository = new PrismaFileRepository();
    this._folderService = new FolderService(this._folderRepository, this._logger);
    this._fileService = new FileService(this._fileRepository, this._folderRepository, this._logger);
    this._folderController = new FolderController(this.folderService);
    this._fileController = new FileController(this._fileService);
    this._baseController = new BaseController();
  }

  public static getInstance(): Injection {
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

  public get fileRepository(): FileRepository {
    return this._fileRepository;
  }

  public get fileService(): IFileService {
    return this._fileService;
  }

  public get fileController(): FileController {
    return this._fileController;
  }

  public get baseController(): BaseController {
    return this._baseController;
  }

  public get logger(): ILogger {
    return this._logger;
  }

  public get requestLogger(): RequestLogger {
    return this._requestLogger;
  }
}
