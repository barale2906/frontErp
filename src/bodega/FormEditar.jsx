import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
  required: "Este campo es obligatorio",
  name: "El formato introducido no es el correcto",
  email: "Debes introducir un email correcta",
  phone: "Debes introducir un número correcto",
  adress: "Se requiere la dirección"
};


const patterns = {
  //name: /^[A-Za-z]+$/i,
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  phone: /^[0-9]+$/i
};

export default function FormEditar({preloadedValues}) {
  
  const alerta = useContext(AlertaContext)  

useEffect(()=>{
  reset(preloadedValues)
}, [preloadedValues])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset    
  } = useForm({mode:'onblur'});



  const onSubmit = async (userInfo) => {

    const ruta = url+"bodega/"+preloadedValues.id;
    
    Swal.fire({
      title: '¿Estas Seguro?',
      text: `¿Quieres modificar: ${preloadedValues.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
  
         axios.put(ruta, userInfo).then((response) =>{
             if(response.status ===200){
                  Swal.fire(
                      '¡MODIFICO LA BODEGA!',
                      'La bodega ha sido modificada correctamente',
                      'success'
                  )
                  alerta();
             } else {
                 Swal.fire(
                     '¡Error!',
                     'Hubo un problema al modificar la bodega',
                     'error'
                 )
             }
         })
  
        
      }
    })
  }
  


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name" className="form-label">Nombre Completo:</label>
      <input
        readOnly
        name="name"
        type="text"
        className={`form-control ${errors.name && "error" }`}        
        {...register("name", {
          required: messages.required,
          pattern: {
            value: patterns.name,
            message: messages.name
          }
        })}
      />
      {errors.name && <p>{errors.name.message}</p>}

      <label htmlFor="email" className="form-label">Correo Electrónico:</label>
      <input
        name="email"
        type="email"
        className={`form-control ${errors.email && "error"}`}
        {...register("email", {
          required: messages.required,
          pattern: {
            value: patterns.email,
            message: messages.email
          }
        })}
      />
      {errors.email && <p>{errors.email.message}</p>}

      <label htmlFor="phone" className="form-label">Teléfono:</label>
      <input
        name="phone"
        type="text"
        placeholder="+34"
        className={`form-control ${errors.phone && "error"}`}
        {...register("phone", {
          required: messages.required,
          minLength: {
            value: 7,
            message: messages.phone
          },
          maxLength: {
            value: 10,
            message: messages.phone
          },
          pattern: {
            value: patterns.phone,
            message: messages.phone
          }
        })}
      />
      {errors.phone && <p>{errors.phone.message}</p>}

      <label htmlFor="adress" className="form-label">Dirección: </label>
      <input
        name="adress"
        type="text"
        placeholder="Dirección"
        className={`form-control ${errors.adress && "error"}`}
        {...register("adress", {
          required: messages.required,
          pattern: {
            value: patterns.adress,
            message: messages.adress
          }
        })}
      />
      {errors.adress && <p>{errors.adress.message}</p>}
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" className="btn btn-info">Actualizar Bodega</button>
      </div>

    </form>
  );
}

