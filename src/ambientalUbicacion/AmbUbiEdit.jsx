import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
  required: "Este campo es obligatorio",
  name: "El formato introducido no es el correcto"
};


const patterns = {
  //name: /^[A-Za-z]+$/i,
  email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
  
};

export default function AmbUbiEdit({editUbicas}) {
    

useEffect(()=>{
  reset(editUbicas)
}, [editUbicas])


const alerta = useContext(AlertaContext) 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset    
  } = useForm({mode:'onblur'});


  const onSubmit = async (ubicaInfo) => {

    const ruta = url+"ambientalubi/"+editUbicas.id;
    
    Swal.fire({
      title: '¿Estas Seguro?',
      text: `¿Quieres modificar: ${editUbicas.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, estoy seguro!'
      
    }).then((result) => {
      if (result.isConfirmed) {
          
         axios.put(ruta, ubicaInfo).then((response) =>{
             if(response.status ===200){
                  Swal.fire(
                      '¡MODIFICO LA UBICACIÓN!',
                      'La ubicación ha sido modificado correctamente',
                      'success'
                  )
                  alerta();
             } else {
                 Swal.fire(
                     '¡Error!',
                     'Hubo un problema al modificar la ubicación',
                     'error'
                 )
             }
         })
  
        
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="form-label">Nombre:</label>
        <input          
          name="name"
          type="text"
          placeholder="Nombre Ubicación"
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
  
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" className="btn btn-info">Editar Ubicación</button>
        </div>
  
      </form>
  );
}

