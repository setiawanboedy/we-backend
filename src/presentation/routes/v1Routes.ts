import Elysia from "elysia";
import type { FolderController } from "../controllers/FolderController";
import type { FileController } from "../controllers/FileController";
import { createFolderRoutes } from "./folderRoutes";
import { createFileRoutes } from "./fileRoutes";

export function createV1Routes(folderController: FolderController, fileController: FileController) {
    return new Elysia({prefix: '/v1'})
        .use(createFolderRoutes(folderController))
        .use(createFileRoutes(fileController));
}