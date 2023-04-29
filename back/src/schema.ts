import { gql } from "apollo-server"

export const typeDefs = gql`
    
    type User {
        _id: ID!
        nombre: String!
        apellido: String!
        email: String!
        password: String!
        nivel_auth: String!
        token: String!
    }

    type Maderas {
        _id: ID!
        img: String!
        name: String!
        description: String!
    }

    type Product {
        _id: ID!
        img: String!
        name: String!
        stock: String!
        precio: String!
    }
    
    type Query{
        getAdmins: [User!]!
        getMaderas: [Maderas!]!
    }

    type Mutation{
        RegistrarAdmin(nombre: String!, apellido: String!, correo: String!, nivel_auth: String!, password: String!): User!
        ChangeLvlAuth(idUser: String!, newNivel_auth: String!): User!
        darAltaMadera(img: String!, name: String!, description: String!): Maderas!
        borrarMadera(id: ID!): Maderas!
        addProducto(img: String!, name: String!, stock: String!, precio: String!): Product!

    }
`