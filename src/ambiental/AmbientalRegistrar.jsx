import axios from "axios";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",    
};
  
  
const patterns = {
    valor: /^[0-9]+$/i
};

export default function AmbientalRegistrar({editRegistro}){

    const alerta = useContext(AlertaContext) 

    let ubiId = ''

    useEffect(()=>{
        ubiId=editRegistro.id
      }, [editRegistro])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
        
    } = useForm({mode:'onblur'});



    const onSubmit = async (registroInfo) => {
        console.log(registroInfo)

        const vacio={
            valor:'',
            variable:'',
            ubiId:''
        }

        const ruta = url+"/ambientereg"
    
        axios.post(ruta, registroInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Registraste ${response.data.valor} °C para la ubicación: <strong>${editRegistro.name}</strong>`,
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
                            <label htmlFor="valor" className="form-label">Registre la lectura</label>
                            <input          
                                name="valor"
                                type="text"
                                placeholder="Valor en °C"
                                className={`form-control ${errors.name && "error" }`}        
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
                                name="variable"
                                type="hidden"
                                {...register("variable")}
                                defaultValue="Temperatura"
                            />
                            <input
                                name="ubiId"
                                type="hidden"                                    
                                {...register("ubiId")}
                                defaultValue={ubiId}
                            />

                            <input
                                name="userId"
                                type="hidden"                                    
                                {...register("userId")}
                                defaultValue="3"
                            />
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                <button type="submit" className="btn btn-info">Crear Registro</button>
                            </div>
                    
                        </form>
        </>
    )       
}