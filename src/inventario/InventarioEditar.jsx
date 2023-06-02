import axios from "axios";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio" 
  };
  
  
  const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/    
  };

export default function InventarioEditar({editInventario}){

    let today = new Date();  // crea un nuevo objeto `Date`
    let now = today.toLocaleString(); // obtener la fecha y la hora
    const {sesionUser} = useContext(UserContext)
    const alerta = useContext(AlertaContext)
    let status
    let nuevcantidad

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    useEffect(()=>{
        reset(editInventario)
    }, [editInventario])

    const onSubmit = async (inventarioInfo) => {

        const ruta = url+"inventario/"+editInventario.id;
        
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
                "observations": `${now}: ${sesionUser.name} Dio de baja: ${inventarioInfo.cantidad}  unidades por el motivo: ${inventarioInfo.observaciones} ---- ${editInventario.observations}`
            }

            axios.put(ruta, inventarioInfoDet)
            .then((response) =>{
                if(response.status ===200){
                        alerta();
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `Haz dado de baja: <strong>${inventarioInfo.cantidad}</strong> unidades del producto: ${inventarioInfo.producto.comercial}`,
                            showConfirmButton: false,
                            timer: 2500
                        })
                        
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
                `La cantidad a dar de baja debe ser inferior al inventario disponible`,
                'error'
            )
        }        
    }

    return(
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