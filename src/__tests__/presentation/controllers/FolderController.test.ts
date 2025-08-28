import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { FolderController } from '../../../presentation/controllers/FolderController'
import type { IFolderService } from '../../../application/interfaces/IFolderService'
import type { FolderEntity, CreateFolderData, UpdateFolderData, FolderWithChildren } from '../../../domain/entities/Folder'
import { ValidationError } from '../../../domain/errors/customErrors'

class MockFolderService implements IFolderService {
  public getAllFoldersCallCount = 0
  public getFolderByIdCallCount = 0
  public getFolderChildrenCallCount = 0
  public getRootFoldersCallCount = 0
  public createFolderCallCount = 0
  public updateFolderCallCount = 0
  public deleteFolderCallCount = 0

  public mockFoldersWithChildren: FolderWithChildren[] = []
  public mockFolders: FolderEntity[] = []
  public mockFolder: FolderEntity | null = null
  public mockError: Error | null = null

  async getAllFolders(): Promise<FolderWithChildren[]> {
    this.getAllFoldersCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFoldersWithChildren
  }

  async getFolderById(id: string) {
    this.getFolderByIdCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFolder
  }

  async getFolderChildren(id: string) {
    this.getFolderChildrenCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFolders
  }

  async getRootFolders() {
    this.getRootFoldersCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFolders
  }

  async createFolder(data: CreateFolderData) {
    this.createFolderCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFolder!
  }

  async updateFolder(id: string, data: UpdateFolderData) {
    this.updateFolderCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFolder!
  }

  async deleteFolder(id: string) {
    this.deleteFolderCallCount++
    if (this.mockError) throw this.mockError
    return this.mockFolder!
  }

  reset() {
    this.getAllFoldersCallCount = 0
    this.getFolderByIdCallCount = 0
    this.getFolderChildrenCallCount = 0
    this.getRootFoldersCallCount = 0
    this.createFolderCallCount = 0
    this.updateFolderCallCount = 0
    this.deleteFolderCallCount = 0
    this.mockFoldersWithChildren = []
    this.mockFolders = []
    this.mockFolder = null
    this.mockError = null
  }
}


describe('FolderController', () => {
  let controller: FolderController
  let mockService: MockFolderService

  beforeEach(() => {
    mockService = new MockFolderService()
    controller = new FolderController(mockService)
  })

  afterEach(() => {
    mockService.reset()
  })

  describe('getAllFolders', () => {
    it('should return success response with folders', async () => {
      const mockFolders: FolderWithChildren[] = [
        {
          id: '1',
          name: 'Test Folder',
          path: '/test',
          parentId: null,
          children: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockService.mockFoldersWithChildren = mockFolders

      const result = await controller.getAllFolders()

      expect(result).toEqual({
        success: true,
        data: mockFolders,
        message: 'Folder retrieved successfully'
      })
      expect(mockService.getAllFoldersCallCount).toBe(1)
    })

    it('should return error response when service throws error', async () => {
      mockService.mockError = new Error('Service error')

      const result = await controller.getAllFolders()

      expect(result).toEqual({
        success: false,
        error: 'Failed to retieve folders',
        details: 'Service error'
      })
      expect(mockService.getAllFoldersCallCount).toBe(1)
    })
  })

  describe('getFolderById', () => {
    it('should return success response with folder', async () => {
      const mockFolder: FolderEntity = {
        id: '1',
        name: 'Test Folder',
        path: '/test',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockService.mockFolder = mockFolder

      const result = await controller.getFolderById({ id: '1' })

      expect(result).toEqual({
        success: true,
        data: mockFolder,
        message: 'Folder retrieved successfully'
      })
      expect(mockService.getFolderByIdCallCount).toBe(1)
    })

    it('should return not found when folder does not exist', async () => {
      mockService.mockFolder = null

      const result = await controller.getFolderById({ id: '1' })

      expect(result).toEqual({
        success: false,
        error: 'Folder not found'
      })
      expect(mockService.getFolderByIdCallCount).toBe(1)
    })

    it('should return error response when validation fails', async () => {
      mockService.mockError = new ValidationError('Invalid ID')

      const result = await controller.getFolderById({ id: 'invalid' })

      expect(result).toEqual({
        success: false,
        error: 'Failed retrieve folder',
        details: 'Invalid ID'
      })
    })

    it('should return error response when service throws error', async () => {
      mockService.mockError = new Error('Service error')

      const result = await controller.getFolderById({ id: '1' })

      expect(result).toEqual({
        success: false,
        error: 'Failed retrieve folder',
        details: 'Service error'
      })
      expect(mockService.getFolderByIdCallCount).toBe(1)
    })
  })

  describe('getFolderChildren', () => {
    it('should return success response with children folders', async () => {
      const mockFolders: FolderEntity[] = [
        {
          id: '2',
          name: 'Child Folder',
          path: '/test/child',
          parentId: '1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockService.mockFolders = mockFolders

      const result = await controller.getFolderChildren({ id: '1' })

      expect(result).toEqual({
        success: true,
        data: mockFolders,
        message: 'Folders retrieved successfully'
      })
      expect(mockService.getFolderChildrenCallCount).toBe(1)
    })

    it('should return error response when service throws error', async () => {
      mockService.mockError = new Error('Service error')

      const result = await controller.getFolderChildren({ id: '1' })

      expect(result).toEqual({
        success: false,
        error: 'Failed retrieve folders',
        details: 'Service error'
      })
      expect(mockService.getFolderChildrenCallCount).toBe(1)
    })
  })

  describe('getRootFolders', () => {
    it('should return success response with root folders', async () => {
      const mockFolders: FolderEntity[] = [
        {
          id: '1',
          name: 'Root Folder',
          path: '/root',
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      mockService.mockFolders = mockFolders

      const result = await controller.getRootFolders()

      expect(result).toEqual({
        success: true,
        data: mockFolders,
        message: 'Folders retrieved successfully'
      })
      expect(mockService.getRootFoldersCallCount).toBe(1)
    })

    it('should return error response when service throws error', async () => {
      mockService.mockError = new Error('Service error')

      const result = await controller.getRootFolders()

      expect(result).toEqual({
        success: false,
        error: 'Failed retrieve folders',
        details: 'Service error'
      })
      expect(mockService.getRootFoldersCallCount).toBe(1)
    })
  })

  describe('createFolder', () => {
    it('should return success response with created folder', async () => {
      const createData = { name: 'New Folder', path: '/new' }
      const mockFolder: FolderEntity = {
        id: '1',
        name: 'New Folder',
        path: '/new',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockService.mockFolder = mockFolder

      const result = await controller.createFolder(createData)

      expect(result).toEqual({
        success: true,
        data: mockFolder,
        message: 'Folder created successfully'
      })
      expect(mockService.createFolderCallCount).toBe(1)
    })

    it('should return error response when validation fails', async () => {
      const invalidData = { name: '', path: '' }

      mockService.mockError = new ValidationError('Name is required')

      const result = await controller.createFolder(invalidData)

      expect(result).toEqual({
        success: false,
        error: 'Failed to create folder',
        details: 'Name is required and must be a string'
      })
    })

    it('should return error response when service throws error', async () => {
      const createData = { name: 'New Folder', path: '/new' }
      mockService.mockError = new Error('Service error')

      const result = await controller.createFolder(createData)

      expect(result).toEqual({
        success: false,
        error: 'Failed to create folder',
        details: 'Service error'
      })
      expect(mockService.createFolderCallCount).toBe(1)
    })
  })

  describe('updateFolder', () => {
    it('should return success response with updated folder', async () => {
      const updateData = { name: 'Updated Folder' }
      const mockFolder: FolderEntity = {
        id: '1',
        name: 'Updated Folder',
        path: '/test',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockService.mockFolder = mockFolder

      const result = await controller.updateFolder({ id: '1' }, updateData)

      expect(result).toEqual({
        success: true,
        data: mockFolder,
        message: 'Folder updated successfully'
      })
      expect(mockService.updateFolderCallCount).toBe(1)
    })

    it('should return error response when validation fails', async () => {
      const invalidData = { name: 123 }

      mockService.mockError = new ValidationError('Name must be a string')

      const result = await controller.updateFolder({ id: '1' }, invalidData)

      expect(result).toEqual({
        success: false,
        error: 'Failed to update folder',
        details: 'Name must be a string'
      })
    })

    it('should return error response when service throws error', async () => {
      const updateData = { name: 'Updated Folder' }
      mockService.mockError = new Error('Service error')

      const result = await controller.updateFolder({ id: '1' }, updateData)

      expect(result).toEqual({
        success: false,
        error: 'Failed to update folder',
        details: 'Service error'
      })
      expect(mockService.updateFolderCallCount).toBe(1)
    })
  })

  describe('deleteFolder', () => {
    it('should return success response with deleted folder', async () => {
      const mockFolder: FolderEntity = {
        id: '1',
        name: 'Deleted Folder',
        path: '/test',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      mockService.mockFolder = mockFolder

      const result = await controller.deleteFolder({ id: '1' })

      expect(result).toEqual({
        success: true,
        data: mockFolder,
        message: 'Folder deleted successfully'
      })
      expect(mockService.deleteFolderCallCount).toBe(1)
    })

    it('should return error response when validation fails', async () => {
      mockService.mockError = new ValidationError('Invalid ID')

      const result = await controller.deleteFolder({ id: 'invalid' })

      expect(result).toEqual({
        success: false,
        error: 'Failed to delete folder',
        details: 'Invalid ID'
      })
    })

    it('should return error response when service throws error', async () => {
      mockService.mockError = new Error('Service error')

      const result = await controller.deleteFolder({ id: '1' })

      expect(result).toEqual({
        success: false,
        error: 'Failed to delete folder',
        details: 'Service error'
      })
      expect(mockService.deleteFolderCallCount).toBe(1)
    })
  })
})
