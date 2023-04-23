import axios from "axios";
import { useEffect, useState } from "react";
import Cargando from "../components/Cargando";
import Paginacion from "../components/Paginacion";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";
import ListaCrear from "./ListaCrear";
import ListaDetalle from "./ListaDetalle";
import ListaEditar from "./ListaEditar";


export default function ListaListado(){
    const [listas, setListas] = useState([]); 
    const ruta = url+"listaprencab";
    

    //Modificar listas
    const [editLista, setEditLista]=useState(null);
    
    // Consulta para mostrar los listas
    const axiosLista = async () => {
      await axios.get(ruta)
      .then((res)=>{
        
        setListas(res.data);
        
      })
      .catch((error)=>{
        console.log(error)
      })
    };

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = listas?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;

    

    useEffect(()=>{
      axiosLista();
    }, [])


    if(!listas){
        return <Cargando/>
    } else if(listas.length===0){
        
        return (
            <>
                <div className="row">                
                    <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Crear Lista
                        </button>                            
                        <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Crear Lista</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <ListaCrear/>
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
                <AlertaContext.Provider value={()=>[axiosLista()]}>
                    <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Lista
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Lista</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <ListaCrear/>
                                        </div>                                    
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>   
                    <div className="row">                
                        <div className="container text-center col-sm-12">
                        <h6>Seleccione Lista de Precios <small>{listas?.length} registros encontrados</small></h6>
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
                                        <th scope="col">INICIA</th>
                                        <th scope="col">FINALIZA</th>
                                        <th scope="col">BODEGA</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listas.map((lista, index)=>(                                        
                                        <ListaDetalle lista={lista} key={index} setEditLista={setEditLista}/>
                                        
                                    )).slice(firstIndex,lastIndex)}
                                </tbody>
                            </table>
                        </div>                        
                    </div>
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Lista</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <ListaEditar editLista={editLista}/>      
                                </div>                                           
                            </div>
                        </div>
                    </div>                      
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}