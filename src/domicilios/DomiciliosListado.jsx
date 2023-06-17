import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import axios from "axios";
import Vacio from "../components/Vacio";
import DomiciliosEncabezado from "./DomiciliosEncabezado";
import DomiciliosDetalle from "./DomiciliosDetalle";
import AlertaContext from "../providers/AlertaContext";
import DomiciliosEditar from "./DomiciliosEditar";
import Swal from "sweetalert2";
import DomiciliosEntregar from "./DomiciliosEntregar";

export default function DomiciliosListado(){
    const [domicilios, setDomicilios]=useState([])
    const [elegidos, setElegidos]=useState([])
    const ruta = url+"domicilio/activos"

    //Modificar Domicilio
    const [editDomicilio, setEditDomicilio]=useState(null);
    const [domi, setDomi]=useState(null); 
    const [genEntrega, setGenEntrega]=useState(0)

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

    // Cargar elegidos
    const cargaElegidos=()=>{
        if(domi){
            //verificar si ya esta cargado el domicilio
            const indexbus = elegidos.findIndex((ya)=>ya.factId===domi?.factId);

            if(indexbus>0){
                Swal.fire(
                    '¡Error!',
                    `¡La factura N°: ${domi.factId} ya fue incluida`,
                    'error'
                )
            }else if(indexbus===-1){
                const domis = [domi, ...elegidos] 
                setElegidos(domis)
            }
        }
        
    }

    // Elimina Domi
    const eliminaitem=(inv)=>{
        
        const indexbus = elegidos.findIndex((ya)=>ya.factId===inv.factId)
        const operativo = elegidos

        //Actualizar el dato
        operativo.splice(indexbus,1)
        setElegidos(operativo)
        axiosDomicilios()
    }
        
    //Eliminar Domicilios
    const eliminaDomi=()=>{
        setElegidos([])
    }

    //Eliminar Domicilios
    const continuar=()=>{
        setElegidos([])
        axiosDomicilios()
        setDomi()
        setGenEntrega(0)
    }

    useEffect(()=>{
        cargaElegidos()
    },[domi])

    useEffect(()=>{
        axiosDomicilios()
    }, [])

    

    
    if(domicilios){
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
                                        <DomiciliosDetalle domicilio={domicilio} key={index} setEditDomicilio={setEditDomicilio} setDomi={setDomi}/>
                                    ))}
                                </tbody>
                            </table>
                            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabel">Recibe Domicilio</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>  
                                        <div className="modal-body">
                                            <DomiciliosEditar editDomicilio={editDomicilio}/>      
                                        </div>     
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-2">
                            {
                                elegidos.length>=1 && genEntrega===0?
                                <>
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-success btn-sm" onClick={()=>{setGenEntrega(1)}}>Asignar</button>
                                    <button type="button" className="btn btn-warning btn-sm" onClick={()=>{eliminaDomi()}} >Eliminar domicilios</button>
                                </div>                                    
                                    <table className="table table-success table-hover table-bordered table-responsive table-striped" >
                                        <thead>
                                            <tr>
                                                <th>N° Factura</th>
                                                <th>Valor Domicilio</th>
                                                <th>Valor total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>                            
                                            {elegidos.map((elegido, index)=>(                                        
                                                <tr key={elegido.id}>
                                                    <td>
                                                        {elegido.factId}
                                                    </td>
                                                    <td>
                                                        {"$ "+ new Intl.NumberFormat().format(elegido.facturaEncabezado.domiTarifa)}
                                                    </td>
                                                    <td>
                                                        {"$ "+ new Intl.NumberFormat().format(elegido.facturaEncabezado.totalFactura+elegido.facturaEncabezado.domiTarifa)}
                                                    </td>
                                                    <td>
                                                    <button type="button" className="btn btn-danger btn-sm" onClick={()=>{eliminaitem(elegido)}} >X</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                </>
                                
                                
                                :
                                <></>

                            }
                            {
                                genEntrega===1 ?
                                <>                                    
                                    <DomiciliosEntregar elegidos={elegidos} setElegidos={setElegidos} genEntrega={genEntrega} setGenEntrega={setGenEntrega}/>
                                </>
                                
                                :
                                <></>
                            }
                            {
                                genEntrega===2 ?
                                <>
                                    <button type="button" className="btn btn-danger btn-sm" onClick={()=>{continuar()}} >Asignar mas domicilios</button>
                                </>
                                
                                :
                                <></>
                            }
                            
                            
                        </div>                        
                    </div>
                </AlertaContext.Provider>                
            </>
        )
    }else{
        return(
            <>
                <DomiciliosEncabezado/>
                <Vacio/>
            </>
        )        
    }    
}