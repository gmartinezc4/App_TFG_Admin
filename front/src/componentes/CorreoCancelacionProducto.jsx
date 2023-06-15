import React, { useContext, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

//
// * Componente CorreoCancelación
// * Se encarga de enviar correos de cancelación de productos
//
// * props: producto
//
function CorreoCancelacionProducto(props) {
  const form = useRef();

  // Variables de contexto usadas
  const { changeEnviarCorreoCancelacion } = useContext(Context);

  //
  // * Función que envia el email de confirmación al email del usuario.
  //
  const sendEmail = () => {
    emailjs
      .sendForm(
        "Maderas_Cobo_Gmail_2",
        "template_bzpt4b1",
        form.current,
        "YhNbt1A31RmKQ6mNB"
      )
      .then(
        (result) => {
          console.log(result.text);
          changeEnviarCorreoCancelacion(false);
        },
        (error) => {
          console.log(error.text);
          changeEnviarCorreoCancelacion(false);
        }
      );
  };

  let importeFreeIva_redonded = props.pedido.importeFreeIvaPedido.toString();

  console.log(props.pedido.importePedido )
  console.log(props.producto.precioTotal)
  
  let nuevo_importe = props.pedido.importePedido - props.producto.precioTotal;
  let nuevo_importe_freeIVA = props.pedido.importeFreeIvaPedido.toString() - props.producto.precioTotal_freeIVA.toString();
  
  console.log(nuevo_importe_freeIVA)
  //
  // * Función que muestra que el email de confirmación se ha enviado.
  // * Tras mostrar la confirmación envia el email.
  //
  function mostrarModal() {
    Swal.fire({
      title: "Correo de cancelación",
      text: "Se le va a enviar un correo de cancelación del producto al usuario",
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      sendEmail();
    });
  }

  return (
    <div>
      {/* form que utiliza EmailJs para recoger los datos y enviarlos en el correo */}
      <form
        ref={form}
        onSubmit={(e) => {
          e.preventDefault();
          sendEmail();
        }}
        className="flex flex-col mt-8 w-96"
      >
          <div>
            <input
              type="text"
              name="user_email"
              defaultValue={props.pedido.email}
              hidden
            />
            <input
              type="text"
              name="fecha_recogida_titulo"
              defaultValue={"Fecha estimada de recogida"}
              hidden
            />
            <input
              type="text"
              name="fecha_recogida"
              defaultValue={props.pedido.fechaRecogida}
              hidden
            />
            <input
              type="text"
              name="user_name"
              defaultValue={props.pedido.nombre + " " + props.pedido.apellido}
              hidden
            />
            <input
              type="text"
              name="nombre_Producto"
              defaultValue={props.producto.name}
              hidden
            />
            <input
              type="text"
              name="direccion"
              defaultValue={props.pedido.direccion}
              hidden
            />
            {props.pedido.masInformacion != "" && (
              <input
                type="text"
                name="d_adicional"
                defaultValue={", " + props.pedido.masInformacion}
                hidden
              />
            )}

            <input
              type="text"
              name="codigoPostal_Ciudad"
              defaultValue={props.pedido.codigoPostal}
              hidden
            />
            <input type="text" name="pais" defaultValue={props.pedido.pais} hidden />
            <input
              type="text"
              name="punto_recogida1"
              defaultValue={
                "Recuerda que el pedido hay que recogerlo en la siguiente dirección:"
              }
              hidden
            />
            <input
              type="text"
              name="punto_recogida2"
              defaultValue={"Casa de Moya, 16740 La Almarcha, Cuenca"}
              hidden
            />
            <input
              type="text"
              name="fecha_compra"
              defaultValue={props.pedido.fechaPedido}
              hidden
            />
            <input type="text" name="num_pedido" defaultValue={props.pedido._id} hidden />
            <input
              type="text"
              name="subtotal"
              defaultValue={nuevo_importe_freeIVA.toPrecision(5)}
              hidden
            />
            <input
              type="text"
              name="total"
              defaultValue={nuevo_importe}
              hidden
            />
          </div>
      </form>

      {/* Llama a la función mostrarModal */}
      {mostrarModal()}
    </div>
  );
}

export default CorreoCancelacionProducto;
