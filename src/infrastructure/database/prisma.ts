import { PrismaClient } from "@prisma/client";
import { DatabaseError } from "../../domain/errors/customErrors";

export const prisma = new PrismaClient()

export async function connectDatabase() {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        throw new DatabaseError('Database error connection');
    }
}

export async function disconnectDatabase() {
    await prisma.$disconnect();
}