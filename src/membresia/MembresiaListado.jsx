import axios from "axios";
import { useEffect, useState } from "react";
import Cargando from "../components/Cargando";
import MembresiaCrear from "./MembresiaCrear";
import Vacio from "../components/Vacio";
import url from "../utils/urlimport";
import AlertaContext from "../providers/AlertaContext";
import Paginacion from "../components/Paginacion";
import MembresiaDetalle from "./MembresiaDetalle";
import MembresiaEditar from "./MembresiaEditar";

export default function MembresiaListado(){
    const [membresias, setMembresias] = useState([]);
    const ruta = url+"membresiaEncabezado";
    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = membresias?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;
    //Modificar listas
    const [editMembresia, setEditMembresia]=useState(null);
    
    // Consulta para mostrar las membresias
    const axiosMembresias = async () => {
        await axios.get(ruta)
        .then((res)=>{            
            setMembresias(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };
    useEffect(()=>{
        axiosMembresias();
    }, [])
    
    if(!membresias){
        return(
            <Cargando/>
        )
    }else if(membresias.length===0){
        return(
            <>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Membresia
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Membresia</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <MembresiaCrear/>
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
            <AlertaContext.Provider value={()=>[axiosMembresias()]}>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Membresia
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Membresia</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <MembresiaCrear/>
                                    </div>                                    
                                </div>
                            </div>
                        </div> 
                    </div>
                </div>   
                <div className="row">                
                    <div className="container text-center col-sm-12">
                    <h6>Seleccione Lista Membresia <small>{membresias?.length} registros encontrados</small></h6>
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
                                    <th scope="col">PORCENTAJE DE DESCUENTO</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {membresias.map((membresia, index)=>(                                        
                                    <MembresiaDetalle membresia={membresia} key={index} setEditMembresia={setEditMembresia}/>
                                    
                                )).slice(firstIndex,lastIndex)}
                            </tbody>
                        </table>
                    </div>                        
                </div>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modificar Membresia</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>  
                            <div className="modal-body">
                                <MembresiaEditar editMembresia={editMembresia}/>      
                            </div>                                           
                        </div>
                    </div>
                </div>                      
            </AlertaContext.Provider>                              
        </>
    )
    }    
}