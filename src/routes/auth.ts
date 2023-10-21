
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../libs/prisma";



export async function AuthRoutes(app: FastifyInstance) {
    app.post("/auth/login", async (request: FastifyRequest, reply: FastifyReply) => {
        const loginSchema = z.object({
            email: z.string().email(),
            password: z.string().min(8),
        });


        const { email, password } = loginSchema.parse(request.body); 
        const user =  await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if(!user) {
            return reply.status(401).send({message: "email is not registered"})
        }

        if(user.password !== password) {
            return reply.status(401).send({message: "password or email is incorrect"})
        }

        const token = app.jwt.sign({
            name: user.name,
            email: user.email,
        },{
            sub: user.id,
            expiresIn: "15 days"
        
        })

        return reply.status(201).send({token: token})
    });
}