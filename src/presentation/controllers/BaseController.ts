import { connectDatabase } from "../../infrastructure/database/prisma";
import { ResponseFormatter } from "../utils/ResponseFormatter";

export class BaseController {
  base() {
    return {
      message: "Windows Explorer API v1.0.0",
      status: "Running",
      architecture: "Clean Architecture with Prisma",
      timestamp: new Date().toISOString(),
      endpoints: {
        api: "/api/v1",
        docs: "/swagger",
        folders: "/api/v1/folders",
      },
    };
  }

  async healthCheck(): Promise<any> {
    try {
      await connectDatabase();
      const status = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "connected",
      };
      return ResponseFormatter.success(status, 'Health status');
    } catch (error) {
      return ResponseFormatter.error(error, "Database disconnected");
    }
  }
}
