import { useContext, useEffect, useState } from "react";
import UserContext from "../providers/sesion/UserContext";
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

export default function InventarioTraslado({editInventario}){

    let today = new Date();  // crea un nuevo objeto `Date`
    let now = today.toLocaleString(); // obtener la fecha y la hora
    const [bodegas, setBodegas] = useState([])
    const {sesionUser} = useContext(UserContext)
    const alerta = useContext(AlertaContext)
    const rutap = url+"bodega";    
    let status
    let nuevcantidad

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    // Seleccionar bodegas
    const axiosBodega = async () => {
        

        await axios.get(rutap)
        .then((res)=>{
        
            setBodegas(res.data);
        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    useEffect(()=>{
        axiosBodega();
    }, [])

    useEffect(()=>{
        reset(editInventario)
    }, [editInventario])

    const onSubmit = async (inventarioInfo) => {    
        const ruta = url+"inventario/"+editInventario.id;    

        // Actualizar bodega actual
        if(inventarioInfo.cantidad<=editInventario.cantidad){

            if(editInventario.cantidad===inventarioInfo.cantidad){
                status = 5
                nuevcantidad=editInventario.cantidad
            }else if(inventarioInfo.cantidad<editInventario.cantidad){
                status = editInventario.status
                nuevcantidad=editInventario.cantidad-inventarioInfo.cantidad

            }

            // Datos de actualización
            const inventarioInfoDet = {
                "status" : status,
                "cantidad":nuevcantidad,
                "observations": `${now}: ${sesionUser.name} traslado: ${inventarioInfo.cantidad}  unidades por el motivo: ${inventarioInfo.observaciones} ---- ${editInventario.observations}`
            }

            await axios.put(ruta, inventarioInfoDet)
            .then((response) =>{
                if(response.status ===200){
                        alerta();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `Haz trasladado: <strong>${inventarioInfo.cantidad}</strong> unidades del producto: ${inventarioInfo.producto.comercial}`,
                            showConfirmButton: false,
                            timer: 2500
                        })

                        translada(inventarioInfo)
                        
                    }else{
                        Swal.fire(
                            '¡IMPORTANTE!',
                            `No fue posible guardar el registro`,
                            'error'
                        )
                    }
            })



        } else{
            Swal.fire(
                '¡IMPORTANTE!',
                `La cantidad a trasladar debe ser inferior al inventario disponible`,
                'error'
            )
        }        
    }

    // Cargar cantidad a la nueva bodega
    const translada = async(datos)=>{
        const ruta = url+"inventario";
        let data = {}

        //OJO VERIFICAR QUE NO EXISTA EL PRODUCTO YA CARGADO
        if(editInventario){
            data={
                "bodegaId":datos.bodegaId,
                "cantidad":datos.cantidad,
                "costo":editInventario.costo,
                "encabId":editInventario.encabId,
                "expiration":editInventario.expiration,
                "idTecnicalDetalle":editInventario.idTecnicalDetalle,
                "lote":editInventario.lote,
                "observations":`${now}: ${sesionUser.name} traslado: ${datos.cantidad}  unidades por el motivo: ${datos.observaciones} ---- ${editInventario.observations}`,
                "prodId":editInventario.prodId,
                "status":2
            }
        }else{

        }
        
        await axios.post(ruta, data)
            .then((response) =>{
                if(response.status ===200){
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

    if(editInventario)
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                
                <label htmlFor="cantidad" className="form-label">Cantidad</label>
                <input
                    name="cantidad"
                    type="text"                
                    className={`form-control ${errors.cantidad && "error"}`}
                    {...register("cantidad", {
                    required: messages.required,
                    pattern: {
                        value: patterns.cantidad,
                        message: messages.cantidad
                    }
                    })}
                />
                {errors.cantidad && <p className="text-danger">{errors.cantidad.message}</p>}

                <label htmlFor="bodegaId" className="form-label">Seleccione Bodega a la que será trasladado el producto</label>
                <select          
                    name="bodegaId"                                
                    className={`form-control ${errors.bodega && "error" }`}        
                    {...register("bodegaId", {
                        required: messages.required,
                        pattern: {
                        value: patterns.bodega,
                        message: messages.bodega
                        }
                    })}
                >                                
                    {bodegas.map((bodega)=>(                                        
                        editInventario.bodegaId!==bodega.id?<option value={bodega.id} key={bodega.id}>{bodega.name}</option>:<></>        
                    ))}
                </select>
                {errors.bodega && <p className="text-danger">{errors.bodega.message}</p>}

                <label htmlFor="observaciones" className="form-label">Observaciones:</label>
                <input
                    name="observaciones"
                    type="text"
                    placeholder="Registre las observaciones de baja"
                    className={`form-control ${errors.observaciones && "error"}`}
                    {...register("observaciones", {
                    required: messages.required,
                    pattern: {
                        value: patterns.observaciones,
                        message: messages.observaciones
                    }
                    })}
                />
                {errors.observaciones && <p className="text-danger">{errors.observaciones.message}</p>}


                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" className="btn btn-info">Modificar Inventario</button>
                </div>

            </form>
        </>
    )
}