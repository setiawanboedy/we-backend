import Elysia from "elysia";
import type { FolderController } from "../controllers/FolderController";
import { createFolderRoutes } from "./folderRoutes";

export function createV1Routes(folderController: FolderController) {
    return new Elysia({prefix: '/v1'})
        .use(createFolderRoutes(folderController));
}