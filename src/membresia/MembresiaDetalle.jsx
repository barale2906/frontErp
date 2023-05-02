import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import { useContext, useEffect, useState } from "react"
import url from "../utils/urlimport"
import axios from "axios"
import { Link } from "react-router-dom"

export default function MembresiaDetalle({membresia, setEditMembresia}){
    const [estadoact, setEstadoact] = useState("En proceso");
    const [estadocolor, setEstadocolor] = useState("En proceso");
    const alerta = useContext(AlertaContext)
    
    
    let estado = membresia.status
    let oracion = ""

    const inactivarmembresia = async ()=>{
        
        // Consulta para mostrar productos de la membresia
        const axiosMembresias = async () => {
            const rutad = url+"membresiaproducto/"+membresia.id;
            await axios.get(rutad)
            .then((res)=>{            
                
            })
            .catch((error)=>{
                console.log(error)
            })
        };
    }

    const cambiarEstado = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Activar Membresia"
        } else if (estado===2){
            estado = 3
            oracion = "Finalizar Membresia"
        }
        
        const ruta = url+"membresiaEncabezado/"+membresia.id+"/"+estado;

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${membresia.name}?`,
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
                            'La membresia ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                    } else {
                        Swal.fire(
                            '¡Error!',
                            'Hubo un problema al desactivar la membresia',
                            'error'
                        )
                    }
                })              
            }
        })
    }

    const estadoactual = ()=>{
        switch(membresia.status){
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
    }, [membresia])

    return(
        <tr key={membresia.id}>
                <td>{membresia.name}</td>
                <td>{membresia.description}</td>
                <td>{membresia.percentage}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        <button className="btn btn-sm"><strong>{estadoact}</strong></button>
                        {membresia.status<3 ? 
                            <>
                                <Link to={membresia.id}><button className="btn btn-warning btn-sm">Configurar</button></Link>
                                <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditMembresia(membresia)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                            </>
                            : 
                            <></>
                        }
                    </div>
                </td>
            </tr>
    )
}