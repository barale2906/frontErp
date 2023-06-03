import { useForm } from "react-hook-form";
import UserContext from "../providers/sesion/UserContext";
import { useContext, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function MovimientosCrear({medios}){
    
    const [tipo, setTipo]=useState();
    const [descMov, setDescMov]=useState();
    const {sesionUser} = useContext(UserContext);
    const ruta = url+"movimientos";
    const alerta = useContext(AlertaContext)
    const vacio = {
        fecha           : '',
        monto           : '',
        medioId         : '',
        tipoMovimiento  : '',
        concepto        : '',
        observaciones   : '',
        tipo            : ''
    }    
    
    const onChange = e=>{  
        setTipo(e.target.value)
        descMovimiento(e.target.value) 

    }
    const descMovimiento = (reg)=>{
        if(reg===1){
            setDescMov("Ingreso")
        }else{
            setDescMov("Egreso")
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});

    const onSubmit = async (tecnicaInfo) => {
        
        const info = {
            fecha           : tecnicaInfo.fecha,
            monto           : tecnicaInfo.monto,
            medioId         : tecnicaInfo.medioId,
            tipoMovimiento  : tipo,
            concepto        : tecnicaInfo.concepto,
            observaciones   : tecnicaInfo.observaciones,
            userId          : tecnicaInfo.userId
        }       
        
        axios.post(ruta, info)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado el: <strong>${descMov}</strong> con fecha: <strong>${response.data.fecha}</strong> por: $ <strong>${info.monto}</strong>.`,
                        showConfirmButton: false,
                        timer: 3000
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

            <label htmlFor="tipo" className="form-label">Seleccione tipo de Recepción</label>
                <select name="tipoMovimiento" value={tipo} onChange={onChange} className={`form-control ${errors.tipo && "error" }`}>                                
                    <option value=""></option>
                    <option value="1">INGRESO</option>
                    <option value="2">EGRESO</option>
                    
                </select>
            {errors.tipoMovimiento && <p className="text-danger">{errors.tipoMovimiento.message}</p>}    
            
            {
                tipo?
                <>
                    <label htmlFor="fecha" className="form-label">Fecha de Transacción:</label>
                    <input          
                        name="fecha"
                        type="date"
                        className={`form-control ${errors.fecha && "error" }`}        
                        {...register("fecha", {
                            required: messages.required,
                            pattern: {
                            value: patterns.fecha,
                            message: messages.fecha
                            }
                    })}
                    />
                    {errors.fecha && <p className="text-danger">{errors.fecha.message}</p>}

                    <label htmlFor="monto" className="form-label">Monto Transacción:</label>
                    <input          
                        name="monto"
                        type="text"
                        placeholder="Escriba solo números"
                        className={`form-control ${errors.monto && "error" }`}        
                        {...register("monto", {
                            required: messages.required,
                            pattern: {
                            value: patterns.monto,
                            message: messages.monto
                            }
                        })}
                    />
                    {errors.monto && <p className="text-danger">{errors.monto.message}</p>}

                    <label htmlFor="medioId" className="form-label">Seleccione Medio de pago</label>
                    <select          
                        name="medioId"                                
                        className={`form-control ${errors.medioId && "error" }`}        
                        {...register("medioId", {
                            required: messages.required,
                            pattern: {
                            value: patterns.medioId,
                            message: messages.medioId
                            }
                        })}
                    >                                
                        <option value=""></option>
                        {medios.map((medio)=>(                                        
                            <option value={medio.id} key={medio.id}>{medio.name}</option>                                     
                        ))}
                    </select>
                    {errors.medioId && <p className="text-danger">{errors.medioId.message}</p>}

            
                    <label htmlFor="concepto" className="form-label">Concepto: </label>
                    <textarea
                        name="concepto"
                        placeholder="Registre datos importantes de la"
                        className={`form-control ${errors.concepto && "error"}`}
                        {...register("concepto", {
                            required: messages.required,
                            pattern: {
                            value: patterns.concepto,
                            message: messages.concepto
                            }
                        })}
                    ></textarea>
                    {errors.concepto && <p className="text-danger">{errors.concepto.message}</p>}

                    <label htmlFor="observaciones" className="form-label">Observaciones: </label>
                    <textarea
                        name="observaciones"
                        placeholder="Registre datos importantes de la"
                        className={`form-control ${errors.observaciones && "error"}`}
                        {...register("observaciones", {
                            required: messages.required,
                            pattern: {
                            value: patterns.observaciones,
                            message: messages.observaciones
                            }
                        })}
                    ></textarea>
                    {errors.observaciones && <p className="text-danger">{errors.observaciones.message}</p>}
                    <input
                        name="userId"
                        type="hidden"                                    
                        {...register("userId")}
                        defaultValue={sesionUser.id}
                    />

                    
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" className="btn btn-info">Crear Movimiento</button>
                    </div>  
                </>
                :
                <></>
            }
        </form>
    )
}