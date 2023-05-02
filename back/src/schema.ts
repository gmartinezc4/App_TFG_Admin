import { gql } from "apollo-server"

export const typeDefs = gql`
    
    type UserAdmin {
        _id: ID!
        nombre: String!
        apellido: String!
        email: String!
        password: String!
        nivel_auth: String!
        token: String!
    }

    type User {
        _id: ID!
        nombre: String!
        apellido: String!
        email: String!
        password: String!
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

    type ProductoComprado {
        _id: ID!
        id_user: ID!
        id_producto: ID!
        img: String!
        name: String!
        cantidad: String!
        precioTotal: String!
        precioTotal_freeIVA: String!
    }

    type Pedido {
        _id: ID!
        id_user: ID!
        estado: String!
        nombre: String!
        apellido: String!
        email: String!
        telefono: String!
        direccion: String!
        masInformacion: String!
        codigoPostal: String!
        ciudad: String!
        pais: String!
        fechaPedido: String!
        fechaRecogida: String!
        importePedido: String!
        importeFreeIvaPedido: String!
        productos: [ProductoComprado!]!
    }
    
    type Query{
        getAdmins: [UserAdmin!]!
        getUsuarios: [User!]
        getMaderas: [Madera!]!
        getProductos: [Product!]!
        getProducto (id_product: ID!): Product!
        getPedidosRecogidos(id_user: ID!): [Pedido!]
        getPedidosActivosUser(id_user: ID!): [Pedido!]
        getPedidosPendientesUser(id_user: ID!): [Pedido!]
        getPedidosCanceladosUser(id_user: ID!): [Pedido!]
    }

    type Mutation{
        RegistrarAdmin(nombre: String!, apellido: String!, correo: String!, nivel_auth: String!, password: String!): UserAdmin!
        logIn(correo: String!, password: String!): UserAdmin!
        cerrarSesion: Boolean!
        ChangeLvlAuth(idUser: ID!, newNivel_auth: String!): UserAdmin!
        borraUserAdmin(idUser: ID!): UserAdmin!
        borraUser(idUser: ID!): User!

        darAltaMadera(img: String!, name: String!, description: String!): Madera!
        modificarMadera(id_madera: ID!, img: String, name: String, description: String): Madera!
        borrarMadera(id_madera: ID!): Madera!

        addProducto(img: String!, name: String!, stock: String!, precio: String!): Product!
        modificarProducto(id_product: ID!, img: String, name: String, stock: String, precio: String): Product!
        borrarProducto(id_product: ID!): Product!

        cambiarEstadoPedido(id_pedido: ID!, oldEstado: String!, newEstado: String!): Pedido!
        cancelarProductoPedido(id_product: ID!): Pedido!
    }
`