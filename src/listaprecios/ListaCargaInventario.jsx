import axios from "axios";
import { useEffect, useState } from "react";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";
import EditarValor from "./EditarValor";
import ListaInventario from "./ListaInventario";

export default function ListaCargaInventario({seleccionado}){

    const [editValor, setEditValor]=useState();
    const [inventario, setInventario] = useState()
    
    // Seleccionar productos en Inventario
    const axiosInventario = async () => {
        const rutain=url+"producto/"+seleccionado.id+"/lp"
        
        await axios.get(rutain)
        .then((res)=>{                 
            setInventario(res.data);              
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    // Productos registrados en la base de datos
    const axiosProductos = async () => {
        const rutap = url+"producto"
        await axios.get(rutap)
        .then((res)=>{    
            
            window.sessionStorage.setItem("productosFarmacia", JSON.stringify(res.data))
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    useEffect(()=>{
        axiosInventario()  
        axiosProductos()      
    }, [])



    if(inventario)
    
    return (
        <>
            <AlertaContext.Provider value={()=>[axiosInventario()]}>
                <div className="row">                
                    <div className="container text-center col-sm-12">
                        <table className="table table-success table-hover table-bordered table-responsive table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">GENERICO</th>  
                                    <th scope="col">COMERCIAL</th>
                                    <th scope="col">UNIDAD</th>
                                    <th scope="col">PRECIO</th>
                                    <th scope="col">DESCUENTO</th>
                                    <th scope="col">VALOR IMPUESTO</th>
                                    <th scope="col">IMPUESTO <span>%</span></th>
                                    <th scope="col">PRECIO TOTAL</th>
                                    <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventario.map((inven, index)=>(     
                                    <ListaInventario inven={inven} key={index} setEditValor={setEditValor}/> 
                                ))}
                            </tbody>
                        </table>
                    </div>                        
                </div>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modificar Precio</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>  
                            <div className="modal-body">
                                {editValor ?
                                    <EditarValor editValor={editValor}/>   :
                                    <></>
                                }
                                   
                            </div>                                           
                        </div>
                    </div>
                </div>
            </AlertaContext.Provider>
        </>
    )
}