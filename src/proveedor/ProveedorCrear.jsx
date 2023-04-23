import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",
    nit: "No incluya DV",
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
  
  export default function ProveedorCrear() {
    
    const ruta = url+"proveedor";
    const alerta = useContext(AlertaContext)
    const vacio = {
        nit:'',
        name:'',
        adress:'',
        phone:'',
        email:'',
        contact:'',
        reorden:''
    } 
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset 
    } = useForm({mode:'onblur'});
  
  
    const onSubmit = async (proveedorInfo) => {
        
       axios.post(ruta, proveedorInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado al proveedor: <strong>${response.data.name}</strong>`,
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

    
  
  
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="nit" className="form-label">NIT sin D.V.:</label>
            <input          
            name="nit"
            type="text"
            placeholder="Escriba el NIT sin puntos, comas y sin Digito de Verificación"
            className={`form-control ${errors.nit && "error" }`}        
            {...register("nit", {
                required: messages.required,
                pattern: {
                value: patterns.nit,
                message: messages.nit
                }
            })}
            />
            {errors.nit && <p className="text-danger">{errors.nit.message}</p>}

            <label htmlFor="name" className="form-label">Nombre Completo:</label>
            <input          
                name="name"
                type="text"
                placeholder="Nombre Proveedor"
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

            <label htmlFor="contact" className="form-label">Nombre Contacto:</label>
            <input          
                name="contact"
                type="text"
                placeholder="Nombre Contacto"
                className={`form-control ${errors.contact && "error" }`}        
                {...register("contact", {
                    required: messages.required,
                    pattern: {
                    value: patterns.contact,
                    message: messages.contact
                    }
                })}
            />
            {errors.contact && <p className="text-danger">{errors.contact.message}</p>}
    
            <label htmlFor="email" className="form-label">Correo Electrónico:</label>
            <input
                name="email"
                type="email"
                placeholder="Correo Electrónico del proveedor"
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
                placeholder="Teléfono Proveedor"
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
                placeholder="Dirección del proveedor"
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

            <label htmlFor="reorden" className="form-label">Punto de Reorden:</label>
            <input          
                name="reorden"
                type="text"
                placeholder="tiempo de anticipación "
                className={`form-control ${errors.reorden && "error" }`}        
                {...register("reorden", {
                    required: messages.required,
                    pattern: {
                    value: patterns.reorden,
                    message: messages.reorden
                    }
                })}
            />
            {errors.reorden && <p className="text-danger">{errors.reorden.message}</p>}
            
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" className="btn btn-info">Crear Proveedor</button>
            </div>  
        </form>
    );
  }