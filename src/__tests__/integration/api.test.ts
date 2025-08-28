import { describe, it, expect, beforeAll, afterAll } from 'bun:test'
import { Elysia } from 'elysia'
import { createApiRoutes } from '../../presentation/routes/apiRoutes'
import { createBaseRoutes } from '../../presentation/routes/baseRoutes'
import { Injection } from '../../di/Injection'
import cors from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'

let app: Elysia

describe('Folder API Integration Tests', () => {
  beforeAll(async () => {
    app = new Elysia()
      .use(cors({
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      }))
      .use(swagger({
        documentation: {
          info: {
            title: 'Windows Explorer API',
            version: '1.0.0',
            description: 'REST API for Windows Explorer-like application with Clean Architecture',
          },
          tags: [
            { name: 'Folders', description: 'Folder management endpoints' }
          ]
        }
      }))

    const injection = Injection.getInstance()
    app.use(createBaseRoutes(injection.baseController))
    app.use(createApiRoutes(injection.folderController))
  })

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await app.handle(
        new Request('http://localhost/health', { method: 'GET' })
      )

      expect(response.status).toBe(200)
      const data = await response.json() as { success: boolean; data: { status: string } }
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('status')
      expect(data.data.status).toBe('healthy')
    })
  })

  describe('GET /api/v1/folders', () => {
    it('should return all folders', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/v1/folders', { method: 'GET' })
      )

      expect(response.status).toBe(200)
      const data = await response.json() as { success: boolean; data: any[] }
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe('GET /api/v1/folders/root', () => {
    it('should return root folders', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/v1/folders/root', { method: 'GET' })
      )

      expect(response.status).toBe(200)
      const data = await response.json() as { success: boolean; data: any[] }
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
    })
  })

  describe('POST /api/v1/folders', () => {
    it('should create a new folder', async () => {
      const folderData = {
        name: 'Test Folder',
        path: '/test-folder-' + Date.now()
      }

      const response = await app.handle(
        new Request('http://localhost/api/v1/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderData)
        })
      )

      expect(response.status).toBe(200) 
      const data = await response.json() as { success: boolean; data: { id: string; name: string; path: string } }
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('id')
      expect(data.data.name).toBe(folderData.name)
      expect(data.data.path).toBe(folderData.path)
    })

    it('should return error for duplicate path', async () => {
      const folderData = {
        name: 'Duplicate Folder',
        path: '/duplicate-path'
      }

      await app.handle(
        new Request('http://localhost/api/v1/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderData)
        })
      )

      const response = await app.handle(
        new Request('http://localhost/api/v1/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderData)
        })
      )

      expect(response.status).toBe(200)
      const error = await response.json() as { success: boolean; error: string }
      expect(error).toHaveProperty('success')
      expect(error.success).toBe(false)
      expect(error).toHaveProperty('error')
    })
  })

  describe('GET /api/v1/folders/:id', () => {
    it('should return folder by id', async () => {
      const folderData = {
        name: 'Folder to Get',
        path: '/folder-to-get-' + Date.now()
      }

      const createResponse = await app.handle(
        new Request('http://localhost/api/v1/folders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(folderData)
        })
      )

      expect(createResponse.status).toBe(200)
      const createResult = await createResponse.json() as { success: boolean; data: { id: string; name: string } }
      expect(createResult.success).toBe(true)
      const createdFolder = createResult.data

      await new Promise(resolve => setTimeout(resolve, 100))

      const response = await app.handle(
        new Request(`http://localhost/api/v1/folders/${createdFolder.id}`, { method: 'GET' })
      )

      expect(response.status).toBe(200)
      const data = await response.json() as { success: boolean; data: { id: string; name: string } }
      expect(data).toHaveProperty('success')
      expect(data.success).toBe(true)
      expect(data.data.id).toBe(createdFolder.id)
      expect(data.data.name).toBe(folderData.name)
    })

    it('should return 404 for non-existent folder', async () => {
      const response = await app.handle(
        new Request('http://localhost/api/v1/folders/nonexistent-id', { method: 'GET' })
      )

      expect(response.status).toBe(200)
      const error = await response.json() as { success: boolean; error: string }
      expect(error).toHaveProperty('success')
      expect(error.success).toBe(false)
      expect(error).toHaveProperty('error')
    })
  })
})
