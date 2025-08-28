import { describe, it, expect } from 'bun:test'
import type { FolderEntity, CreateFolderData, UpdateFolderData } from '../../domain/entities/Folder'

describe('Folder Entity', () => {
  const mockFolder: FolderEntity = {
    id: '1',
    name: 'Test Folder',
    path: '/test-folder',
    parentId: null,
    size: 1024,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }

  const mockCreateData: CreateFolderData = {
    name: 'New Folder',
    path: '/new-folder',
    parentId: 'parent-1'
  }

  const mockUpdateData: UpdateFolderData = {
    name: 'Updated Folder',
    path: '/updated-folder'
  }

  describe('FolderEntity interface', () => {
    it('should have all required properties', () => {
      expect(mockFolder).toHaveProperty('id')
      expect(mockFolder).toHaveProperty('name')
      expect(mockFolder).toHaveProperty('path')
      expect(mockFolder).toHaveProperty('parentId')
      expect(mockFolder).toHaveProperty('createdAt')
      expect(mockFolder).toHaveProperty('updatedAt')
    })

    it('should allow optional size property', () => {
      const folderWithoutSize: FolderEntity = {
        ...mockFolder,
        size: undefined
      }
      expect(folderWithoutSize.size).toBeUndefined()
    })

    it('should allow null parentId for root folders', () => {
      expect(mockFolder.parentId).toBeNull()
    })
  })

  describe('CreateFolderData interface', () => {
    it('should have required name and path', () => {
      expect(mockCreateData).toHaveProperty('name')
      expect(mockCreateData).toHaveProperty('path')
    })

    it('should allow optional parentId', () => {
      expect(mockCreateData).toHaveProperty('parentId')
      expect(mockCreateData.parentId).toBe('parent-1')
    })
  })

  describe('UpdateFolderData interface', () => {
    it('should allow partial updates', () => {
      expect(mockUpdateData.name).toBe('Updated Folder')
      expect(mockUpdateData.path).toBe('/updated-folder')
      expect(mockUpdateData.parentId).toBeUndefined()
    })
  })
})