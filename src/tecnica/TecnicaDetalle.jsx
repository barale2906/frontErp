import axios from "axios"
import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import url from "../utils/urlimport"

export default function TecnicaDetalle({tecnica, setEditTecnica}){

 
    
    const alerta = useContext(AlertaContext)  
    
    

    const aprobartecnica = async ()=>{
               
        const ruta = url+"tecnicaencabezado/"+tecnica.id+"/2";
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres APROBAR la Recepción Técnica de la factura: ${tecnica.factura}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
          }).then((result) => {
            if (result.isConfirmed) {

               axios.delete(ruta).then((response) =>{
                   if(response.status ===200){
                        Swal.fire(
                            '¡El estado cambio!',
                            'La Recepción Técnica ha sido APROBADA correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al Aprobar la Recepción Técnica',
                           'error'
                       )
                   }
               })

              
            }
          })
    }

    const desaprobartecnica = async ()=>{
               
        const ruta = url+"tecnicaencabezado/"+tecnica.id+"/3";
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres DESAPROBAR la Recepción Técnica de la factura: ${tecnica.factura}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
          }).then((result) => {
            if (result.isConfirmed) {

               axios.delete(ruta).then((response) =>{
                   if(response.status ===200){
                        Swal.fire(
                            '¡El estado cambio!',
                            'La Recepción Técnica ha sido DESAPROBADA',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al Desaprobar la Recepción Técnica',
                           'error'
                       )
                   }
               })

              
            }
          })
    }
    
    return(   
        <>
            <tr key={tecnica.id}>
                <td><small>{tecnica.fecha}</small></td>
                <td><small>{tecnica.proveedore.name}</small></td>
                <td><small>{tecnica.factura}</small></td>
                <td><small>{"$ "+ new Intl.NumberFormat().format(tecnica.valor)}</small></td>
                <td><small>{tecnica.embalaje}</small></td>
                <td><small>{tecnica.transportadora}</small></td>
                {
                    tecnica.tipo===1 ? 
                    <>
                        <td><small>Técnica</small></td>
                    </>
                    :
                    <>
                        <td><small>Ordinaria</small></td>
                    </>
                }                
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">                        
                        {tecnica.status===1 ? 
                            <>
                                <button className="btn btn-success btn-sm" onClick={aprobartecnica}>Aprobar</button>
                                <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditTecnica(tecnica)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>                                
                                <Link to={tecnica.id}><button className="btn btn-warning btn-sm">Productos</button></Link>
                                <button className="btn btn-danger btn-sm" onClick={desaprobartecnica}>Desaprobar</button>                                                                
                            </>: 
                            <></>
                        }
                        {tecnica.status===2 ? 
                            <>
                                <Link to={tecnica.id}><button className="btn btn-warning btn-sm">Productos</button></Link>
                                <button className="btn btn-success btn-sm">APROBADA</button> 
                            </>
                            
                            : 
                            <></>
                        }
                        {tecnica.status===3 ? 
                            <>
                                <Link to={tecnica.id}><button className="btn btn-warning btn-sm">Productos</button></Link>
                                <button className="btn btn-danger btn-sm">DESAPROBADA</button>
                            </>
                            : 
                            <></>
                        }
                    </div>
                </td>
            </tr> 
        </>              
    )
}
