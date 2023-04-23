import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";
import md5 from "md5";


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
  
  export default function UsuCrear() {
    
    const [bodegas, setBodegas] = useState([])
    const ruta = url+"user";
    const rutap = url+"bodega"; 
    const alerta = useContext(AlertaContext)
    const vacio = {
        name:'',
        email:'',
        password:'',
        rol:'',
        bodegaId:''        
    }
     

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
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset 
    } = useForm({mode:'onblur'});
  
  
    const onSubmit = async (userInfo) => {

      //const encriptado = bcrypt.hashSync(userInfo.password, 10)
      const datos={
        "name":userInfo.name,
        "email":userInfo.email,
        "password":md5(userInfo.password),
        "bodega":userInfo.bodega,
        "rol":userInfo.rol
      }
        
       axios.post(ruta, datos)
        
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado al usuario: <strong>${response.data.name}</strong>`,
                        showConfirmButton: false,
                        timer: 1500
                      })
                    reset(vacio)
                    alerta();
                    
                    }else{
                    Swal.fire(
                        '¡IMPORTANTE!',
                        `No fue posible guardar el registro`,
                        'error'
                    )
                    }
            })  
    }

    useEffect(()=>{
        axiosBodega();
    }, [])
  
  
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

        <label htmlFor="bodega" className="form-label">Seleccione Bodega a la que será registrado el usuario</label>
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
        </select>
        {errors.bodega && <p className="text-danger">{errors.bodega.message}</p>}

        <label htmlFor="rol" className="form-label">Seleccione rol para el usuario</label>
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
          <button type="submit" className="btn btn-info">Crear Usuario</button>
        </div>
  
      </form>
    );
  }