import { ApolloError } from "apollo-server";
import { Db, ObjectId } from "mongodb";

export const Query = {

    getAdmins: async (parent: any, args: any, context: { db_admin: Db, userAdmin: any }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;

        try {

            if (userAdmin) {
                const usuariosAdmins = await db_admin.collection("Usuarios_admins").find().toArray();

                if (usuariosAdmins) {
                    return usuariosAdmins.map((u) => ({
                        _id: u._id.toString(),
                        nombre: u.Nombre,
                        apellido: u.Apellido,
                        email: u.Email,
                        password: u.Password,
                        nivel_auth: u.Nivel_auth,
                        token: u.token || "",
                    }))
                } else {
                    throw new ApolloError("No hay ningun usuario administrador registrado en la bbdd");
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }


        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getUsuarios: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;

        try {
            if (userAdmin) {
                const usuarios = await db.collection("Usuarios").find().toArray();
                
                if(usuarios){
                    return usuarios.map((u) => ({
                        _id: u._id.toString(),
                        nombre: u.Nombre,
                        apellido: u.Apellido,
                        email: u.Email,
                        password: u.Password,
                        token: u.token || "",
                    }))
                }
            }else{
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getMaderas: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;

        try {
            if (userAdmin) {
                const maderas = await db.collection("Tipos_Madera").find().toArray();

                if (maderas) {
                    return maderas;
                } else {
                    throw new ApolloError("No hay maderas", "403");
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getProductos: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;

        try {
            if (userAdmin) {
                const productos = await db.collection("Productos_Venta").find().toArray();

                if (productos) {
                    return productos;
                } else {
                    throw new ApolloError("no hay productos", "403");
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }


        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }

    },

    getProducto: async (parent: any, args: { id_product: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const id_product = args.id_product;

        try {
            if (userAdmin) {
                if (id_product.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    const producto = await db.collection("Productos_Venta").findOne({ _id: new ObjectId(id_product) });

                    if (producto) {
                        return producto;
                    } else {
                        throw new ApolloError("No hay ningun producto registrado con ese ID");
                    }
                }

            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getHistorialPedidosUser: async (parent: any, args: { idUser: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const idUser = args.idUser;

        try {
            if (userAdmin) {
                if (idUser.length != 24) {
                    throw new ApolloError("ID invalido");
                }else {
                    const userPedidos = await db.collection("Usuarios").findOne({ _id: new ObjectId(idUser) });

                    if(userPedidos){
                        const pedidos = await db.collection("Historial_Pedidos").find({ Id_user: idUser }).toArray();
    
                        if (pedidos) {
                            return pedidos.map(p => ({
                                _id: p._id,
                                id_user: p.Id_user,
                                estado: p.Estado,
                                nombre: p.Nombre,
                                apellido: p.Apellido,
                                email: p.Email,
                                telefono: p.Telefono,
                                direccion: p.Direccion,
                                masInformacion: p.MasInformacion,
                                codigoPostal: p.CodigoPostal,
                                ciudad: p.Ciudad,
                                pais: p.Pais,
                                fechaPedido: p.FechaPedido,
                                fechaRecogida: p.FechaRecogida,
                                importePedido: p.ImportePedido,
                                importeFreeIvaPedido: p.ImporteFreeIvaPedido,
                                productos: p.Productos.map((e: any) => ({
                                    _id: e._id.toString(),
                                    id_user: e.Id_user,
                                    id_producto: e.Id_producto,
                                    img: e.Img,
                                    name: e.Name,
                                    cantidad: e.Cantidad,
                                    precioTotal: e.PrecioTotal,
                                    precioTotal_freeIVA: e.PrecioTotal_freeIVA
                                }))
        
                            }))
        
                        } else {
                            throw new ApolloError("El usuario no tiene pedidos", "404");
                        }
                    }else{
                        throw new ApolloError("No hay coincidencias con ese ID");
                    }
                }
                
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },
}
