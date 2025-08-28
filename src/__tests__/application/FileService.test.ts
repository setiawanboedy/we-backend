import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { FileService } from '../../application/services/FileService'
import type { FileRepository } from '../../domain/repositories/FileRepository'
import type { FolderRepository } from '../../domain/repositories/FolderRepository'
import type { ILogger } from '../../infrastructure/logging/ILogger'
import type { FileEntity, CreateFileData, UpdateFileData, SearchFileParams } from '../../domain/entities/File'
import type { FolderEntity } from '../../domain/entities/Folder'
import { LogicError, NotFoundError } from '../../domain/errors/customErrors'

class MockFileRepository implements FileRepository {
  public files: FileEntity[] = []

  async findAll(): Promise<FileEntity[]> {
    return this.files
  }

  async findById(id: string): Promise<FileEntity | null> {
    return this.files.find(f => f.id === id) || null
  }

  async findByFolderId(folderId: string): Promise<FileEntity[]> {
    return this.files.filter(f => f.folderId === folderId)
  }

  async findByPath(path: string): Promise<FileEntity | null> {
    return this.files.find(f => f.path === path) || null
  }

  async exists(path: string): Promise<boolean> {
    return this.files.some(f => f.path === path)
  }

  async searchFiles(query: SearchFileParams): Promise<FileEntity[]> {
    let result = this.files

    if (query.name) {
      result = result.filter(f => f.name.toLowerCase().includes(query.name!.toLowerCase()))
    }

    if (query.offset) {
      result = result.slice(query.offset)
    }

    if (query.limit) {
      result = result.slice(0, query.limit)
    }

    return result
  }

  async create(data: CreateFileData): Promise<FileEntity> {
    const file: FileEntity = {
      id: Math.random().toString(),
      ...data,
      size: data.size || null,
      mimeType: data.mimeType || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    this.files.push(file)
    return file
  }

  async update(id: string, data: UpdateFileData): Promise<FileEntity | null> {
    const index = this.files.findIndex(f => f.id === id)
    if (index === -1) return null

    const existing = this.files[index]
    if (!existing) return null

    const updated = {
      ...existing,
      ...data,
      size: data.size !== undefined ? data.size : existing.size,
      mimeType: data.mimeType !== undefined ? data.mimeType : existing.mimeType,
      updatedAt: new Date()
    } as FileEntity

    this.files[index] = updated
    return updated
  }

  async delete(id: string): Promise<FileEntity | null> {
    const index = this.files.findIndex(f => f.id === id)
    if (index === -1) return null

    const file = this.files[index]
    if (!file) return null

    this.files.splice(index, 1)
    return file
  }
}

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

  async exists(path: string): Promise<boolean> {
    return this.folders.some(f => f.path === path)
  }

  async create(data: any): Promise<FolderEntity> {
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

  async update(id: string, data: any): Promise<FolderEntity | null> {
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
    if (!folder) return null

    this.folders.splice(index, 1)
    return folder
  }
}

class MockLogger implements ILogger {
  info(message: string, context?: any): void {}
  error(message: string, context?: any): void {}
  warn(message: string, context?: any): void {}
  debug(message: string, context?: any): void {}
  verbose(message: string, context?: any): void {}
}

let mockFileRepository: FileRepository
let mockFolderRepository: FolderRepository
let mockLogger: ILogger
let fileService: FileService

describe('FileService', () => {
  beforeEach(() => {
    mockFileRepository = new MockFileRepository()
    mockFolderRepository = new MockFolderRepository()
    mockLogger = new MockLogger()
    fileService = new FileService(mockFileRepository, mockFolderRepository, mockLogger)
  })

  afterEach(() => {
    ;(mockFileRepository as MockFileRepository).files = []
    ;(mockFolderRepository as MockFolderRepository).folders = []
  })

  describe('getFileById', () => {
    it('should return file when found', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const createdFile = await fileService.createFile({
        name: 'test.txt',
        path: '/test-folder/test.txt',
        folderId: 'folder-1'
      })

      const result = await fileService.getFileById(createdFile.id)

      expect(result).toEqual(createdFile)
    })

    it('should return null when file not found', async () => {
      const result = await fileService.getFileById('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('getFilesByFolderId', () => {
    it('should return files in folder', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const file1 = await fileService.createFile({
        name: 'file1.txt',
        path: '/test-folder/file1.txt',
        folderId: 'folder-1'
      })

      const file2 = await fileService.createFile({
        name: 'file2.txt',
        path: '/test-folder/file2.txt',
        folderId: 'folder-1'
      })

      const result = await fileService.getFilesByFolderId('folder-1')

      expect(result).toHaveLength(2)
      expect(result).toContain(file1)
      expect(result).toContain(file2)
    })

    it('should throw NotFoundError when folder does not exist', async () => {
      expect(async () => {
        await fileService.getFilesByFolderId('nonexistent')
      }).toThrow(NotFoundError)
    })
  })

  describe('createFile', () => {
    it('should create file successfully', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const createData: CreateFileData = {
        name: 'newfile.txt',
        path: '/test-folder/newfile.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: 'folder-1'
      }

      const result = await fileService.createFile(createData)

      expect(result.name).toBe(createData.name)
      expect(result.path).toBe(createData.path)
      expect(result.size).toBe(createData.size || null)
      expect(result.mimeType).toBe(createData.mimeType || null)
      expect(result.folderId).toBe(createData.folderId)
      expect(result.id).toBeDefined()
    })

    it('should throw LogicError when path already exists', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const createData: CreateFileData = {
        name: 'duplicate.txt',
        path: '/test-folder/duplicate.txt',
        folderId: 'folder-1'
      }

      await fileService.createFile(createData)

      expect(async () => {
        await fileService.createFile(createData)
      }).toThrow(LogicError)
    })

    it('should throw NotFoundError when folder does not exist', async () => {
      const createData: CreateFileData = {
        name: 'file.txt',
        path: '/file.txt',
        folderId: 'nonexistent'
      }

      expect(async () => {
        await fileService.createFile(createData)
      }).toThrow(NotFoundError)
    })
  })

  describe('updateFile', () => {
    it('should update file successfully', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const createdFile = await fileService.createFile({
        name: 'original.txt',
        path: '/test-folder/original.txt',
        folderId: 'folder-1'
      })

      const updateData: UpdateFileData = {
        name: 'updated.txt',
        size: 2048
      }

      const result = await fileService.updateFile(createdFile.id, updateData)

      expect(result.name).toBe(updateData.name!)
      expect(result.size).toBe(updateData.size || null)
      expect(result.path).toBe(createdFile.path)
    })

    it('should throw NotFoundError when file does not exist', async () => {
      const updateData: UpdateFileData = {
        name: 'updated.txt'
      }

      expect(async () => {
        await fileService.updateFile('nonexistent', updateData)
      }).toThrow(NotFoundError)
    })

    it('should throw LogicError when updating to existing path', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      await fileService.createFile({
        name: 'file1.txt',
        path: '/test-folder/file1.txt',
        folderId: 'folder-1'
      })

      const file2 = await fileService.createFile({
        name: 'file2.txt',
        path: '/test-folder/file2.txt',
        folderId: 'folder-1'
      })

      const updateData: UpdateFileData = {
        path: '/test-folder/file1.txt'
      }

      expect(async () => {
        await fileService.updateFile(file2.id, updateData)
      }).toThrow(LogicError)
    })

    it('should throw NotFoundError when updating to non-existent folder', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const createdFile = await fileService.createFile({
        name: 'file.txt',
        path: '/test-folder/file.txt',
        folderId: 'folder-1'
      })

      const updateData: UpdateFileData = {
        folderId: 'nonexistent'
      }

      expect(async () => {
        await fileService.updateFile(createdFile.id, updateData)
      }).toThrow(NotFoundError)
    })
  })

  describe('deleteFile', () => {
    it('should delete file successfully', async () => {
      const folder: FolderEntity = {
        id: 'folder-1',
        name: 'Test Folder',
        path: '/test-folder',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      ;(mockFolderRepository as MockFolderRepository).folders.push(folder)

      const createdFile = await fileService.createFile({
        name: 'file.txt',
        path: '/test-folder/file.txt',
        folderId: 'folder-1'
      })

      const result = await fileService.deleteFile(createdFile.id)

      expect(result).toEqual(createdFile)

    })

    it('should throw NotFoundError when file does not exist', async () => {
      expect(async () => {
        await fileService.deleteFile('nonexistent')
      }).toThrow(NotFoundError)
    })
  })
})
