import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import url from "../utils/urlimport";

export default function CotizaImprimir({comprados, totalFactura, descuentos, impuestos, user}){

    const [basicos, setBasicos]=useState()
    let ahora = new Date;
    const now = ahora.toLocaleDateString();  

    const axiosBasicos=async()=>{
        const rutain=url+"basicos/1"       
        
        await axios.get(rutain)
        .then((res)=>{ 
            setBasicos(res.data)                 
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const ref = useRef()

    useEffect(()=>{
        axiosBasicos()
    },[comprados])

    if(comprados && basicos)
    return(
        <>
            <div ref={ref} className="d-none d-print-block m-5 p-3" >
                <div className="container text-center">
                    <h1><strong>COTIZACIÓN N°: {now}</strong></h1>
                </div>
                <h3><strong>DATOS DEL VENDEDOR:</strong></h3>
                <div className="row">
                    <div className="col">
                        <h3>NIT: <strong>{basicos.nit}</strong> Nombre: <strong>{basicos.name} / {user}</strong></h3>                        
                    </div>                    
                </div>
                <div className="row">
                    <div className="col">
                        <h3>Dirección: <strong>{basicos.adress} {basicos.ciudad} - Colombia</strong></h3>
                        <h3>Teléfono: <strong>{basicos.phone}</strong></h3>
                        <h3>Correo Electrónico: <strong>{basicos.email}</strong></h3>
                        <h3>Actividad Económica: <strong>{basicos.actividad}</strong></h3>
                    </div>                  
                </div>
                <hr />
                <table className="table table-hover table-bordered table-responsive table-striped" >
                    <thead>
                        <tr>
                            <th><h5>Nombre Comercial</h5></th>
                            <th><h5>Unidad</h5></th>
                            <th><h5>Cantidad</h5></th>
                            <th><h5>Precio Unitario</h5></th>
                            <th><h5>Descuento</h5></th>                        
                            <th><h5>Total</h5></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            comprados.map((comprado, index)=>(
                                <>
                                    <tr key={comprado.id}>
                                        <td><h5>{comprado.comercial}</h5></td>
                                        <td><h5 align="center">{comprado.invId}</h5></td>
                                        <td><h5 align="center">{comprado.cantidad}</h5></td>                                        
                                        <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(comprado.precio+comprado.impuesto)}</h5></td>
                                        <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(comprado.descuento)}</h5></td>                                     
                                        <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(comprado.totalbase)}</h5></td>
                                    </tr>                                    
                                </> 
                            ))
                        } 
                        <tr>
                            <td colSpan="5"><h5 align="right"><strong>Total Descuento</strong></h5></td>
                            <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(descuentos)}</h5></td>
                        </tr>
                        <tr>
                            <td colSpan="5"><h5 align="right"><strong>Total Impuestos</strong></h5></td>
                            <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(impuestos)}</h5></td>
                        </tr>
                        <tr>
                            <td colSpan="5"><h5 align="right"><strong>Total Factura</strong></h5></td>
                            <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(totalFactura)}</h5></td>
                        </tr>                        
                    </tbody>
                </table>                
                <hr />
                <p>Resolución: <strong>{basicos.resolucion}</strong></p>
            </div>
            <ReactToPrint trigger={()=><button type="button" className="btn btn-info btn-sm"  >Imprimir Cotización</button>} content={()=>ref.current}/>
        </>
    )
}