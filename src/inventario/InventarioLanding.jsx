import axios from "axios"
import { useContext, useEffect, useState } from "react"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"
import InventarioDetalle from "./InventarioDetalle"
import xlsimag from "../img/xlsimag.png";
import DescargarExcel from "../components/DescargarExcel"
import UserContext from "../providers/sesion/UserContext"
import Paginacion from "../components/Paginacion"
import InventarioEditar from "./InventarioEditar"
import { NavLink } from "react-router-dom"

export default function InventarioLanding(){

    const [inventarios, setInventarios]=useState([])  
    const [editInventario, setEditInventario]=useState(null)
    
    const [excel, setExcel]=useState()     
    const {sesionUser} = useContext(UserContext)
    const rutainv = url+"inventario";

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(25);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = inventarios?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;

    // Seleccionar inventario
    const axiosInventario = async () => {
        

        await axios.get(rutainv)
        .then((res)=>{        
            setInventarios(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    

    // Generar Excel
    const imprimir=(consultas)=>{
        

        const envio = consultas.map((consulta)=>(
            
            
            //key=factura.id,
            {
                "CUM":consulta.producto.cum,
                "Comercial":consulta.producto.comercial,
                "Generico":consulta.producto.generico,
                "Unidad":consulta.producto.unit,
                "Expira":consulta.expiration,
                "Lote":consulta.lote,
                "Unitario (antes de impuestos)":consulta.costo,
                "Máximo":consulta.producto.maximo,
                "Mínimo":consulta.producto.minimo,
                "Cantidad":consulta.cantidad,
                "Bodega":consulta.bodega.name
            }
        ));
        setExcel(envio)  
    } 


    useEffect(()=>{        
        axiosInventario();
    }, [])
    
    return(
        <>
            <h6>Seleccione Productos <small>{inventarios?.length} registros encontrados</small></h6>
            <Paginacion 
                itemsPerPage={itemsPerPage} 
                setItemsPerPage={setItemsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalItems}
            />
            <AlertaContext.Provider value={()=>[axiosInventario()]}>
                <div className="row">
                    <table className="table table-success table-hover table-bordered table-responsive table-striped">
                        <thead>
                            <tr>
                                <th colSpan="3">PRODUCTO</th>
                                <th colSpan="3">
                                    <NavLink to="/reporteInventario">
                                        <button type="button" className="btn btn-info">Movimiento Producto</button>
                                    </NavLink>
                                </th>
                                <th colSpan="4">CANTIDADES</th>
                                <th colSpan="2">UBICACIÓN</th>
                            </tr>
                            <tr>
                                <th><small>CUM</small></th>
                                <th><small>Comercial</small></th>
                                <th><small>Generico</small></th>
                                <th><small>Unidad</small></th>
                                <th><small>Expira</small></th>
                                <th><small>Lote</small></th>
                                <th><small>Unitario</small></th>
                                <th><small>Máximo</small></th>
                                <th><small>Mínimo</small></th>
                                <th><small>Cant</small></th>
                                <th><small>Bodega</small></th>
                                <th>
                                    {sesionUser.rol>=2 ?
                                        <button type="button" className="btn btn-sm" onClick={()=>imprimir(inventarios)} data-bs-toggle="modal" data-bs-target="#staticExcel">
                                            <img src={xlsimag} className="img-fluid rounded-start" alt="Descargar en excel" width="30" />
                                        </button>:
                                        <></>
                                    }
                                </th>                            
                            </tr>
                        </thead>
                        <tbody>                            
                            {inventarios?.map((buscado, index)=>( 
                                <InventarioDetalle inventario={buscado} key={index} setEditIventario={setEditInventario}/>
                            )).slice(firstIndex,lastIndex)}                            
                        </tbody>
                    </table>
                </div>
                <div className="modal fade " id="staticExcel" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticExcelLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticExcelLabel">Descargar en Excel</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>  
                            <div className="modal-body">
                                <DescargarExcel data={excel}/>                                    
                            </div>                                        
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modificar item de inventario</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>  
                            <div className="modal-body">
                                <InventarioEditar editInventario={editInventario}/>      
                            </div>
                                        
                        </div>
                    </div>
                </div>
            </AlertaContext.Provider>
            
        </>
    )
}