import { Elysia } from 'elysia';
import { connectDatabase } from './infrastructure/database/prisma';
import { createApiRoutes } from './presentation/routes/apiRoutes';
import { Injection } from './di/injection';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';

const app = new Elysia()
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
    .get('/', () => ({
        message: 'Windows Explorer API v1.0.0',
        status: 'Running',
        architecture: 'Clean Architecture with Prisma',
        timestamp: new Date().toISOString(),
        endpoints: {
        api: '/api/v1',
        docs: '/swagger',
        folders: '/api/v1/folders'
        }
    }))
    .get('/health', () => ({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected'
    }))
    .onStart(async () => {
        try {
            await connectDatabase();
        } catch (error) {
            process.exit(1);
        }
    });

const injection = Injection.getInstance();    
app.use(createApiRoutes(injection.folderController));    

app.listen(3000);

console.log('🌐 Backend running at http://localhost:3000');
console.log('📚 API Documentation at http://localhost:3000/swagger');
console.log('🔍 Health check at http://localhost:3000/health');
console.log('🏗️  Architecture: Clean Architecture with Repository Pattern');