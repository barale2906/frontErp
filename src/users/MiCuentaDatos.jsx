import axios from "axios";
import md5 from "md5";
import { useEffect } from "react"
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
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

export default function MiCuentaDatos({sesionUser}){
     
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
      } = useForm({mode:'onblur'});

    useEffect(()=>{
        reset(sesionUser)
      }, [sesionUser])
  
      
      
      
        const onSubmit = async (userInfo) => {
      
          const ruta = url+"user/"+sesionUser.id;

          const datos={
            "email":userInfo.email,
            "password":md5(userInfo.password)
          }
          
          Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres modificar: ${sesionUser.name}?`,
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
                            'El Usuario ha sido modificado correctamente, para aplicar los cambios cierra sesión y vuelves a ingresar',
                            'success'
                        )
                        
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
        if(sesionUser)
    return(
        <>
            <div className="alert alert-primary" role="alert">
                <h4>Bienvenido(a) <strong>{sesionUser.name}</strong>, desde acá puedes actualizar tus datos de acceso a la cuenta</h4>
            </div>
            <div className="alert alert-secondary" role="alert">
                <form onSubmit={handleSubmit(onSubmit)}>
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

                    <label htmlFor="password" className="form-label">Contraseña:</label>
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
                    <hr/>
                    <button type="submit" className="btn btn-secondary">Modificar Mis Datos</button>
                </form>
            </div>
            
        </>
    )
}