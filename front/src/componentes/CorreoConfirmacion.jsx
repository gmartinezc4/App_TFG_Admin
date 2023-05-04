import React, { useContext, useRef, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { Context } from "../context/Context";
import Swal from "sweetalert2";

function CorreoConfirmacion(props) {
    const form = useRef();

    const { changeEnviarCorreoConfirmacion } = useContext(Context);
  
    const sendEmail = () => {
  
      emailjs
        .sendForm("Maderas_Cobo_Gmail_2", "template_8o6xvcp", form.current, "YhNbt1A31RmKQ6mNB")
        .then(
          (result) => {
            console.log(result.text);
            changeEnviarCorreoConfirmacion(false);
          },
          (error) => {
            console.log(error.text);
            changeEnviarCorreoConfirmacion(false);
          }
        );
    };
  
    let importeFreeIva_redonded = props.pedido.importeFreeIvaPedido.toString();
    let fecha = new Date();
    let fechaHoy = (fecha.getDate() + "/" + (fecha.getMonth() + 1 ) + "/" + fecha.getFullYear());
  
  function mostrarModal(){
    Swal.fire({
      title: "Correo de confirmación",
      text: "Se le va a enviar un correo de confirmación al usuario",
      icon: "success",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Aceptar",
    }).then(() => {
        sendEmail();
    });
  }
  
    return (
      <div>
        <form
          ref={form}
          onSubmit={(e) => {
            e.preventDefault();
            sendEmail();
          }}
          className="flex flex-col mt-8 w-96"
        >
          {props.pedido.estado == "Activo" && (
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
                name="mensaje"
                defaultValue={
                  "Tu pedido se ha REACTIVADO, ¡Esperamos que hayas disfrutado al comprar con nosotros! Recuerda que tenienes 7 días hábiles para recogerlo."
                }
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
              <input
                type="text"
                name="num_pedido"
                defaultValue={props.pedido._id}
                hidden
              />
              <input
                type="text"
                name="subtotal"
                defaultValue={importeFreeIva_redonded.substring(0, 5)}
                hidden
              />
              <input
                type="text"
                name="total"
                defaultValue={props.pedido.importePedido}
                hidden
              />
            </div>
          )}

          {props.pedido.estado == "Pendiente" && (
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
                defaultValue={"Fecha de recogida"}
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
                name="mensaje"
                defaultValue={
                  "Ya puedes RECOGER tu pedido, ¡Esperamos que hayas disfrutado al comprar con nosotros! Recuerda que tenienes 7 días hábiles para recogerlo."
                }
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
              <input
                type="text"
                name="num_pedido"
                defaultValue={props.pedido._id}
                hidden
              />
              <input
                type="text"
                name="subtotal"
                defaultValue={importeFreeIva_redonded.substring(0, 5)}
                hidden
              />
              <input
                type="text"
                name="total"
                defaultValue={props.pedido.importePedido}
                hidden
              />
            </div>
          )}

          {props.pedido.estado == "Cancelado" && (
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
                defaultValue={"Fecha de cancelación"}
                hidden
              />
              <input
                type="text"
                name="fecha_recogida"
                defaultValue={fechaHoy}
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
                name="mensaje"
                defaultValue={
                  "Tu pedido se ha CANCELADO, ¡Esperamos que hayas disfrutado al comprar con nosotros! Cualquier problema puedes ponerte en contacto con nosotros."
                }
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
              <input
                type="text"
                name="fecha_compra"
                defaultValue={props.pedido.fechaPedido}
                hidden
              />
              <input
                type="text"
                name="num_pedido"
                defaultValue={props.pedido._id}
                hidden
              />
              <input
                type="text"
                name="subtotal"
                defaultValue={importeFreeIva_redonded.substring(0, 5)}
                hidden
              />
              <input
                type="text"
                name="total"
                defaultValue={props.pedido.importePedido}
                hidden
              />
            </div>
          )}

          {props.pedido.estado == "Recogido" && (
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
                defaultValue={"Fecha de la recogida"}
                hidden
              />
              <input
                type="text"
                name="fecha_recogida"
                defaultValue={fechaHoy}
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
                name="mensaje"
                defaultValue={
                  "Tu pedido se ha RECOGIDO, ¡Esperamos que hayas disfrutado al comprar con nosotros!."
                }
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
              <input
                type="text"
                name="fecha_compra"
                defaultValue={props.pedido.fechaPedido}
                hidden
              />
              <input
                type="text"
                name="num_pedido"
                defaultValue={props.pedido._id}
                hidden
              />
              <input
                type="text"
                name="subtotal"
                defaultValue={importeFreeIva_redonded.substring(0, 5)}
                hidden
              />
              <input
                type="text"
                name="total"
                defaultValue={props.pedido.importePedido}
                hidden
              />
            </div>
          )}
        </form>
        {mostrarModal()}
      </div>
    );
}

export default CorreoConfirmacion