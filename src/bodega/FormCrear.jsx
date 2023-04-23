import axios from "axios";
import { useContext } from "react";
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
  
  export default function FormCrear() {
    
    const ruta = url+"bodega";
    const rutaefe = url+"efectivo"
    const alerta = useContext(AlertaContext)
    const vacio = {
        name:'',
        email:'',
        phone:'',
        adress:''
    } 
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset 
    } = useForm({mode:'onblur'});
  
  
    const onSubmit = async (bodegaInfo) => {
      
        
       axios.post(ruta, bodegaInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado la bodega: <strong>${response.data.name}</strong>`,
                        showConfirmButton: false,
                        timer: 1500
                      })
                    reset(vacio)
                    alerta();
                    efectivo(response.data.id)
                    
                    }else{
                    Swal.fire(
                        '¡IMPORTANTE!',
                        `No fue posible guardar el registro`,
                        'error'
                    )
                    }
            })  
    }

    const efectivo =(id)=>{
      const cargaNueva={
        "valor":0,
        "saldo":0,
        "movimiento":1,
        "observations":"Saldo Inicial",
        "factura":"bodega",
        "userId":1,
        "bodegaId":id
    }
    
    axios.post(rutaefe, cargaNueva)
        .then((response) =>{
            if(response.status ===201){
                
                
                }else{
                Swal.fire(
                    '¡IMPORTANTE!',
                    `No fue posible guardar el registro`,
                    'error'
                )
                }
        })
    }

    
  
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name" className="form-label">Nombre Completo:</label>
        <input          
          name="name"
          type="text"
          placeholder="Nombre Bodega"
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
          placeholder="Correo Electrónico de la Bodega"
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
  
        <label htmlFor="phone" className="form-label">Teléfono:</label>
        <input
          name="phone"
          type="text"
          placeholder="Teléfono Bodega"
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
        {errors.phone && <p className="text-danger">{errors.phone.message}</p>}
  
        <label htmlFor="adress" className="form-label">Dirección: </label>
        <input
          name="adress"
          type="text"
          placeholder="Dirección de la bodega"
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
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" className="btn btn-info">Crear Bodega</button>
        </div>
  
      </form>
    );
  }
  
  