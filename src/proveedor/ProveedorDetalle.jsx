import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function ProveedorDetalle({proveedor, setEditProveedor}){
    
    const alerta = useContext(AlertaContext)
    let estado = proveedor.status
    let oracion = ""
    

    const inactivarproveedor = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar el proveedor"
        } else {
            estado = 1
            oracion = "Activar el proveedor"
        }
        
        const ruta = url+"proveedor/"+proveedor.id+"/"+estado;

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${proveedor.name}?`,
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
                            'El proveedor ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El proveedor',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={proveedor.id}>
                <td>{proveedor.nit}</td>
                <td>{proveedor.name}</td>
                <td>{proveedor.contact}</td>
                <td>{proveedor.adress}</td>
                <td>{proveedor.phone}</td>
                <td>{proveedor.email}</td>
                <td>{proveedor.reorden}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {proveedor.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivarproveedor}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivarproveedor}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditProveedor(proveedor)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>
              
)
}