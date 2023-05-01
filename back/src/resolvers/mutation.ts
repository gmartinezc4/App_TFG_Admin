import { ApolloError } from "apollo-server";
import { Db, ObjectId } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcrypt');
var nodemailer  = require('nodemailer');
import { htmlRegistro } from '/home/guillermo/App_TFG/back/data/htmlCorreos'

export const Mutation = {

    RegistrarAdmin: async (parent: any, args: { nombre: string, apellido: string, correo: string, password: string, nivel_auth: string }, context: { db_admin: Db, userAdmin: any }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;
        const { nombre, apellido, correo, password, nivel_auth } = args;
        
        try {
            if(userAdmin && userAdmin.Nivel_auth >= 2){
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
                        html: htmlRegistro, // cambiar html
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
            }else {
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

                }else {
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

    ChangeLvlAuth: async (parent: any, args: { idUser: string, newNivel_auth: string }, context: { db_admin: Db, userAdmin: any  }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;
        const { idUser, newNivel_auth } = args;

        try{
            if(userAdmin){
                const userAdminChanged = await db_admin.collection("Usuarios_admins").findOne({ _id: new ObjectId(idUser) });

                if(userAdminChanged){
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
            }else {
                throw new ApolloError("Usuario no autorizado");
            }
            
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    borraUserAdmin: async (parent: any, args: { idUser: string }, context: { db_admin: Db, userAdmin: any  }) => {
        const db_admin = context.db_admin;
        const userAdmin = context.userAdmin;
        const idUser = args.idUser;

        try{
            
            if(userAdmin){
                const userAdminDelete = await db_admin.collection("Usuarios_admins").findOne({ _id: new ObjectId(idUser) });

                if(userAdminDelete){
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
                }else {
                    throw new ApolloError("Usuario no encontrado");
                }
            }else {
                throw new ApolloError("Usuario no autorizado");
            }
        }catch(e: any){
            throw new ApolloError(e, e.extensions.code);
        }

    },

    borraUser: async (parent: any, args: { idUser: string }, context: { db: Db, userAdmin: any  }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const idUser = args.idUser;

        try{
            
            if(userAdmin){
                
                const userDelete = await db.collection("Usuarios").findOne({ _id: new ObjectId(idUser) });

                if(userDelete){
                    await db.collection("Usuarios").deleteOne({ _id: new ObjectId(idUser) });
                    
                    return {
                        _id: userDelete._id.toString(),
                        nombre: userDelete.Nombre,
                        apellido: userDelete.Apellido,
                        email: userDelete.Email,
                        password: userDelete.Password,
                        token: userDelete.token || "",
                    }
                }else {
                    throw new ApolloError("Usuario no encontrado");
                }
            }else {
                throw new ApolloError("Usuario no autorizado");
            }
        }catch(e: any){
            throw new ApolloError(e, e.extensions.code);
        }

    },

    darAltaMadera: async (parent: any, args: { img: String, name: String, description: String }, context: { db: Db, userAdmin: any  }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const { img, name, description } = args;

        try {
            if(userAdmin){
                await db.collection("Tipos_Madera").insertOne({ img, name, description });
                return { img, name, description }
            }else{
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

    addProducto: async (parent: any, args: { img: string, name: string, stock: string, precio: string }, context: { db: Db, userAdmin: any  }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const { img, name, stock, precio } = args;

        try {
            if(userAdmin){
                const precioInt: number = parseInt(precio)

                await db.collection("Productos_Venta").insertOne({ img, name, stock, precio: precioInt })
                return {
                    img,
                    name,
                    stock,
                    precio: precio
                    }    
            }else{
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

    borrarProducto: async (parent: any, args: { id_product: string }, context: { db: Db, userAdmin: any  }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const id_product = args.id_product;

        try {
            if(userAdmin){
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

            }else{
                throw new ApolloError("Usuario no autorizado");
            }
            
        } catch (e: any) {
            throw new ApolloError(e, e.extensions.code);
        }
    },

    cambiarEstadoPedido: async (parent: any, args: { id_pedido: string, newEstado: string }, context: { db: Db, userAdmin: any }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        let { id_pedido, newEstado } = args;

        try {
            if (userAdmin) {
                if (id_pedido.length != 24) {
                    throw new ApolloError("ID invalido");
                } else {
                    const pedidoUser = await db.collection("Historial_Pedidos").findOne({ _id: new ObjectId(id_pedido) });

                    if(pedidoUser) {
                        await db.collection("Historial_Pedidos").findOneAndUpdate({ _id: new ObjectId(id_pedido) }, { $set: { Estado: newEstado } });

                        return {
                            _id: pedidoUser._id,
                            id_user: pedidoUser.Id_user,
                            estado: pedidoUser.Estado,
                            nombre: pedidoUser.Nombre,
                            apellido: pedidoUser.Apellido,
                            email: pedidoUser.Email,
                            telefono: pedidoUser.Telefono,
                            direccion: pedidoUser.Direccion,
                            masInformacion: pedidoUser.MasInformacion,
                            codigoPostal: pedidoUser.CodigoPostal,
                            ciudad: pedidoUser.Ciudad,
                            pais: pedidoUser.Pais,
                            fechaPedido: pedidoUser.FechaPedido,
                            fechaRecogida: pedidoUser.FechaRecogida,
                            importePedido: pedidoUser.ImportePedido,
                            importeFreeIvaPedido: pedidoUser.ImporteFreeIvaPedido,
                            productos: pedidoUser.Productos.map((e: any) => ({
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
                    }else{
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

