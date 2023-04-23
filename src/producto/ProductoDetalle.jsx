import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function ProductoDetalle({producto, setEditProducto}){
    
    const alerta = useContext(AlertaContext)
    let estado = producto.status
    let oracion = ""
    
    

    const inactivarproducto = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar el producto"
        } else {
            estado = 1
            oracion = "Activar el producto"
        }
        
        const ruta = url+"producto/"+producto.id+"/"+estado;

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${producto.comercial}?`,
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
                            'El Producto ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El Producto',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={producto.id}>
                <td><small>{producto.imagen}</small></td>
                <td><small>{producto.code}</small></td>
                <td><small>{producto.cum}</small></td>
                <td><small>{producto.generico}</small></td>
                <td><small>{producto.comercial}</small></td>
                <td><small>{producto.description}</small></td>
                <td><small>{producto.unit}</small></td>
                <td><small>{producto.relativa}</small></td>
                <td><small>{producto.temperatura}</small></td>
                <td><small>{producto.maximo}</small></td>
                <td><small>{producto.minimo}</small></td>                
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {producto.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivarproducto}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivarproducto}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditProducto(producto)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>
              
)
}