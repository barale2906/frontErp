import axios from "axios";
import url from "../utils/urlimport";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import { useContext } from "react";

export default function ComisionesProductoDetalle({produc, id, index}){
    
    const alerta = useContext(AlertaContext)

    const eliminar = ()=>{
        const ruta = url+"comisionproducto/"+produc.id

        axios.delete(ruta).then((response) =>{
            if(response.status ===204){
                Swal.fire(
                    '¡El producto se elimino!',
                    'El producto ha sido eliminado correctamente',
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
    return(
        <>
            <tr key={index}>
                <td><small>{produc.producto.comercial}</small></td>
                <td><small>{produc.producto.unit}</small></td>
                <td><small>{produc.percentage}</small></td>
                <td>
                    <button className="btn btn-danger btn-sm" onClick={eliminar}><small><strong>X</strong></small></button>
                </td>
            </tr>
        </>
    )

}