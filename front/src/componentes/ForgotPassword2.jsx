import React, { useState, useContext, useRef } from "react";
import { useMutation, gql } from "@apollo/client";
import Swal from "sweetalert2";
import { Context } from "../context/Context";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import ReCAPTCHA from "react-google-recaptcha";

const RECUPERAR_PASS_2 = gql`
  mutation Mutation($email: String!, $password: String!) {
    recuperarPass(email: $email, password: $password)
  }
`;

function ForgotPassword2() {
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");
  const [codigo, setCodigo] = useState("");
  const [errorCodigo, setErrorCodigo] = useState(false);
  const [noHayCodigo, setNoHayCodigo] = useState(false);
  const [noHayPassword, setNoHayPassword] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorPasswordNoCoinciden, setErrorPasswordNoCoinciden] = useState(false);

  const [passView, setPassView] = useState(false);
  const [repPassView, setRepPassView] = useState(false);

  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const captchaRef = useRef(null)
  let tokenCaptcha;

  const { changeReload, emailUserRecuperaPass, changeViewRecuperarPass2 } =
    useContext(Context);

  const [recuperarPassword] = useMutation(RECUPERAR_PASS_2, {
    onCompleted: () => {
      mostrarConfirmación();
      captchaRef.current.reset();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function mostrarConfirmación() {
    Swal.fire({
      icon: "success",
      title: "!Enorabuena!",
      text: "Contraseña cambiada con éxito",
    });

    changeViewRecuperarPass2(false);
    changeReload();
  }

  function comprobarUser() {
    if (password == "") {
      setNoHayPassword(true);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCodigo(false);
      setNoHayCodigo(false);
      setErrorCaptcha(false);
    } else if (password != repPassword) {
      setErrorPasswordNoCoinciden(true);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorCodigo(false);
      setNoHayCodigo(false);
      setErrorCaptcha(false);
    } else if (codigo == "") {
      console.log("hols");
      setNoHayCodigo(true);
      setErrorPasswordNoCoinciden(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorCodigo(false);
      setErrorCaptcha(false);
    } else if (codigo != localStorage.getItem("codigoRecuperacion")) {
      setErrorCodigo(true);
      setErrorPasswordNoCoinciden(false);
      setNoHayPassword(false);
      setErrorPassword(false);
      setNoHayCodigo(false);
      setErrorCaptcha(false);
    }else if (tokenCaptcha == ""){
      setErrorCaptcha(true);
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCodigo(false);
      setNoHayCodigo(false);
    } else {
      setNoHayPassword(false);
      setErrorPassword(false);
      setErrorPasswordNoCoinciden(false);
      setErrorCodigo(false);
      setNoHayCodigo(false);
      setErrorCaptcha(false);
      recuperarPassword({
        variables: {
          email: emailUserRecuperaPass,
          password: password,
        },
      });
    }
  }

  return (
    <div className="mt-20 mb-60">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          tokenCaptcha = captchaRef.current.getValue();
          comprobarUser();
        }}
      >
        <label className="text-gray-700 text-sm font-bold mt-5 mb-2 flex justify-center">
          Nueva Contraseña
        </label>
        <div className="flex flex-row items-center justify-center mb-5">
          <input
            className={
              noHayPassword
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="******************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={passView ? "text" : "password"}
            name="password"
            autoComplete="off"
            pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{7,16}$"
            onInvalid={() => {
              setErrorPassword(true),
                setNoHayPassword(false),
                setErrorPasswordNoCoinciden(false),
                setNoHayCodigo(false),
                setErrorCodigo(false);
            }}
          ></input>
          <div
            className="shadow appearance-none border rounded p-3 bg-green-300 hover:bg-green-500"
            onClick={() => {
              setPassView(!passView);
            }}
          >
            {passView && <AiFillEye />}
            {!passView && <AiFillEyeInvisible />}
          </div>
        </div>

        {noHayPassword && (
          <p className="text-red-500 text-xs italic flex justify-center">
            Porfavor, elija una contraseña
          </p>
        )}
        {errorPassword && (
          <p className="text-red-500 text-xs italic flex justify-center">
            Mínimo 8 caracteres y al menos una letra mayúscula, una minúscula y
            un número
          </p>
        )}

        <label className="text-gray-700 text-sm font-bold mt-5 mb-2 flex justify-center">
          Repetir Contraseña
        </label>
        <div className="flex flex-row items-center justify-center mb-5">
          <input
            className={
              errorPasswordNoCoinciden
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="******************"
            value={repPassword}
            onChange={(e) => setRepPassword(e.target.value)}
            type={repPassView ? "text" : "password"}
            name="repPassword"
            autoComplete="off"
          ></input>
          <div
            className="shadow appearance-none border rounded p-3 bg-green-300 hover:bg-green-500"
            onClick={() => {
              setRepPassView(!repPassView);
            }}
          >
            {repPassView && <AiFillEye />}
            {!repPassView && <AiFillEyeInvisible />}
          </div>
        </div>

        {errorPasswordNoCoinciden && (
          <p className="text-red-500 text-xs italic flex justify-center mb-3">
            Las contraseñas no coinciden
          </p>
        )}

        <label className="text-gray-700 text-sm font-bold mb-2 flex justify-center">
          Codigo de Recuperción
        </label>
        <div className="flex justify-center">
          <input
            className={
              noHayCodigo
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="Codigo de recuperación..."
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            type="text"
            name="codigo"
            maxLength={4}
            autoComplete="off"
          ></input>
        </div>

        {noHayCodigo && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Porfavor, introduzca el código de recuperción
          </p>
        )}

        {errorCodigo && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Porfavor, introduzca el código de recuperción válido
          </p>
        )}

        <div className="flex justify-center mt-6">
          <ReCAPTCHA
            sitekey={"6LdjHoElAAAAAOgUQ_f2lvuGG52lSZCEDdcXUqgT"}
            ref={captchaRef}
          />
        </div>

        {errorCaptcha && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Porfavor, marque la casilla
          </p>
        )}

        <div className="flex justify-center mt-5">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline "
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword2;