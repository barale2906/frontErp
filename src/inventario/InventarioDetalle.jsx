import { useContext } from "react";
import UserContext from "../providers/sesion/UserContext";
import mes6 from "../utils/Vence";

export default function InventarioDetalle({inventario, setEditIventario}){
    let today = new Date();  // crea un nuevo objeto `Date`
    const {sesionUser} = useContext(UserContext)
    
    

    return(
        <tr key={inventario.id}>
            <td><small>{inventario.producto.cum}</small></td>
            <td><small>{inventario.producto.comercial}</small></td>
            <td><small>{inventario.producto.generico}</small></td>
            <td><small>{inventario.producto.unit}</small></td>
            <td>
                <small>
                {(Date.parse(inventario.expiration)-Date.parse(today))/1000 > mes6 ?

                    inventario.expiration
                    :
                    (Date.parse(inventario.expiration)-Date.parse(today))/1000 < 0 ?
                    <span className="badge bg-danger">{inventario.expiration}</span>:
                    <span className="badge bg-warning">{inventario.expiration}</span>

                    }
                </small>
            </td>
            <td><small>{inventario.lote}</small></td>
            <td><small>{"$ "+ new Intl.NumberFormat().format(inventario.costo)}</small></td>
            <td><small>{inventario.producto.maximo}</small></td>
            <td><small>{inventario.producto.minimo}</small></td>
            <td><small>{inventario.cantidad}</small></td>
            <td><small>{inventario.bodega.name}</small></td>
            <td>
                {sesionUser.rol>=2 ?
                    <>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-success btn-sm" onClick={()=>setEditIventario(inventario)} data-bs-toggle="modal" data-bs-target="#trasladar">Trasladar</button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={()=>setEditIventario(inventario)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Baja</button>
                        </div>                        
                    </>:
                    <></>
                }
            </td>
        </tr>
    )
}