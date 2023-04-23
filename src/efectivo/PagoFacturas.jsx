import axios from "axios";
import { useEffect, useState } from "react";
import DescargarExcel from "../components/DescargarExcel";
import MenuEfectivo from "../components/MenuEfectivo";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";
import DetallePagoFacturas from "./DetallePagoFacturas";
import PagoCrear from "./PagoCrear";
import xlsimag from "../img/xlsimag.png";

export default function PagoFacturas(){
    const [facturas, setFacturas]=useState([])
    const [excel, setExcel]=useState()
    //Registrar pago de Factura
    const [editFactura, setEditFactura]=useState(null);
    const ruta=url+"tecnicaencabezado/2/pago"
    let status

    
    const axiosFactura = async () => {
        await axios.get(ruta)
        .then((res)=>{ 
              setFacturas(res.data);   
        })
        .catch((error)=>{
          console.log(error)
        })
      };

    const imprimir=()=>{
        

        const envio = facturas.map((factura)=>(
            
            
            //key=factura.id,
            {
                "ID":factura.id,
                "FECHA":factura.fecha,
                "PROVEEDOR":factura.proveedore.name,
                "FACTURA":factura.factura,
                "VALOR FACTURA":factura.valor,
                "VALOR ABONADO":factura.valorPagado,
                "OBSERVACIONES":factura.observaciones
            }
        ));
        setExcel(envio)  
    }  

    
      

    useEffect(()=>{
        axiosFactura();
        
      }, [])

    
    return(
        <>
            <MenuEfectivo/>
            <AlertaContext.Provider value={()=>[axiosFactura()]}>
            {
                facturas ? 
                <div className="row container text-center mt-4">
                    <div className="col-md-12">
                        <div className="alert alert-success" role="alert">
                            <h4>Facturas Pendientes</h4>
                        </div>
                    </div>
                    <table className="table table-success table-hover table-bordered table-responsive table-striped">
                        <thead>
                            <tr>
                                <th>FECHA</th>
                                <th>PROVEEDOR</th>
                                <th>FACTURA</th>
                                <th>VALOR FACTURA</th>
                                <th>VALOR ABONADO</th>
                                <th>OBSERVACIONES</th>
                                <th>
                                <button type="button" className="btn btn-sm" onClick={()=>imprimir()} data-bs-toggle="modal" data-bs-target="#staticExcel">
                                    <img src={xlsimag} className="img-fluid rounded-start" alt="Descargar en excel" width="30" />
                                </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map((factura, index)=>(                                        
                                <DetallePagoFacturas factura={factura} key={index} setEditFactura={setEditFactura}/>                                        
                            ))}                                    
                        </tbody>                        
                    </table>
                    <div className="modal fade " id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Cargar Pago</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <PagoCrear editPago={editFactura}/>                                    
                                </div>
                                           
                            </div>
                        </div>
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
                </div>
                
                
                :
                <>
                    <h4>No hay Facturas para pagar</h4>
                    <Vacio/>
                </>
            }
            </AlertaContext.Provider>
            
        </>
    )
}