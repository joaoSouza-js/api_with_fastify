import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

interface createPostProps {
    authorId:string,
    categoryIdList?: (string | undefined)[],
}

const categoryList = [
    "Estudos Avançados",
    "Educação Online",
    "Vida Saudável",
    "Aprendizado Contínuo",
    "Dicas de Carreira",
    "Desenvolvimento Pessoal",
    "Tecnologias Educacionais",
    "Bem-Estar Mental"
];
  

async function createPost({authorId,categoryIdList}:createPostProps){
    
    if(!categoryIdList){
        return
    }

    const randomIndex = Math.floor(Math.random() * categoryIdList.length) ;
    const categoryId = categoryIdList[randomIndex]

  

   const postContent = {
        title: faker.lorem.words(5),
        content: faker.lorem.paragraphs(3),
        authorId: authorId,
        categoryId: categoryId,
    }

    const prismaPost = await prisma.post.create({
        data:{
            title: postContent.title,
            content: postContent.content,
            authorId: postContent.authorId,
            categoryId: postContent.categoryId,
        },
       
    })
    return prismaPost
}

async function  createUser(){
    const user = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        password: faker.internet.password()
    };

    const prismaUser = await prisma.user.create({
        data:{
            email: user.email,
            name: user.name,
            password: user.password,
        }
    })

    return prismaUser
};

async function createCategory(category: string){
    const categoryExist = await prisma.category.findUnique({
        where: {
            name: category,
        
        }
    })

    if(categoryExist){
        return 
    }

    const prismaCategory = await prisma.category.create({
        data:{
            name: category,
        }
    })

    return prismaCategory
}

// Create a new users, posts and categories

async function seed(){
    await prisma.user.deleteMany()
    await prisma.post.deleteMany()
    await prisma.category.deleteMany()

    try {
        const userToCreate = 3
        const postToCreate = 2
        const categoryToCreate = categoryList.length

        const userPromises = Array(userToCreate).fill(undefined).map(createUser);
        const users = await Promise.all(userPromises);

        const categoryPromises = categoryList.map(createCategory);
        const  categories =  await Promise.all(categoryPromises);
        
        const categoriesId = categories.map(category => category?.id);
        
        const postPromises = users.flatMap(user => Array(postToCreate).fill(undefined).map(() => createPost({
            authorId: user?.id,
            categoryIdList: categoriesId
        },)));

        await Promise.all(postPromises);

        console.log(`created ${userToCreate} users`);
        console.log(`created ${postToCreate} posts`);
        console.log(`created ${categoryToCreate} categories`);


    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
};

// Call the function to create a new user and post
seed().then(() => console.log("Seed complete"));
