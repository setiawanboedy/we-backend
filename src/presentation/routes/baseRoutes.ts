import Elysia from "elysia";
import type { BaseController } from "../controllers/BaseController";

export function createBaseRoutes(baseController: BaseController) {
    return new Elysia()
        .get('/', () => baseController.base(), {
            detail: {
                summary: 'Information',
                description: 'Api information for windows explorer project that you need'
            }
        })
        .get('/health', () => baseController.healthCheck(), {
            detail: {
                summary: 'Health check',
                description: 'Checks if the API is running and healthy'
            }
        })
}