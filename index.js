const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjecType,
    GraphQLString,
    GraphQLObjectType,
    GraphQLList,
    GraphQLInt, 
    GraphQLNonNull
}=require('graphql');
const app = express();

const authors = [
    {id: 1, name: "Malcom Gladwall"},
    {id: 2, name: "Justin Seitz"},
    {id: 3, name: "Michael Lewis"},
    {id: 4, name: "Robert Greene"},
    {id: 5, name: "Marcus Aurelius"},
    {id: 6, name: "Richard Dawkins"},
    {id: 7, name: "Walter Isaacson"},
    {id: 8, name: "Bill O'reilly"},
    {id: 9, name: "Walter Longo"}

]

const books = [
	{ id: 1, name: 'Outliers', authorId: 1 },
	{ id: 2, name: 'Blink', authorId: 1 },
	{ id: 3, name: 'Talking to Strangers', authorId: 1 },
	{ id: 4, name: 'Black Hat Python', authorId: 2 },
	{ id: 5, name: 'The Selfish Gene', authorId: 6 },
	{ id: 6, name: 'Leonardo da Vinci', authorId: 7 },
	{ id: 7, name: 'Moneyball', authorId: 3 },
	{ id: 8, name: 'The Big Short', authorId: 3 },
    { id: 9, name: "The 48 Laws of Power", authorId:4 },
    { id: 10, name: "Meditations", authorId:5 },
    { id: 11, name: "Killing Patton", authorId:8 },
    { id: 12, name: "The Blind Watchmaker", authorId:6 },
    { id: 13, name: "Killing Crazy Horse", authorId:8 },
    { id: 14, name: "Killing Kennedy", authorId:8 },
    { id: 15, name: "Flash Boys", authorId:3 },
    { id: 16, name: "Benjamin Franklin: An American Life", authorId:7 },
    { id: 17, name: "The Longevity Diet", authorId:9 },

]

const BookType= new GraphQLObjectType({
    name: 'Book',
    description: "this is a book",
    //fields needs to be a function because AuthorType is defined after book type
    fields:()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        authorId: {type: GraphQLNonNull(GraphQLInt)},
        author: {
            type: AuthorType,
            resolve:(book)=>{
                return authors.find(author=>{
                    return(
                    book.authorId == author.id
                    )
                })
            }
        }
    })
    })
const AuthorType= new GraphQLObjectType({
    name: 'Author',
    description: "this is an author",
    fields:()=>({
        id: {type: GraphQLNonNull(GraphQLInt)},
        name: {type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve:(author)=>{
                return books.filter(book=>{
                    return( 
                        book.authorId== author.id
                    )
                })
            }
        }
    })
    })
    
const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
      book: {
        type: BookType,
        description: "returns a single book",
        args:{
            id: {type: GraphQLInt}
        },
        resolve: (parent, args) => books.find(book=>book.id===args.id)
      },
      books: {
        type: new GraphQLList(BookType),
        description: 'List of All Books',
        resolve: () => books
      },
      authors: {
        type: new GraphQLList(AuthorType),
        description: 'List of All Authors',
        resolve: () => authors
      },
      author:{
          type: AuthorType,
          description: 'will return a single author',
          args:{
            id: {type: GraphQLInt}
          },
          resolve: (parent, args)=>authors.find(author=>author.id===args.id)
      }

    })
  })
const RootMutationType=new GraphQLObjectType({
    name: "Mutation",
    description: "Root Mutations",
    fields: ()=>({
        addBook: {
            type: BookType,
            description: "add a book",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args)=>{
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book);
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: "add an author",
            args: {
                name: {type: GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args)=>{
                const author = {
                    id: authors.length + 1,
                    name: args.name,
                }
                authors.push(author);
                return author
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use("/graphql", expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.listen(5000, ()=>{
    console.log("Server is listening on port 5000");
})
