import { describe, it, expect } from 'bun:test'
import { FileValidator } from '../../../presentation/validators/FileValidator'
import { ValidationError } from '../../../domain/errors/customErrors'

describe('FileValidator', () => {
  describe('validateCreateFile', () => {
    it('should validate and return valid CreateFileRequest with required fields', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        folderId: 'folder-123'
      }

      const result = FileValidator.validateCreateFile(input)

      expect(result).toEqual({
        name: 'test.txt',
        path: '/test.txt',
        size: undefined,
        mimeType: undefined,
        folderId: 'folder-123'
      })
    })

    it('should validate and return valid CreateFileRequest with all fields', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-123'
      }

      const result = FileValidator.validateCreateFile(input)

      expect(result).toEqual({
        name: 'test.txt',
        path: '/test.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-123'
      })
    })

    it('should trim name, path, and folderId', () => {
      const input = {
        name: '  test.txt  ',
        path: '  /test.txt  ',
        folderId: '  folder-123  '
      }

      const result = FileValidator.validateCreateFile(input)

      expect(result).toEqual({
        name: 'test.txt',
        path: '/test.txt',
        size: undefined,
        mimeType: undefined,
        folderId: 'folder-123'
      })
    })

    it('should throw ValidationError when name is missing', () => {
      const input = {
        path: '/test.txt',
        folderId: 'folder-123'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Name is required and must be a string')
    })

    it('should throw ValidationError when name is empty string', () => {
      const input = {
        name: '',
        path: '/test.txt',
        folderId: 'folder-123'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Name is required and must be a string')
    })

    it('should throw ValidationError when name is not a string', () => {
      const input = {
        name: 123,
        path: '/test.txt',
        folderId: 'folder-123'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Name is required and must be a string')
    })

    it('should throw ValidationError when path is missing', () => {
      const input = {
        name: 'test.txt',
        folderId: 'folder-123'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Path is required and must be a string')
    })

    it('should throw ValidationError when path is empty string', () => {
      const input = {
        name: 'test.txt',
        path: '',
        folderId: 'folder-123'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Path is required and must be a string')
    })

    it('should throw ValidationError when path is not a string', () => {
      const input = {
        name: 'test.txt',
        path: 123,
        folderId: 'folder-123'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Path is required and must be a string')
    })

    it('should throw ValidationError when folderId is missing', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('FolderId is required and must be a string')
    })

    it('should throw ValidationError when folderId is empty string', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        folderId: ''
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('FolderId is required and must be a string')
    })

    it('should throw ValidationError when folderId is not a string', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        folderId: 123
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('FolderId is required and must be a string')
    })

    it('should throw ValidationError when size is not a number', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        folderId: 'folder-123',
        size: '1024'
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Size must be a non-negative number')
    })

    it('should throw ValidationError when size is negative', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        folderId: 'folder-123',
        size: -1
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('Size must be a non-negative number')
    })

    it('should throw ValidationError when mimeType is not a string', () => {
      const input = {
        name: 'test.txt',
        path: '/test.txt',
        folderId: 'folder-123',
        mimeType: 123
      }

      expect(() => FileValidator.validateCreateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateCreateFile(input)).toThrow('MimeType must be a string')
    })
  })

  describe('validateUpdateFile', () => {
    it('should validate and return valid UpdateFileRequest with name only', () => {
      const input = { name: 'updated.txt' }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        name: 'updated.txt'
      })
    })

    it('should validate and return valid UpdateFileRequest with path only', () => {
      const input = { path: '/updated.txt' }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        path: '/updated.txt'
      })
    })

    it('should validate and return valid UpdateFileRequest with folderId only', () => {
      const input = { folderId: 'folder-456' }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        folderId: 'folder-456'
      })
    })

    it('should validate and return valid UpdateFileRequest with size only', () => {
      const input = { size: 2048 }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        size: 2048
      })
    })

    it('should validate and return valid UpdateFileRequest with mimeType only', () => {
      const input = { mimeType: 'application/pdf' }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        mimeType: 'application/pdf'
      })
    })

    it('should validate and return valid UpdateFileRequest with multiple fields', () => {
      const input = {
        name: 'updated.txt',
        path: '/updated.txt',
        size: 2048,
        mimeType: 'application/pdf',
        folderId: 'folder-456'
      }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        name: 'updated.txt',
        path: '/updated.txt',
        size: 2048,
        mimeType: 'application/pdf',
        folderId: 'folder-456'
      })
    })

    it('should trim name, path, and folderId', () => {
      const input = {
        name: '  updated.txt  ',
        path: '  /updated.txt  ',
        folderId: '  folder-456  '
      }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({
        name: 'updated.txt',
        path: '/updated.txt',
        folderId: 'folder-456'
      })
    })

    it('should return empty object when no fields provided', () => {
      const input = {}

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({})
    })

    it('should throw ValidationError when name is not a string', () => {
      const input = { name: 123 }

      expect(() => FileValidator.validateUpdateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateUpdateFile(input)).toThrow('Name must be a string')
    })

    it('should throw ValidationError when path is not a string', () => {
      const input = { path: 123 }

      expect(() => FileValidator.validateUpdateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateUpdateFile(input)).toThrow('Path must be a string')
    })

    it('should throw ValidationError when folderId is not a string', () => {
      const input = { folderId: 123 }

      expect(() => FileValidator.validateUpdateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateUpdateFile(input)).toThrow('FolderId must be a string')
    })

    it('should throw ValidationError when size is not a number', () => {
      const input = { size: '2048' }

      expect(() => FileValidator.validateUpdateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateUpdateFile(input)).toThrow('Size must be a non-negative number')
    })

    it('should throw ValidationError when size is negative', () => {
      const input = { size: -1 }

      expect(() => FileValidator.validateUpdateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateUpdateFile(input)).toThrow('Size must be a non-negative number')
    })

    it('should throw ValidationError when mimeType is not a string', () => {
      const input = { mimeType: 123 }

      expect(() => FileValidator.validateUpdateFile(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateUpdateFile(input)).toThrow('MimeType must be a string')
    })

    it('should allow undefined values to clear fields', () => {
      const input = {
        name: undefined,
        path: undefined,
        size: undefined,
        mimeType: undefined,
        folderId: undefined
      }

      const result = FileValidator.validateUpdateFile(input)

      expect(result).toEqual({})
    })
  })

  describe('validateId', () => {
    it('should validate and return trimmed string ID', () => {
      const input = '  test-id-123  '

      const result = FileValidator.validateId(input)

      expect(result).toBe('test-id-123')
    })

    it('should throw ValidationError when id is empty string', () => {
      const input = ''

      expect(() => FileValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateId(input)).toThrow('ID is required and must be a string')
    })

    it('should throw ValidationError when id is whitespace only', () => {
      const input = '   '

      expect(() => FileValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateId(input)).toThrow('ID cannot be empty or whitespace only')
    })

    it('should throw ValidationError when id is not a string', () => {
      const input = 123 as any

      expect(() => FileValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateId(input)).toThrow('ID is required and must be a string')
    })

    it('should throw ValidationError when id is null', () => {
      const input = null as any

      expect(() => FileValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateId(input)).toThrow('ID is required and must be a string')
    })

    it('should throw ValidationError when id is undefined', () => {
      const input = undefined as any

      expect(() => FileValidator.validateId(input)).toThrow(ValidationError)
      expect(() => FileValidator.validateId(input)).toThrow('ID is required and must be a string')
    })
  })
})
