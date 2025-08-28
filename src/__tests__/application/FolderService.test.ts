import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { FolderService } from '../../application/services/FolderService'
import type { FolderRepository } from '../../domain/repositories/FolderRepository'
import type { ILogger } from '../../infrastructure/logging/ILogger'
import type { FolderEntity, CreateFolderData, UpdateFolderData } from '../../domain/entities/Folder'
import { LogicError } from '../../domain/errors/customErrors'

class MockFolderRepository implements FolderRepository {
  public folders: FolderEntity[] = []

  async findAll(): Promise<FolderEntity[]> {
    return this.folders
  }

  async findById(id: string): Promise<FolderEntity | null> {
    return this.folders.find(f => f.id === id) || null
  }

  async findByParentId(parentId: string | null): Promise<FolderEntity[]> {
    return this.folders.filter(f => f.parentId === parentId)
  }

  async findRootFolders(): Promise<FolderEntity[]> {
    return this.folders.filter(f => f.parentId === null)
  }

  async create(data: CreateFolderData): Promise<FolderEntity> {
    const folder: FolderEntity = {
      id: Math.random().toString(),
      ...data,
      parentId: data.parentId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.folders.push(folder)
    return folder
  }

  async update(id: string, data: UpdateFolderData): Promise<FolderEntity | null> {
    const index = this.folders.findIndex(f => f.id === id)
    if (index === -1) return null

    const existing = this.folders[index]
    const updated = {
      ...existing,
      ...data,
      updatedAt: new Date()
    } as FolderEntity

    this.folders[index] = updated
    return updated
  }

  async delete(id: string): Promise<FolderEntity | null> {
    const index = this.folders.findIndex(f => f.id === id)
    if (index === -1) return null

    const folder = this.folders[index]
    this.folders.splice(index, 1)
    return folder || null
  }

  async exists(path: string): Promise<boolean> {
    return this.folders.some(f => f.path === path)
  }
}

class MockLogger implements ILogger {
  info(message: string, context?: any): void {}
  error(message: string, context?: any): void {}
  warn(message: string, context?: any): void {}
  debug(message: string, context?: any): void {}
  verbose(message: string, context?: any): void {}
}

let mockFolderRepository: FolderRepository
let mockLogger: ILogger
let folderService: FolderService

describe('FolderService', () => {
  beforeEach(() => {
    mockFolderRepository = new MockFolderRepository()
    mockLogger = new MockLogger()
    folderService = new FolderService(mockFolderRepository, mockLogger)
  })

  afterEach(() => {
    ;(mockFolderRepository as MockFolderRepository).folders = []
  })

  describe('getAllFolders', () => {
    it('should return empty array when no folders exist', async () => {
      const result = await folderService.getAllFolders()
      expect(result).toHaveLength(0)
    })

    it('should return folder hierarchy', async () => {
      const rootFolder = await folderService.createFolder({
        name: 'Root',
        path: '/root'
      })

      await folderService.createFolder({
        name: 'Child',
        path: '/root/child',
        parentId: rootFolder.id
      })

      const result = await folderService.getAllFolders()

      expect(result).toHaveLength(1)
      expect(result[0]?.children).toHaveLength(1)
    })
  })

  describe('getFolderById', () => {
    it('should return folder when found', async () => {
      const createdFolder = await folderService.createFolder({
        name: 'Test Folder',
        path: '/test'
      })

      const result = await folderService.getFolderById(createdFolder.id)

      expect(result).toEqual(createdFolder)
    })

    it('should return null when folder not found', async () => {
      const result = await folderService.getFolderById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('createFolder', () => {
    it('should create folder successfully', async () => {
      const createData: CreateFolderData = {
        name: 'New Folder',
        path: '/new-folder'
      }

      const result = await folderService.createFolder(createData)

      expect(result.name).toBe(createData.name)
      expect(result.path).toBe(createData.path)
      expect(result.id).toBeDefined()
    })

    it('should throw LogicError when path already exists', async () => {
      const createData: CreateFolderData = {
        name: 'New Folder',
        path: '/existing-path'
      }

      await folderService.createFolder(createData)

      expect(async () => {
        await folderService.createFolder(createData)
      }).toThrow(LogicError)
    })
  })
})
