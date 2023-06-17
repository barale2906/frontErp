import { useEffect, useState } from "react"
import url from "../utils/urlimport"
import axios from "axios"
import DomiciliosEncabezado from "./DomiciliosEncabezado"
import AlertaContext from "../providers/AlertaContext"
import DomiciliosDetalle from "./DomiciliosDetalle"
import DomiciliosFactura from "./DomiciliosFactura"

export default function DomiciliosLegalizar(){

    const [domicilios, setDomicilios]=useState([])
    const [editDomicilio, setEditDomicilio]=useState(null);
    const ruta = url+"domicilio/lega"

   // Carga Domicilios
    const axiosDomicilios=async()=>{
        await axios.get(ruta)
        .then((res)=>{
            setDomicilios(res.data)
        })

        .catch((error)=>{
            console.log(error)
        })
    }
    useEffect(()=>{
        axiosDomicilios()
    }, [])
    return(
        <>
        <DomiciliosEncabezado/>
            <AlertaContext.Provider value={()=>[axiosDomicilios()]}>
                <div className="row">
                    <div className="col-lg-10">
                        <table className="table table-info table-hover table-bordered table-responsive table-striped" >
                            <thead>
                                <tr>
                                    <th>N° Factura</th>
                                    <th>Nombre cliente</th>
                                    <th>Teléfono</th>
                                    <th>Dirección</th>
                                    <th>Valor Factura</th>
                                    <th>Valor Domicilio</th>
                                    <th>Valor total</th>
                                    <th>Mensajero</th>
                                    <th>Observaciones</th>
                                    <th>Estado</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>                            
                                {domicilios.map((domicilio, index)=>(                                        
                                    <DomiciliosDetalle domicilio={domicilio} key={index} setEditDomicilio={setEditDomicilio} />
                                ))}
                            </tbody>
                        </table>
                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">Registrar Factura</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>  
                                    <div className="modal-body">
                                        <DomiciliosFactura editDomicilio={editDomicilio}/>
                                    </div>     
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </AlertaContext.Provider> 
        </>
    )
}