import { ApolloError } from "apollo-server";
import { Db, ObjectId } from "mongodb";


//
// * Querys de la apliación
//
export const Query = {

    getAdmin: async (parent: any, args: any, context: { userAdmin: any }) => {
        const userAdmin = context.userAdmin;

        try {
            if (userAdmin) {
                return {
                    _id: userAdmin._id.toString(),
                    nombre: userAdmin.Nombre,
                    apellido: userAdmin.Apellido,
                    email: userAdmin.Email,
                    password: userAdmin.Password,
                    nivel_auth: userAdmin.Nivel_auth,
                    token: userAdmin.token || "",
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

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

    getAdminsFiltrados: async (parent: any, args: { filtro: string }, context: { db_admin: Db, userAdmin: any }) => {
        const { db_admin, userAdmin } = context;
        const filtro = args.filtro;

        try {

            if (userAdmin) {
                const filtradosNombre = await db_admin.collection("Usuarios_admins").find({ Nombre: { $regex: filtro, $options: 'i' } }).toArray();

                if (filtradosNombre) {
                    return filtradosNombre.map((u) => ({
                        _id: u._id.toString(),
                        nombre: u.Nombre,
                        apellido: u.Apellido,
                        email: u.Email,
                        password: u.Password,
                        nivel_auth: u.Nivel_auth,
                        token: u.token || "",
                    }))
                } else {
                    return [];
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

                if (usuarios) {
                    return usuarios.map((u) => ({
                        _id: u._id.toString(),
                        nombre: u.Nombre,
                        apellido: u.Apellido,
                        email: u.Email,
                        password: u.Password,
                        token: u.token || "",
                    }))
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getUsuariosFiltrados: async (parent: any, args: { filtro: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const filtro = args.filtro;

        try {

            if (userAdmin) {
                const filtradosNombre = await db.collection("Usuarios").find({ Nombre: { $regex: filtro, $options: 'i' } }).toArray();

                if (filtradosNombre) {
                    return filtradosNombre.map((u: any) => ({
                        _id: u._id.toString(),
                        nombre: u.Nombre,
                        apellido: u.Apellido,
                        email: u.Email,
                        password: u.Password,
                        token: u.token || "",
                    }))
                } else {
                    return [];
                }
            } else {
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

    getMaderasFiltradas: async (parent: any, args: { filtro: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const filtro = args.filtro;

        try {

            if (userAdmin) {
                const filtradosNombre = await db.collection("Tipos_Madera").find({ name: { $regex: filtro, $options: 'i' } }).toArray();

                if (filtradosNombre) {
                    return filtradosNombre.map((u: any) => ({
                        _id: u._id.toString(),
                        img: u.img,
                        name: u.name,
                        description: u.description,
                    }))
                } else {
                    throw new ApolloError("No hay ninguna madera registrada en la bbdd con ese filtro");
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

    getProductosPedido: async (parent: any, args: { id_pedido: string, estado: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const { id_pedido, estado } = args;

        try {
            if (userAdmin) {
                if (id_pedido.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    let bbdd: any;

                    if (estado == "Activo") bbdd = "Pedidos_Activos"
                    if (estado == "Pendiente") bbdd = "Pedidos_Pendientes"
                    if (estado == "Cancelado") bbdd = "Pedidos_Cancelados"
                    if (estado == "Recogido") bbdd = "Pedidos_Recogidos"
                    if (estado == "Eliminado") bbdd = "Pedidos_Eliminados"

                    const pedido = await db.collection(bbdd).findOne({ _id: new ObjectId(id_pedido) });

                    if (pedido) {
                        if (pedido.Productos.length != 0) {

                            return pedido?.Productos.map((e: any) => ({
                                _id: e._id.toString(),
                                id_user: e.Id_user,
                                id_producto: e.Id_producto,
                                img: e.Img,
                                name: e.Name,
                                cantidad: e.Cantidad,
                                precioTotal: e.PrecioTotal,
                                precioTotal_freeIVA: e.PrecioTotal_freeIVA
                            }))


                        } else {
                            throw new ApolloError("El pedido no tiene productos");

                        }
                    } else {
                        throw new ApolloError("No se ha encontrado ningún pedido con ese ID");
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getProductosFiltrados: async (parent: any, args: { filtro: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const filtro = args.filtro;

        try {

            if (userAdmin) {
                const filtradosNombre = await db.collection("Productos_Venta").find({ name: { $regex: filtro, $options: 'i' } }).toArray();

                if (filtradosNombre) {
                    return filtradosNombre.map((u: any) => ({
                        _id: u._id.toString(),
                        img: u.img,
                        name: u.name,
                        stock: u.stock,
                        precio: u.precio,
                    }))
                } else {
                    return [];
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }


        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosRecogidosUser: async (parent: any, args: { id_user: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const id_user = args.id_user;

        try {
            if (userAdmin) {
                if (id_user.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    const userPedidos = await db.collection("Usuarios").findOne({ _id: new ObjectId(id_user) });
                    if (userPedidos) {
                        const pedidos = await db.collection("Pedidos_Recogidos").find({ Id_user: userPedidos._id.toString() }).toArray();

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
                            throw new ApolloError("El usuario no tiene pedidos recogidos", "404");
                        }
                    } else {
                        throw new ApolloError("Ha ocurrido un error con el usuario", "500");
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosActivosUser: async (parent: any, args: { id_user: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const id_user = args.id_user;

        try {
            if (userAdmin) {
                if (id_user.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    const userPedidos = await db.collection("Usuarios").findOne({ _id: new ObjectId(id_user) });
                    if (userPedidos) {
                        const pedidos = await db.collection("Pedidos_Activos").find({ Id_user: userPedidos._id.toString() }).toArray();

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
                            throw new ApolloError("El usuario no tiene pedidos activos", "404");
                        }
                    } else {
                        throw new ApolloError("Ha ocurrido un error con el usuario", "500");
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosPendientesUser: async (parent: any, args: { id_user: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const id_user = args.id_user;

        try {
            if (userAdmin) {
                if (id_user.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    const userPedidos = await db.collection("Usuarios").findOne({ _id: new ObjectId(id_user) });
                    if (userPedidos) {
                        const pedidos = await db.collection("Pedidos_Pendientes").find({ Id_user: userPedidos._id.toString() }).toArray();

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
                            throw new ApolloError("El usuario no tiene pedidos pendientes de recoger", "404");
                        }
                    } else {
                        throw new ApolloError("Ha ocurrido un error con el usuario", "500");
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosCanceladosUser: async (parent: any, args: { id_user: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const id_user = args.id_user;

        try {
            if (userAdmin) {
                if (id_user.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    const userPedidos = await db.collection("Usuarios").findOne({ _id: new ObjectId(id_user) });
                    if (userPedidos) {
                        const pedidos = await db.collection("Pedidos_Cancelados").find({ Id_user: userPedidos._id.toString() }).toArray();

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
                            throw new ApolloError("El usuario no tiene pedidos cancelados", "404");
                        }
                    } else {
                        throw new ApolloError("Usuario no autorizado");
                    }
                }
            } else {
                throw new ApolloError("Ha ocurrido un error con el usuario", "500");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosFiltradosUser: async (parent: any, args: { filtro: string, bbdd: string, id_user: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const { filtro, bbdd, id_user } = args;

        try {

            if (userAdmin) {
                let filtradosFecha: any;

                if (bbdd == "Pedidos_Activos")
                    filtradosFecha = await db.collection("Pedidos_Activos").find({ FechaRecogida: { $eq: filtro.toString() }, Id_user: { $eq: id_user } }).toArray();

                if (bbdd == "Pedidos_Pendientes")
                    filtradosFecha = await db.collection("Pedidos_Pendientes").find({ FechaRecogida: { $eq: filtro.toString() }, Id_user: { $eq: id_user } }).toArray();

                if (bbdd == "Pedidos_Cancelados")
                    filtradosFecha = await db.collection("Pedidos_Cancelados").find({ FechaRecogida: { $eq: filtro.toString() }, Id_user: { $eq: id_user } }).toArray();

                if (bbdd == "Pedidos_Recogidos")
                    filtradosFecha = await db.collection("Pedidos_Recogidos").find({ FechaRecogida: { $eq: filtro.toString() }, Id_user: { $eq: id_user } }).toArray();

                if (bbdd == "Pedidos_Eliminados")
                    filtradosFecha = await db.collection("Pedidos_Eliminados").find({ FechaRecogida: { $eq: filtro.toString() }, Id_user: { $eq: id_user } }).toArray();


                if (filtradosFecha) {
                    return filtradosFecha.map((p: any) => ({
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
                    return [];
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }


        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosRecogidos: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;

        try {
            if (userAdmin) {
                const pedidos = await db.collection("Pedidos_Recogidos").find().toArray();

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
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosActivos: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;

        try {
            if (userAdmin) {
                const pedidos = await db.collection("Pedidos_Activos").find().toArray();

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
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosPendientes: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;

        try {
            if (userAdmin) {
                const pedidos = await db.collection("Pedidos_Pendientes").find().toArray();

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
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosCancelados: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;

        try {
            if (userAdmin) {
                const pedidos = await db.collection("Pedidos_Cancelados").find().toArray();

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
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosEliminados: async (parent: any, args: any, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;

        try {
            if (userAdmin) {
                const pedidos = await db.collection("Pedidos_Eliminados").find().toArray();

                return pedidos.map((p: any) => ({
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
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    getPedidosFiltrados: async (parent: any, args: { filtro: string, bbdd: string }, context: { db: Db, userAdmin: any }) => {
        const { db, userAdmin } = context;
        const { filtro, bbdd } = args;

        try {

            if (userAdmin) {
                let filtradosFecha: any;

                if (bbdd == "Pedidos_Activos") filtradosFecha = await db.collection("Pedidos_Activos").find({ FechaRecogida: { $eq: filtro.toString() } }).toArray();
                if (bbdd == "Pedidos_Pendientes") filtradosFecha = await db.collection("Pedidos_Pendientes").find({ FechaRecogida: { $eq: filtro.toString() } }).toArray();
                if (bbdd == "Pedidos_Cancelados") filtradosFecha = await db.collection("Pedidos_Cancelados").find({ FechaRecogida: { $eq: filtro.toString() } }).toArray();
                if (bbdd == "Pedidos_Recogidos") filtradosFecha = await db.collection("Pedidos_Recogidos").find({ FechaRecogida: { $eq: filtro.toString() } }).toArray();
                if (bbdd == "Pedidos_Eliminados") filtradosFecha = await db.collection("Pedidos_Eliminados").find({ FechaRecogida: { $eq: filtro.toString() } }).toArray();


                if (filtradosFecha) {
                    return filtradosFecha.map((p: any) => ({
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
                    return [];
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }


        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },
}
