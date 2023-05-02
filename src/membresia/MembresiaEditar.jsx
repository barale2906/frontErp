import { useContext, useEffect } from "react";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    description: "Detalla el tipo de impuesto",
    percentage: "Solo números"    
};

const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
};

export default function MembresiaEditar({editMembresia}){
    const ruta = url+"membresiaEncabezado";
    const alerta = useContext(AlertaContext);

    useEffect(()=>{
        reset(editMembresia)
    }, [editMembresia])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    const onSubmit = async (listaInfo) => {

        const ruta = url+"membresiaEncabezado/"+editMembresia.id;
        
        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres modificar: ${editMembresia.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
        }).then((result) => {
        if (result.isConfirmed) {

            axios.put(ruta, listaInfo).then((response) =>{
                if(response.status ===200){
                    Swal.fire(
                        '¡MODIFICO LA MEMBRESIA!',
                        'La membresia ha sido modificado correctamente',
                        'success'
                    )
                    alerta();
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Hubo un problema al modificar la membresia',
                        'error'
                    )
                }
            })

            
        }
        })
    }

    return(
        <form onSubmit={handleSubmit(onSubmit)}>            
            
            <label htmlFor="name" className="form-label">Nombre de Membresia:</label>
            <input          
                name="name"
                type="text"
                placeholder="Nombre Membresia"
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
                placeholder="Registre datos importantes de la membresia"
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

            <label htmlFor="percentage" className="form-label">Porcentaje de descuento:</label>
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
                <button type="submit" className="btn btn-info">Crear Membresia</button>
            </div>  
        </form>
    )
}