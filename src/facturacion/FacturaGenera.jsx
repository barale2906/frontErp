import axios from "axios";
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2";
import Paginacion from "../components/Paginacion";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";
import mes6 from "../utils/Vence";
import Facturar from "./Facturar";
import FacturaUnitaria from "./FacturaUnitaria";
import CotizaImprimir from "./CotizaImprimir"

export default function FacturaGenera({tipo}){
    const [lpactiva, setLpactiva] = useState()
    const [busca, setBusca] = useState()
    const [buscados, setBuscados] = useState()
    const [productos, setProductos] = useState()
    const [numero, setNumero] = useState(0)
    const [inven, setInven] = useState()
    const [cargado, setCargado] = useState()
    const [comprados, setComprados] = useState([])
    const [impuestos, setImpuestos] = useState(0)
    const [descuentos, setDescuentos] = useState(0)
    const [totalFactura, setTotalFactura] = useState(0)
    const [genfactura, setGenFactura] = useState(0)
    const [lastFactura, setLastFactura]=useState()
    const [numeroLast, setNumeroLast]=useState()
    const {sesionUser} = useContext(UserContext)  
    const [detalle, setDetalle]=useState() 
    let today = new Date();  // crea un nuevo objeto `Date`        
    let now = today.toLocaleString(); // obtener la fecha y la hora
   
    // Carga lista de precios activa para la bodega
    const axioslistactiva = async () => {
        const rutain=url+"listaprencab/"+sesionUser.bodega+"/"+tipo       
        
        await axios.get(rutain)
        .then((res)=>{ 
            setLpactiva(res.data) 
            cargaproductos(res.data.id)                   
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    // Carga de productos de la lista de precios
    const cargaproductos = async (id) => {
        const rutaprod=url+"producto/"+id+"/lp"
        
        await axios.get(rutaprod)
        .then((res)=>{ 
            setProductos(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // carga datos a buscar
    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    // Carga productos enconstrados según parámetros
    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=productos?.filter((elemento)=>{
          if(elemento.generico?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.code?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.comercial?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          ){
            return elemento;
          }
        });
        setBuscados(resultadosBusqueda);
    }

    useEffect(()=>{
        axioslistactiva();
    }, [])

    // Verificar si esta cargado
    const inventario = async (compra) => {
        
        const rutainve=url+"inventario/"+sesionUser.bodega+"/"+compra.id
        
          
        setCargado(compra)   

        await axios.get(rutainve)
        .then((res)=>{ 
            setInven(res.data) 
            //fechas(res.data)                   
        })
        .catch((error)=>{
            console.log(error)
        })
    };


    // Verificar si el producto ya fue cargado
    const cantidad = (inv)=>{        
        const indexbus = comprados.findIndex((ya)=>ya.invId===inv.id);
        setDetalle()

        if(indexbus>=0){

            const existe = comprados.filter((ya)=>ya.invId===inv.id);            
            const operativo = comprados

            //Verificar inventario
            const cant = existe[0].cantidad+1

            if(cant<=existe[0].saldo){

                const prebas = existe[0].preciobase+existe[0].precio
                const desc =  cargado.listaPrecios[0].precioDescuento+existe[0].descuento
                const imp = existe[0].impuesto+cargado.listaPrecios[0].precioImpuesto
                const tot = existe[0].totalbase+cargado.listaPrecios[0].precioTotal
                //Actualiza variables globales
                const tota = totalFactura+cargado.listaPrecios[0].precioTotal
                const descu = descuentos+cargado.listaPrecios[0].precioDescuento 
                const impu = impuestos+cargado.listaPrecios[0].precioImpuesto       
                
                setDescuentos(descu)
                setImpuestos(impu)
                setTotalFactura(tota)

                const item = {
                    "id":existe[0].id,  
                    "prodId":existe[0].prodId,          
                    "comercial":existe[0].comercial,
                    "cantidad":cant,
                    "lpId":existe[0].lpId,
                    "precio":existe[0].precio,
                    "preciobase":prebas,
                    "descuento":existe[0].descuento,
                    "descuentobase":desc,
                    "impuesto":existe[0].impuesto,
                    "impuestobase":imp,
                    "impuestoporc":cargado.impuesto.valor,
                    "total":existe[0].total,
                    "totalbase":tot,
                    "invId":existe[0].invId,
                    "lote":existe[0].lote,
                    "expiration":existe[0].expiration,
                    "saldo":existe[0].saldo
                }

                //Actualizar el dato
                const oficio = operativo.splice(indexbus,1,item)
                setComprados(operativo)
            } else {
                Swal.fire(
                    '¡Error!',
                    `¡No hay inventario suficiente del producto: ${existe[0].comercial}?`,
                    'error'
                )
            }
        }else{
            facturar(inv)
        }
        
    }

    // modifica cantidades
    const cantidadMod = (inv,operacion)=>{
        const indexbus = comprados.findIndex((ya)=>ya.invId===inv.invId)
        const operativo = comprados
        if(operacion===0){
            const canti=inv.cantidad-1
            const descu=inv.descuentobase-inv.descuento
            const preci=inv.preciobase-inv.precio
            const impu=inv.impuestobase-inv.impuesto
            const total=inv.totalbase-inv.total

            const item = {
                "id":inv.id,  
                "prodId":inv.prodId,          
                "comercial":inv.comercial,
                "cantidad":canti,
                "lpId":inv.lpId,
                "precio":inv.precio,
                "preciobase":preci,
                "descuento":inv.descuento,
                "descuentobase":descu,
                "impuesto":inv.impuesto,
                "impuestobase":impu,
                "impuestoporc":inv.impuestoporc,
                "total":inv.total,
                "totalbase":total,
                "invId":inv.invId,
                "lote":inv.lote,
                "expiration":inv.expiration,
                "saldo":inv.saldo
            }

            //Actualiza variables globales
            const totali = totalFactura-inv.total
            const descuen = descuentos-inv.descuento 
            const impues = impuestos-inv.impuesto       
        
            setDescuentos(descuen)
            setImpuestos(impues)
            setTotalFactura(totali)

            //Actualizar el dato
            const oficio = operativo.splice(indexbus,1,item)
            setComprados(operativo)
        }
        if(operacion===1){
            const canti=inv.cantidad+1
            if(canti<=inv.saldo){
                const descu=inv.descuentobase+inv.descuento
                const preci=inv.preciobase+inv.precio
                const impu=inv.impuestobas+inv.impuesto
                const total=inv.totalbase+inv.total
    
                const item = {
                    "id":inv.id,  
                    "prodId":inv.prodId,          
                    "comercial":inv.comercial,
                    "cantidad":canti,
                    "lpId":inv.lpId,
                    "precio":inv.precio,
                    "preciobase":preci,
                    "descuento":inv.descuento,
                    "descuentobase":descu,
                    "impuesto":inv.impuesto,
                    "impuestobase":impu,
                    "impuestoporc":inv.impuestoporc,
                    "total":inv.total,
                    "totalbase":total,
                    "invId":inv.invId,
                    "lote":inv.lote,
                    "expiration":inv.expiration,
                    "saldo":inv.saldo
                }
    
                //Actualiza variables globales
                const totali = totalFactura+inv.total
                const descuen = descuentos+inv.descuento 
                const impues = impuestos+inv.impuesto       
            
                setDescuentos(descuen)
                setImpuestos(impues)
                setTotalFactura(totali)
    
                //Actualizar el dato
                const oficio = operativo.splice(indexbus,1,item)
                setComprados(operativo)
            } else {
                Swal.fire(
                    '¡Error!',
                    `¡No hay inventario suficiente del producto: ${inv.comercial}?`,
                    'error'
                )
            }
            
        }
    }

    // Elimina producto
    const eliminaitem = (inv)=>{
        const indexbus = comprados.findIndex((ya)=>ya.invId===inv.invId)
        const operativo = comprados
        //Actualiza variables globales
        const totali = totalFactura-(inv.total*inv.cantidad)
        const descuen = descuentos-(inv.descuento*inv.cantidad)
        const impues = impuestos-(inv.impuesto*inv.cantidad)       
    
        setDescuentos(descuen)
        setImpuestos(impues)
        setTotalFactura(totali)

        //Actualizar el dato
        const oficio = operativo.splice(indexbus,1)
        setComprados(operativo)
    }
    
    // Cargar Productos Facturados
    const facturar = (detalle)=>{
       
        const idpedido = numero+1
        setNumero(idpedido)
        const tota = totalFactura+cargado.listaPrecios[0].precioTotal
        const desc = descuentos+cargado.listaPrecios[0].precioDescuento 
        const imp = impuestos+cargado.listaPrecios[0].precioImpuesto       
        setTotalFactura(tota)
        setDescuentos(desc)
        setImpuestos(imp)

        const item = {
            "id":numero,  
            "prodId":cargado.id,          
            "comercial":cargado.comercial,
            "cantidad":1,
            "lpId":cargado.listaPrecios[0].id,
            "precio":cargado.listaPrecios[0].precio,
            "preciobase":cargado.listaPrecios[0].precio,
            "descuento":cargado.listaPrecios[0].precioDescuento,
            "descuentobase":cargado.listaPrecios[0].precioDescuento,
            "impuesto":cargado.listaPrecios[0].precioImpuesto,
            "impuestobase":cargado.listaPrecios[0].precioImpuesto,
            "impuestoporc":cargado.impuesto.valor,
            "total":cargado.listaPrecios[0].precioTotal,
            "totalbase":cargado.listaPrecios[0].precioTotal,
            "invId":detalle.id,
            "lote":detalle.lote,
            "expiration":detalle.expiration,
            "saldo":detalle.cantidad
        }
       const items = [item, ...comprados] 
       setComprados(items)
    }  
    
    // Elimina productos Cargados
    const eliminatodo = ()=>{
        setComprados([])
        setTotalFactura(0)
        setDescuentos(0)
        setImpuestos(0)
    }

    //Iniciar Facturación
    const generafac=()=>{
        setGenFactura(1)
    }

    //Factura Nueva
    const nuevaFac=()=>{
        if(genfactura>1){

            setNumeroLast(genfactura)
            setBusca()
            setBuscados()
            setNumero(0)
            setCargado()
            setInven()
            setComprados([])
            setImpuestos(0)
            setDescuentos(0)
            setTotalFactura(0)
            setGenFactura(0)
        }
    }

     //parámetros de paginación
     const [itemsPerPage, setItemsPerPage]=useState(25);
     const [currentPage, setCurrentPage]=useState(1);
     const totalItems = buscados?.length; //Total de registros a paginar
     const lastIndex = currentPage * itemsPerPage;
     const firstIndex = lastIndex-itemsPerPage;

    

    useEffect(()=>{
        nuevaFac();
    }, [genfactura])

    
    if(lpactiva){
        return (
        
            <>  
                {genfactura===0 ?
                    <>
                        <div className="container text-center">
                            <div className="alert alert-primary" role="alert">
                                <h5 className="modal-title" id="productos">
                                    BODEGA: <strong>{lpactiva.bodega.name} </strong>    
                                    LISTA DE PRECIOS VIGENTE: <strong>{lpactiva.name} </strong><br/>
                                    DE FECHA DE INICIO: <strong>{lpactiva.inicia} </strong>
                                    FECHA FIN: <strong>{lpactiva.fin}</strong><br/>
                                    DESCRIPCIÓN: <strong>{lpactiva.description}</strong> esta lista de precios es de tipo: {lpactiva.tipo===1 ? <><strong>Pública</strong></>:<><strong>Coworking</strong></>} 
                                    
                                </h5>
                            </div>                
                        </div> 
                        { numeroLast>1 ?
                            <div className="container text-center">
                                <div className="alert alert-warning" role="alert">
                                    <p>El último registro de compra fue el N°: {lastFactura.id}, al cliente: {lastFactura.name} por: {"$ "+ new Intl.NumberFormat().format(lastFactura.totalFactura)}</p>
                                    <button type="button" className="btn btn-warning btn-sm" onClick={()=>setDetalle(lastFactura.id)} >Ver</button>
                                </div>
                            </div>:
                            null
                        } 
                        {
                            detalle ?
                            <FacturaUnitaria factura={lastFactura} setDetalle={setDetalle}  />:
                            null
                        }                   
                        <div className="container text-center">                
                            <div className="row">
                                <div className="col-sm-6">  
                                    <div className="container text-center">
                                        <div className="alert alert-success" role="alert">
                                            <h5>Buscar Producto</h5>
                                            <input value={busca} autoFocus onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>                            
                                        </div>                            
                                    </div>
                                    {
                                        busca ?
                                            <>
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
                                                            <th scope="col">COMERCIAL</th>
                                                            <th scope="col">UNIDAD</th>
                                                            <th scope="col">DESCUENTO</th>
                                                            <th scope="col">COSTO</th>
                                                            
                                                            <th scope="col"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {buscados.map((buscado, index)=>(                                        
                                                            <tr key={buscado.id}>
                                                                <td>{buscado.comercial}</td>
                                                                <td>{buscado.unit}</td>
                                                                <td>{"$ "+ new Intl.NumberFormat().format(buscado.listaPrecios[0].precioDescuento)}</td>
                                                                <td>{"$ "+ new Intl.NumberFormat().format(buscado.listaPrecios[0].precioTotal)}</td>
                                                                <td>
                                                                    <button type="button" className="btn btn-info btn-sm" onClick={()=>inventario(buscado)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Elegir</button>
                                                                </td>
                                                            </tr>                                        
                                                        )).slice(firstIndex,lastIndex)}
                                                    </tbody>
                                                </table>
                                            </>:
                                            <h6>Digita parte del nombre o código del producto a buscar</h6>
                                    }
                                </div>
                                <div className="col-sm-6">
                                    { totalFactura ?
                                        <div className="container text-center">
                                            <div className="alert alert-info" role="alert">
                                                <h6 className="modal-title" id="productos">
                                                    TOTAL: <strong>{"$ "+ new Intl.NumberFormat().format(totalFactura) } </strong>    
                                                    DESCUENTOS: <strong>{"$ "+ new Intl.NumberFormat().format(descuentos) } </strong><br/>
                                                    IMPUESTOS: <strong>{"$ "+ new Intl.NumberFormat().format(impuestos) } </strong>
                                                </h6>
                                                <button className="btn btn-success btn-sm" onClick={()=>generafac()}>Facturar</button>
                                            </div>
                                            <table className="table table-info table-hover table-bordered table-responsive table-striped">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">COMERCIAL</th>  
                                                        <th scope="col">LOTE</th>
                                                        <th scope="col">FECHA</th>
                                                        <th scope="col">CANT</th>
                                                        <th scope="col">TOTAL</th>
                                                        <th scope="col"></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {comprados.map((comprado, index)=>(                                        
                                                    <tr key={comprado.id}>
                                                        <td><small>{comprado.comercial}</small></td>
                                                        <td><small>{comprado.lote}</small></td>
                                                        <td><small>{comprado.expiration}</small></td>
                                                        <td> 
                                                            <small>
                                                                {comprado.cantidad>1 ?
                                                                    <>
                                                                        <button className="btn btn-sm" onClick={()=>cantidadMod(comprado,0)}>-</button>
                                                                            {comprado.cantidad}
                                                                        <button className="btn btn-sm" onClick={()=>cantidadMod(comprado,1)}>+</button>
                                                                    </>:
                                                                    <>
                                                                        {comprado.cantidad}
                                                                        <button className="btn  btn-sm" onClick={()=>cantidadMod(comprado,1)}>+</button>
                                                                    </>
                                                                }
                                                            </small>                                             
                                                        </td>
                                                        <td><small>{"$ "+ new Intl.NumberFormat().format(comprado.totalbase)}</small></td>
                                                        <td>
                                                            <small>
                                                                <button className="btn btn-danger btn-sm" onClick={()=>eliminaitem(comprado)}>X</button>
                                                            </small>
                                                        </td>
                                                    </tr>                                            
                                                    ))}
                                                </tbody>
                                            </table>
                                            <button className="btn btn-danger btn-sm" onClick={()=>eliminatodo()}>Eliminar Todo</button>
                                            <CotizaImprimir 
                                                comprados={comprados} 
                                                totalFactura={totalFactura} 
                                                descuentos={descuentos} 
                                                impuestos={impuestos}
                                                user = {sesionUser.name}
                                            />
                                        </div> :
                                        <></>
                                    }
                                    
                                </div>                    
                            </div>
                        </div>  
                        {
                            cargado ?
                            <div className="modal fade" id="staticBackdrop"  data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabel">{cargado.comercial}</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>  
                                        <div className="modal-body">
                                            <h6>Seleccione Productos</h6>
                                            { inven ?                                    
                                                <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col">VENCIMIENTO</th>
                                                            <th scope="col">LOTE</th>
                                                            <th scope="col">SALDO</th>
                                                            <th scope="col"></th>
                                                        </tr>   
                                                    </thead>
                                                    <tbody>
                                                        {inven.map((inv, index)=>(                                        
                                                            <tr key={inv.id}>
                                                                <td>
                                                                    {(Date.parse(inv.expiration)-Date.parse(today))/1000 > mes6 ?

                                                                        inv.expiration
                                                                        :
                                                                        (Date.parse(inv.expiration)-Date.parse(today))/1000 < 0 ?
                                                                        <span className="badge bg-danger">{inv.expiration}</span>:
                                                                        <span className="badge bg-warning">{inv.expiration}</span>
                                                                        
                                                                    }
                                                                </td>
                                                                <td>{inv.lote}</td>
                                                                <td>{inv.cantidad}</td>
                                                                <td>
                                                                    {
                                                                        inv.cantidad>0 ?
                                                                        <button className="btn btn-warning btn-sm" onClick={()=>cantidad(inv)}>Elegir</button> :
                                                                        <span className="badge bg-danger">Sin Inventario</span>
                                                                    }                                        
                                                                    
                                                                </td>
                                                            </tr>                                        
                                                        ))}
                                                    </tbody>
                                                </table>:
                                                <></>
                                            }
                                        </div>                                           
                                    </div>
                                </div>
                            </div>:
                            <></>
                        }
                    </>:
                    <>
                        <div className="container text-center">                                            
                            <Facturar comprados={comprados} impuestos={impuestos} descuentos={descuentos} totalFactura={totalFactura} setGenFactura={setGenFactura} setLastFactura={setLastFactura}/>                                            
                        </div>
                        
                    </>
                }      

            </>    
        )
    }else{
        return (
            <h1>No hay lista de precios definida</h1>
        )
    }
    
        
}