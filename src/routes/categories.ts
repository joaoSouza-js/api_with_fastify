import { FastifyInstance } from "fastify";
import { prisma } from "../libs/prisma";

export async function CategoryRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
    app.get("/categories", async (request, reply) => {

        const categories = await prisma.category.findMany();

        return reply.status(200).send(categories);
    })
}