import axios from "axios";
import { useEffect, useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import url from "../utils/urlimport";

export default function FacturaImprimir({facturad}){

    const [basicos, setBasicos]=useState()
    const [detalles, setDetalles]=useState()
    const [medio, setMedio] =useState()

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

    const axiosProductos=async()=>{

        const rutadetalle=url+"producto/"+facturad.id+"/detalle"
        

        axios.get(rutadetalle)
        .then((res)=>{
            setDetalles(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })

    }

    const axiosMedio=async()=>{

        const rutamedio=url+"medioPago/"+facturad.medioId
        console.log("medio", rutamedio)
        

        axios.get(rutamedio)
        .then((res)=>{
            setMedio(res.data)
            console.log("Medio pago: ",res.data)
        })
        .catch((error)=>{
            console.log(error)
        })

    }

    const ref = useRef()

    useEffect(()=>{
        axiosBasicos()
        axiosProductos()
        axiosMedio()
    },[facturad])


    
    if(basicos && facturad && detalles && medio)
    return(
        <>
            <div ref={ref} className="d-none d-print-block m-5 p-3" >
                <div className="container text-center">
                    <h1><strong>REGISTRO DE VENTA N°: {facturad.id}</strong></h1>
                </div>
                <hr />
                <div className="row">
                    <div className="col">
                        <h2>Fecha de emisión: 
                            <strong>
                                {facturad.createdAt}
                            </strong>
                        </h2>
                    </div>
                    <div className="col">
                        <h2>Forma de Pago: <strong>{medio.name}</strong></h2>
                    </div>
                </div>
                <hr />
                <h3><strong>DATOS DEL VENDEDOR:</strong></h3>
                <div className="row">
                    <div className="col">
                        <h3>NIT: <strong>{basicos.nit}</strong> Nombre: <strong>{basicos.name}</strong></h3>                        
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
                <h3><strong>DATOS DEL COMPRADOR:</strong></h3>
                <div className="row">
                    <div className="col">
                        <h3>Tipo Documento: <strong>{facturad.tipoDocumento}</strong> Documento: <strong>{facturad.documento}</strong> Nombre: <strong>{facturad.name}</strong></h3>
                        <h3>Dirección: <strong>{facturad.adress} Correo Electrónico: {facturad.email}</strong></h3>
                        <h3>Teléfono: <strong>{facturad.phone}</strong></h3>
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
                            detalles.map((detalle, index)=>(
                                <>
                                    <tr key={detalle.id}>
                                        <td><h5>{detalle.comercial}</h5></td>
                                        <td><h5 align="center">{detalle.producto.unit}</h5></td>
                                        <td><h5 align="center">{detalle.cantidad}</h5></td>                                        
                                        <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(detalle.precio+detalle.impuesto)}</h5></td>
                                        <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(detalle.descuento)}</h5></td>                                     
                                        <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(detalle.totalbase)}</h5></td>
                                    </tr>                                    
                                </> 
                            ))
                        } 
                        <tr>
                            <td colSpan="5"><h5 align="right"><strong>Total Registro</strong></h5></td>
                            <td><h5 align="right">{"$ "+ new Intl.NumberFormat().format(facturad.totalFactura)}</h5></td>
                        </tr>                        
                    </tbody>
                </table>
                <hr />
                <p>Resolución: <strong>{basicos.resolucion}</strong></p>
                
            </div>

            <ReactToPrint trigger={()=><button type="button" className="btn btn-info btn-sm"  >Imprimir</button>} content={()=>ref.current}/>
              
        </>
    )
}