import { ApolloError } from "apollo-server";
import { Db, ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcrypt');
var nodemailer = require('nodemailer');
import correoRegistroAdmin from '/home/guillermo/App_TFG_Admin/back/data/htmlCorreos'


//
// * Mutations de la apliación
//
export const Mutation = {
    RegistrarAdmin: async (parent: any, args: { nombre: string, apellido: string, correo: string, password: string, nivel_auth: string }, context: { db_admin: Db, userAdmin: any }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;
        const { nombre, apellido, correo, password, nivel_auth } = args;;

        try {
            if (userAdmin && userAdmin.Nivel_auth >= 2) {
                if (nombre == "" || apellido == "" || correo == "" || password == "" || nivel_auth == "") {
                    return new ApolloError("Faltan campos por completar");
                }

                const user = await db_admin.collection("Usuarios_admins").findOne({ Email: correo });

                if (!user) {
                    const encripted_pass = await bcrypt.hash(password, 12);

                    await db_admin.collection("Usuarios_admins").insertOne({ Nombre: nombre, Apellido: apellido, Email: correo, Password: encripted_pass, Nivel_auth: nivel_auth, token: null });

                    //Creamos el objeto de transporte
                    var transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        ignoreTLS: false,
                        secure: false,
                        auth: {
                            user: 'maderas.cobo.cuenca@gmail.com',
                            pass: 'fllksawjvxgrncfp'
                        }
                    });

                    var mailOptions = {
                        from: 'maderas.cobo.cuenca@gmail.com',
                        to: correo,
                        subject: 'Nuevo usuario administrador',
                        html: correoRegistroAdmin(correo, password),
                    };



                    transporter.sendMail(mailOptions, function (error: any, info: any) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email enviado: ' + info.response);
                        }
                    });

                    return {
                        nombre: nombre,
                        apellido: apellido,
                        email: correo,
                        password: password,
                        nivel_auth: nivel_auth,
                        token: "",
                    };

                } else {
                    return new ApolloError("Ya existe un administrador con ese email");
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }


        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    logIn: async (parent: any, args: { correo: String, password: String }, context: { db_admin: Db }) => {
        const db_admin = context.db_admin;
        const { correo, password } = args;

        try {
            const user = await db_admin.collection("Usuarios_admins").findOne({ Email: correo });

            if (!user) {
                throw new ApolloError("Ningun usuario con ese correo está registrado");

            } else {

                if (await bcrypt.compare(password, user['Password'])) {
                    const token = uuidv4();

                    await db_admin.collection("Usuarios_admins").updateOne({ Email: correo }, { $set: { token: token } });

                    return {
                        _id: user._id.toString(),
                        nombre: user.Nombre,
                        apellido: user.Apellido,
                        email: user.Email,
                        password: user.Password,
                        nivel_auth: user.Nivel_auth,
                        token: token,
                    };

                } else {
                    throw new ApolloError("Contraseña invalida");
                }
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    cerrarSesion: async (parent: any, args: any, context: { db_admin: Db, userAdmin: any }) => {
        const { db_admin, userAdmin } = context;

        try {
            if (!userAdmin) {
                throw new ApolloError("User not exist", "USER_NOT_EXIST")
            } else {
                await db_admin.collection("Usuarios_admins").updateOne({ _id: userAdmin._id }, { $set: { token: null } });
                return true;
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    ChangeLvlAuth: async (parent: any, args: { idUser: string, newNivel_auth: string }, context: { db_admin: Db, userAdmin: any }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;
        const { idUser, newNivel_auth } = args;

        try {
            if (userAdmin) {
                const userAdminChanged = await db_admin.collection("Usuarios_admins").findOne({ _id: new ObjectId(idUser) });

                if (userAdminChanged) {
                    await db_admin.collection("Usuarios_admins").findOneAndUpdate({ _id: new ObjectId(idUser) }, { $set: { Nivel_auth: newNivel_auth } });

                    return {
                        _id: userAdminChanged._id.toString(),
                        nombre: userAdminChanged.Nombre,
                        apellido: userAdminChanged.Apellido,
                        email: userAdminChanged.Email,
                        password: userAdminChanged.Password,
                        nivel_auth: newNivel_auth,
                        token: userAdminChanged.token || "",
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    borraUserAdmin: async (parent: any, args: { idUser: string }, context: { db_admin: Db, userAdmin: any }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;
        const idUser = args.idUser;

        try {

            if (userAdmin) {
                const userAdminDelete = await db_admin.collection("Usuarios_admins").findOne({ _id: new ObjectId(idUser) });

                if (userAdminDelete) {
                    await db_admin.collection("Usuarios_admins").deleteOne({ _id: new ObjectId(idUser) });

                    return {
                        _id: userAdminDelete._id.toString(),
                        nombre: userAdminDelete.Nombre,
                        apellido: userAdminDelete.Apellido,
                        email: userAdminDelete.Email,
                        password: userAdminDelete.Password,
                        nivel_auth: userAdminDelete.Nivel_auth,
                        token: userAdminDelete.token || "",
                    }
                } else {
                    throw new ApolloError("Usuario no encontrado");
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }

    },

    borraUser: async (parent: any, args: { idUser: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const idUser = args.idUser;
        let productos = [];

        try {

            if (userAdmin) {

                const userDelete = await db.collection("Usuarios").findOne({ _id: new ObjectId(idUser) });

                if (userDelete) {
                    const pActivos = await db.collection("Pedidos_Activos").find({ Id_user: idUser }).toArray();
                    const pRecogidos = await db.collection("Pedidos_Recogidos").find({ Id_user: idUser }).toArray();
                    const pCancelados = await db.collection("Pedidos_Cancelados").find({ Id_user: idUser }).toArray();
                    const pPendientes = await db.collection("Pedidos_Pendientes").find({ Id_user: idUser }).toArray();

                    let fecha = new Date();
                    let fechaEliminación = (fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear())

                    pActivos.map(async (a) => {
                        a.Productos.map(async (e: any) => {
                            let newStock: any;
                            const producto = await db.collection("Productos_Venta").findOne({ _id: new ObjectId(e.Id_producto) })

                            if (producto) {
                                newStock = parseInt(producto.stock) + parseInt(e.Cantidad);
                                await db.collection("Productos_Venta").updateOne({ _id: new ObjectId(e.Id_producto) }, { $set: { stock: newStock.toString() } })
                            } else {
                                throw new ApolloError("Ese producto no existe");
                            }

                        })

                        productos = a.Productos;

                        productos.map((e: any) => {
                            e.Id_user = "usuario eliminado";
                        })

                        await db.collection("Pedidos_Eliminados").insertOne({ Id_user: "usuario eliminado", Estado: "Eliminado", Nombre: a.Nombre, Apellido: a.Apellido, Email: a.Email, Telefono: a.Telefono, Direccion: a.Direccion, MasInformacion: a.MasInformacion, CodigoPostal: a.CodigoPostal, Ciudad: a.Ciudad, Pais: a.Pais, FechaPedido: fechaEliminación, FechaRecogida: "", ImportePedido: a.ImportePedido, ImporteFreeIvaPedido: a.ImporteFreeIvaPedido, Productos: productos })
                    })

                    pRecogidos.map(async (a) => {
                        productos = a.Productos;
                        productos.map((e: any) => {
                            e.Id_user = "usuario eliminado";
                        })

                        await db.collection("Pedidos_Eliminados").insertOne({ Id_user: "usuario eliminado", Estado: "Eliminado", Nombre: a.Nombre, Apellido: a.Apellido, Email: a.Email, Telefono: a.Telefono, Direccion: a.Direccion, MasInformacion: a.MasInformacion, CodigoPostal: a.CodigoPostal, Ciudad: a.Ciudad, Pais: a.Pais, FechaPedido: fechaEliminación, FechaRecogida: "", ImportePedido: a.ImportePedido, ImporteFreeIvaPedido: a.ImporteFreeIvaPedido, Productos: a.Productos })
                    })

                    pCancelados.map(async (a) => {
                        productos = a.Productos;

                        productos.map((e: any) => {
                            e.Id_user = "usuario eliminado";
                        })
                        await db.collection("Pedidos_Eliminados").insertOne({ Id_user: "usuario eliminado", Estado: "Eliminado", Nombre: a.Nombre, Apellido: a.Apellido, Email: a.Email, Telefono: a.Telefono, Direccion: a.Direccion, MasInformacion: a.MasInformacion, CodigoPostal: a.CodigoPostal, Ciudad: a.Ciudad, Pais: a.Pais, FechaPedido: fechaEliminación, FechaRecogida: "", ImportePedido: a.ImportePedido, ImporteFreeIvaPedido: a.ImporteFreeIvaPedido, Productos: a.Productos })
                    })

                    pPendientes.map(async (a) => {
                        a.Productos.map(async (e: any) => {
                            let newStock: any;
                            const producto = await db.collection("Productos_Venta").findOne({ _id: new ObjectId(e.Id_producto) })

                            if (producto) {
                                newStock = parseInt(producto.stock) + parseInt(e.Cantidad);
                                await db.collection("Productos_Venta").updateOne({ _id: new ObjectId(e.Id_producto) }, { $set: { stock: newStock.toString() } })
                            } else {
                                throw new ApolloError("Ese producto no existe");
                            }

                            productos = a.Productos;

                            productos.map((e: any) => {
                                e.Id_user = "usuario eliminado";
                            })

                        })
                        await db.collection("Pedidos_Eliminados").insertOne({ Id_user: "usuario eliminado", Estado: "Eliminado", Nombre: a.Nombre, Apellido: a.Apellido, Email: a.Email, Telefono: a.Telefono, Direccion: a.Direccion, MasInformacion: a.MasInformacion, CodigoPostal: a.CodigoPostal, Ciudad: a.Ciudad, Pais: a.Pais, FechaPedido: a.FechaPedido, FechaRecogida: "", ImportePedido: a.ImportePedido, ImporteFreeIvaPedido: a.ImporteFreeIvaPedido, Productos: a.Productos })
                    })

                    await db.collection("Pedidos_Activos").deleteMany({ Id_user: idUser });
                    await db.collection("Pedidos_Recogidos").deleteMany({ Id_user: idUser });
                    await db.collection("Pedidos_Cancelados").deleteMany({ Id_user: idUser });
                    await db.collection("Pedidos_Pendientes").deleteMany({ Id_user: idUser });
                    await db.collection("Usuarios").deleteOne({ _id: new ObjectId(idUser) });

                    return {
                        _id: userDelete._id.toString(),
                        nombre: userDelete.Nombre,
                        apellido: userDelete.Apellido,
                        email: userDelete.Email,
                        password: userDelete.Password,
                        token: userDelete.token || "",
                    }
                } else {
                    throw new ApolloError("Usuario no encontrado");
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }

    },

    modificarUseraAdmin: async (parent: any, args: { nombre: string, apellido: string, newCorreo: string, password: string, newPassword: string }, context: { db_admin: Db, userAdmin: any }) => {
        const { db_admin, userAdmin } = context;
        const { nombre, apellido, newCorreo, password, newPassword } = args;

        const encripted_pass = await bcrypt.hash(password, 12);
        const encripted_new_pass = await bcrypt.hash(newPassword, 12);

        try {
            if (userAdmin) {
                if (nombre != "" && apellido != "" && nombre != null && apellido != null) {
                    await db_admin.collection("Usuarios_admins").findOneAndUpdate({ _id: userAdmin._id }, { $set: { Nombre: nombre, Apellido: apellido } });

                    return {
                        _id: userAdmin._id.toString(),
                        nombre: nombre,
                        apellido: apellido,
                        email: userAdmin.Email,
                        password: userAdmin.Password,
                        nivel_auth: userAdmin.Nivel_auth,
                        token: userAdmin.token
                    }

                } else if (apellido != "" && apellido != null) {
                    await db_admin.collection("Usuarios_admins").findOneAndUpdate({ _id: userAdmin._id }, { $set: { Apellido: apellido } });
                    return {
                        _id: userAdmin._id.toString(),
                        nombre: nombre,
                        apellido: apellido,
                        email: userAdmin.Email,
                        password: userAdmin.Password,
                        nivel_auth: userAdmin.Nivel_auth,
                        token: userAdmin.token
                    }
                } else if (nombre != "" && nombre != null) {
                    await db_admin.collection("Usuarios_admins").findOneAndUpdate({ _id: userAdmin._id }, { $set: { Nombre: nombre } });
                    return {
                        _id: userAdmin._id.toString(),
                        nombre: nombre,
                        apellido: apellido,
                        email: userAdmin.Email,
                        password: userAdmin.Password,
                        nivel_auth: userAdmin.Nivel_auth,
                        token: userAdmin.token
                    }
                } else if (newCorreo != "" && password != "" && newCorreo != null && password != null) {

                    if (await bcrypt.compare(password, userAdmin.Password)) {
                        const yaExisteCorreo = await db_admin.collection("Usuarios_admins").findOne({ Email: newCorreo });

                        if (!yaExisteCorreo) {
                            await db_admin.collection("Usuarios_admins").findOneAndUpdate({ _id: userAdmin._id }, { $set: { Email: newCorreo } });
                            return {
                                _id: userAdmin._id.toString(),
                                nombre: userAdmin.Nombre,
                                apellido: userAdmin.Apellido,
                                email: newCorreo,
                                password: encripted_pass,
                                nivel_auth: userAdmin.Nivel_auth,
                                token: userAdmin.token
                            }
                        } else {
                            throw new ApolloError("Email ya registrado");
                        }
                    } else {
                        throw new ApolloError("Contraseña incorrecta");
                    }
                } else if (password != "" && newPassword != "" && password != null && newPassword != null) {
                    if (await bcrypt.compare(password, userAdmin.Password)) {
                        await db_admin.collection("Usuarios_admins").findOneAndUpdate({ _id: userAdmin._id }, { $set: { Password: encripted_new_pass } });
                        return {
                            _id: userAdmin._id.toString(),
                            nombre: userAdmin.Nombre,
                            apellido: userAdmin.Apellido,
                            email: userAdmin.Email,
                            password: encripted_new_pass,
                            nivel_auth: userAdmin.Nivel_auth,
                            token: userAdmin.token
                        }
                    } else {
                        throw new ApolloError("Contraseña incorrecta");
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }

    },

    darAltaMadera: async (parent: any, args: { img: String, name: String, description: String }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const { img, name, description } = args;

        try {
            if (userAdmin) {
                await db.collection("Tipos_Madera").insertOne({ img, name, description });
                return { img, name, description }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }

    },

    modificarMadera: async (parent: any, args: { id_madera: string, img: string, name: string, description: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        let { id_madera, img, name, description } = args;

        try {
            if (userAdmin) {
                if (id_madera.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {

                    const maderaModify = await db.collection("Tipos_Madera").findOne({ _id: new ObjectId(id_madera) });

                    if (maderaModify) {

                        if (img == "" || img == null) img = maderaModify.img;
                        if (name == "" || name == null) name = maderaModify.name;
                        if (description == "" || description == null) description = maderaModify.description;

                        await db.collection("Tipos_Madera").findOneAndUpdate({ _id: new ObjectId(id_madera) }, { $set: { img: img, name: name, description: description } })

                        return {
                            _id: id_madera,
                            img: img,
                            name: name,
                            description: description
                        }

                    } else {
                        throw new ApolloError("No se encuentran coincidencias con ese ID");
                    }
                }

            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    borrarMadera: async (parent: any, args: { id_madera: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const id_madera = args.id_madera;

        try {
            if (userAdmin) {
                if (id_madera.length != 24) {
                    throw new ApolloError("ID invalido");

                } else {
                    const madera = await db.collection("Tipos_Madera").findOne({ _id: new ObjectId(id_madera) });

                    if (madera) {
                        await db.collection("Tipos_Madera").deleteOne({ _id: new ObjectId(id_madera) });

                        return {
                            id: id_madera,
                            ...madera
                        };
                    } else {
                        throw new ApolloError("No se encuentran coincidencias con ese ID");
                    }
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    addProducto: async (parent: any, args: { img: string, name: string, stock: string, precio: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const { img, name, stock, precio } = args;

        try {
            if (userAdmin) {
                const precioInt: number = parseInt(precio)

                await db.collection("Productos_Venta").insertOne({ img, name, stock, precio: precioInt })
                return {
                    img,
                    name,
                    stock,
                    precio: precio
                }
            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    modificarProducto: async (parent: any, args: { id_product: string, img: String, name: String, stock: String, precio: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        let { id_product, img, name, stock, precio } = args;

        try {
            if (userAdmin) {
                if (id_product.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {

                    const productModify = await db.collection("Productos_Venta").findOne({ _id: new ObjectId(id_product) });

                    if (productModify) {

                        if (img == "" || img == null) img = productModify.img;
                        if (name == "" || name == null) name = productModify.name;
                        if (stock == "" || stock == null) stock = productModify.stock;
                        if (precio == "" || precio == null) precio = productModify.precio;

                        const precioInt: number = parseInt(precio);

                        await db.collection("Productos_Venta").findOneAndUpdate({ _id: new ObjectId(id_product) }, { $set: { img: img, name: name, stock: stock, precio: precioInt } })

                        return {
                            _id: id_product,
                            img: img,
                            name: name,
                            stock: stock,
                            precio: precioInt
                        }

                    } else {
                        throw new ApolloError("No se encuentran coincidencias con ese ID");
                    }
                }

            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    borrarProducto: async (parent: any, args: { id_product: string }, context: { db: Db, userAdmin: any }) => {
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
                        await db.collection("Productos_Venta").deleteOne({ _id: new ObjectId(id_product) });

                        return {
                            id: id_product,
                            ...producto
                        };
                    } else {
                        throw new ApolloError("No se encuentran coincidencias con ese ID");
                    }
                }

            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    cancelarProductoPedido: async (parent: any, args: { id_pedido: string, id_product: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const { id_pedido, id_product } = args;
        let newProductos: any = [];
        let productoEliminado: any;
        let newStock: any;
        let newImporte: number;
        let newImporteFreeIVA: number;

        try {
            if (userAdmin) {
                if (id_pedido.length != 24 || id_product.length != 24) {
                    throw new ApolloError("ID invalido");

                } else {
                    const pedido = await db.collection("Pedidos_Activos").findOne({ _id: new ObjectId(id_pedido) });

                    if (pedido) {
                        if (pedido.Productos.length > 1) {
                            pedido.Productos.map(async (p: any) => {
                                if (p.Id_producto != id_product) {
                                    newProductos.push(p);
                                }else{
                                    productoEliminado = p;
                                }

                                
                                const producto = await db.collection("Productos_Venta").findOne({ _id: new ObjectId(p.Id_producto) })

                                if (producto) {
                                    newStock = parseInt(producto.stock) + parseInt(p.Cantidad);
                                    await db.collection("Productos_Venta").updateOne({ _id: new ObjectId(p.Id_producto) }, { $set: { stock: newStock.toString() } })
                                } else {
                                    throw new ApolloError("Ese producto no existe");
                                }

                            })

                            if(productoEliminado){
                                newImporte = parseInt(pedido.ImportePedido) - parseInt(productoEliminado.PrecioTotal);
                                newImporteFreeIVA = parseFloat(pedido.ImporteFreeIvaPedido) - parseFloat(productoEliminado.PrecioTotal_freeIVA);
                                await db.collection("Pedidos_Activos").findOneAndUpdate({ _id: new ObjectId(id_pedido) }, { $set: { Productos: newProductos,  ImportePedido: newImporte, ImporteFreeIvaPedido: newImporteFreeIVA} });
                            }


                            return {
                                _id: pedido._id,
                                id_user: pedido.Id_user,
                                estado: pedido.Estado,
                                nombre: pedido.Nombre,
                                apellido: pedido.Apellido,
                                email: pedido.Email,
                                telefono: pedido.Telefono,
                                direccion: pedido.Direccion,
                                masInformacion: pedido.MasInformacion,
                                codigoPostal: pedido.CodigoPostal,
                                ciudad: pedido.Ciudad,
                                pais: pedido.Pais,
                                fechaPedido: pedido.FechaPedido,
                                fechaRecogida: pedido.FechaRecogida,
                                importePedido: pedido.ImportePedido,
                                importeFreeIvaPedido: pedido.ImporteFreeIvaPedido,
                                productos: newProductos.map((e: any) => ({
                                    _id: e._id.toString(),
                                    id_user: e.Id_user,
                                    id_producto: e.Id_producto,
                                    img: e.Img,
                                    name: e.Name,
                                    cantidad: e.Cantidad,
                                    precioTotal: e.PrecioTotal,
                                    precioTotal_freeIVA: e.PrecioTotal_freeIVA
                                }))
                            }

                        } else {
                            throw new ApolloError("No se puede borrar ese producto. El pedido solo tiene un producto");
                        }


                    } else {
                        throw new ApolloError("No se ha recuperado ningún pedido con ese ID");
                    }
                }

            } else {
                throw new ApolloError("Usuario no autorizado");
            }

        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },


    cambiarEstadoPedido: async (parent: any, args: { id_pedido: string, oldEstado: string, newEstado: string, newFechaRecogida: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        let { id_pedido, oldEstado, newEstado, newFechaRecogida } = args;

        try {
            if (userAdmin) {
                if (id_pedido.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    let pedidoUserCambiado: any;
                    let newBbdd: any;
                    let oldBbdd: any;
                    const fecha = new Date();
                    let stockProductoBorrado: any;


                    if (newEstado == "Activo") newBbdd = "Pedidos_Activos";

                    if (newEstado == "Pendiente") newBbdd = "Pedidos_Pendientes";

                    if (newEstado == "Cancelado") {
                        newBbdd = "Pedidos_Cancelados"
                        newFechaRecogida = (fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear())

                        if (oldEstado == "Activo") oldBbdd = "Pedidos_Activos"
                        if (oldEstado == "Pendiente") oldBbdd = "Pedidos_Pendientes"
                        if (oldEstado == "Recogido") oldBbdd = "Pedidos_Recogidos"
                        const pedidoUser = await db.collection(oldBbdd).findOne({ _id: new ObjectId(id_pedido) });

                        if (pedidoUser) {
                            pedidoUser.Productos.map(async (e: any) => {
                                stockProductoBorrado = e.Cantidad;

                                const producto = await db.collection("Productos_Venta").findOne({ _id: new ObjectId(e.Id_producto) });

                                if (producto) {
                                    const nuevoStock = parseInt(producto.stock) + parseInt(stockProductoBorrado);
                                    await db.collection("Productos_Venta").findOneAndUpdate({ _id: new ObjectId(e.Id_producto) }, { $set: { stock: nuevoStock.toString() } })
                                } else {
                                    throw new ApolloError("Ha ocurrido un error al recuperar los productos del pedido");
                                }
                            })
                        }
                    }

                    if (newEstado == "Recogido") {
                        newBbdd = "Pedidos_Recogidos";
                        newFechaRecogida = (fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear())
                    }

                    if (oldEstado == "Activo") {
                        const pedidoUser = await db.collection("Pedidos_Activos").findOne({ _id: new ObjectId(id_pedido) });
                        if (pedidoUser) {
                            pedidoUser.Estado = newEstado;
                            pedidoUserCambiado = pedidoUser;
                            await db.collection(newBbdd).insertOne({ Id_user: pedidoUser.Id_user.toString(), Estado: newEstado, Nombre: pedidoUser.Nombre, Apellido: pedidoUser.Apellido, Email: pedidoUser.Email, Telefono: pedidoUser.Telefono, Direccion: pedidoUser.Direccion, MasInformacion: pedidoUser.MasInformacion, CodigoPostal: pedidoUser.CodigoPostal, Ciudad: pedidoUser.Ciudad, Pais: pedidoUser.Pais, FechaPedido: pedidoUser.FechaPedido, FechaRecogida: newFechaRecogida, ImportePedido: pedidoUser.ImportePedido, ImporteFreeIvaPedido: pedidoUser.ImporteFreeIvaPedido, Productos: pedidoUser.Productos });
                            await db.collection("Pedidos_Activos").findOneAndDelete({ _id: new ObjectId(id_pedido) });

                        } else {
                            throw new ApolloError("Ha ocurrido un error al recuperar el pedido");
                        }

                    } else if (oldEstado == "Pendiente") {
                        const pedidoUser = await db.collection("Pedidos_Pendientes").findOne({ _id: new ObjectId(id_pedido) });
                        if (pedidoUser) {
                            pedidoUser.Estado = newEstado;
                            pedidoUserCambiado = pedidoUser;
                            await db.collection(newBbdd).insertOne({ Id_user: pedidoUser.Id_user.toString(), Estado: newEstado, Nombre: pedidoUser.Nombre, Apellido: pedidoUser.Apellido, Email: pedidoUser.Email, Telefono: pedidoUser.Telefono, Direccion: pedidoUser.Direccion, MasInformacion: pedidoUser.MasInformacion, CodigoPostal: pedidoUser.CodigoPostal, Ciudad: pedidoUser.Ciudad, Pais: pedidoUser.Pais, FechaPedido: pedidoUser.FechaPedido, FechaRecogida: newFechaRecogida, ImportePedido: pedidoUser.ImportePedido, ImporteFreeIvaPedido: pedidoUser.ImporteFreeIvaPedido, Productos: pedidoUser.Productos });
                            await db.collection("Pedidos_Pendientes").findOneAndDelete({ _id: new ObjectId(id_pedido) });

                        } else {
                            throw new ApolloError("Ha ocurrido un error al recuperar el pedido");
                        }

                    } else if (oldEstado == "Recogido") {
                        const pedidoUser = await db.collection("Pedidos_Recogidos").findOne({ _id: new ObjectId(id_pedido) });
                        if (pedidoUser) {
                            pedidoUser.Estado = newEstado;
                            pedidoUserCambiado = pedidoUser;
                            await db.collection(newBbdd).insertOne({ Id_user: pedidoUser.Id_user.toString(), Estado: newEstado, Nombre: pedidoUser.Nombre, Apellido: pedidoUser.Apellido, Email: pedidoUser.Email, Telefono: pedidoUser.Telefono, Direccion: pedidoUser.Direccion, MasInformacion: pedidoUser.MasInformacion, CodigoPostal: pedidoUser.CodigoPostal, Ciudad: pedidoUser.Ciudad, Pais: pedidoUser.Pais, FechaPedido: pedidoUser.FechaPedido, FechaRecogida: newFechaRecogida, ImportePedido: pedidoUser.ImportePedido, ImporteFreeIvaPedido: pedidoUser.ImporteFreeIvaPedido, Productos: pedidoUser.Productos });
                            await db.collection("Pedidos_Recogidos").findOneAndDelete({ _id: new ObjectId(id_pedido) });
                        } else {
                            throw new ApolloError("Ha ocurrido un error al recuperar el pedido");
                        }
                    }

                    if (pedidoUserCambiado) {
                        return {
                            _id: pedidoUserCambiado._id,
                            id_user: pedidoUserCambiado.Id_user,
                            estado: pedidoUserCambiado.Estado,
                            nombre: pedidoUserCambiado.Nombre,
                            apellido: pedidoUserCambiado.Apellido,
                            email: pedidoUserCambiado.Email,
                            telefono: pedidoUserCambiado.Telefono,
                            direccion: pedidoUserCambiado.Direccion,
                            masInformacion: pedidoUserCambiado.MasInformacion,
                            codigoPostal: pedidoUserCambiado.CodigoPostal,
                            ciudad: pedidoUserCambiado.Ciudad,
                            pais: pedidoUserCambiado.Pais,
                            fechaPedido: pedidoUserCambiado.FechaPedido,
                            fechaRecogida: newFechaRecogida,
                            importePedido: pedidoUserCambiado.ImportePedido,
                            importeFreeIvaPedido: pedidoUserCambiado.ImporteFreeIvaPedido,
                            productos: pedidoUserCambiado.Productos.map((e: any) => ({
                                _id: e._id.toString(),
                                id_user: e.Id_user,
                                id_producto: e.Id_producto,
                                img: e.Img,
                                name: e.Name,
                                cantidad: e.Cantidad,
                                precioTotal: e.PrecioTotal,
                                precioTotal_freeIVA: e.PrecioTotal_freeIVA
                            }))
                        }
                    } else {
                        throw new ApolloError("Ha ocurrido un error al recuperar el pedido");
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

