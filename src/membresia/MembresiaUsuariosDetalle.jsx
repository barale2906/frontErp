import { useContext } from "react"
import AlertaContext from "../providers/AlertaContext"
import Swal from "sweetalert2";
import axios from "axios";
import url from "../utils/urlimport";

export default function MembresiaUsuariosDetalle({usuario, setEditUsuario, index, id}){
    const alerta = useContext(AlertaContext)

    
    

    const asignarMembresia = async ()=>{
        
        const ruta = url+"membresiausuario/"+usuario.id+"/"+id;        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres Asignar a: ${usuario.name} esta membresia?`,
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
                            'El usuario ha sido asignado correctamente',
                            'success'
                        )
                        alerta();
                    } else {
                        Swal.fire(
                            '¡Error!',
                            'Hubo un problema al asignar el usuario',
                            'error'
                        )
                    }
                })              
            }
        })
    }
    
    return(
        <>
            <tr key={index}>
                <td><small>{usuario.name}</small></td>
                <td><small>{usuario.documento}</small></td>
                <td><small>{usuario.email}</small></td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {usuario.membreEncaId===id ? 
                            <>                                
                                <button className="btn btn-success btn-sm" onClick={asignarMembresia}><small>SI</small></button>                                
                            </>
                            : 
                            <>                                
                                <button className="btn btn-default btn-sm" onClick={asignarMembresia}><small>No</small></button>                                
                            </>
                        }
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditUsuario(usuario)} data-bs-toggle="modal" data-bs-target="#staticBackdrop"><small>Modificar</small></button>
                    </div>
                </td>
            </tr>
        </>
    )
}