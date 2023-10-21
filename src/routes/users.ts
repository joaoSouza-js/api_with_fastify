import { FastifyInstance } from "fastify";
import { prisma } from "../libs/prisma";

export async function UsersRoutes(app:FastifyInstance){
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify()
    })

    app.get("/users", async (request, reply) => {
        const users = await prisma.user.findMany()

        return reply.status(200).send(users)
    })
}