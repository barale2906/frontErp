import axios from "axios";
import md5 from "md5";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    email: "Debes introducir un email correcta",
    password: "Digite mínimo 8 caracteres"    
  };
  
  
  const patterns = {
    //name: /^[A-Za-z]+$/i,
    email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
  };

export default function UsuEdit({editUser}) {

const [bodegas, setBodegas] = useState([])
const [pend,setPend]=useState(0)
const rutap = url+"bodega"; 
  

useEffect(()=>{
  reset(editUser)
  axiosBodega();
  verificaPendientesCaja()
}, [editUser])


 // Seleccionar bodegas
 const axiosBodega = async () => {
        

  await axios.get(rutap)
  .then((res)=>{
  
      setBodegas(res.data);
  
  })
  .catch((error)=>{
      console.log(error)
  })
};

//Verificar que no tenga pendiente cerrar caja en la actual bodega
const verificaPendientesCaja = async()=>{
  if(editUser){
    const urlm=url+"efectivo/"+editUser.id+"/user"
    await axios.get(urlm)
    .then((res)=>{        
      if(res.data.length>0){
        setPend(1)
      } else {
        setPend(0)
      }              
    })
    .catch((error)=>{
        console.log(error)
    })
  }
  
}


const alerta = useContext(AlertaContext) 

const {
  register,
  handleSubmit,
  formState: { errors },
  reset    
} = useForm({mode:'onblur'});


  const onSubmit = async (userInfo) => {

    const datos={
      "email":userInfo.email,
      "password":md5(userInfo.password),
      "bodega":userInfo.bodega,
      "rol":userInfo.rol
    }

    const ruta = url+"user/"+editUser.id;
    
    Swal.fire({
      title: '¿Estas Seguro?',
      text: `¿Quieres modificar: ${editUser.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
  
         axios.put(ruta, datos).then((response) =>{
             if(response.status ===200){
                  Swal.fire(
                      '¡MODIFICO EL USUARIO!',
                      'El Usuario ha sido modificado correctamente',
                      'success'
                  )
                  alerta();
             } else {
                 Swal.fire(
                     '¡Error!',
                     'Hubo un problema al modificar el usuario',
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
          name="name"
          type="text"
          placeholder="Nombre Usuario"
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
          placeholder="Correo Electrónico"
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
  
        <label htmlFor="phone" className="form-label">Contraseña:</label>
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          className={`form-control ${errors.password && "error"}`}
          {...register("password", {
            required: messages.required,
            minLength: {
              value: 8,
              message: messages.password
            },
            pattern: {
              value: patterns.password,
              message: messages.password
            }
          })}
        />
        {errors.password && <p className="text-danger">{errors.password.message}</p>}

        <label htmlFor="bodega" className="form-label">Bodega del usuario</label>
        {
          pend===0 ?
            <select          
                name="bodega"                                
                className={`form-control ${errors.bodega && "error" }`}        
                {...register("bodega", {
                    required: messages.required,
                    pattern: {
                    value: patterns.bodega,
                    message: messages.bodega
                    }
                })}
            >                                
                <option value=""></option>
                {bodegas.map((bodega)=>(                                        
                    <option value={bodega.id} key={bodega.id}>{bodega.name}</option>                                     
                ))}
            </select> :
          <>
            <p>No puede cambiar de bodega hasta no cerrar caja.</p>
              <input
                name="bodega"
                type="hidden"
                
                className={`form-control ${errors.bodega && "error"}`}
                {...register("bodega", {
                  required: messages.required,
                  pattern: {
                    value: patterns.bodega,
                    message: messages.bodega
                  }
                })}
              />
          </>
        }
        
        {errors.bodega && <p className="text-danger">{errors.bodega.message}</p>}

        <label htmlFor="rol" className="form-label">Rol del usuario</label>
        <select          
            name="rol"                                
            className={`form-control ${errors.rol && "error" }`}        
            {...register("rol", {
                required: messages.required,
                pattern: {
                value: patterns.rol,
                message: messages.rol
                }
            })}
        >                                
            <option value="1">Operador</option>
            <option value="2">Administrador</option>
            <option value="3">Super Usuario</option>            
        </select>
        {errors.rol && <p className="text-danger">{errors.rol.message}</p>}
  
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" className="btn btn-info">Modificar Usuario</button>
        </div>
  
      </form>
  );
}

