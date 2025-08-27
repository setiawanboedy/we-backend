import { ValidationError } from "../../domain/errors/customErrors";

export interface CreateFolderRequest {
  name: string;
  path: string;
  parentId?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  path?: string;
  parentId?: string;
}

export class FolderValidator {
  static validateCreateFolder(body: any): CreateFolderRequest {
    if (!body.name || typeof body.name !== "string") {
      throw new ValidationError("Name is required and must be a string");
    }

    if (!body.path || typeof body.path !== "string") {
      throw new ValidationError("Path is required and must be a string");
    }

    if (body.parentId && typeof body.parentId !== "string") {
      throw new ValidationError("ParentId must be a string");
    }

    return {
      name: body.name.trim(),
      path: body.path.trim(),
      parentId: body.parentId,
    };
  }

  static validateUpdateFolder(body: any): UpdateFolderRequest {
    const validated: UpdateFolderRequest = {};

    if (body.name !== undefined) {
      if (typeof body.name !== "string") {
        throw new ValidationError("Name must be a string");
      }
      validated.name = body.name.trim();
    }

    if (body.path !== undefined) {
      if (typeof body.path !== "string") {
        throw new ValidationError("Path must be a string");
      }
      validated.path = body.path.trim();
    }

    if (body.parentId !== undefined) {
      if (typeof body.parentId !== "string") {
        throw new ValidationError("ParentId must be a string");
      }
      validated.parentId = body.parentId;
    }

    return validated;
  }
  static validateId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new ValidationError("ID is required and must be a string");
    }
    return id.trim();
  }
}
