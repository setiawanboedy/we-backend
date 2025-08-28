import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { FileController } from '../../../presentation/controllers/FileController'
import type { IFileService } from '../../../application/interfaces/IFileService'
import type { FileEntity, CreateFileData, UpdateFileData, SearchFileParams } from '../../../domain/entities/File'
import { ValidationError, NotFoundError, LogicError } from '../../../domain/errors/customErrors'

class MockFileService implements IFileService {
  public getAllFilesCallCount = 0
  public getFileByIdCallCount = 0
  public getFilesByFolderIdCallCount = 0
  public searchFilesCallCount = 0
  public createFileCallCount = 0
  public updateFileCallCount = 0
  public deleteFileCallCount = 0

  public mockFiles: FileEntity[] = []
  public mockFile: FileEntity | null = null
  public mockError: Error | null = null

  async getAllFiles(): Promise<FileEntity[]> {
    this.getAllFilesCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFiles
  }

  async getFileById(id: string): Promise<FileEntity | null> {
    this.getFileByIdCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFile
  }

  async getFilesByFolderId(folderId: string): Promise<FileEntity[]> {
    this.getFilesByFolderIdCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFiles
  }

  async searchFiles(query: SearchFileParams): Promise<FileEntity[]> {
    this.searchFilesCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFiles
  }

  async createFile(data: CreateFileData): Promise<FileEntity> {
    this.createFileCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFile!
  }

  async updateFile(id: string, data: UpdateFileData): Promise<FileEntity> {
    this.updateFileCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFile!
  }

  async deleteFile(id: string): Promise<FileEntity> {
    this.deleteFileCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFile!
  }
}

describe('FileController', () => {
  let fileController: FileController
  let mockFileService: MockFileService

  beforeEach(() => {
    mockFileService = new MockFileService()
    fileController = new FileController(mockFileService)
  })

  afterEach(() => {
    // Reset all mocks
    mockFileService.getAllFilesCallCount = 0
    mockFileService.getFileByIdCallCount = 0
    mockFileService.getFilesByFolderIdCallCount = 0
    mockFileService.searchFilesCallCount = 0
    mockFileService.createFileCallCount = 0
    mockFileService.updateFileCallCount = 0
    mockFileService.deleteFileCallCount = 0
    mockFileService.mockFiles = []
    mockFileService.mockFile = null
    mockFileService.mockError = null
  })


  describe('getFileById', () => {
    it('should return success response with file', async () => {
      const mockFile: FileEntity = {
        id: '1',
        name: 'test-file.txt',
        path: '/test-file.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockFileService.mockFile = mockFile

      const result = await fileController.getFileById({ id: '1' })

      expect(result).toEqual({
        success: true,
        data: mockFile,
        message: 'File retrieved successfully'
      })
      expect(mockFileService.getFileByIdCallCount).toBe(1)
    })

    it('should return not found when file does not exist', async () => {
      mockFileService.mockFile = null

      const result = await fileController.getFileById({ id: 'non-existent' })

      expect(result).toEqual({
        success: false,
        error: 'File not found'
      })
      expect(mockFileService.getFileByIdCallCount).toBe(1)
    })
  })

  describe('searchFiles', () => {
    it('should return success response with search results', async () => {
      const mockFiles: FileEntity[] = [
        {
          id: '1',
          name: 'search-result.txt',
          path: '/folder/search-result.txt',
          size: 1024,
          mimeType: 'text/plain',
          folderId: 'folder-1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockFileService.mockFiles = mockFiles

      const searchQuery = {
        name: 'search',
        mimeType: 'text/plain'
      }

      const result = await fileController.searchFiles(searchQuery)

      expect(result).toEqual({
        success: true,
        data: mockFiles,
        message: 'Files search completed successfully'
      })
      expect(mockFileService.searchFilesCallCount).toBe(1)
    })
  })

  describe('createFile', () => {
    it('should return success response with created file', async () => {
      const mockFile: FileEntity = {
        id: '1',
        name: 'new-file.txt',
        path: '/new-file.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockFileService.mockFile = mockFile

      const fileData = {
        name: 'new-file.txt',
        path: '/new-file.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-1'
      }

      const result = await fileController.createFile(fileData)

      expect(result).toEqual({
        success: true,
        data: mockFile,
        message: 'File created successfully'
      })
      expect(mockFileService.createFileCallCount).toBe(1)
    })

    it('should return error response when service throws error', async () => {
      mockFileService.mockError = new LogicError('Path already exists')

      const fileData = {
        name: 'test-file.txt',
        path: '/test-file.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-1'
      }

      const result = await fileController.createFile(fileData)

      expect(result).toEqual({
        success: false,
        error: 'Logic Error',
        details: 'Path already exists'
      })
      expect(mockFileService.createFileCallCount).toBe(1)
    })
  })

  describe('updateFile', () => {
    it('should return success response with updated file', async () => {
      const mockFile: FileEntity = {
        id: '1',
        name: 'updated-file.txt',
        path: '/updated-file.txt',
        size: 2048,
        mimeType: 'text/plain',
        folderId: 'folder-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockFileService.mockFile = mockFile

      const updateData = {
        name: 'updated-file.txt',
        size: 2048
      }

      const result = await fileController.updateFile({ id: '1' }, updateData)

      expect(result).toEqual({
        success: true,
        data: mockFile,
        message: 'File updated successfully'
      })
      expect(mockFileService.updateFileCallCount).toBe(1)
    })
  })

  describe('deleteFile', () => {
    it('should return success response with deleted file', async () => {
      const mockFile: FileEntity = {
        id: '1',
        name: 'deleted-file.txt',
        path: '/deleted-file.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockFileService.mockFile = mockFile

      const result = await fileController.deleteFile({ id: '1' })

      expect(result).toEqual({
        success: true,
        data: mockFile,
        message: 'File deleted successfully'
      })
      expect(mockFileService.deleteFileCallCount).toBe(1)
    })
  })
})
