import { useContext } from "react";
import AlertaContext from "../providers/AlertaContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import url from "../utils/urlimport";
import UserContext from "../providers/sesion/UserContext";

const messages = {
    required: "Este campo es obligatorio",    
};
  
  
const patterns = {
    //valor: /^[0-9]+$/i
};


export default function AmbientalCrear({ubicacions}){

    const alerta = useContext(AlertaContext)
    
    const {sesionUser} = useContext(UserContext)

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
        
    } = useForm({mode:'onblur'});



    const onSubmit = async (registroInfo) => {
        
        const vacio={
            valor:'',
            variable:'',
            ubiId:''
        }

        const ruta = url+"ambientereg"
    
        axios.post(ruta, registroInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Registraste ${response.data.valor} (% / °C)`,
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
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="ubiId" className="form-label">Elija Ubicación</label>
                <select          
                    name="ubiId"                                
                    className={`form-control ${errors.variable && "error" }`}        
                    {...register("ubiId", {
                        required: messages.required,
                        pattern: {
                        value: patterns.ubiId,
                        message: messages.ubiId
                        }
                    })}
                >                                
                    <option value=""></option>
                    {ubicacions.map((ubicacion)=>(                                        
                        <option value={ubicacion.id} key={ubicacion.id}>{ubicacion.name}</option>                                     
                    ))}
                </select>
                {errors.ubiId && <p className="text-danger">{errors.ubiId.message}</p>}

                <label htmlFor="variable" className="form-label">Elija Variable</label>
                <select          
                    name="variable"                                
                    className={`form-control ${errors.variable && "error" }`}        
                    {...register("variable", {
                        required: messages.required,
                        pattern: {
                        value: patterns.variable,
                        message: messages.variable
                        }
                    })}
                >                                
                    <option value=""></option>
                    <option value="Temperatura">Temperatura</option>
                    <option value="Humedad">Húmedad Relativa</option>

                </select>
                {errors.variable && <p className="text-danger">{errors.variable.message}</p>}

                
                <label htmlFor="valor" className="form-label">Registre la lectura</label>
                <input          
                    name="valor"
                    type="text"
                    placeholder="Temperatura en °C, Húmedad Relativa en %"
                    className={`form-control ${errors.valor && "error" }`}        
                    {...register("valor", {
                        required: messages.required,
                        pattern: {
                        value: patterns.valor,
                        message: messages.valor
                        }
                    })}
                />
                {errors.valor && <p className="text-danger">{errors.valor.message}</p>}                          
        
                <input
                    name="userId"
                    type="hidden"                                    
                    {...register("userId")}
                    defaultValue={sesionUser.id}
                />
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" className="btn btn-info">Crear Registro</button>
                </div>
        
            </form>
        </>
    )  
}