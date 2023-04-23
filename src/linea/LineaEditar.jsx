import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    description: "Describe la línea de producto"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function LineaEditar({editLinea}) {
    

useEffect(()=>{
  reset(editLinea)
}, [editLinea])


const alerta = useContext(AlertaContext) 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset    
  } = useForm({mode:'onblur'});


  const onSubmit = async (lineaInfo) => {

    const ruta = url+"productlinea/"+editLinea.id;
    
    Swal.fire({
      title: '¿Estas Seguro?',
      text: `¿Quieres modificar: ${editLinea.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
  
         axios.put(ruta, lineaInfo).then((response) =>{
             if(response.status ===200){
                  Swal.fire(
                      '¡MODIFICO LA LÍNEA DE PRODUCTO!',
                      'La línea de Producto ha sido modificada correctamente',
                      'success'
                  )
                  alerta();
             } else {
                 Swal.fire(
                     '¡Error!',
                     'Hubo un problema al modificar la línea de producto',
                     'error'
                 )
             }
         })
  
        
      }
    })
  }
  


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="form-label">Nombre de la línea de Producto:</label>
        <input          
          name="name"
          type="text"
          placeholder="Línea de Producto"
          className={`form-control ${errors.name && "error" }`}        
          {...register("name", {
            required: messages.required,
            pattern: {
              value: patterns.name,
              message: messages.name
            }
          })}
        />
        {errors.name && <p className="text-danger">{errors.name.message}</p>}
  
        <label htmlFor="description" className="form-label">Descripción:</label>
        <input
          name="description"
          type="textarea"
          placeholder="Descripcción de la línea de Producto"
          className={`form-control ${errors.description && "error"}`}
          {...register("description", {
            required: messages.required,
            pattern: {
              value: patterns.description,
              message: messages.description
            }
          })}
        />
        {errors.email && <p className="text-danger">{errors.email.message}</p>}
  
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" className="btn btn-info">Modificar Línea de Producto</button>
        </div>  
    </form>
  );
}

