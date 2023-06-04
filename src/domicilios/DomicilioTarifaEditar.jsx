import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio" 
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function DomicilioTarifaEditar({editTarifa}){
    
    useEffect(()=>{
        reset(editTarifa)
    }, [editTarifa])
    
    
    const alerta = useContext(AlertaContext) 

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    const onSubmit = async (tarifaInfo) => {
    
        const ruta = url+"domicilioTarifa/"+editTarifa.id;
        
        Swal.fire({
        title: '¿Estas Seguro?',
        text: `¿Quieres modificar: ${editTarifa.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, estoy seguro!'
        }).then((result) => {
        if (result.isConfirmed) {
    
            axios.put(ruta, tarifaInfo).then((response) =>{
                if(response.status ===200){
                    Swal.fire(
                        '¡MODIFICO LA TARIFA!',
                        'La Tarifa ha sido modificada correctamente',
                        'success'
                    )
                    alerta();
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Hubo un problema al modificar la tarifa',
                        'error'
                    )
                }
            })
    
            
        }
        })
    }
    
    
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="name" className="form-label">Nombre de la tarifa:</label>
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
            <button type="submit" className="btn btn-info">Modificar Tarifa</button>
            </div>
    
        </form>
    );

}