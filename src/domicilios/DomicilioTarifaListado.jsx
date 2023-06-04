import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import DomicilioTarifaCrear from "./DomicilioTarifaCrear";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext";
import DomicilioTarifaDetalle from "./DomicilioTarifaDetalle";
import DomicilioTarifaEditar from "./DomicilioTarifaEditar";
import axios from "axios";
import { NavLink } from "react-router-dom";

export default function DomicilioTarifaListado(){

    const [tarifas, setTarifas] = useState([]); 
    const ruta = url+"domicilioTarifa";

    //Modificar Tarifa
    const [editTarifa, setEditTarifa]=useState(null);
    
    // Consulta para mostrar las tarifas
    const axiosReq = async () => {
        await axios.get(ruta)
        .then((res)=>{
            
            setTarifas(res.data);
            
        })
            .catch((error)=>{
            console.log(error)
        })
    };    

    useEffect(()=>{
        axiosReq();
    }, [])


    if(!tarifas){
        return <Cargando/>
    } else if(tarifas.length===0){
        
        return (
            <>
                <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Crear Tarifa
                                </button>
                                <NavLink to="/domicilios">
                                    <button type="button" className="btn btn-info">Volver</button>
                                </NavLink>
                            </div>                                                        
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Tarifa</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <DomicilioTarifaCrear/>
                                        </div>                                    
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div> 
                <Vacio/>
                
            </>
        ) 
    } else {
        return (
            <>
                <AlertaContext.Provider value={()=>[axiosReq()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <div className="btn-group" role="group" aria-label="Basic example">
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Crear Tarifa
                                </button>
                                <NavLink to="/domicilios">
                                    <button type="button" className="btn btn-info">Volver</button>
                                </NavLink>
                            </div>                           
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Tarifa</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <DomicilioTarifaCrear/>
                                        </div>                                    
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>   
                    <div className="row">                
                        <div className="container text-center col-sm-12">
                            <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                <thead>
                                    <tr>                                        
                                        <th scope="col">NOMBRE </th>
                                        <th scope="col">DESCRIPCIÓN</th>
                                        <th scope="col">VALOR</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tarifas.map((tarifa, index)=>(                                        
                                        <DomicilioTarifaDetalle tarifa={tarifa} key={index} setEditTarifa={setEditTarifa}/>                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar tarifa</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <DomicilioTarifaEditar editTarifa={editTarifa}/>      
                                </div>     
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}