import Elysia, { t } from "elysia";
import type { FolderController } from "../controllers/FolderController";

export function createFolderRoutes(folderController: FolderController) {
    return new Elysia({ prefix: '/folders' })
    .get('/', () => folderController.getAllFolders(), {
        detail: {
            tags: ['Folders'],
            summary: 'Get all folders with hierarchy',
            description: 'Retrieves all folders organized in a hierarchical structure'
        }
    })
    .get('/root', () => folderController.getRootFolders(), {
      detail: {
        tags: ['Folders'],
        summary: 'Get root folders',
        description: 'Retrieves only the root folders (folders without parents)'
      }
    })
    .get('/:id', ({ params }) => folderController.getFolderById(params), {
        params: t.Object({
            id: t.String()
        }),
         detail: {
        tags: ['Folders'],
        summary: 'Get folder by ID',
        description: 'Retrieves a specific folder by its ID'
      }
    })
    .get('/:id/children', ({ params }) => folderController.getFolderChildren(params), {
      params: t.Object({
        id: t.String()
      }),
      detail: {
        tags: ['Folders'],
        summary: 'Get folder children',
        description: 'Retrieves direct children of the specified folder'
      }
    })
}