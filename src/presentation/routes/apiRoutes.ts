import Elysia from "elysia";
import type { FolderController } from "../controllers/FolderController";
import type { FileController } from "../controllers/FileController";
import { createV1Routes } from "./v1Routes";

export function createApiRoutes(folderController: FolderController, fileController: FileController) {
    return new Elysia({prefix: '/api'})
        .use(createV1Routes(folderController, fileController));
}