import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function DomicilioTarifaDetalle({tarifa, setEditTarifa}){
    
    const alerta = useContext(AlertaContext)
    let estado = tarifa.status
    let oracion = ""
    
    

    const inactivartarifa = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar la tarifa"
        } else {
            estado = 1
            oracion = "Activar la tarifa"
        }
        
        const ruta = url+"domicilioTarifa/"+tarifa.id+"/"+estado;
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${tarifa.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro(a)!'
        }).then((result) => {
            if (result.isConfirmed) {

                axios.delete(ruta).then((response) =>{
                    if(response.status ===200){
                            Swal.fire(
                                '¡El estado cambio!',
                                'La tarifa ha sido modificada correctamente',
                                'success'
                            )
                            alerta();
                    } else {
                        Swal.fire(
                            '¡Error!',
                            'Hubo un problema al desactivar El tarifa',
                            'error'
                        )
                    }
                })
            }
        })
    }
    
    return(   
        <>
            <tr key={tarifa.id}>
                <td>{tarifa.name}</td>
                <td>{tarifa.detalle}</td>
                <td>{tarifa.tarifa}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {tarifa.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivartarifa}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivartarifa}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditTarifa(tarifa)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>              
    )

}