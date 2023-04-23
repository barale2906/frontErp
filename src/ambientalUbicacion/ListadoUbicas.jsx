import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import axios from "axios";
import AmbUbiCrear from "./AmbUbiCrear";
import AmbUbiDetalle from "./AmbUbiDetalle";
import AmbUbiEdit from "./AmbUbiEdit";

export default function ListadoUbicas(){

    const [ubicas, setUbicas] = useState([]); 
    const ruta = url+"ambientalubi";

    //Modificar ubicaciones
    const [editUbicas, setEditUbicas]=useState(null);
    
    // Consulta para mostrar las ubicaciones
    const axiosUbicas = async () => {
      await axios.get(ruta)
      .then((res)=>{
        
        setUbicas(res.data);
        
      })
      .catch((error)=>{
        console.log(error)
      })
    };

    

    useEffect(()=>{
      axiosUbicas();
    }, [])


    if(!ubicas){
        return <Cargando/>
    } else if(ubicas.length===0){
        
        return (
            <>
                <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Ubicación
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Ubicación</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <AmbUbiCrear/>
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
                <AlertaContext.Provider value={()=>[axiosUbicas()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Ubicación
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Ubicación</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <AmbUbiCrear/>
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
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ubicas.map((ubicas, index)=>(                                        
                                        <AmbUbiDetalle ubicas={ubicas} key={index} setEditUbicas={setEditUbicas}/>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop"  data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Ubicación</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <AmbUbiEdit editUbicas={editUbicas}/>      
                                </div>
                                           
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}