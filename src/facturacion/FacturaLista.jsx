import axios from "axios"
import { useEffect, useState } from "react"
import Paginacion from "../components/Paginacion"
import url from "../utils/urlimport"
import FacturaDetalle from "./FacturaDetalle"
import FacturaUnitaria from "./FacturaUnitaria"

export default function FacturaLista(){
    const [facturas,setFacturas]=useState([])
    const [busca, setBusca]=useState()
    const [buscados, setBuscados]=useState([])
    const [detalle, setDetalle]=useState()
    const ruta=url+"facturaEncabezado"

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = facturas?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;

    // Carga Facturas
    const axiosFacturas=async()=>{
        await axios.get(ruta)
        .then((res)=>{
            setFacturas(res.data)
        })

        .catch((error)=>{
            console.log(error)
        })
    }

    // constrol de cambios en la busqueda
    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    //Filtrar las facturas 
    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=facturas.filter((elemento)=>{
          if( elemento.documento.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.name.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.formaPago.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.id===terminoBusqueda
          ){
            return elemento;
          }
        });
        setBuscados(resultadosBusqueda);
    }

    useEffect(()=>{
        axiosFacturas()
    }, [])

    

    return (
        <>
            {
                detalle ?
                <FacturaUnitaria factura={detalle} setDetalle={setDetalle}/>:
                <div className="container text-center">
                    <div className="alert alert-success" role="alert">
                        <h5>Buscar Factura</h5>
                        <input value={busca} autoFocus onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>                            
                    </div>
                    <h6>Seleccione Facturas <small>{facturas?.length} registros encontrados</small></h6>
                    <Paginacion 
                        itemsPerPage={itemsPerPage} 
                        setItemsPerPage={setItemsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalItems={totalItems}
                    />
                    <table className="table table-info table-hover table-bordered table-responsive table-striped" >
                        <thead>
                            <tr>
                                <th>N° Factura</th>
                                <th>Fecha</th>
                                <th>Tipo Documento</th>
                                <th>Documento</th>
                                <th>Nombre</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th>Correo Electrónico</th>
                                <th>Descuentos</th>
                                <th>Impuestos</th>
                                <th>Total</th>
                                <th>Forma de Pago</th>
                                <th>Generada</th>
                                <th>Bodega</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                busca ?                                
                                    buscados.length>0 ?
                                        buscados.map((buscado, index)=>(
                                            <FacturaDetalle variable={buscado} key={index} setDetalle={setDetalle} imprime={1}/>
                                        )):
                                        <></>
                                    :
                                    facturas.map((factura, index)=>(
                                        <FacturaDetalle variable={factura} key={index} setDetalle={setDetalle} imprime={1}/>
                                    )).slice(firstIndex,lastIndex)
                            }
                            
                        </tbody>
                    </table>                            
                </div>

            }
        </>
    )
}