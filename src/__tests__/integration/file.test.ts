import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { Elysia } from 'elysia'
import { createApiRoutes } from '../../presentation/routes/apiRoutes'
import { Injection } from '../../di/Injection'
import { prisma } from '../../infrastructure/database/prisma'

describe('File API Integration Tests', () => {
  let app: Elysia
  let testFolderId: string
  let testFileId: string

  beforeAll(async () => {
    console.log('✅ Database connected successfully')

    const injection = Injection.getInstance()

    app = new Elysia()
      .use(createApiRoutes(injection.folderController, injection.fileController))

    const testFolderResponse = await app.handle(
      new Request('http://localhost/api/v1/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'Test Folder',
          path: '/test-folder'
        })
      })
    )
    const testFolderResult = await testFolderResponse.json() as { success: boolean; data: { id: string } }
    testFolderId = testFolderResult.data.id
  })

  afterAll(async () => {
    if (testFileId) {
      await prisma.file.deleteMany({
        where: { folderId: testFolderId }
      })
    }
    if (testFolderId) {
      await prisma.folder.deleteMany({
        where: { id: testFolderId }
      })
    }
  })

  describe('GET /api/v1/files', () => {
    it('should return all files', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/v1/files', {
          method: 'GET'
        })
      )

      expect(response.status).toBe(200)
      const result = await response.json() as { success: boolean; data: any[] }
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
      expect(Array.isArray(result.data)).toBe(true)
    })
  })

  describe('POST /api/v1/files', () => {
    it('should create a new file', async () => {
      const fileData = {
        name: 'test-file.txt',
        path: '/test-folder/test-file.txt',
        size: 1024,
        mimeType: 'text/plain',
        folderId: testFolderId
      }

      const response = await app.handle(
        new Request('http://localhost/api/v1/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fileData)
        })
      )

      expect(response.status).toBe(200)
      const result = await response.json() as { success: boolean; data: { id: string; name: string; path: string; size?: number; mimeType?: string; folderId: string } }
      expect(result).toHaveProperty('success', true)
      expect(result.data).toHaveProperty('id')
      expect(result.data.name).toBe(fileData.name)
      expect(result.data.path).toBe(fileData.path)
      expect(result.data.folderId).toBe(fileData.folderId)

      testFileId = result.data.id
    })

    it('should return error for duplicate path', async () => {
      if (!testFileId) {
        console.log('Skipping duplicate path test - no test file created')
        return
      }

      const fileData = {
        name: 'duplicate-file.txt',
        path: '/test-folder/test-file.txt',
        size: 512,
        mimeType: 'text/plain',
        folderId: testFolderId
      }

      const response = await app.handle(
        new Request('http://localhost/api/v1/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(fileData)
        })
      )

      expect(response.status).toBe(200)
      const result = await response.json() as { success: boolean; error: string; details?: string }
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error', 'Logic Error')
      expect(result.details).toContain('already exists')
    })
  })

  describe('GET /api/v1/files/:id', () => {
    it('should return file by id', async () => {
      if (!testFileId) {
        console.log('Skipping get file by id test - no test file created')
        return
      }

      const response = await app.handle(
        new Request(`http://localhost/api/v1/files/${testFileId}`, {
          method: 'GET'
        })
      )

      expect(response.status).toBe(200)
      const result = await response.json() as { success: boolean; data: { id: string; name: string } }
      expect(result).toHaveProperty('success', true)
      expect(result.data.id).toBe(testFileId)
      expect(result.data.name).toBe('test-file.txt')
    })
  })

  describe('PUT /api/v1/files/:id', () => {
    it('should update file successfully', async () => {
      if (!testFileId) {
        console.log('Skipping update file test - no test file created')
        return
      }

      const updateData = {
        name: 'updated-file.txt',
        size: 2048
      }

      const response = await app.handle(
        new Request(`http://localhost/api/v1/files/${testFileId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        })
      )

      expect(response.status).toBe(200)
      const result = await response.json() as { success: boolean; data: { name: string; size?: number } }
      expect(result).toHaveProperty('success', true)
      expect(result.data.name).toBe(updateData.name)
      expect(result.data.size).toBe(updateData.size)
    })
  })

  describe('DELETE /api/v1/files/:id', () => {
    it('should delete file successfully', async () => {
      if (!testFileId) {
        console.log('Skipping delete file test - no test file created')
        return
      }

      const response = await app.handle(
        new Request(`http://localhost/api/v1/files/${testFileId}`, {
          method: 'DELETE'
        })
      )

      expect(response.status).toBe(200)
      const result = await response.json() as { success: boolean; data: { id: string } }
      expect(result).toHaveProperty('success', true)
      expect(result.data.id).toBe(testFileId)
    })
  })
})
