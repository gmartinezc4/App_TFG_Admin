import React, { useState, useContext } from "react";
import Modal from "react-modal";
import { Context } from "../context/Context";
import { gql, useMutation } from "@apollo/client";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";


const customStyles = {
  content: {
    position: "absolute",
    width: 400,
    backgrounColor: "white",
    boxShadow: "10px 5px 5px black",
    padding: "16px 32px 24px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
  },
};

const MODIFICAR_USER_ADMIN = gql`
  mutation Mutation(
    $nombre: String
    $apellido: String
    $newCorreo: String
    $password: String
    $newPassword: String
  ) {
    modificarUseraAdmin(
      nombre: $nombre
      apellido: $apellido
      newCorreo: $newCorreo
      password: $password
      newPassword: $newPassword
    ) {
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

function ModalesPerfilAdmin(props) {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [noHayNombre, setNoHayNombre] = useState(false);
  const [noHayApellido, setNoHayApellido] = useState(false);

  const [correo, setCorreo] = useState("");
  const [correoRep, setCorreoRep] = useState("");
  const [noHayCorreo, setNoHayCorreo] = useState(false);
  const [noHayCorreoRep, setNoHayCorreoRep] = useState(false);
  const [errorCorreoExistente, setErrorCorreoExistente] = useState(false);
  const [invalidCorreo, setInvalidCorreo] = useState(false);
  const [noCoincidenCorreos, setNoCoincidenCorreos] = useState(false);
  let invalidCorreo2 = false;

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRep, setNewPasswordRep] = useState("");
  const [noHayPassword, setNoHayPassword] = useState(false);
  const [noHayNewPassword, setNoHayNewPassword] = useState(false);
  const [noHayNewPasswordRep, setNoHayNewPasswordRep] = useState(false);
  const [errorNoCoincidenPasswords, setErrorNoCoincidenPasswords] = useState(false);
  const [errorOldNewPasswordsEquals, setErrorOldNewPasswordsEquals] = useState(false);
  const [errorPasswordIncorrecta, setErrorPasswordIcorrecta] = useState(false);
  const [invalidNewPassword, setInvalidNewPassword] = useState(false);
  let invalidNewPassword2 = false;

  const [passView, setPassView] = useState(false);
  const [passViewNew, setPassViewNew] = useState(false);
  const [passViewNewRep, setPassViewNewRep] = useState(false);

  const { changeReload } = useContext(Context);

  const [modificarUserAdmin] = useMutation(MODIFICAR_USER_ADMIN, {
    onCompleted: () => {
      setErrorPasswordIcorrecta(true);
      setErrorCorreoExistente(true);

      if (props.modalIsOpenNombreApellido) props.closeModalNombreApellido();
      if (props.modalIsOpenCorreo) props.closeModalCorreo();
      if (props.modalIsOpenPassword) props.closeModalPassword();

      changeReload();
      mostrarConfirmación() 
    },
    onError: (error) => {
      console.log(error.toString());
      if (error.toString() == "Error: Contraseña incorrecta") {
        setErrorPasswordIcorrecta(true);
        setErrorCorreoExistente(false);
      } else if (error.toString() == "Error: Email ya registrado") {
        setErrorCorreoExistente(true);
        setErrorPasswordIcorrecta(false);
      }
    },
  });

  function comprobarUserNombreApellido() {
    if (nombre == "" && apellido == "") {
      setNoHayNombre(true);
      setNoHayApellido(true);
    } else {
      setNoHayApellido(false);
      setNoHayNombre(false);

      modificarUserAdmin({
        context: {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        },
        variables: {
          nombre: nombre,
          apellido: apellido,
          newCorreo: correo,
          password: password,
          newPassword: newPassword,
        },
      });
    }
  }

  //falta el caso de cuando el correo existe y el de cuando la contraseña no es correcta
  function comprobarUserCorreo() {
    if (correo == "") {
      setNoHayCorreo(true);
      setNoHayCorreoRep(false);
      setErrorCorreoExistente(false);
      setNoCoincidenCorreos(false);
      setNoHayPassword(false);
      invalidCorreo2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (invalidCorreo2) {
      setNoHayCorreo(false);
      setNoHayCorreoRep(false);
      setErrorCorreoExistente(false);
      setNoCoincidenCorreos(false);
      setNoHayPassword(false);
      setErrorPasswordIcorrecta(false);
    } else if (correoRep == "") {
      setNoHayCorreoRep(true);
      setNoHayCorreo(false);
      setErrorCorreoExistente(false);
      setNoCoincidenCorreos(false);
      setNoHayPassword(false);
      invalidCorreo2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (correo != correoRep) {
      setNoCoincidenCorreos(true);
      setNoHayCorreo(false);
      setNoHayCorreoRep(false);
      setErrorCorreoExistente(false);
      setNoHayPassword(false);
      invalidCorreo2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (password == "") {
      setNoHayPassword(true);
      setNoCoincidenCorreos(false);
      setNoHayCorreo(false);
      setNoHayCorreoRep(false);
      setErrorCorreoExistente(false);
      invalidCorreo2 = false;
      setErrorPasswordIcorrecta(false);
    } else {
      setNoHayCorreo(false);
      setNoHayCorreoRep(false);
      setErrorCorreoExistente(false);
      setNoCoincidenCorreos(false);
      setNoHayPassword(false);
      invalidCorreo2 = false;
      setErrorPasswordIcorrecta(false);

      modificarUserAdmin({
        context: {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        },
        variables: {
          nombre: nombre,
          apellido: apellido,
          newCorreo: correo,
          password: password,
          newPassword: newPassword,
        },
      });
    }
  }

  function comprobarUserPassword() {
    if (password == "") {
      setNoHayPassword(true);
      setNoHayNewPassword(false);
      setNoHayNewPasswordRep(false);
      setErrorNoCoincidenPasswords(false);
      setErrorOldNewPasswordsEquals(false);
      invalidNewPassword2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (newPassword == "") {
      setNoHayNewPassword(true);
      setNoHayPassword(false);
      setNoHayNewPasswordRep(false);
      setErrorNoCoincidenPasswords(false);
      setErrorOldNewPasswordsEquals(false);
      invalidNewPassword2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (invalidNewPassword2) {
      setNoHayPassword(false);
      setNoHayNewPassword(false);
      setNoHayNewPasswordRep(false);
      setErrorNoCoincidenPasswords(false);
      setErrorOldNewPasswordsEquals(false);
      setErrorPasswordIcorrecta(false);
    } else if (newPasswordRep == "") {
      setNoHayNewPasswordRep(true);
      setNoHayPassword(false);
      setNoHayNewPassword(false);
      setErrorNoCoincidenPasswords(false);
      setErrorOldNewPasswordsEquals(false);
      invalidNewPassword2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (newPassword != newPasswordRep) {
      setErrorNoCoincidenPasswords(true);
      setNoHayPassword(false);
      setNoHayNewPassword(false);
      setNoHayNewPasswordRep(false);
      setErrorOldNewPasswordsEquals(false);
      invalidNewPassword2 = false;
      setErrorPasswordIcorrecta(false);
    } else if (password == newPassword) {
      setErrorOldNewPasswordsEquals(true);
      setNoHayPassword(false);
      setNoHayNewPassword(false);
      setNoHayNewPasswordRep(false);
      setErrorNoCoincidenPasswords(false);
      invalidNewPassword2 = false;
      setErrorPasswordIcorrecta(false);
    } else {
      setNoHayPassword(false);
      setNoHayNewPassword(false);
      setNoHayNewPasswordRep(false);
      setErrorNoCoincidenPasswords(false);
      setErrorOldNewPasswordsEquals(false);
      invalidNewPassword2 = false;
      setErrorPasswordIcorrecta(false);

      modificarUserAdmin({
        context: {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        },
        variables: {
          nombre: nombre,
          apellido: apellido,
          newCorreo: correo,
          password: password,
          newPassword: newPassword,
        },
      });
    }
  }

  function mostrarConfirmación() {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Cambios guardados con éxito',
      showConfirmButton: false,
      timer: 1500
    })
  }

  return (
    <div>
      {/* Modal Nombre y Apellido */}
      <Modal
        isOpen={props.modalIsOpenNombreApellido}
        onRequestClose={props.closeModalNombreApellido}
        style={customStyles}
        ariaHideApp={false}
      >
        <form
          className="p-3 flex flex-col justify-center"
          onSubmit={(event) => {
            event.preventDefault();
            comprobarUserNombreApellido();
          }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
          <input
            className={
              noHayNombre
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="Nombre..."
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            type="text"
            name="nombre"
          ></input>
          {noHayNombre && (
            <p className="text-red-500 text-xs italic mt-3">Porfavor introduzca el nuevo nombre</p>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">apellido</label>
          <input
            className={
              noHayApellido
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="Apellido..."
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            type="text"
            name="apellido"
          ></input>

          {noHayApellido && (
            <p className="text-red-500 text-xs italic mt-3">
              Porfavor introduzca el nuevo apellido
            </p>
          )}

          <div className="flex justify-between items-center mt-5">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Correo */}
      <Modal
        isOpen={props.modalIsOpenCorreo}
        onRequestClose={props.closeModalCorreo}
        style={customStyles}
        ariaHideApp={false}
      >
        {noCoincidenCorreos && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Los Emails tienen que coincidir
          </p>
        )}

        {errorCorreoExistente && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            El email ya esta registrado
          </p>
        )}

        {errorPasswordIncorrecta && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Contraseña incorrecta
          </p>
        )}

        <form
          className="p-3 flex flex-col justify-center"
          onSubmit={(event) => {
            event.preventDefault();
            comprobarUserCorreo();
          }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2">Nuevo Correo</label>
          <input
            className={
              noHayCorreo || (noCoincidenCorreos && correoRep != "") || errorCorreoExistente
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="Correo electrónico..."
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value),
                setNoCoincidenCorreos(false),
                setInvalidCorreo(false),
                setErrorCorreoExistente(false);
            }}
            type="text"
            name="correo"
            pattern="[a-zA-Z0-9!#$%&'*_+-]([\.]?[a-zA-Z0-9!#$%&'*_+-])+@[a-zA-Z0-9]([^@&%$\/()=?¿!.,:;]|\d)+[a-zA-Z0-9][\.][a-zA-Z]{2,4}([\.][a-zA-Z]{2})?"
            onInvalid={() => {
              {
                (invalidCorreo2 = true), setInvalidCorreo(true), comprobarUserCorreo();
              }
            }}
          ></input>
          {noHayCorreo && (
            <p className="text-red-500 text-xs italic mt-3">Porfavor introduzca el nuevo email</p>
          )}

          {invalidCorreo && (
            <p className="text-red-500 text-xs italic mt-3">
              Porfavor introduzca un correo electrónico valido
            </p>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">
            Repetir Nuevo Correo
          </label>
          <input
            className={
              noHayCorreoRep || noCoincidenCorreos
                ? "shadow appearance-none border rounded p-2 border-red-500"
                : "shadow appearance-none border rounded p-2"
            }
            placeholder="Correo electrónico..."
            value={correoRep}
            onChange={(e) => {
              setCorreoRep(e.target.value), setNoCoincidenCorreos(false), setNoHayCorreoRep(false);
            }}
            type="text"
            name="correoRep"
          ></input>
          {noHayCorreoRep && (
            <p className="text-red-500 text-xs italic mt-3">
              Porfavor introduzca de nuevo el email
            </p>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">Contraseña</label>
          <div className="flex flex-row items-center">
            <input
              className={
                noHayPassword
                  ? "shadow appearance-none border rounded p-2 border-red-500"
                  : "shadow appearance-none border rounded p-2"
              }
              placeholder="******************"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value),
                  setNoHayPassword(false),
                  setErrorPasswordIcorrecta(false);
              }}
              type={passView ? "text" : "password"}
              name="password"
              autoComplete="off"
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
            <p className="text-red-500 text-xs italic mt-3">Porfavor introduzca una contraseña</p>
          )}

          <div className="flex justify-between items-center mt-5">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Password */}
      <Modal
        isOpen={props.modalIsOpenPassword}
        onRequestClose={props.closeModalPassword}
        style={customStyles}
        ariaHideApp={false}
      >
        {errorNoCoincidenPasswords && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Las nuevas contraseñas tienen que coincidir
          </p>
        )}

        {errorOldNewPasswordsEquals && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            La contraseña nueva no puede ser igual a la anterior
          </p>
        )}

        {errorPasswordIncorrecta && (
          <p className="text-red-500 text-xs italic mt-3 flex justify-center">
            Contraseña incorrecta
          </p>
        )}

        <form
          className="p-3 flex flex-col justify-center"
          onSubmit={(event) => {
            event.preventDefault();
            comprobarUserPassword();
          }}
        >
          <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">Contraseña</label>
          <div className="flex flex-row items-center">
            <input
              className={
                noHayPassword || errorOldNewPasswordsEquals || errorPasswordIncorrecta
                  ? "shadow appearance-none border rounded p-2 border-red-500"
                  : "shadow appearance-none border rounded p-2"
              }
              placeholder="******************"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value),
                  setErrorNoCoincidenPasswords(false),
                  setNoHayPassword(false),
                  setErrorPasswordIcorrecta(false);
              }}
              type={passView ? "text" : "password"}
              name="password"
              autoComplete="off"
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
            <p className="text-red-500 text-xs italic mt-3">Porfavor introduzca una contraseña</p>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">
            Nueva Contraseña
          </label>
          <div className="flex flex-row items-center">
            <input
              className={
                noHayNewPassword || errorNoCoincidenPasswords || errorOldNewPasswordsEquals
                  ? "shadow appearance-none border rounded p-2 border-red-500"
                  : "shadow appearance-none border rounded p-2"
              }
              placeholder="******************"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value),
                  setNoHayNewPassword(false),
                  setInvalidNewPassword(false);
              }}
              type={passViewNew ? "text" : "password"}
              name="newPassword"
              autoComplete="off"
              pattern="^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{7,16}$"
              onInvalid={() => {
                {
                  (invalidNewPassword2 = true),
                    setInvalidNewPassword(true),
                    comprobarUserPassword();
                }
              }}
            ></input>
            <div
              className="shadow appearance-none border rounded p-3 bg-green-300 hover:bg-green-500"
              onClick={() => {
                setPassViewNew(!passViewNew);
              }}
            >
              {passViewNew && <AiFillEye />}
              {!passViewNew && <AiFillEyeInvisible />}
            </div>
          </div>

          {noHayNewPassword && (
            <p className="text-red-500 text-xs italic mt-3">Porfavor introduzca una contraseña</p>
          )}

          {invalidNewPassword && (
            <p className="text-red-500 text-xs italic mt-3">
              Mínimo 8 caracteres y al menos una letra mayúscula, una minúscula y un número
            </p>
          )}

          <label className="block text-gray-700 text-sm font-bold mb-2 mt-5">
            Repetir Nueva Contraseña
          </label>
          <div className="flex flex-row items-center">
            <input
              className={
                noHayNewPasswordRep || errorNoCoincidenPasswords
                  ? "shadow appearance-none border rounded p-2 border-red-500"
                  : "shadow appearance-none border rounded p-2"
              }
              placeholder="******************"
              value={newPasswordRep}
              onChange={(e) => {
                setNewPasswordRep(e.target.value),
                  setErrorNoCoincidenPasswords(false),
                  setNoHayNewPasswordRep(false);
              }}
              type={passViewNewRep ? "text" : "password"}
              name="newPasswordRep"
              autoComplete="off"
            ></input>
            <div
              className="shadow appearance-none border rounded p-3 bg-green-300 hover:bg-green-500"
              onClick={() => {
                setPassViewNewRep(!passViewNewRep);
              }}
            >
              {passViewNewRep && <AiFillEye />}
              {!passViewNewRep && <AiFillEyeInvisible />}
            </div>
          </div>

          {noHayNewPasswordRep && (
            <p className="text-red-500 text-xs italic mt-3">Porfavor introduzca una contraseña</p>
          )}

          <div className="flex justify-between items-center mt-5">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ModalesPerfilAdmin;
