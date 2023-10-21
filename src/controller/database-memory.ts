import {randomUUID} from 'node:crypto'

export interface Post {
    author: string,
    title: string,
    text: string,
    id_category: number,
    id_user: string,
    date: string
}


//map and set structure 
export class DataBaseMemory {
    #post = new Map<string, Post>()


    

    createPost(post: Post){
        const postId  = randomUUID()
        this.#post.set(postId, post)
    }


    deletePost(id: string){
        this.#post.delete(id)
    }

    listPost(author?: string){
        const listSearch =   author || ''
        const list =  Array.from(this.#post.entries()).map(([id, video]) => ({id, ...video}))
        const listFiltered = list.filter(video => video.title.includes(listSearch))
        return listFiltered
    }

    seed(){
        Users.forEach(user => {
            this.createPost({
                author: user.name,
                title: `post do ${user.name}`,
                text: "<p>Meu primeiro artigo está demais!</p>",
                id_category: 1,
                id_user: user.id,
                date: new Date().toISOString()
            })
        })
    }

    

    

}

export const Users = [
    {  
        name: 'Pedro',
        id: randomUUID(),
        email: 'dev1@curseduca.com',
        password: 'dev1'
    },
    {
        name: 'João',
        id: randomUUID(),
        email: 'dev2@curseduca.com',
        password: 'dev2'
    },
    {
        name: 'Maria',
        id: randomUUID(),
        email: 'dev3@curseduca.com',
        password: 'dev3'
    }
]

