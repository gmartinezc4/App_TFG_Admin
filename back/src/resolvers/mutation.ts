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

    borrarMadera: async (parent: any, args: { id: string }, context: { db: Db, userAdmin: any  }) => {
        const db = context.db;
        const userAdmin = context.userAdmin;
        const id = args.id;

        try {
            if(userAdmin){
                const madera = await db.collection("Tipos_Madera").findOne({ _id: new ObjectId(id) });
                if (madera) {
                    await db.collection("Tipos_Madera").deleteOne({ _id: new ObjectId(id) });
                }
                return {
                    id: id,
                    ...madera
                };
            }else{
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
}

