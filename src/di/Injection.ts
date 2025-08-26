import type { FolderRepository } from "../domain/repositories/FolderRepository";
import { PrismaFolderRepository } from "../infrastructure/repositories/PrismaFolderRepository";

export class Injection {
    private static instance: Injection;

    private _folderRepository: FolderRepository;

    private constructor() {
        this._folderRepository = new PrismaFolderRepository();
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
}