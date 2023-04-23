import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom"
import url from "../utils/urlimport";
import ListaCargaInventario from "./ListaCargaInventario";

export default function ListaProductos(){

    const [seleccionado, setSeleccionado] = useState()
    
    const {id} = useParams()

    const ruta=url+"listaprencab/"+id
    
    

    //Seleccionar datos básicos del encabezado
    const axiosEncabezado = async () => {
        await axios.get(ruta)
        .then((res)=>{                 
            setSeleccionado(res.data);
            
        })
        .catch((error)=>{
            console.log(error)
        })
    };

   

    // Cargar datos
    useEffect(()=>{
        axiosEncabezado()        
    }, [])

    if(seleccionado)
    return (
        <>
            <div className="container text-center">
                <div className="alert alert-primary" role="alert">
                    <h5 className="modal-title" id="productos">
                        CARGAR PRODUCTOS A LA LISTA DE PRECIOS: <strong>{seleccionado.name} </strong><br/>
                        DE FECHA DE INICIO: <strong>{seleccionado.inicia} </strong><br/>
                        VA HASTA EL: <strong>{seleccionado.fin}</strong><br/>
                        DESCRIPCIÓN: <strong>{seleccionado.description}</strong><br/> 
                        APLICABLE A LA BODEGA: <strong>{seleccionado.bodega.name}</strong>                             
                    </h5>                        
                    <br/>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">                        
                        <Link to={"/listaprecios"}><button type="button" className="btn btn-warning btn-sm" >Regresar</button></Link>
                        <Link to={"/agregaproducto/"+id}><button className="btn btn-success btn-sm">Agregar Producto</button></Link>
                    </div>
                     
                </div>                
            </div>
            <ListaCargaInventario seleccionado={seleccionado}/>
            

        </>
    )
}