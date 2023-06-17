import { useContext, useEffect, useState } from "react";
import AlertaContext from "../providers/AlertaContext";
import { useForm } from "react-hook-form";
import url from "../utils/urlimport";
import axios from "axios";
import Swal from "sweetalert2";

const messages = {
    required: "Este campo es obligatorio"
};


const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};
export default function DomiciliosEditar({editDomicilio}){

    const [crt, setCrt]=useState(0)
    useEffect(()=>{
        setCrt(0)
        reset(editDomicilio)        
    }, [editDomicilio])

    let today = new Date();  // crea un nuevo objeto `Date`        
    let now = today.toISOString(); // obtener la fecha y la hora
    const monto=editDomicilio?.facturaEncabezado.domiTarifa+editDomicilio?.facturaEncabezado.totalFactura

    const alerta = useContext(AlertaContext) 
    const vacio={
        "montoLegaliza":""
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

const onSubmit = async (Info) => {
    const rutam=url+"domicilio/"+editDomicilio.id    
    const datos={
        "montoLegaliza":Info.montoLegaliza,
        "fechaLegaliza":now,
        "status":3,
        "observaciones":"+--+ "+now+" Se le recibio el dinero y soportes a: "+editDomicilio.name+" -- "+editDomicilio.observaciones
    }
    Swal.fire({
        title: '¿Estas Seguro(a)?',
        text: `¿Quieres actualizar este domicilio?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, estoy seguro(a)!'
    }).then((result) => {
        if (result.isConfirmed) {
            
            axios.put(rutam, datos).then((response) =>{
                if(response.status ===200){
                    Swal.fire(
                        '¡MODIFICO ESTE DOMICILIO!',
                        'Los datos han sido actualizados correctamente',
                        'success'
                    )
                    alerta()
                    setCrt(1)
                    reset(vacio)
                    
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Hubo un problema al modificar los datos',
                        'error'
                    )
                }
            })
        }
    })
    }

    if(editDomicilio)
    return (
        <>
            <h2>Factura N° {editDomicilio.factId}</h2>
            <p>Entregada por: {editDomicilio.name}</p>
            {
                crt===0 ?
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="montoLegaliza" className="form-label">Valor entregado</label>
                    <input          
                    name="montoLegaliza"
                    type="text"
                    placeholder={monto}
                    className={`form-control ${errors.montoLegaliza && "error" }`}        
                    {...register("montoLegaliza", {
                        required: messages.required,
                        pattern: {
                        value: patterns.montoLegaliza,
                        message: messages.montoLegaliza
                        }
                    })}
                    />
                    {errors.montoLegaliza && <p className="text-danger">{errors.montoLegaliza.message}</p>}

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" className="btn btn-info">Recibir</button>
                    </div>                
                </form>
                :
                <>
                    <strong>REGISTRADO</strong>
                </>
            }            
        </>
    )
}