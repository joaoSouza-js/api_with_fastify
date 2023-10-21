import fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';
import cors from "@fastify/cors";
import { AuthRoutes } from './routes/auth';
import { PostRoutes } from './routes/posts';
import { CategoryRoutes } from './routes/categories';
import { UsersRoutes } from './routes/users';

const app = fastify({ logger: true });

app.register(fastifyJwt, {
	secret: String('secret')
});

app.register(cors, {
    origin: "*"
})

app.register(AuthRoutes)
app.register(CategoryRoutes)
app.register(PostRoutes)
app.register(UsersRoutes)

app.listen({port:3000}, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`app listening on ${address}`);
});
