import Elysia from "elysia";
import type { FolderController } from "../controllers/FolderController";
import { createV1Routes } from "./v1routes";

export function createApiRoutes(folderController: FolderController) {
    return new Elysia({prefix: 'v1'})
        .use(createV1Routes(folderController));
}