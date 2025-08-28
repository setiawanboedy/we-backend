import Elysia, { t } from "elysia";
import type { FileController } from "../controllers/FileController";

export function createFileRoutes(fileController: FileController) {
  return new Elysia({ prefix: '/files' })

    .get('/', () => fileController.getAllFiles(), {
      detail: {
        tags: ["Files"],
        summary: "Get all files",
        description: "Retrieves all files in the system",
      },
    })

    .get('/:id', ({ params }) => fileController.getFileById(params), {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Files"],
        summary: "Get file by ID",
        description: "Retrieves a specific file by its ID",
      },
    })

    .get('/folder/:folderId', ({ params }) => fileController.getFilesByFolderId(params), {
      params: t.Object({
        folderId: t.String(),
      }),
      detail: {
        tags: ["Files"],
        summary: "Get files by folder ID",
        description: "Retrieves all files within the specified folder",
      },
    })

    .post('/', ({ body }) => fileController.createFile(body), {
      body: t.Object({
        name: t.String(),
        path: t.String(),
        size: t.Optional(t.Number()),
        mimeType: t.Optional(t.String()),
        folderId: t.String(),
      }),
      detail: {
        tags: ["Files"],
        summary: "Create a new file",
        description: "Creates a new file with the specified information",
      },
    })

    .put('/:id', ({ params, body }) => fileController.updateFile(params, body), {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        name: t.Optional(t.String()),
        path: t.Optional(t.String()),
        size: t.Optional(t.Number()),
        mimeType: t.Optional(t.String()),
        folderId: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Files"],
        summary: "Update a file",
        description: "Updates the specified file with new information",
      },
    })

    .delete('/:id', ({ params }) => fileController.deleteFile(params), {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Files"],
        summary: "Delete a file",
        description: "Deletes the specified file",
      },
    });
}
