import { expect } from "chai";
import { ApolloError, ApolloServer, gql } from "apollo-server";
import { Db, MongoClient, Collection, ObjectId } from "mongodb";
import { describe, it } from 'mocha';

describe("Query - getAdmin", () => {
    let server: ApolloServer;
    let userAdmin: any;

    before(() => {
        // Configurar el esquema y los resolvers de Apollo Server
        const typeDefs = gql`
        type Admin {
          _id: ID
          nombre: String
          apellido: String
          email: String
          password: String
          nivel_auth: String
          token: String
        }
  
        type Query {
          getAdmin: Admin
        }
      `;

        const resolvers = {
            Query: {
                getAdmin: async (
                    parent: any,
                    args: any,
                    context: { userAdmin: any }
                ) => {
                    const userAdmin = context.userAdmin;

                    try {
                        if (userAdmin) {
                            return {
                                _id: userAdmin._id.toString(),
                                nombre: userAdmin.nombre || "",
                                apellido: userAdmin.apellido || "",
                                email: userAdmin.email || "",
                                password: userAdmin.password || "",
                                nivel_auth: userAdmin.nivel_auth || "",
                                token: userAdmin.token || "",
                            };
                        } else {
                            throw new ApolloError("Usuario no autorizado");
                        }
                    } catch (e: any) {
                        throw new ApolloError(e, e.extensions.code);
                    }
                },
            },
        };

        // Crear una instancia de ApolloServer con los resolvers y el contexto configurados
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: () => {
                return { userAdmin };
            },
        });
    });

    it("debería devolver un administrador si el usuario es un administrador", async () => {
        // Definir un usuario administrador de prueba
        const admin = {
            _id: "admin-id",
            nombre: "Admin",
            apellido: "Apellido",
            email: "admin@example.com",
            password: "password",
            nivel_auth: "nivel",
            token: "token",
        };

        // Establecer el usuario administrador en el contexto
        userAdmin = admin;

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getAdmin {
            _id
            nombre
            apellido
            email
            password
            nivel_auth
            token
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se devuelve el administrador esperado
        expect(response.data?.getAdmin).to.deep.equal(admin);
    });

    it("debería lanzar un ApolloError si el usuario no es un administrador", async () => {
        // Establecer el usuario no administrador en el contexto (null)
        userAdmin = null;

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getAdmin {
            _id
            nombre
            apellido
            email
            password
            nivel_auth
            token
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje adecuado
        expect(response.errors?.[0].message).to.equal("Usuario no autorizado");
    });
});



describe("Query - getAdmins", () => {
    let server: ApolloServer;
    let db_admin: Db;
    let usuariosAdminsCollection: Collection<any>;

    before(async () => {
        // Configurar y conectar a la base de datos

        const dbName: string = "TFG";
        const usr = "gmartinezc4";
        const pwd = "cristiano7";
        const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ltpbs.mongodb.net/?retryWrites=true&w=majority`;

        const client = new MongoClient(mongouri);

        try {
            await client.connect();
            console.info("MongoDB connected");

            db_admin = client.db(dbName);
            usuariosAdminsCollection = db_admin.collection("Usuarios_admins");
        } catch (e) {
            console.error(e);
            throw new Error("Fallo al conectarse a la base de datos");
        }

        // Configurar el esquema y los resolvers de Apollo Server
        const typeDefs = gql`
        type Admin {
          _id: ID
          nombre: String
          apellido: String
          email: String
          password: String
          nivel_auth: String
          token: String
        }
  
        type Query {
          getAdmins: [Admin]
        }
      `;

        const resolvers = {
            Query: {
                getAdmins: async () => {
                    const usuariosAdmins = await usuariosAdminsCollection.find().toArray();

                    if (usuariosAdmins.length > 0) {
                        return usuariosAdmins.map((u) => ({
                            _id: u._id.toString(),
                            nombre: u.Nombre,
                            apellido: u.Apellido,
                            email: u.Email,
                            password: u.Password,
                            nivel_auth: u.Nivel_auth,
                            token: u.token || "",
                        }));
                    } else {
                        throw new ApolloError(
                            "No hay ningun usuario administrador registrado en la bbdd"
                        );
                    }
                },
            },
        };

        // Crear una instancia de ApolloServer con los resolvers y el contexto configurados
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async () => {
                return { db_admin };
            },
        });
    });

    after(async () => {
        // Limpiar la base de datos y detener el servidor Apollo Server
        await server.stop();
    });

    it("debería devolver un array de administradores", async () => {
        // Insertar datos de prueba en la colección de administradores
        await usuariosAdminsCollection.insertMany([
            {
                nombre: "Admin 1",
                apellido: "Apellido 1",
                email: "admin1@example.com",
                password: "password1",
                nivel_auth: "nivel1",
            },
            {
                nombre: "Admin 2",
                apellido: "Apellido 2",
                email: "admin2@example.com",
                password: "password2",
                nivel_auth: "nivel2",
            },
        ]);

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getAdmins {
            _id
            nombre
            apellido
            email
            password
            nivel_auth
            token
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se devuelve un array con al menos un administrador
        expect(response.data?.getAdmins).to.be.an("array").that.is.not.empty;
    });

    it("debería lanzar un ApolloError si no hay ningún usuario administrador registrado", async () => {
        // Vaciar la colección de administradores
        await usuariosAdminsCollection.deleteMany({});

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
          query {
            getAdmins {
              _id
              nombre
              apellido
              email
              password
              nivel_auth
              token
            }
          }
        `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje adecuado
        expect(response.errors?.[0].message).to.equal(
            "No hay ningun usuario administrador registrado en la bbdd"
        );
    });

    it("debería lanzar un ApolloError si no hay ningún usuario administrador registrado", async () => {
        // Vaciar la colección de administradores
        await usuariosAdminsCollection.deleteMany({});

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
          query {
            getAdmins {
              _id
              nombre
              apellido
              email
              password
              nivel_auth
              token
            }
          }
        `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje adecuado
        expect(response.errors?.[0].message).to.equal(
            "No hay ningun usuario administrador registrado en la bbdd"
        );
    });
});

describe("Query - getUsuarios", () => {
    let server: ApolloServer;
    let db: Db;
    let usuariosCollection: Collection<any>;

    before(async () => {
        // Configurar y conectar a la base de datos

        const dbName: string = "TFG";
        const usr = "gmartinezc4";
        const pwd = "cristiano7";
        const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ltpbs.mongodb.net/?retryWrites=true&w=majority`;

        const client = new MongoClient(mongouri);

        try {
            await client.connect();
            console.info("MongoDB connected");

            db = client.db(dbName);
            usuariosCollection = db.collection("Usuarios");
        } catch (e) {
            console.error(e);
            throw new Error("Fallo al conectarse a la base de datos");
        }

        // Configurar el esquema y los resolvers de Apollo Server
        const typeDefs = gql`
        type Usuario {
          _id: ID
          nombre: String
          apellido: String
          email: String
          password: String
          token: String
        }
  
        type Query {
          getUsuarios: [Usuario]
        }
      `;

        const resolvers = {
            Query: {
                getUsuarios: async () => {
                    const usuarios = await usuariosCollection.find().toArray();

                    if (usuarios.length > 0) {
                        return usuarios.map((u) => ({
                            _id: u._id.toString(),
                            nombre: u.Nombre,
                            apellido: u.Apellido,
                            email: u.Email,
                            password: u.Password,
                            token: u.token || "",
                        }));
                    } else {
                        throw new ApolloError(
                            "No hay ningún usuario registrado en la base de datos"
                        );
                    }
                },
            },
        };

        // Crear una instancia de ApolloServer con los resolvers y el contexto configurados
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async () => {
                return { db };
            },
        });
    });

    after(async () => {
        // Limpiar la base de datos y detener el servidor Apollo Server
        await server.stop();
    });

    it("debería devolver un array de usuarios", async () => {
        // Insertar datos de prueba en la colección de usuarios
        await usuariosCollection.insertMany([
            {
                nombre: "Usuario 1",
                apellido: "Apellido 1",
                email: "usuario1@example.com",
                password: "password1",
            },
            {
                nombre: "Usuario 2",
                apellido: "Apellido 2",
                email: "usuario2@example.com",
                password: "password2",
            },
        ]);

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getUsuarios {
            _id
            nombre
            apellido
            email
            password
            token
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se devuelve un array con al menos un usuario
        expect(response.data?.getUsuarios).to.be.an("array").that.is.not.empty;
    });

    it("debería lanzar un ApolloError si no hay ningún usuario registrado", async () => {
        // Vaciar la colección de usuarios
        await usuariosCollection.deleteMany({});

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getUsuarios {
            _id
            nombre
            apellido
            email
            password
            token
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje adecuado
        expect(response.errors?.[0].message).to.equal(
            "No hay ningún usuario registrado en la base de datos"
        );
    });
});

describe("Query - getMaderas", () => {
    let server: ApolloServer;
    let db: Db;
    let maderasCollection: Collection<any>;

    before(async () => {
        // Configurar y conectar a la base de datos

        const dbName: string = "TFG";
        const usr = "gmartinezc4";
        const pwd = "cristiano7";
        const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ltpbs.mongodb.net/?retryWrites=true&w=majority`;

        const client = new MongoClient(mongouri);

        try {
            await client.connect();
            console.info("MongoDB connected");

            db = client.db(dbName);
            maderasCollection = db.collection("Tipos_Madera");
        } catch (e) {
            console.error(e);
            throw new Error("Fallo al conectarse a la base de datos");
        }

        // Configurar el esquema y los resolvers de Apollo Server
        const typeDefs = gql`
        type Madera {
          _id: ID
          nombre: String
          descripcion: String
        }
  
        type Query {
          getMaderas: [Madera]
        }
      `;

        const resolvers = {
            Query: {
                getMaderas: async () => {
                    const maderas = await maderasCollection.find().toArray();

                    if (maderas.length > 0) {
                        return maderas;
                    } else {
                        throw new ApolloError("No hay maderas", "403");
                    }
                },
            },
        };

        // Crear una instancia de ApolloServer con los resolvers y el contexto configurados
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async () => {
                return { db };
            },
        });
    });

    after(async () => {
        // Limpiar la base de datos y detener el servidor Apollo Server
        await server.stop();
    });

    it("debería devolver un array de maderas", async () => {
        // Insertar datos de prueba en la colección de maderas
        await maderasCollection.insertMany([
            {
                nombre: "Madera 1",
                descripcion: "Descripción de la madera 1",
            },
            {
                nombre: "Madera 2",
                descripcion: "Descripción de la madera 2",
            },
        ]);

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getMaderas {
            _id
            nombre
            descripcion
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se devuelve un array con al menos una madera
        expect(response.data?.getMaderas).to.be.an("array").that.is.not.empty;
    });

    it("debería lanzar un ApolloError si no hay maderas", async () => {
        // Vaciar la colección de maderas
        await maderasCollection.deleteMany({});

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getMaderas {
            _id
            nombre
            descripcion
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje adecuado
        expect(response.errors?.[0].message).to.equal("No hay maderas");
        expect(response.errors?.[0].extensions?.code).to.equal("403");
    });
});

describe("Query - getProductos", () => {
    let server: ApolloServer;
    let db: Db;
    let productosCollection: Collection<any>;

    before(async () => {
        // Configurar y conectar a la base de datos

        const dbName: string = "TFG";
        const usr = "gmartinezc4";
        const pwd = "cristiano7";
        const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ltpbs.mongodb.net/?retryWrites=true&w=majority`;

        const client = new MongoClient(mongouri);

        try {
            await client.connect();
            console.info("MongoDB connected");

            db = client.db(dbName);
            productosCollection = db.collection("Productos_Venta");
        } catch (e) {
            console.error(e);
            throw new Error("Fallo al conectarse a la base de datos");
        }

        // Configurar el esquema y los resolvers de Apollo Server
        const typeDefs = gql`
        type Producto {
          _id: ID
          nombre: String
          precio: Float
          descripcion: String
        }
  
        type Query {
          getProductos: [Producto]
        }
      `;

        const resolvers = {
            Query: {
                getProductos: async () => {
                    const productos = await productosCollection.find().toArray();

                    if (productos.length > 0) {
                        return productos;
                    } else {
                        throw new ApolloError("No hay productos", "403");
                    }
                },
            },
        };

        // Crear una instancia de ApolloServer con los resolvers y el contexto configurados
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async () => {
                return { db };
            },
        });
    });

    after(async () => {
        // Limpiar la base de datos y detener el servidor Apollo Server
        await server.stop();
    });

    it("debería devolver un array de productos", async () => {
        // Insertar datos de prueba en la colección de productos
        await productosCollection.insertMany([
            {
                nombre: "Producto 1",
                precio: 10.99,
                descripcion: "Descripción del producto 1",
            },
            {
                nombre: "Producto 2",
                precio: 19.99,
                descripcion: "Descripción del producto 2",
            },
        ]);

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getProductos {
            _id
            nombre
            precio
            descripcion
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se devuelve un array con al menos un producto
        expect(response.data?.getProductos).to.be.an("array").that.is.not.empty;
    });

    it("debería lanzar un ApolloError si no hay productos", async () => {
        // Vaciar la colección de productos
        await productosCollection.deleteMany({});

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
        query {
          getProductos {
            _id
            nombre
            precio
            descripcion
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje adecuado
        expect(response.errors?.[0].message).to.equal("No hay productos");
        expect(response.errors?.[0].extensions?.code).to.equal("403");
    });
});

describe("Query - getProducto", () => {
    let server: ApolloServer;
    let db: Db;
    let productosCollection: Collection<any>;

    before(async () => {
        // Configurar y conectar a la base de datos

        const dbName: string = "TFG";
        const usr = "gmartinezc4";
        const pwd = "cristiano7";
        const mongouri: string = `mongodb+srv://${usr}:${pwd}@cluster0.ltpbs.mongodb.net/?retryWrites=true&w=majority`;

        const client = new MongoClient(mongouri);

        try {
            await client.connect();
            console.info("MongoDB connected");

            db = client.db(dbName);
            productosCollection = db.collection("Productos_Venta");
        } catch (e) {
            console.error(e);
            throw new Error("Fallo al conectarse a la base de datos");
        }

        // Configurar el esquema y los resolvers de Apollo Server
        const typeDefs = gql`
        type Producto {
          _id: ID
          nombre: String
          precio: Float
          descripcion: String
        }
  
        type Query {
          getProducto(id_product: ID!): Producto
        }
      `;

        const resolvers = {
            Query: {
                getProducto: async (parent: any, args: { id_product: string }) => {
                    const { id_product } = args;

                    if (id_product.length !== 24) {
                        throw new ApolloError("ID inválido");
                    }

                    const producto = await productosCollection.findOne({
                        _id: new ObjectId(id_product),
                    });

                    if (!producto) {
                        throw new ApolloError(
                            "No hay ningún producto registrado con ese ID"
                        );
                    }

                    return producto;
                },
            },
        };

        // Crear una instancia de ApolloServer con los resolvers y el contexto configurados
        server = new ApolloServer({
            typeDefs,
            resolvers,
            context: async () => {
                return { db };
            },
        });
    });

    after(async () => {
        // Limpiar la base de datos y detener el servidor Apollo Server
        await server.stop();
    });

    it("debería devolver el producto correspondiente al ID", async () => {
        // Insertar un producto de prueba en la colección de productos
        const producto = {
            nombre: "Producto de prueba",
            precio: 9.99,
            descripcion: "Descripción del producto de prueba",
        };
        const { insertedId } = await productosCollection.insertOne(producto);

        // Ejecutar una consulta a través del servidor Apollo Server
        const query = gql`
          query GetProducto($id_product: ID!) {
            getProducto(id_product: $id_product) {
              _id
              nombre
              precio
              descripcion
            }
          }
        `;
        const variables = { id_product: insertedId.toHexString() };
        const response = await server.executeOperation({ query, variables });

        // Comprobar que se devuelve el producto esperado
        const expectedProduct = {
            _id: insertedId.toHexString(),
            nombre: producto.nombre,
            precio: producto.precio,
            descripcion: producto.descripcion,
        };
        expect(response.data?.getProducto).to.deep.equal(expectedProduct);
        await db.collection("Productos_Venta").findOneAndDelete({ _id: new ObjectId(insertedId) });
    });

    it("debería lanzar un ApolloError si se proporciona un ID inválido", async () => {
        // Ejecutar una consulta con un ID inválido a través del servidor Apollo Server
        const query = gql`
        query {
          getProducto(id_product: "123") {
            _id
            nombre
            precio
            descripcion
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje esperado
        expect(response.errors?.[0].message).to.equal("ID inválido");
    });

    it("debería lanzar un ApolloError si no se encuentra ningún producto con el ID proporcionado", async () => {
        // Ejecutar una consulta con un ID que no existe en la base de datos a través del servidor Apollo Server
        const query = gql`
        query {
          getProducto(id_product: "6151e1a15214123a12345678") {
            _id
            nombre
            precio
            descripcion
          }
        }
      `;
        const response = await server.executeOperation({ query });

        // Comprobar que se lanza un ApolloError con el mensaje esperado
        expect(response.errors?.[0].message).to.equal(
            "No hay ningún producto registrado con ese ID"
        );
    });
});