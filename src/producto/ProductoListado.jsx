import { useContext, useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import ProductoDetalle from "./ProductoDetalle";
import ProductoEditar from "./ProductoEditar";
import ProductoCrear from "./ProductoCrea";
import UserContext from "../providers/sesion/UserContext";
import Paginacion from "../components/Paginacion";
import BuscaProductos from "../components/BuscaProductos";
import axios from "axios";


export default function ProductoListado(){

    //Modificar productos
    const [editProducto, setEditProducto]=useState(null);
    const {productos, cargaproductos} = useContext(UserContext);    
    const [siguienteId, setSiguienteId] = useState(); 
    
    //Parámetros de busqueda.
    const [buscados, setBuscados] = useState();

    useEffect(()=>{      
        cargaproductos()
    }, [])

    // Seleccionar máximo ID
    const axiosMaxId = async () =>{
        const rutap = url+"producto/1/max"
            await axios.get(rutap)
            .then((res)=>{                
            setSiguienteId(res.data+1);
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    useEffect(()=>{
        axiosMaxId()
    }, [cargaproductos])

    
    //parámetros de paginación productos
    const [itemsPerPage, setItemsPerPage]=useState(25);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = productos?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;   

    //parámetros de paginación buscados
    const [itemsPerPageb, setItemsPerPageb]=useState(25);
    const [currentPageb, setCurrentPageb]=useState(1);
    const totalItemsb = buscados?.length; //Total de registros a paginar
    const lastIndexb = currentPage * itemsPerPage;
    const firstIndexb = lastIndex-itemsPerPage;   


    if(!productos){
        return <Cargando/>
    } else if(productos.length===0){
        
        return (
            <>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Producto
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Producto </h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <ProductoCrear siguienteId={siguienteId}/>
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
                <AlertaContext.Provider value={()=>[cargaproductos()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Producto
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Producto {siguienteId}</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <ProductoCrear siguienteId={siguienteId}/>
                                        </div>                                    
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div> 
                    <BuscaProductos setBuscados={setBuscados}/>   
                    <div className="row">                
                        <div className="container text-center col-sm-12">
                            
                            {
                                buscados ? 
                                    <h6>Elementos Búscados {buscados.length}</h6>
                                    :
                                    <>
                                        <h6>Total de Productos <small>{productos?.length} registros encontrados</small></h6>
                                        <Paginacion 
                                            itemsPerPage={itemsPerPage} 
                                            setItemsPerPage={setItemsPerPage}
                                            currentPage={currentPage}
                                            setCurrentPage={setCurrentPage}
                                            totalItems={totalItems}
                                        />
                                    </>                                    
                            }
                            
                            <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                <thead>
                                    <tr>                                        
                                        <th scope="col"><small>IMAGEN</small></th>
                                        <th scope="col"><small>CODE</small></th>
                                        <th scope="col"><small>CUM</small></th>
                                        <th scope="col"><small>NOMBRE GENERICO</small></th>
                                        <th scope="col"><small>NOMBRE COMERCIAL</small></th>
                                        <th scope="col"><small>PRESENTACIÓN</small></th>
                                        <th scope="col"><small>UNIDAD</small></th>
                                        <th scope="col"><small>HÚMEDAD RELATIVA</small></th>
                                        <th scope="col"><small>TEMPERATURA</small></th>
                                        <th scope="col"><small>MÁXIMO (stock)</small></th>
                                        <th scope="col"><small>MÍNIMO (stock)</small></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { buscados ?
                                        <>
                                            {
                                                buscados.map((producto, index)=>(                                        
                                                    <ProductoDetalle producto={producto} key={index} setEditProducto={setEditProducto}/>                                        
                                                ))
                                            }
                                        </>:
                                        <>
                                            {
                                                productos.map((producto, index)=>(                                        
                                                    <ProductoDetalle producto={producto} key={index} setEditProducto={setEditProducto}/>                                        
                                                )).slice(firstIndex,lastIndex)
                                            }
                                        </>                                        
                                    }
                                </tbody>
                            </table>
                            
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Producto</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <ProductoEditar editProducto={editProducto}/>      
                                </div>
                                           
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}