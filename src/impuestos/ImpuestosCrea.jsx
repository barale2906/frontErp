import axios from "axios";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    description: "Detalla el tipo de impuesto",
    valor: "Digite mínimo 8 caracteres"    
  };
  
  
  const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
  };
  
  export default function ImpuestosCrear() {
    
    const ruta = url+"impuesto";
    const alerta = useContext(AlertaContext)
    const vacio = {
        name:'',
        description:'',
        valor:''        
    } 
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset 
    } = useForm({mode:'onblur'});
  
  
    const onSubmit = async (impuestoInfo) => {
        
       axios.post(ruta, impuestoInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado al impuesto: <strong>${response.data.name}</strong>`,
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
        <label htmlFor="name" className="form-label">Nombre del Impuesto:</label>
        <input          
          name="name"
          type="text"
          placeholder="Nombre Impuesto"
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
  
        <label htmlFor="description" className="form-label">Describa el impuesto:</label>
        <input
          name="description"
          type="textArea"
          placeholder="Describa el impuesto"
          className={`form-control ${errors.description && "error"}`}
          {...register("description", {
            required: messages.required,
            pattern: {
              value: patterns.description,
              message: messages.description
            }
          })}
        />
        {errors.description && <p className="text-danger">{errors.description.message}</p>}
  
        <label htmlFor="valor" className="form-label">Valor:</label>
        <input
          name="valor"
          type="text"
          placeholder="Valor, no incluya puntos, comas ni simbolos"
          className={`form-control ${errors.valor && "error"}`}
          {...register("valor", {
            required: messages.required,
            minLength: {
              value: 1,
              message: messages.valor
            },
            pattern: {
              value: patterns.valor,
              message: messages.valor
            }
          })}
        />
        {errors.valor && <p className="text-danger">{errors.valor.message}</p>}
  
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" className="btn btn-info">Crear Impuesto</button>
        </div>
  
      </form>
    );
  }