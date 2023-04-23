import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import axios from "axios";
import TecnicaCrea from "./TecnicaCrea";
import TecnicaDetalle from "./TecnicaDetalle";
import TecnicaEditar from "./TecnicaEditar";


export default function TecnicaListado(){    
    
    const [tecnicas, setTecnicas] = useState([]); 
    const ruta = url+"tecnicaencabezado";

    //Modificar tecnicas
    const [editTecnica, setEditTecnica]=useState(null);
    
    // Consulta para mostrar los encabezados
    const axiosTecnica = async () => {
      await axios.get(ruta)
      .then((res)=>{ 
            setTecnicas(res.data);        
      })
      .catch((error)=>{
        console.log(error)
      })
    };
    

    useEffect(()=>{
      axiosTecnica();
    }, [])


    if(!tecnicas){
        return <Cargando/>
    } else if(tecnicas.length===0){
        
        return (
            <>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Recepción Técnica
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Recepción Técnica</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <TecnicaCrea/>
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
                <AlertaContext.Provider value={()=>[axiosTecnica()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Recepción Técnica
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Recepción Técnica</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <TecnicaCrea/>
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
                                        <th scope="col">FECHA</th>
                                        <th scope="col">PROVEEDOR</th>
                                        <th scope="col">FACTURA</th>
                                        <th scope="col">VALOR</th>
                                        <th scope="col">EMBALAJE</th>
                                        <th scope="col">TRANSPORTADORA</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tecnicas.map((tecnica, index)=>(                                        
                                        <TecnicaDetalle tecnica={tecnica} key={index} setEditTecnica={setEditTecnica}/>                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Recepción Técnica</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <TecnicaEditar editTecnica={editTecnica}/>      
                                </div>
                                           
                            </div>
                        </div>
                    </div>
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}