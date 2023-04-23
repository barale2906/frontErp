import axios from "axios";
import { useContext } from "react";
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
  
  export default function AmbUbiCrear() {
    
    const ruta = url+"ambientalubi";
    const alerta = useContext(AlertaContext)
    const vacio = {
        name:''        
    } 
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset 
    } = useForm({mode:'onblur'});
  
  
    const onSubmit = async (ubiInfo) => {
      
        
       axios.post(ruta, ubiInfo)
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
          <button type="submit" className="btn btn-info">Crear Ubicación</button>
        </div>
  
      </form>
    );
  }