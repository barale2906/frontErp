import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function BodegaDetalle({detalle, setEditBodega}){
    
    const alerta = useContext(AlertaContext)
    let estado = detalle.status
    let oracion = ""
    

    const inactivarbodega = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar la bodega"
        } else {
            estado = 1
            oracion = "Activar la bodega"
        }
        
        const ruta = url+"bodega/"+detalle.id+"/"+estado;
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${detalle.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
          }).then((result) => {
            if (result.isConfirmed) {

               axios.delete(ruta).then((response) =>{
                   if(response.status ===200){
                        Swal.fire(
                            '¡El estado cambio!',
                            'La bodega ha sido modificada correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar la bodega',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={detalle.id}>
                <td>{detalle.name}</td>
                <td>{detalle.adress}</td>
                <td>{detalle.phone}</td>
                <td>{detalle.email}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {detalle.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivarbodega}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivarbodega}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditBodega(detalle)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>
              
)
}