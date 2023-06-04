import { useContext } from "react";
import url from "../utils/urlimport";
import AlertaContext from "../providers/AlertaContext";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";

const messages = {
    required: "Este campo es obligatorio" 
};

const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
};

export default function DomicilioTarifaCrear(){
    
    const ruta = url+"domicilioTarifa";
    const alerta = useContext(AlertaContext)
    const vacio = {
        name:'',
        detalle:'',
        tarifa:''        
    } 

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});


    const onSubmit = async (tarifaInfo) => {
        
        axios.post(ruta, tarifaInfo)
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
            <label htmlFor="name" className="form-label">Nombre de la Tarifa:</label>
            <input          
            name="name"
            type="text"
            placeholder="Nombre Tarifa"
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
    
            <label htmlFor="detalle" className="form-label">Describa la tarifa:</label>
            <input
                name="detalle"
                type="textArea"
                placeholder="Describa la tarifa"
                className={`form-control ${errors.detalle && "error"}`}
                {...register("detalle", {
                    required: messages.required,
                    pattern: {
                    value: patterns.detalle,
                    message: messages.detalle
                    }
                })}
            />
            {errors.detalle && <p className="text-danger">{errors.detalle.message}</p>}
    
            <label htmlFor="tarifa" className="form-label">Valor:</label>
            <input
                name="tarifa"
                type="text"
                placeholder="Valor, no incluya puntos, comas ni simbolos"
                className={`form-control ${errors.tarifa && "error"}`}
                {...register("tarifa", {
                    required: messages.required,
                    minLength: {
                    value: 1,
                    message: messages.tarifa
                    },
                    pattern: {
                    value: patterns.tarifa,
                    message: messages.tarifa
                    }
                })}
            />
            {errors.tarifa && <p className="text-danger">{errors.tarifa.message}</p>}
    
            
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" className="btn btn-info">Crear Tarifa</button>
            </div>
    
        </form>
    );
}