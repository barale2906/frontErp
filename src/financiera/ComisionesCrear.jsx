import axios from "axios";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};   
const patterns = {
//name: /^[A-Za-z]+$/i,
};

export default function ComisionesCrear(){

    const ruta = url+"comisionencabezado";
    const alerta = useContext(AlertaContext);
    const vacio = {
        name:'',
        description:'',
        percentage:''
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});

    const onSubmit = async (listaInfo) => {
        
        axios.post(ruta, listaInfo)
            .then((response) =>{
                if(response.status ===201){                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado el esquema de comisión: <strong>${response.data.name}</strong>`,
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

    return(
        <form onSubmit={handleSubmit(onSubmit)}>            
            
            <label htmlFor="name" className="form-label">Nombre Esquema de Comisiones:</label>
            <input          
                name="name"
                type="text"
                placeholder="Nombre Esquema Comisión"
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
    
            <label htmlFor="description" className="form-label">Descripción: </label>
            <textarea
                name="description"
                placeholder="Registre datos importantes de la"
                className={`form-control ${errors.description && "error"}`}
                {...register("description", {
                    required: messages.required,
                    pattern: {
                    value: patterns.description,
                    message: messages.description
                    }
                })}
            ></textarea>
            {errors.description && <p className="text-danger">{errors.description.message}</p>}

            <label htmlFor="percentage" className="form-label">Porcentaje de comisión:</label>
            <input          
                name="percentage"
                type="text"
                placeholder="Escriba solo números"
                className={`form-control ${errors.percentage && "error" }`}        
                {...register("percentage", {
                    required: messages.required,
                    pattern: {
                    value: patterns.percentage,
                    message: messages.percentage
                    }
                })}
            />
            {errors.percentage && <p className="text-danger">{errors.percentage.message}</p>}       
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-info">Crear Comisión</button>
            </div>  
        </form>
    )
}