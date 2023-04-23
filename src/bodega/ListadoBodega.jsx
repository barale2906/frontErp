import axios from "axios";
import { useEffect, useState } from "react"
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport";
import BodegaDetalle from "./BodegaDetalle";
import BodegaEditar from "./BodegaEditar";
import FormCrear from "./FormCrear";



export default function ListadoBodega(){    
    const [bodegas, setBodegas] = useState([]); 
    const ruta = url+"bodega";

    //Modificar bodega
    const [editBodega, setEditBodega]=useState(null);
    
    // Consulta para mostrar las bodegas
    const axiosReq = async () => {
      await axios.get(ruta)
      .then((res)=>{
        //console.log(res);
        setBodegas(res.data);
        
      })
      .catch((error)=>{
        console.log(error)
      })
    };

    //console.log(bodegas)

    useEffect(()=>{
      axiosReq();
    }, [])

   
    if(!bodegas){
        return <Cargando/>
    } else if(bodegas.length===0){
        
        return (
            <>
                <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Bodega
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Bodega</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <FormCrear/>
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
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Bodega
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Bodega</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <FormCrear/>
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
                                        <th scope="col">DIRECCIÓN</th>
                                        <th scope="col">TELEFONO</th>
                                        <th scope="col">EMAIL</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bodegas.map((detalle, index)=>(                                        
                                        <BodegaDetalle detalle={detalle} key={index} setEditBodega={setEditBodega}/>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Bodega</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <BodegaEditar editBodega={editBodega}/>               
                                </div>                                  
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}