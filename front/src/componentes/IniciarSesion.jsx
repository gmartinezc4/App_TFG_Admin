import React, { useContext, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Context } from '../context/Context'
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

const LOG_IN = gql`
  mutation Mutation($correo: String!, $password: String!) {
    logIn(correo: $correo, password: $password) {
      _id
      apellido
      email
      nivel_auth
      nombre
      password
      token
    }
  }
`;

function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errorUserOrPasswordIncorrect, setErrorUserOrPasswordIncorrect] = useState(false);
  const [noHayCorreo, setNoHayCorreo] = useState(false);
  const [noHayPassword, setNoHayPassword] = useState(false);
  const [passView, setPassView] = useState(false);

  const { changeReload, changeViewRecuperarPass1 } = useContext(Context);

  const [login] = useMutation(LOG_IN, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.logIn.token); //cuando se complete la mutation guardar el token
      localStorage.setItem("nivel_auth", data.logIn.nivel_auth); //guarda el nivel de autorización del admin
      console.log("me loggeo, token: " + localStorage.getItem("token"));

      changeReload();
      mostrarConfirmación();
    },
    onError: (error) => {
      //si hay un error, borrar el token
      console.log(error);
      localStorage.removeItem("token");
      setErrorUserOrPasswordIncorrect(true);
    },
  });

  function comprobarUser() {
    if (correo == "") {
      setNoHayCorreo(true);
      setNoHayPassword(false);
      setErrorUserOrPasswordIncorrect(false);
    } else if (password == "") {
      setNoHayPassword(true);
      setNoHayCorreo(false);
      setErrorUserOrPasswordIncorrect(false);
    } else {
      setNoHayPassword(false);
      setNoHayCorreo(false);
      login({
        variables: {
          correo,
          password,
        },
      });
    }
  }

  function mostrarConfirmación() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Bienvenido administrador',
      text: 'Nivel de autorización: ' + localStorage.getItem("nivel_auth"),
      showConfirmButton: false,
      timer: 2000
    });
  }

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center underline">ADMINISTRADOR</h1>

        {errorUserOrPasswordIncorrect && (
          <p className="flex justify-center text-red-500 text-xs italic mt-5">
            Correo o contraseña no validos
          </p>
        )}

        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            comprobarUser();
          }}
        >
          <div className="mb-2">
            <label className="block text-sm font-semibold text-gray-800">Email</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="true"
              className={
                noHayCorreo || errorUserOrPasswordIncorrect
                  ? "block w-full px-4 py-2 mt-2 bg-white border rounded-md border-red-500"
                  : "block w-full px-4 py-2 mt-2 bg-white border rounded-md"
              }
            />

            {noHayCorreo && (
              <p className="text-red-500 text-xs italic mt-3">
                Porfavor introduzca un correo electrónico
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
                className={
                  noHayPassword || errorUserOrPasswordIncorrect
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
          </div>
          <a
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 cursor-pointer"
            onClick={() => {
              changeViewRecuperarPass1(true);
            }}
          >
            Ha olvidado su contraseña?
          </a>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:bg-green-500"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IniciarSesion;
