import axios from "axios"
import { useEffect, useState } from "react"
import url from "../utils/urlimport"
import FacturaImprimir from "./FacturaImprimir"

export default function FacturaUnitaria ({factura, setDetalle}){
    const [detalles, setDetalles]=useState([])
    const [facturad, setFacturad]=useState()

    const axiosDetalles=async()=>{

        const rutadetalle=url+"facturaDetalle/"+factura.id
        

        axios.get(rutadetalle)
        .then((res)=>{
            setDetalles(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })

    }

    useEffect(()=>{
        axiosDetalles()
        setFacturad(factura)
    },[factura])

    if(detalles && facturad)

    return (
        <>            
            <div className="container text-center">
                <div className="alert alert-info" role="alert">
                    <p>Nombre: <strong>{facturad.name}</strong> Dirección: <strong>{facturad.adress}</strong></p>
                    <button type="button" className="btn btn-primary btn-sm" onClick={()=>setDetalle()} >Volver</button>  
                    <FacturaImprimir facturad={facturad} />

                </div>                
                <table className="table table-info table-hover table-bordered table-responsive table-striped" >
                    <thead>
                        <tr>
                            <th>Nombre Comercial</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Descuento</th>
                            <th>Impuesto</th>
                            <th>% Impuesto</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            detalles.map((detalle, index)=>(
                               <>
                                    <tr key={detalle.id}>
                                        <td>{detalle.comercial}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>{"$ "+ new Intl.NumberFormat().format(detalle.precio)}</td>
                                        <td>{"$ "+ new Intl.NumberFormat().format(detalle.descuento)}</td>
                                        <td>{"$ "+ new Intl.NumberFormat().format(detalle.impuesto)}</td>
                                        <td>{detalle.impuestoporc}</td>
                                        <td>{"$ "+ new Intl.NumberFormat().format(detalle.totalbase)}</td>
                                    </tr>
                               </> 
                            ))
                        }                        
                    </tbody>
                </table>
            </div>
        </>
    )
}