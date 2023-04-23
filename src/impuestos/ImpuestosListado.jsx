import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import axios from "axios";
import ImpuestosCrear from "./ImpuestosCrea";
import ImpuestosDetalle from "./ImpuestosDetalle";
import ImpuestosEditar from "./ImpuestosEditar";

export default function ImpuestosListado(){

    const [impuestos, setImpuestos] = useState([]); 
    const ruta = url+"impuesto";

    //Modificar impuestos
    const [editImpuesto, setEditImpuesto]=useState(null);
    
    // Consulta para mostrar los impuestos
    const axiosImpuesto = async () => {
      await axios.get(ruta)
      .then((res)=>{
        
        setImpuestos(res.data);
        
      })
      .catch((error)=>{
        console.log(error)
      })
    };

    

    useEffect(()=>{
      axiosImpuesto();
    }, [])


    if(!impuestos){
        return <Cargando/>
    } else if(impuestos.length===0){
        
        return (
            <>
                <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Impuesto
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Usuario</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <ImpuestosCrear/>
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
                <AlertaContext.Provider value={()=>[axiosImpuesto()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Impuesto
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Impuesto</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <ImpuestosCrear/>
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
                                    {impuestos.map((impuesto, index)=>(                                        
                                        <ImpuestosDetalle impuesto={impuesto} key={index} setEditImpuesto={setEditImpuesto}/>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Impuesto</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <ImpuestosEditar editImpuesto={editImpuesto}/>      
                                </div>
                                           
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}