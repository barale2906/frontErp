import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Paginacion from "../components/Paginacion";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";
import TecnicaImprimir from "./TecnicaImprimir";

import xlsimag from "../img/xlsimag.png";
import DescargarExcel from "../components/DescargarExcel";


export default function TecnicaDetaProductos(){
    
    const [seleccionado, setSeleccionado] = useState()
    const [busca, setBusca] = useState()

    const [excel, setExcel]=useState()
    
    const [buscados, setBuscados] = useState()
    const [productoSel, setProductoSel] = useState()
    const [eliminado, setEliminado] = useState()
    
    const {id} = useParams()
    const ruta=url+"tecnicaencabezado/"+id
    const rutaps = url+"tecnicadetalle/"+id
    window.sessionStorage.setItem("Idencab", id)
    
    let navig = useNavigate()

    const {productos, buscaproductos} = useContext(UserContext)

    
    

    //Seleccionar datos básicos del encabezado
    const axiosEncabezado = async () => {
        await axios.get(ruta)
        .then((res)=>{                 
            setSeleccionado(res.data); 
            window.sessionStorage.setItem("tipo", res.data.tipo)
            
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    

    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    const reenviar = (uni)=>{
        window.sessionStorage.setItem("IdProd", uni)
        navig("/tecnicas/cargar")
    }

    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=productos?.filter((elemento)=>{
          if(elemento.comercial?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())              
          || elemento.code?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
         // || elemento.generico?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          )
          {
            return elemento;
          }
        });

        
        setBuscados(resultadosBusqueda);
    }

    //Seleccionar productos registrados
    const axiosProductoSel = async () => {
        await axios.get(rutaps)
        .then((res)=>{                 
            setProductoSel(res.data);                            
        })
        .catch((error)=>{
            console.log(error)
        })
    }; 

    // eliminar producto de la lista de elegidos
    if(eliminado){
        
        const rutadel = url+"tecnicadetalle/"+eliminado.id;

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres eliminar el producto: ${eliminado.producto.comercial}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
          }).then((result) => {
            if (result.isConfirmed) {

               axios.delete(rutadel).then((response) =>{
                   if(response.status ===204){
                        Swal.fire(
                            '¡EL PRODUCTO SE ELIMINO!',
                            'El producto ha sido eliminado correctamente',
                            'success'
                        )
                        axiosProductoSel();
                        setEliminado();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El impuesto',
                           'error'
                       )
                   }
               })

              
            }
          })        
    }
    
    //parámetros de paginación
    const [itemsPerPage, setItemsPerPage]=useState(25);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = buscados?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;

    // Generar Excel
    const imprimir=(consultas)=>{
        

        const envio = consultas.map((consulta)=>(
            
            
            //key=factura.id,
            {
                "NOMBRE COMERCIAL":consulta.producto.comercial,
                "LOTE":consulta.lote,
                "VENCIMIENTO":consulta.expiration,
                "CANT":consulta.cantidad,
                "UNIDAD":consulta.producto.unit,
                "COSTO":consulta.costo,
                "CUM":consulta.cum,
                "GENERICO":consulta.generico,
                "COMERCIAL":consulta.comercial,
                "INVIMA":consulta.invima,
                "TIPO PRODUCTO":consulta.tipoproducto,
                "ETIQUETADO":consulta.etiquetado,
                "EMBALAJE PRIMARIO":consulta.embalajePrimario,
                "EMBALAJE SECUNDARIO":consulta.embalajeSecundario,
                "PRESENTACIÓN LÍQUIDA":consulta.condicionesPresentacionLiquida,
                "CIERRES HERMETICOS":consulta.cierresHermeticos,
                "CONDICIONES DM":consulta.condicionesDM,
                "OBSERVACIONES":consulta.observations
            }
        ));
        setExcel(envio)  
    } 

    useEffect(()=>{
        axiosEncabezado()    
        axiosProductoSel()        
        buscaproductos()        
    }, [])

    

    if(seleccionado && productos)
    return (
        <>
            <AlertaContext.Provider value={()=>[axiosProductoSel(), setBusca()]}>
                <div className="container text-center">
                    <div className="alert alert-primary" role="alert">
                        <h5 className="modal-title" id="productos">
                            CARGAR PRODUCTOS A LA FACTURA: <strong>{seleccionado.factura} </strong> 
                            DE FECHA: <strong>{seleccionado.fecha} </strong>
                            DEL PROVEEDOR: <strong>{seleccionado.proveedore.name}</strong> 
                            {
                                seleccionado.status===2 ?
                                <p><button className="btn btn-success btn-sm">APROBADA</button></p>  :
                                <></>                            
                            }
                            {
                                seleccionado.status===3 ?
                                <p><button className="btn btn-danger btn-sm">DESAPROBADA</button></p>  :
                                <></>
                            }                            
                            {
                                seleccionado.status>1 && productoSel?
                                    <>
                                        <TecnicaImprimir
                                            seleccionado={seleccionado}
                                            productoSel={productoSel}
                                        />
                                        <button type="button" className="btn btn-sm" onClick={()=>imprimir(productoSel)} data-bs-toggle="modal" data-bs-target="#staticExcel">
                                            <img src={xlsimag} className="img-fluid rounded-start" alt="Descargar en excel" width="30" />
                                        </button>
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

                                    </>
                                    :
                                    <></>
                            }  
                                                     
                        </h5> 
                        
                        <p>Transportadora: <strong>{seleccionado.transportadora}</strong> Embalaje: <strong>{seleccionado.embalaje}</strong></p> 
                        <small>Creado por: {seleccionado.user.name}</small>
                        
                        <br/>
                        <Link to={"/tecnicas"}><button type="button" className="btn btn-warning btn-sm" >REGRESAR</button></Link> 
                    </div>                
                </div>  
                {
                    seleccionado.status===1 ? 
                    <>
                    <div className="container text-center col-sm-10">
                        <div className="alert alert-success" role="alert">
                            <h5>Cargar Producto</h5>
                            <input value={busca} onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>
                        </div>                            
                    </div>
                    </>
                    :
                    <></>
                }
                
                        
                <div className="row">
                    { busca ?
                        <div className="col-sm-5">
                            <div className="alert alert-info" role="alert">
                                <h6>Seleccione Productos <small>{buscados?.length} registros encontrados</small></h6>
                                <Paginacion 
                                    itemsPerPage={itemsPerPage} 
                                    setItemsPerPage={setItemsPerPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalItems={totalItems}
                                />
                                <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col"><small>COMERCIAL</small></th>
                                        <th scope="col"><small>UNIDAD</small></th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buscados?.map((buscado, index)=>(                                        
                                        <tr key={buscado.id}>
                                            <td><small>{buscado.comercial}</small></td>
                                            <td><small>{buscado.unit}</small></td>
                                            <td>                                            
                                                <button className="btn btn-warning btn-sm" onClick={()=>reenviar(buscado.id)}>Elegir</button>
                                            </td>
                                        </tr>                                        
                                    )).slice(firstIndex,lastIndex)}
                                </tbody>
                            </table>
                            </div>
                        </div> :
                        <></>
                    }
                    
                    
                        <div className="col-sm-7">
                            <div className="alert alert-primary" role="alert">
                                <h6>Productos Verificados para esta factura</h6>
                                {
                                    !productoSel ? <Vacio/> :
                                    <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                        <thead>
                                            <tr>                                        
                                                <th scope="col"><small>NOMBRE COMERCIAL</small></th>
                                                {
                                                    seleccionado.tipo===2 ? 
                                                        <></>
                                                        :
                                                        <>
                                                            <th scope="col"><small>LOTE</small></th>
                                                            <th scope="col"><small>VENCIMIENTO</small></th>
                                                        </>
                                                }                                                
                                                <th scope="col"><small>CANT</small></th>
                                                <th scope="col"><small>UNIDAD</small></th>
                                                <th scope="col"><small>COSTO</small></th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productoSel.map((productose, index)=>(                                        
                                                <tr key={productose.id}>
                                                    <td><small>{productose.producto.comercial}</small></td>
                                                    {
                                                        seleccionado.tipo===2 ?
                                                            <></>
                                                            :
                                                            <>
                                                                <td><small>{productose.lote}</small></td>
                                                                <td><small>{productose.expiration}</small></td>       
                                                            </>
                                                    }                                                    
                                                    <td><small>{productose.cantidad}</small></td>
                                                    <td><small>{productose.producto.unit}</small></td>
                                                    <td><small>$ {productose.costo}</small></td>
                                                    <td>
                                                        {
                                                            seleccionado.status===1 ?
                                                            <button className="btn btn-danger btn-sm" onClick={()=>setEliminado(productose)}>X</button> :
                                                            <></>
                                                        }
                                                        
                                                    </td>
                                                </tr>                                                
                                            ))}
                                        </tbody>
                                    </table>                                    
                                }
                            </div>
                        </div>
                                
                </div>
                
            </AlertaContext.Provider>  
        </>
    )
}