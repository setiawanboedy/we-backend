import Elysia from "elysia";
import type { FolderController } from "../controllers/FolderController";
import { createV1Routes } from "./v1Routes";

export function createApiRoutes(folderController: FolderController) {
    return new Elysia({prefix: '/api'})
        .use(createV1Routes(folderController));
}