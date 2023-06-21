import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

const REGISTRAR_ADMIN = gql`
  mutation RegistrarAdmin(
    $nombre: String!
    $apellido: String!
    $correo: String!
    $nivelAuth: String!
    $password: String!
  ) {
    RegistrarAdmin(
      nombre: $nombre
      apellido: $apellido
      correo: $correo
      nivel_auth: $nivelAuth
      password: $password
    ) {
      apellido
      email
      nivel_auth
      nombre
      password
      token
    }
  }
`;

//
// * Componente RegistrarAdmin.
// * Desde aqui se dan de dalta nuevos usuarios administradores.
//
function RegistrarAdmin() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [nivel_auth, setNivel_auth] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [noHayNombre, setNoHayNombre] = useState(false);
  const [noHayApellido, setnoHayApellido] = useState(false);
  const [noHayCorreo, setNoHayCorreo] = useState(false);
  const [noHayNivelAuth, setNoHayNivelAuth] = useState(false);
  const [noHayPassword, setNoHayPassword] = useState(false);
  const [errorPasswordNoCoinciden, setErrorPasswordNoCoinciden] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [errorCorreoIncompleto, setErrorCorreoIncompleto] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [passView, setPassView] = useState(false);
  const [repPassView, setRepPassView] = useState(false);

  //Mutatuion para registrar un nuevo administrador
  const [register] = useMutation(REGISTRAR_ADMIN, {
    onCompleted: () => {
      console.log("usuario administrador registrado");
      mostrarConfirmación();
      setErrorCorreo(false);
      setNombre("");
      setApellido("");
      setCorreo("");
      setNivel_auth("");
      setPassword("");
      setRepPassword("");
    },
    onError: (error) => {
      //si hay un error, borrar el token
      console.log(error);
      setErrorCorreo(true);
    },
  });

  //
  // * Función para comprobar que los datos introducidos son correctos.
  // * Realiza la mutatuion register.
  //
  function comprobarUser() {
    if (nombre == "") {
      setNoHayNombre(true);
      setnoHayApellido(false);
      setNoHayCorreo(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCorreoIncompleto(false);
      setNoHayNivelAuth(false);
    } else if (apellido == "") {
      setnoHayApellido(true);
      setNoHayNombre(false);
      setNoHayCorreo(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCorreoIncompleto(false);
      setNoHayNivelAuth(false);
    } else if (correo == "") {
      setNoHayCorreo(true);
      setNoHayNombre(false);
      setnoHayApellido(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCorreoIncompleto(false);
      setNoHayNivelAuth(false);
    } else if (nivel_auth == "") {
      setNoHayNivelAuth(true);
      setNoHayPassword(false);
      setNoHayNombre(false);
      setnoHayApellido(false);
      setNoHayCorreo(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCorreoIncompleto(false);
    } else if (password == "") {
      setNoHayPassword(true);
      setNoHayNombre(false);
      setnoHayApellido(false);
      setNoHayCorreo(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCorreoIncompleto(false);
      setNoHayNivelAuth(false);
    } else if (password != repPassword) {
      setErrorPasswordNoCoinciden(true);
      setNoHayNombre(false);
      setnoHayApellido(false);
      setErrorCorreo(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorCorreoIncompleto(false);
      setNoHayNivelAuth(false);
    } else if (errorPassword == false) {
      setNoHayNombre(false);
      setnoHayApellido(false);
      setNoHayCorreo(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCorreoIncompleto(false);
      setNoHayNivelAuth(false);
      register({
        variables: {
          nombre,
          apellido,
          correo,
          nivelAuth: nivel_auth,
          password,
        },
        context: {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        },
      });
    }
  }

  //
  // * Función para mostrar la confirmación del registro.
  //
  function mostrarConfirmación() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Usuario registrado",
      showConfirmButton: false,
      timer: 1500,
    });
  }

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-2xl font-semibold text-center underline">
          REGISTRAR ADMINISTRADOR
        </h1>

        {/* Si el email ya está registrado */}
        {errorCorreo && (
          <p className="flex justify-center text-red-500 text-xs italic mt-5">
            El email ya esta registrado
          </p>
        )}

        {/* Form que se usa para recoger los datos del nuevo usuario administrador */}
        {/* Llama a la funicón comprobarUser tras el submit */}
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            comprobarUser();
          }}
        >
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className={
                noHayNombre
                  ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                  : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
              }
            />

            {noHayNombre && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca su nombre
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className={
                noHayApellido
                  ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                  : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
              }
            />

            {noHayApellido && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca su apellido
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">Email</label>
            <input
              type="text"
              pattern="^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,4}(\.[a-zA-Z]{2})?$"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              onInvalid={() => {
                setErrorCorreoIncompleto(true);
              }}
              className={
                noHayCorreo
                  ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                  : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
              }
            />

            {noHayCorreo && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca un correo electrónico
              </p>
            )}

            {errorCorreoIncompleto && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca un correo electrónico valido
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Nivel de autorización
            </label>
            <input
              type="number"
              value={nivel_auth}
              onChange={(e) => setNivel_auth(e.target.value)}
              className={
                noHayNivelAuth
                  ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                  : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
              }
              maxLength={1}
              max={2}
            />

            {noHayNivelAuth && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca el nivel de autorización del usuario
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Contraseña
            </label>
            <div className="flex flex-row">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passView ? "text" : "password"}
                autoComplete="off"
                pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{7,16}$"
                onInvalid={() => {
                  setErrorPassword(true),
                    setNoHayPassword(false),
                    setErrorPasswordNoCoinciden(false);
                }}
                className={
                  noHayPassword
                    ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                    : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
                }
              />
              <div
                className="shadow appearance-none border rounded p-3 mt-2 bg-green-500 hover:bg-green-400"
                onClick={() => {
                  setPassView(!passView);
                }}
              >
                {passView && <AiFillEye />}
                {!passView && <AiFillEyeInvisible />}
              </div>
            </div>

            {noHayPassword && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca una contraseña
              </p>
            )}

            {errorPassword && (
              <p className="text-red-500 text-xs italic mt-3">
                Mínimo 8 caracteres y al menos una letra mayúscula, una minúscula y un
                número
              </p>
            )}
          </div>

          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">
              Repetir contraseña
            </label>
            <div className="flex flex-row">
              <input
                value={repPassword}
                onChange={(e) => setRepPassword(e.target.value)}
                type={repPassView ? "text" : "password"}
                autoComplete="off"
                className={
                  errorPasswordNoCoinciden
                    ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                    : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
                }
              />
              <div
                className="shadow appearance-none border rounded p-3 mt-2 bg-green-500 hover:bg-green-400"
                onClick={() => {
                  setRepPassView(!repPassView);
                }}
              >
                {repPassView && <AiFillEye />}
                {!repPassView && <AiFillEyeInvisible />}
              </div>
            </div>

            {errorPasswordNoCoinciden && (
              <p className="text-red-500 text-xs italic mt-3">
                Las contraseñas no coinciden
              </p>
            )}
          </div>

          {/* Boton submit, para realizar el registro */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
            >
              Registrar usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegistrarAdmin;
