import axios from "axios";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
  };
  
  
  const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
  };

export default function BasicosEdit ({modBasico}){
    
    useEffect(()=>{
        reset(modBasico)
    }, [modBasico])

    const alerta = useContext(AlertaContext) 

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
      } = useForm({mode:'onblur'});

    const onSubmit = async (basicoInfo) => {
        const rutam=url+"basicos/"+modBasico.id
        
        Swal.fire({
          title: '¿Estas Seguro(a)?',
          text: `¿Quieres modificar los datos básicos?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, estoy seguro(a)!'
        }).then((result) => {
          if (result.isConfirmed) {
                
             axios.put(rutam, basicoInfo).then((response) =>{
                 if(response.status ===200){
                      Swal.fire(
                          '¡MODIFICO LOS DATOS BÁSICOS!',
                          'Los datos han sido actualizados correctamente',
                          'success'
                      )
                      alerta()
                      
                 } else {
                     Swal.fire(
                         '¡Error!',
                         'Hubo un problema al modificar los datos',
                         'error'
                     )
                 }
             })
      
            
          }
        })
      }

    
    return(
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name" className="form-label">Nombre de la Empresa:</label>
                <input          
                name="name"
                type="text"
                placeholder="Nombre Empresa"
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
        
                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                <input
                name="email"
                type="email"
                placeholder="correo de la empresa"
                className={`form-control ${errors.email && "error"}`}
                {...register("email", {
                    required: messages.required,
                    pattern: {
                    value: patterns.email,
                    message: messages.email
                    }
                })}
                />
                {errors.email && <p className="text-danger">{errors.email.message}</p>}
        
                <label htmlFor="adress" className="form-label">Dirección:</label>
                <input
                name="adress"
                type="text"
                placeholder="Dirección de la Empresa"
                className={`form-control ${errors.adress && "error"}`}
                {...register("adress", {
                    required: messages.required,                    
                    pattern: {
                    value: patterns.adress,
                    message: messages.adress
                    }
                })}
                />
                {errors.adress && <p className="text-danger">{errors.adress.message}</p>}

                <label htmlFor="ciudad" className="form-label">Ciudad:</label>
                <input
                name="ciudad"
                type="text"
                placeholder="Ciudad de ubicación de la Empresa"
                className={`form-control ${errors.ciudad && "error"}`}
                {...register("ciudad", {
                    required: messages.required,                    
                    pattern: {
                    value: patterns.ciudad,
                    message: messages.ciudad
                    }
                })}
                />
                {errors.ciudad && <p className="text-danger">{errors.ciudad.message}</p>}

                <label htmlFor="phone" className="form-label">Teléfono:</label>
                <input
                name="phone"
                type="text"
                placeholder="Telefóno de la Empresa"
                className={`form-control ${errors.phone && "error"}`}
                {...register("phone", {
                    required: messages.required,                    
                    pattern: {
                    value: patterns.phone,
                    message: messages.phone
                    }
                })}
                />
                {errors.phone && <p className="text-danger">{errors.phone.message}</p>}

                <label htmlFor="actividad" className="form-label">Actividad Económica:</label>
                <input
                name="actividad"
                type="text"
                placeholder="Actividad Económica"
                className={`form-control ${errors.actividad && "error"}`}
                {...register("actividad", {
                    required: messages.required,                    
                    pattern: {
                    value: patterns.actividad,
                    message: messages.actividad
                    }
                })}
                />
                {errors.actividad && <p className="text-danger">{errors.actividad.message}</p>}

                <label htmlFor="representante" className="form-label">Representante:</label>
                <input
                name="representante"
                type="text"
                placeholder="Nombre del representante legal"
                className={`form-control ${errors.representante && "error"}`}
                {...register("representante", {
                    required: messages.required,                    
                    pattern: {
                    value: patterns.representante,
                    message: messages.representante
                    }
                })}
                />
                {errors.representante && <p className="text-danger">{errors.representante.message}</p>}

                <label htmlFor="resolucion" className="form-label">Resolución de Facturación:</label>
                <input
                name="resolucion"
                type="text"
                placeholder="Resolución de Facturación"
                className={`form-control ${errors.resolucion && "error"}`}
                {...register("resolucion", {
                    required: messages.required,                    
                    pattern: {
                    value: patterns.resolucion,
                    message: messages.resolucion
                    }
                })}
                />
                {errors.resolucion && <p className="text-danger">{errors.resolucion.message}</p>}
                
                <button type="submit" className="btn btn-info">Modificar</button>
            </form>
        </>
    )
}