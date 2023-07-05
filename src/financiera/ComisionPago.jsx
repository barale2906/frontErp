import { useForm } from "react-hook-form";
import UserContext from "../providers/sesion/UserContext";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function ComisionPago({setRegistro, comisionesUsuario, usuarioComision}){

    const ruta = url+"movimientos";
    const rutap = url+"medioPago";
    const {sesionUser} = useContext(UserContext);
    const [medios, setMedios]=useState([])
    const [usua, setUsua]=useState()
    const [obser, setObser]=useState()
    let key

    //Seleccionar medios de pago
    const axiosMedios = async () => { 
        await axios.get(rutap)
        .then((res)=>{        
            setMedios(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    const vacio = {
        monto           : "",
        tipoMovimiento  : "",
        concepto        : "",
        observaciones   : "",
        medioId         : "",
        fecha           : ""
    }

    // Crear Usuario
    const UsuarioPago=()=>{
        const titulo=JSON.parse(window.sessionStorage.getItem("usuario"))
        setUsua(titulo)
    }
    useEffect(()=>{
        axiosMedios();
        UsuarioPago();
    }, [])

    //Generar observación
    const Observa=()=>{
        const titulo=JSON.parse(window.sessionStorage.getItem("usuario"))        
        const relleno=`Pago de comisiones a ${usua?.name}`

        const info = {
            monto           : window.sessionStorage.getItem("comisionAcumulada"),
            tipoMovimiento  : 2,
            concepto        : "Pago de Comisiones",
            observaciones   : relleno,
            userId          : sesionUser.id
        }

        setObser(info)
    }

    useEffect(()=>{
        Observa();
    }, [usua])

    
    

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});

    useEffect(()=>{
        reset(obser)
    }, [obser])

    
    const onSubmit = async (tecnicaInfo) => {       
        
        axios.post(ruta, tecnicaInfo)
            .then((response) =>{
                if(response.status ===201){
                    afectadas()
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado el pago de comisiones con fecha: <strong>${response.data.fecha}</strong> por: $ <strong>${tecnicaInfo.monto}</strong>.`,
                        showConfirmButton: false,
                        timer: 3000
                    }) 
                    reset(vacio)                    
                    setRegistro(0)
                    window.sessionStorage.clear();
                    usuarioComision()                    
                }else{
                    Swal.fire(
                        '¡IMPORTANTE!',
                        `No fue posible guardar el registro`,
                        'error'
                    )
                }
            })
    }

    //Verificar y actualizar facturas afectadas 
    const afectadas=()=>{
        {comisionesUsuario.map((comision, index)=>(                                        
            key=index,
            filtrar(comision)
        ))}
    }

    //filtrar Factura
    const filtrar=(comision)=>{
        if(comision.calculo>0){
            const rutafact=url+"facturaEncabezado/"+comision.id
            const data={
                comiId:comision.comiId+"P"
            }
            axios.put(rutafact, data).then((response) =>{
                if(response.status ===200){
                    
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Hubo un problema al aplicar la comisión',
                        'error'
                    )
                }
            })
        }
    }

    return(
        <>
            <button type="button" className="btn btn-info btn-sm" onClick={()=>setRegistro(0)} >Volver</button>
            <h4>
                Generar pago de comisiones a {usua?.name}
            </h4>
            <form onSubmit={handleSubmit(onSubmit)}>  
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
                        
                        <button type="submit" className="btn btn-info mt-4">Crear Movimiento</button>
                        
                    </>
                
            </form>
        </>
    )
}