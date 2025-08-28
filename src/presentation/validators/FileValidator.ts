import { ValidationError } from "../../domain/errors/customErrors";

export interface CreateFileRequest {
  name: string;
  path: string;
  size?: number;
  mimeType?: string;
  folderId: string;
}

export interface UpdateFileRequest {
  name?: string;
  path?: string;
  size?: number;
  mimeType?: string;
  folderId?: string;
}

export class FileValidator {
  static validateCreateFile(body: any): CreateFileRequest {
    if (!body.name || typeof body.name !== "string") {
      throw new ValidationError("Name is required and must be a string");
    }

    if (!body.path || typeof body.path !== "string") {
      throw new ValidationError("Path is required and must be a string");
    }

    if (!body.folderId || typeof body.folderId !== "string") {
      throw new ValidationError("FolderId is required and must be a string");
    }

    if (body.size !== undefined && (typeof body.size !== "number" || body.size < 0)) {
      throw new ValidationError("Size must be a non-negative number");
    }

    if (body.mimeType !== undefined && typeof body.mimeType !== "string") {
      throw new ValidationError("MimeType must be a string");
    }

    return {
      name: body.name.trim(),
      path: body.path.trim(),
      size: body.size,
      mimeType: body.mimeType,
      folderId: body.folderId.trim(),
    };
  }

  static validateUpdateFile(body: any): UpdateFileRequest {
    const validated: UpdateFileRequest = {};

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

    if (body.folderId !== undefined) {
      if (typeof body.folderId !== "string") {
        throw new ValidationError("FolderId must be a string");
      }
      validated.folderId = body.folderId.trim();
    }

    if (body.size !== undefined) {
      if (typeof body.size !== "number" || body.size < 0) {
        throw new ValidationError("Size must be a non-negative number");
      }
      validated.size = body.size;
    }

    if (body.mimeType !== undefined) {
      if (typeof body.mimeType !== "string") {
        throw new ValidationError("MimeType must be a string");
      }
      validated.mimeType = body.mimeType;
    }

    return validated;
  }

  static validateId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new ValidationError("ID is required and must be a string");
    }
    const trimmedId = id.trim();
    if (!trimmedId) {
      throw new ValidationError("ID cannot be empty or whitespace only");
    }
    return trimmedId;
  }
}
