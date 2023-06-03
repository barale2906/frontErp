import AlertaContext from "../providers/AlertaContext"
import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function ComisionesDetalle({comision, setEditComisiones}){

    const [estadoact, setEstadoact] = useState("En proceso");
    const alerta = useContext(AlertaContext)
    

    const estadoactual = ()=>{
        switch(comision.status){
            case(1):
                setEstadoact("Proceso")
                break;
            case(2):
                setEstadoact("Activa")
                break;
            case(3):
                setEstadoact("Inactiva")
                break;
        }
    }
    useEffect(()=>{
        estadoactual();
    }, [comision])

    return(
        <tr key={comision.id}>
                <td>{comision.name}</td>
                <td>{comision.description}</td>
                <td>{comision.percentage}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button className="btn btn-sm"><strong>{estadoact}</strong></button>
                        {comision.status<3 ? 
                            <>
                                <Link to={comision.id}><button className="btn btn-warning btn-sm">Configurar</button></Link>
                                <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditComisiones(comision)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                            </>
                            : 
                            <></>
                        }
                    </div>
                </td>
            </tr>
    )
}