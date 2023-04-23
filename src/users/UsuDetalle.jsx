import axios from "axios"
import { useContext } from "react"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function UsuDetalle({user, setEditUser}){
    
    const alerta = useContext(AlertaContext)
    let estado = user.status
    let oracion = ""
    const inactivarusuario = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar el usuario"
        } else {
            estado = 1
            oracion = "Activar el usuario"
        }
        
        const ruta = url+"user/"+user.id+"/"+estado;
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${user.name}?`,
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
                            'El usuario ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El usuario',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={user.id}>
                <td>{user.imagen}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {user.status===1 ? 
                            <button className="btn btn-warning btn-sm" onClick={inactivarusuario}>Inactivar</button> : 
                            <button className="btn btn-success btn-sm" onClick={inactivarusuario}>Activar</button>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditUser(user)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>              
    )
}