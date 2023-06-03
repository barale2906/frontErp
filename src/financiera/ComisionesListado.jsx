import { useEffect, useState } from "react";
import Cargando from "../components/Cargando"
import Paginacion from "../components/Paginacion";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";
import ComisionesCrear from "./ComisionesCrear";
import ComisionesDetalle from "./ComisionesDetalle";
import ComisionesEditar from "./ComisionesEditar";
import axios from "axios";

export default function ComisionesListado(){

    const [comisiones, setComisiones] = useState([]);
    const ruta = url+"comisionencabezado";
    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = comisiones?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;
    //Modificar listas
    const [editComisiones, setEditComisiones]=useState(null);
    
    // Consulta para mostrar las membresias
    const axiosComisiones = async () => {
        await axios.get(ruta)
        .then((res)=>{            
            setComisiones(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };
    useEffect(()=>{
        axiosComisiones();
    }, [])


    if(!comisiones){
        return(
            <Cargando/>
        )
    }else if(comisiones.length===0){
        return(
            <>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Comisión
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Comisión</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <ComisionesCrear/>
                                    </div>                                    
                                </div>
                            </div>
                        </div> 
                    </div>
                </div> 
                <Vacio/>                
            </>
        )
    }else{
        return(
            <>
            <AlertaContext.Provider value={()=>[axiosComisiones()]}>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Comisión
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Comisión</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <ComisionesCrear/>
                                    </div>                                    
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>   
                <div className="row">                
                    <div className="container text-center col-sm-12">
                    <h6>Comisiones <small>{comisiones?.length} registros encontrados</small></h6>
                    <Paginacion 
                        itemsPerPage={itemsPerPage} 
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                    />
                        <table className="table table-success table-hover table-bordered table-responsive table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">NOMBRE</th>  
                                    <th scope="col">DESCRIPCIÓN</th>
                                    <th scope="col">PORCENTAJE DE COMISION</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {comisiones.map((comision, index)=>(                                        
                                    <ComisionesDetalle comision={comision} key={index} setEditComisiones={setEditComisiones}/>
                                    
                                )).slice(firstIndex,lastIndex)}
                            </tbody>
                        </table>
                    </div>                        
                </div>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modificar Comisión</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>  
                            <div className="modal-body">
                                <ComisionesEditar editComisiones={editComisiones}/>      
                            </div>                                           
                        </div>
                    </div>
                </div>                      
            </AlertaContext.Provider>                              
        </>
    )
    } 
}