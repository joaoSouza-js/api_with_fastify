import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../libs/prisma";

export async function PostRoutes(app: FastifyInstance) {
    app.addHook("preHandler", async (request) => {
        await request.jwtVerify();
    });
 
    app.get("/posts", async (request, reply) => {
        const requestParams = z.object({
            categoryId: z.string().uuid().optional(),
        });

        const { categoryId } = requestParams.parse(request.params);

        if(categoryId){
            const posts = await prisma.post.findMany({
                where: {
                    categoryId: categoryId,
                    scheduled: {
                        lte: new Date()
                    }
                },
                
                include: {
                    author: {
                        select: {
                            name: true
                        }
                    },
                    category: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
                
            })
            const postsFormatted = posts.map((post) => {
                const owner = post.authorId === request.user.sub;
                return {
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    scheduled: post.scheduled,
                    published: post.published,
                    category: post.category?.name,
                    categoryId: post?.category?.id,
                    author: post.author?.name,
                    owner: owner
                
                    
                }
            })

            return reply.status(200).send(postsFormatted)
        }

        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true
                    }
                },
                category: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });

        const postsFormatted = posts.map((post) => {
            const owner = post.authorId === request.user.sub;
            return {
                id: post.id,
                title: post.title,
                content: post.content,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                scheduled: post.scheduled,
                published: post.published,
                category: post.category?.name,
                categoryId: post?.category?.id,
                author: post.author?.name,
                owner: owner
                
            }

        })

        return reply.status(200).send(postsFormatted);

    });

    app.post("/posts", async (request, reply) => {
        const requestBody = z.object({
            title: z.string(),
            content: z.string(),
            categoryId: z.string().uuid(),
            schedule: z.string().default(String(new Date()))
        
        })

        const { title, content, categoryId,schedule } = requestBody.parse(request.body);

        const userId = request.user.sub;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if(!user){
            return reply.status(401).send({message: "user does not exist"})
        }
        

        const categoryExists = await prisma.category.findUnique({
            where: {
                id: categoryId
            }
        })

        if(!categoryExists){
            return reply.status(400).send({message: "category does not exist"})
        }

        const postCreated = await prisma.post.create({
            data: {
                title: title,
                content: content,
                categoryId: categoryId,
                scheduled: new Date(schedule),
                authorId: request.user.sub
            }
        })


        const PostFormatted = {
                id: postCreated.id,
                title: postCreated.title,
                content: postCreated.content,
                createdAt: postCreated.createdAt,
                updatedAt: postCreated.updatedAt,
                scheduled: postCreated.scheduled,
                published: postCreated.published,
                category: categoryExists.name,
                categoryId: categoryExists.id,
                author: request.user.name,
                owner: true            
        }

        reply.status(201).send(PostFormatted)
    })

    app.delete("/posts/:id", async (request, reply) => {
    
        const RequestBodyParams = z.object({
            id: z.string().uuid()
        })

        const { id } = RequestBodyParams.parse(request.params);

        const post = await prisma.post.findUnique({
            where: {
                id: id
            }
        })

        if(!post){
            return reply.status(404).send({message: "post does not exist or has been deleted"})
        }

        if(post.authorId !== request.user.sub){
            return reply.status(403).send({message: "you are not the author of this post"})
        }

        await prisma.post.delete({
            where: {
                id: id
            }
        })
    })
}