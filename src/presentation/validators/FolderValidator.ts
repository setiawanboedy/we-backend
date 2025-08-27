import { ValidationError } from "../../domain/errors/customErrors";

export class FolderValidator {
    static validateId(id: string) : string {
        if (!id || id !== 'string') {
            throw new ValidationError('ID is required and must be a string');
        }
        return id.trim();
    }
}