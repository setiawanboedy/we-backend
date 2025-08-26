import type { FolderEntity } from "../../domain/entities/Folder";
import type { FolderRepository } from "../../domain/repositories/FolderRepository";
import { prisma } from "../database/prisma";

export class PrismaFolderRepository implements FolderRepository {
    async findAll(): Promise<FolderEntity[]> {
        const folders = await prisma.folder.findMany({
            orderBy: [
                {parentId: 'asc'},
                {name: 'asc'}
            ]
        });
        return folders;
    }
    async findById(id: string): Promise<FolderEntity | null> {
        const folder = await prisma.folder.findUnique({
            where: {id}
        });
        return folder
    }
    async findByParentId(parentId: string | null): Promise<FolderEntity[]> {
        const folder = await prisma.folder.findMany({
            where: {parentId},
            orderBy: {name: 'asc'}
        });
        return folder
    }
    async findRootFolders(): Promise<FolderEntity[]> {
        const folders = await prisma.folder.findMany({
            where: {parentId: null}
        });
        return folders
    }
    async exists(path: string): Promise<boolean> {
        const folder = await prisma.folder.findUnique({
            where: { path }
        });
        return folder ? true : false;
    }

}