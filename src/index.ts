import { Elysia } from 'elysia';
import { createApiRoutes } from './presentation/routes/apiRoutes';
import { Injection } from './di/injection';
import cors from '@elysiajs/cors';
import swagger from '@elysiajs/swagger';
import { createBaseRoutes } from './presentation/routes/baseRoutes';

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
    }));

const injection = Injection.getInstance();    
app.use(createBaseRoutes(injection.baseController));
app.use(createApiRoutes(injection.folderController));    

app.listen(3000);

console.log('🌐 Backend running at http://localhost:3000');
console.log('📚 API Documentation at http://localhost:3000/swagger');
console.log('🔍 Health check at http://localhost:3000/health');