import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function LineaDetalle({linea, setEditLinea}){
    
    const alerta = useContext(AlertaContext)
    let estado = linea.status
    let oracion = ""
    
    

    const inactivarlinea = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar la línea de producto"
        } else {
            estado = 1
            oracion = "Activar la línea de producto"
        }
        
        const ruta = url+"productlinea/"+linea.id+"/"+estado;
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${linea.name}?`,
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
                            'La Línea de Producto ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar La Línea de Producto',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={linea.id}>
                <td>{linea.name}</td>
                <td>{linea.description}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {linea.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivarlinea}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivarlinea}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditLinea(linea)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>
              
)
}