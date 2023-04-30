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

    type Madera {
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
        getMaderas: [Madera!]!
        getProductos: [Product!]!
        getProducto (id_product: String!): Product!
    }

    type Mutation{
        RegistrarAdmin(nombre: String!, apellido: String!, correo: String!, nivel_auth: String!, password: String!): User!
        logIn(correo: String!, password: String!): User!
        cerrarSesion: Boolean!
        ChangeLvlAuth(idUser: ID!, newNivel_auth: String!): User!

        darAltaMadera(img: String!, name: String!, description: String!): Madera!
        modificarMadera(id_madera: ID!, img: String, name: String, description: String): Madera!
        borrarMadera(id_madera: ID!): Madera!

        addProducto(img: String!, name: String!, stock: String!, precio: String!): Product!
        modificarProducto(id_product: ID!, img: String, name: String, stock: String, precio: String): Product!
        borrarProducto(id_product: ID!): Product!

    }
`