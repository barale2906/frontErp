import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import axios from "axios";
import ProveedorCrear from "./ProveedorCrear";
import ProveedorDetalle from "./ProveedorDetalle";
import ProveedorEditar from "./ProveedorEditar";

export default function ProveedorListado(){

    const [proveedors, setProveedors] = useState([]); 
    const ruta = url+"proveedor";

    //Modificar proveedores
    const [editProveedor, setEditProveedor]=useState(null);
    
    // Consulta para mostrar los proveedores
    const axiosProveedor = async () => {
      await axios.get(ruta)
      .then((res)=>{
        
        setProveedors(res.data);
        
      })
      .catch((error)=>{
        console.log(error)
      })
    };

    

    useEffect(()=>{
      axiosProveedor();
    }, [])


    if(!proveedors){
        return <Cargando/>
    } else if(proveedors.length===0){
        
        return (
            <>
                <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Proveedor
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Proveedor</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <ProveedorCrear/>
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
                <AlertaContext.Provider value={()=>[axiosProveedor()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Proveedor
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Proveedor</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <ProveedorCrear/>
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
                                        <th scope="col">NIT</th>
                                        <th scope="col">NOMBRE</th>
                                        <th scope="col">CONTACTO</th>
                                        <th scope="col">DIRECCIÓN</th>
                                        <th scope="col">TELEFÓNO</th>
                                        <th scope="col">CORREO ELECTRÓNICO</th>
                                        <th scope="col">REORDEN <span>Días</span></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proveedors.map((proveedor, index)=>(                                        
                                        <ProveedorDetalle proveedor={proveedor} key={index} setEditProveedor={setEditProveedor}/>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Proveedor</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <ProveedorEditar editProveedor={editProveedor}/>      
                                </div>
                                           
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}