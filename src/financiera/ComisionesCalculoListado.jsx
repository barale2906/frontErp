import { useEffect, useState } from "react"
import url from "../utils/urlimport";
import Vacio from "../components/Vacio";
import axios from "axios";
import ComisionesCalLisDetalle from "./ComisionesCalLisDetalle";

export default function ComisionesCalculoListado(){
    const [usuarios, setUsuarios]=useState([])
    const [usuarioElegido, setUsuarioElegido]=useState()
    const [comisionesUsuario, setComisionesUsuario]=useState([])
    const ruta=url+"comisionusuario"

    // Consulta para mostrar las membresias
    const axiosUsuarios = async () => {
        await axios.get(ruta)
        .then((res)=>{            
            setUsuarios(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    //Capturar dato
    const onChange = e=>{  
        setUsuarioElegido(e.target.value)      
        usuarioComision(e.target.value)        
    }

    //Movimientos del efectivo para la bodega seleccionada
    const usuarioComision = async(id) =>{
        const rutaefec=url+"facturaEncabezado/"+id+"/comi"

        await axios.get(rutaefec)
            .then((res)=>{        
                setComisionesUsuario(res.data);        
            })
            .catch((error)=>{
                console.log(error)
            })        
    }
    useEffect(()=>{
        axiosUsuarios();
    }, [])

    console.log("Cargado: ",comisionesUsuario)

    if(usuarios){
        return(
            <>
                <div className="row">
                    <div className="container text-center col-md-10">
                        <div className="alert alert-secondary" role="alert">
                            <h4>Seleccione Usuario</h4>
                        </div>                    
                        <select value={usuarioElegido} className="form-select" onChange={onChange} >
                            <option value=""></option>
                            {usuarios.map((usuario)=>(                                        
                                <option value={usuario.id} key={usuario.id}>{usuario.name}</option>                                     
                            ))}
                        </select>
                    </div>
                </div>
                {
                    comisionesUsuario.length>0?
                    <>
                        <table className="table table-success table-hover table-bordered table-responsive table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">N° FACTURA</th>  
                                    <th scope="col">NOMBRE</th>
                                    <th scope="col">TOTAL FACTURA</th>
                                    <th scope="col">CANTIDAD ITEMES</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {comisionesUsuario.map((comision, index)=>(                                        
                                    <ComisionesCalLisDetalle comision={comision} key={index}/>                                    
                                ))}
                            </tbody>
                        </table>
                    </>
                    :
                    <></>
                }
                <div className="row">
                    <div className="container text-center">
                        
                    </div>
                </div>
            </>
        )
    }else{
        <Vacio/>
    }
    
}