import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function ImpuestosDetalle({impuesto, setEditImpuesto}){
    
    const alerta = useContext(AlertaContext)
    let estado = impuesto.status
    let oracion = ""
    
    

    const inactivarimpuesto = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar el impuesto"
        } else {
            estado = 1
            oracion = "Activar el impuesto"
        }
        
        const ruta = url+"impuesto/"+impuesto.id+"/"+estado;
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${impuesto.name}?`,
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
                            'El impuesto ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El impuesto',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={impuesto.id}>
                <td>{impuesto.name}</td>
                <td>{impuesto.description}</td>
                <td>{impuesto.valor}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {impuesto.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivarimpuesto}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivarimpuesto}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditImpuesto(impuesto)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>
              
)
}