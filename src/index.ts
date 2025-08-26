import { Elysia } from 'elysia';
import { connectDatabase } from './infrastructure/database/prisma';
import { createApiRoutes } from './presentation/routes/apiRoutes';
import { Injection } from './di/injection';

const app = new Elysia()
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