import { describe, it, expect } from 'bun:test'
import { FolderValidator } from '../../../presentation/validators/FolderValidator'
import { ValidationError } from '../../../domain/errors/customErrors'

describe('FolderValidator', () => {
  describe('validateCreateFolder', () => {
    it('should validate and return valid CreateFolderRequest with name and path', () => {
      const input = { name: 'Test Folder', path: '/test' }

      const result = FolderValidator.validateCreateFolder(input)

      expect(result).toEqual({
        name: 'Test Folder',
        path: '/test',
        parentId: undefined
      })
    })

    it('should validate and return valid CreateFolderRequest with name, path, and parentId', () => {
      const input = { name: 'Test Folder', path: '/test', parentId: 'parent-123' }

      const result = FolderValidator.validateCreateFolder(input)

      expect(result).toEqual({
        name: 'Test Folder',
        path: '/test',
        parentId: 'parent-123'
      })
    })

    it('should trim name and path', () => {
      const input = { name: '  Test Folder  ', path: '  /test  ' }

      const result = FolderValidator.validateCreateFolder(input)

      expect(result).toEqual({
        name: 'Test Folder',
        path: '/test',
        parentId: undefined
      })
    })

    it('should throw ValidationError when name is missing', () => {
      const input = { path: '/test' }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('Name is required and must be a string')
    })

    it('should throw ValidationError when name is empty string', () => {
      const input = { name: '', path: '/test' }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('Name is required and must be a string')
    })

    it('should throw ValidationError when name is not a string', () => {
      const input = { name: 123, path: '/test' }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('Name is required and must be a string')
    })

    it('should throw ValidationError when path is missing', () => {
      const input = { name: 'Test Folder' }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('Path is required and must be a string')
    })

    it('should throw ValidationError when path is empty string', () => {
      const input = { name: 'Test Folder', path: '' }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('Path is required and must be a string')
    })

    it('should throw ValidationError when path is not a string', () => {
      const input = { name: 'Test Folder', path: 123 }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('Path is required and must be a string')
    })

    it('should throw ValidationError when parentId is not a string', () => {
      const input = { name: 'Test Folder', path: '/test', parentId: 123 }

      expect(() => FolderValidator.validateCreateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateCreateFolder(input)).toThrow('ParentId must be a string')
    })

    it('should allow null parentId', () => {
      const input = { name: 'Test Folder', path: '/test', parentId: null as any }

      const result = FolderValidator.validateCreateFolder(input)

      expect(result).toEqual({
        name: 'Test Folder',
        path: '/test',
        parentId: null as any
      })
    })
  })

  describe('validateUpdateFolder', () => {
    it('should validate and return valid UpdateFolderRequest with name only', () => {
      const input = { name: 'Updated Folder' }

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({
        name: 'Updated Folder'
      })
    })

    it('should validate and return valid UpdateFolderRequest with path only', () => {
      const input = { path: '/updated' }

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({
        path: '/updated'
      })
    })

    it('should validate and return valid UpdateFolderRequest with parentId only', () => {
      const input = { parentId: 'parent-123' }

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({
        parentId: 'parent-123'
      })
    })

    it('should validate and return valid UpdateFolderRequest with multiple fields', () => {
      const input = { name: 'Updated Folder', path: '/updated', parentId: 'parent-123' }

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({
        name: 'Updated Folder',
        path: '/updated',
        parentId: 'parent-123'
      })
    })

    it('should trim name and path', () => {
      const input = { name: '  Updated Folder  ', path: '  /updated  ' }

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({
        name: 'Updated Folder',
        path: '/updated'
      })
    })

    it('should return empty object when no fields provided', () => {
      const input = {}

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({})
    })

    it('should throw ValidationError when name is not a string', () => {
      const input = { name: 123 }

      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow('Name must be a string')
    })

    it('should throw ValidationError when path is not a string', () => {
      const input = { path: 123 }

      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow('Path must be a string')
    })

    it('should throw ValidationError when parentId is not a string', () => {
      const input = { parentId: 123 }

      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow('ParentId must be a string')
    })

    it('should throw ValidationError when parentId is null', () => {
      const input = { parentId: null as any }

      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateUpdateFolder(input)).toThrow('ParentId must be a string')
    })

    it('should allow undefined values to clear fields', () => {
      const input = { name: undefined, path: undefined, parentId: undefined }

      const result = FolderValidator.validateUpdateFolder(input)

      expect(result).toEqual({})
    })
  })

  describe('validateId', () => {
    it('should validate and return trimmed string ID', () => {
      const input = '  test-id-123  '

      const result = FolderValidator.validateId(input)

      expect(result).toBe('test-id-123')
    })

    it('should throw ValidationError when id is empty string', () => {
      const input = ''

      expect(() => FolderValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateId(input)).toThrow('ID is required and must be a string')
    })

    it('should return empty string when id is whitespace only', () => {
      const input = '   '

      const result = FolderValidator.validateId(input)

      expect(result).toBe('')
    })

    it('should throw ValidationError when id is not a string', () => {
      const input = 123 as any

      expect(() => FolderValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateId(input)).toThrow('ID is required and must be a string')
    })

    it('should throw ValidationError when id is null', () => {
      const input = null as any

      expect(() => FolderValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateId(input)).toThrow('ID is required and must be a string')
    })

    it('should throw ValidationError when id is undefined', () => {
      const input = undefined as any

      expect(() => FolderValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FolderValidator.validateId(input)).toThrow('ID is required and must be a string')
    })
  })
})
