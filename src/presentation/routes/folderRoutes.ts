import Elysia, { t } from "elysia";
import type { FolderController } from "../controllers/FolderController";
import { SearchFileParams } from "../../domain/entities/File";

export function createFolderRoutes(folderController: FolderController) {
  return new Elysia({ prefix: "/folders" })

    .get("/", () => folderController.getAllFolders(), {
      detail: {
        tags: ["Folders"],
        summary: "Get all folders with hierarchy",
        description:
          "Retrieves all folders organized in a hierarchical structure",
      },
    })

    .get(
      "/search",
      ({ query }) => folderController.searchFolders(query as SearchFileParams),
      {
        query: t.Object({
          name: t.Optional(t.String()),
          path: t.Optional(t.String()),
          mimeType: t.Optional(t.String()),
          folderId: t.Optional(t.String()),
          limit: t.Optional(t.Number()),
          offset: t.Optional(t.Number()),
        }),
        detail: {
          tags: ["Folders"],
          summary: "Search folders",
          description:
            "Search folders by name, path, mimeType, folderId with optional pagination",
        },
      }
    )

    .get("/root", () => folderController.getRootFolders(), {
      detail: {
        tags: ["Folders"],
        summary: "Get root folders",
        description:
          "Retrieves only the root folders (folders without parents)",
      },
    })

    .get("/:id", ({ params }) => folderController.getFolderById(params), {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Get folder by ID",
        description: "Retrieves a specific folder by its ID",
      },
    })

    .get(
      "/:id/children",
      ({ params }) => folderController.getFolderChildren(params),
      {
        params: t.Object({
          id: t.String(),
        }),
        detail: {
          tags: ["Folders"],
          summary: "Get folder children",
          description: "Retrieves direct children of the specified folder",
        },
      }
    )

    .post("/", ({ body }) => folderController.createFolder(body), {
      body: t.Object({
        name: t.String(),
        path: t.String(),
        parentId: t.Optional(t.String()),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Create a new folder",
        description:
          "Creates a new folder with the specified name, path, and optional parent",
      },
    })

    .put(
      "/:id",
      ({ params, body }) => folderController.updateFolder(params, body),
      {
        params: t.Object({
          id: t.String(),
        }),
        body: t.Object({
          name: t.Optional(t.String()),
          path: t.Optional(t.String()),
          parentId: t.Optional(t.String()),
        }),
        detail: {
          tags: ["Folders"],
          summary: "Update a folder",
          description: "Updates the specified folder with new information",
        },
      }
    )

    .delete("/:id", ({ params }) => folderController.deleteFolder(params), {
      params: t.Object({
        id: t.String(),
      }),
      detail: {
        tags: ["Folders"],
        summary: "Delete a folder (recursive)",
        description:
          "Deletes the specified folder and all its children (recursive delete)",
      },
    });
}
