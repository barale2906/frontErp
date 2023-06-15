import axios from "axios";
import { useContext, useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";
import tope from "../utils/monto";
import FacturaCrear from "./FacturaCrear";
import Cargando from "../components/Cargando";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    description: "Detalla el tipo de impuesto",
    valor: "Digite mínimo 8 caracteres"    
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
};
export default function Facturar({comprados,impuestos, descuentos, totalFactura, setGenFactura, setLastFactura}){

    const {sesionUser} = useContext(UserContext)
    const [usuarios, setUsuarios] = useState([]) 
    const [medios, setMedios] = useState([])
    const [domicilios, setdomicilios] = useState([])
    const [reqDomi, setReqDomi] = useState("0")
    const [domiEleg, setDomiEleg] = useState()
    const [comisionistas, setComisionistas] = useState()
    const [comiEleg, setComiEleg] = useState(0)
    const [busca, setBusca] = useState()
    const [buscados, setBuscados] = useState()
    const [elegido, setElegido]= useState()    
    const [form, setForm]=useState() 
    const [productoMembresia, setProductoMembresia] = useState([])
    const [pinFact, setPinFact] = useState(0)
    
    let listainfo        
    let totalFact = 0;
    let impuest = 0;
    let descuen = 0;
    let productos = [];


    // Seleccionar Usuarios cargados
    const axiosUsuariosCarga = async()=>{
        const ruta=url+"membresiaUsuario"        
        await axios.get(ruta)
        .then((res)=>{                 
            setUsuarios(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    //Requiere Domicilio
    const onChange = e=>{  
        setReqDomi(e.target.value)
        if(totalFactura>=tope)
        {
            aplicaDomicilio()
        }                    
    }    

    // Verifica si tiene el domicilio incluido
    const aplicaDomicilio = ()=>{
        setDomiEleg(domicilios[0])
    }

    // Asignar tarifa de domicilios
    const asigTariDomi = (domi)=>{
        setDomiEleg(domi)
    }
    // Seleccionar Usuarios cargados
    const axiosMediosCarga = async()=>{
        const rutam=url+"medioPago"        
        await axios.get(rutam)
        .then((res)=>{                 
            setMedios(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // Seleccionar domicilios
    const axiosDomis = async()=>{
        const rutam=url+"domicilioTarifa/1/status"        
        await axios.get(rutam)
        .then((res)=>{                 
            setdomicilios(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // Seleccionar comisionistas
    const axiosComisionistas = async()=>{
        const rutam=url+"comisionusuario"        
        await axios.get(rutam)
        .then((res)=>{                 
            setComisionistas(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // Select Comisionista
    const onCambio = e=>{  
        setComiEleg(e.target.value)
    }    

    // carga datos a buscar
    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    // Carga usuarios enconstrados según parámetros
    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=usuarios?.filter((elemento)=>{
            if(elemento.name?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
                || elemento.documento?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())            
            ){
                return elemento;
            }
        });
        setBuscados(resultadosBusqueda);
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        //setFocus    
    } = useForm({mode:'onblur'});

    const elegir = (buscado)=>{
        setElegido(buscado)
        setBusca()
    }

    useEffect(()=>{
        reset(elegido)
        setProductoMembresia([])
        setForm(1)
    }, [elegido])

    //Verificar productos según membresia
    const buscarproductos = async(listaInfo)=>{
        if(elegido){
            verificaMembresia(listaInfo)
        }else{
            // Cargar variables
            window.sessionStorage.setItem("listaInfo", JSON.stringify(listaInfo))
            window.sessionStorage.setItem("productosComprados", JSON.stringify(comprados))
            window.sessionStorage.setItem("impuestos", JSON.stringify(impuestos))
            window.sessionStorage.setItem("descuentos", JSON.stringify(descuentos))
            window.sessionStorage.setItem("totalFactura", JSON.stringify(totalFactura))
            window.sessionStorage.setItem("aplicaDomicilio", JSON.stringify(reqDomi))
            window.sessionStorage.setItem("comiEleg", JSON.stringify(comiEleg))
            if(reqDomi==="0"){
                const domicilio={
                    "id":0,
                    "name":"No Aplico Domicilio",
                    "tarifa":0
                }
                window.sessionStorage.setItem("domiEleg", JSON.stringify(domicilio))
            }else{
                window.sessionStorage.setItem("domiEleg", JSON.stringify(domiEleg))
            }
            setPinFact(1)
        }
    } 


    //Verificar productos según membresia
    const verificaMembresia = (listaInfo)=>{        
        
        comprados.forEach(function(elemento, indice) {
            const rutamem = url+"membresiaProducto/"+elegido.membreEncaId+"/"+elemento.prodId

            axios.get(rutamem)
                .then((response) =>{
                    if(response.data!=null){                        
                        //1. Cargar los productos con su descuento, impuestos, total
                        const porcentaje = response.data.percentage

                        const descuento = elemento.precio*porcentaje/100
                        const descuentobase = descuento*elemento.cantidad
                        const impuesto = (elemento.precio-descuento)*elemento.impuestoporc/100
                        const impuestobase = impuesto*elemento.cantidad
                        const total=(elemento.precio-descuento)+impuesto
                        const totalbase = total*elemento.cantidad

                        const nuevoElemento={
                            "cantidad":elemento.cantidad,
                            "comercial":elemento.comercial,
                            "descuento":descuento,
                            "descuentobase":descuentobase,
                            "expiration":elemento.expiration,
                            "id":elemento.id,
                            "impuesto":impuesto,
                            "impuestobase":impuestobase,
                            "impuestoporc":elemento.impuestoporc,
                            "invId":elemento.invId,
                            "lote":elemento.lote,
                            "lpId":elemento.lpId,
                            "precio":elemento.precio,
                            "preciobase":elemento.preciobase,
                            "prodId":elemento.prodId,
                            "saldo":elemento.saldo,
                            "total":total,
                            "totalbase":totalbase
                            
                        }
                        const items = [nuevoElemento, ...productos];
                        productos=items
                        
                        window.sessionStorage.setItem("productosComprados", JSON.stringify(productos))

                        // Cargar
                        totalFact=totalbase+totalFact;
                        window.sessionStorage.setItem("totalFactura", totalFact)
                        impuest=impuest+impuestobase;
                        window.sessionStorage.setItem("impuestos", impuest)
                        descuen = descuen+descuentobase;
                        window.sessionStorage.setItem("descuentos", descuen)

                        // Cargar cabecera
                        const cabecera = {
                            "adress":listaInfo.adress,
                            "bodegaId":listaInfo.bodegaId,
                            "createdAt":listaInfo.createdAt,
                            "descuentos":descuen,
                            "documento":listaInfo.documento,
                            "email":listaInfo.email,
                            //"id":listaInfo.id,
                            "impuestos":impuest,
                            "medioId":listaInfo.medioId,
                            "membreEncaId":listaInfo.membreEncaId,
                            "name":listaInfo.name,
                            "phone":listaInfo.phone,
                            "status":listaInfo.status,
                            "tipoDocumento":listaInfo.tipoDocumento,
                            "totalFactura":totalFact,
                            "updatedAt":listaInfo.updatedAt,
                            "updatedAt":listaInfo.updatedAt,
                            "userId":sesionUser.id
                        }
                        window.sessionStorage.setItem("listaInfo", JSON.stringify(cabecera))

                        
                    }else{

                        const items = [elemento, ...productos];
                        productos=items                                              
                        window.sessionStorage.setItem("productosComprados", JSON.stringify(productos))

                        // Cargar
                        totalFact=elemento.totalbase+totalFact;
                        window.sessionStorage.setItem("totalFactura", totalFact)
                        impuest=impuest+elemento.impuestobase;
                        window.sessionStorage.setItem("impuestos", impuest)
                        descuen = descuen+elemento.descuentobase;
                        window.sessionStorage.setItem("descuentos", descuen)

                        // Cargar cabecera
                        const cabecera = {
                            "adress":listaInfo.adress,
                            "bodegaId":listaInfo.bodegaId,
                            "createdAt":listaInfo.createdAt,
                            "descuentos":descuen,
                            "documento":listaInfo.documento,
                            "email":listaInfo.email,
                            //"id":listaInfo.id,
                            "impuestos":impuest,
                            "medioId":listaInfo.medioId,
                            "membreEncaId":listaInfo.membreEncaId,
                            "name":listaInfo.name,
                            "phone":listaInfo.phone,
                            "status":listaInfo.status,
                            "tipoDocumento":listaInfo.tipoDocumento,
                            "totalFactura":totalFact,
                            "updatedAt":listaInfo.updatedAt,
                            "updatedAt":listaInfo.updatedAt,
                            "userId":sesionUser.id
                        }
                        window.sessionStorage.setItem("listaInfo", JSON.stringify(cabecera))
                    }
                })


        })
        setTimeout(generar, 1000);
    }

    const generar = ()=>{        
        window.sessionStorage.setItem("comiEleg", JSON.stringify(comiEleg))
        window.sessionStorage.setItem("aplicaDomicilio", JSON.stringify(reqDomi))
        if(reqDomi==="0"){
            const domicilio={
                "id":0,
                "name":"No Aplico Domicilio",
                "tarifa":0
            }
            window.sessionStorage.setItem("domiEleg", JSON.stringify(domicilio))
        }else{
            window.sessionStorage.setItem("domiEleg", JSON.stringify(domiEleg))
        }
        setPinFact(1)
    }
    
    const retorno = ()=>{
        setGenFactura(0)
        sessionStorage.clear()
    }

    useEffect(() => {
        axiosUsuariosCarga()
        axiosMediosCarga()
        axiosDomis()
        axiosComisionistas()
    }, []);   
    

    return (
        <>
            <div className="container text-center">
                <div className="alert alert-info" role="alert">
                    <h6 className="modal-title" id="productos">
                        TOTAL: <strong>{"$ "+ new Intl.NumberFormat().format(totalFactura) } </strong>    
                        DESCUENTOS: <strong>{"$ "+ new Intl.NumberFormat().format(descuentos) } </strong><br/>
                        IMPUESTOS: <strong>{"$ "+ new Intl.NumberFormat().format(impuestos) } </strong>
                    </h6> 
                    <button className="btn btn-danger btn-sm" onClick={()=>retorno()}>Seguir Cargando Productos a la Factura </button>               
                </div>
                {
                    pinFact===1 ?
                    <>
                        <Cargando/>
                        <FacturaCrear setGenFactura={setGenFactura} setLastFactura={setLastFactura} setPinFact={setPinFact}/>
                    </>
                    :
                    <></>
                }
                <div className="row">
                    <div className="col-sm-6">
                        <div className="container text-center alert alert-info  mt-4" role="alert">
                            <h5>Digité Nombre o Cédula</h5>
                            <input value={busca} autoFocus onChange={handleChange} type="text" placeholder='Buscar cliente' className='form-control'/>
                        </div>
                        {
                            busca ?
                            
                                <div className="alert alert-info" role="alert">                                    
                                    <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                        <thead>
                                            <tr>
                                                
                                                <th scope="col"><small>NOMBRE</small></th>
                                                <th scope="col"><small>CEDULA</small></th>
                                                <th scope="col"><small>EMAIL</small></th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {buscados.map((buscado, index)=>(                                        
                                                <tr key={buscado.id}>                                        
                                                    <td><small>{buscado.name}</small></td>
                                                    <td><small>{buscado.documento}</small></td>
                                                    <td><small>{buscado.email}</small></td>
                                                    <td>                                        
                                                        <button className="btn btn-warning btn-sm" onClick={()=>elegir(buscado)}>Elegir</button>
                                                    </td>
                                                </tr>                                        
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                        
                            :
                            <></>
                            }
                        <div className="alert alert-warning" role="alert">
                            {
                                elegido ?
                                <h5>"Este cliente esta afiliado a una membresia, se aplicaran los descuentos al finalizar la factura"</h5>:
                                <></>
                            }
                            <form onSubmit={handleSubmit(buscarproductos)}>
                            
                                <label htmlFor="medioId" className="form-label">Forma de Pago:</label>
                                    <select          
                                        name="medioId"                                
                                        className={`form-control ${errors.medioId && "error" }`}        
                                        {...register("medioId", {
                                            required: messages.required,
                                            pattern: {
                                            value: patterns.medioId,
                                            message: messages.medioId
                                            }
                                        })}
                                    >                                
                                        <option value="">Seleccione medio de pago</option>
                                        {medios.map((medio, index)=>(
                                            medio.name!=="Aporte Socios" ? <option value={medio.id}>{medio.name}</option>:<></>
                                        ))}
                                    </select>
                                {errors.medioId && <p className="text-danger">{errors.medioId.message}</p>}
                                
                                <label htmlFor="name" className="form-label">Nombre:</label>
                                <input          
                                    name="name"
                                    type="text"
                                    //onFocus
                                    defaultValue="cliente Mostrador"
                                    className={`form-control ${errors.name && "error" }`}        
                                    {...register("name", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.name,
                                        message: messages.name
                                        }
                                    })}
                                />
                                {errors.name && <p className="text-danger">{errors.name.message}</p>}

                                <label htmlFor="tipoDocumento" className="form-label">Tipo Documento:</label>
                                <select          
                                    name="tipoDocumento"                                
                                    className={`form-control ${errors.tipoDocumento && "error" }`}        
                                    {...register("tipoDocumento", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.tipoDocumento,
                                        message: messages.tipoDocumento
                                        }
                                    })}
                                >                                
                                    
                                    <option value="Cédula">Cédula</option>
                                    <option value="NIT">NIT</option>                        
                                </select>
                                {errors.tipoDocumento && <p className="text-danger">{errors.tipoDocumento.message}</p>}

                                <label htmlFor="documento" className="form-label">Documento:</label>
                                <input          
                                    name="documento"
                                    type="text"
                                    defaultValue="99999999"
                                    className={`form-control ${errors.documento && "error" }`}        
                                    {...register("documento", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.documento,
                                        message: messages.documento
                                        }
                                    })}
                                />
                                {errors.documento && <p className="text-danger">{errors.documento.message}</p>}

                                <label htmlFor="adress" className="form-label">Dirección: </label>
                                <input
                                    name="adress"
                                    type="text"
                                    defaultValue="Calle 1 # 1 - 10"
                                    className={`form-control ${errors.adress && "error"}`}
                                    {...register("adress", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.adress,
                                        message: messages.adress
                                        }
                                    })}
                                />
                                {errors.adress && <p className="text-danger">{errors.adress.message}</p>}

                                <label htmlFor="phone" className="form-label">Teléfono:</label>
                                <input          
                                    name="phone"
                                    type="text"
                                    defaultValue="99999999"
                                    className={`form-control ${errors.phone && "error" }`}        
                                    {...register("phone", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.phone,
                                        message: messages.phone
                                        }
                                    })}
                                />
                                {errors.phone && <p className="text-danger">{errors.phone.message}</p>}

                                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                                <input          
                                    name="email"
                                    type="email"
                                    defaultValue="mostrador@dominio.com"
                                    className={`form-control ${errors.email && "error" }`}        
                                    {...register("email", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.email,
                                        message: messages.email
                                        }
                                    })}
                                />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}                                

                                <input
                                    name="userId"
                                    type="hidden"                                    
                                    {...register("userId")}
                                    defaultValue={sesionUser.id}
                                />
                                <input
                                    name="bodegaId"
                                    type="hidden"                                    
                                    {...register("bodegaId")}
                                    defaultValue={sesionUser.bodega}
                                />
                                <input
                                    name="totalFactura"
                                    type="hidden"                                    
                                    {...register("totalFactura")}
                                    defaultValue={totalFactura}
                                />
                                <input
                                    name="impuestos"
                                    type="hidden"                                    
                                    {...register("impuestos")}
                                    defaultValue={impuestos}
                                />
                                <input
                                    name="descuentos"
                                    type="hidden"                                    
                                    {...register("descuentos")}
                                    defaultValue={descuentos}
                                />
                                            
                                <div className="modal-footer">                    
                                    <button type="submit" className="btn btn-warning">FACTURAR</button>
                                </div>  
                            </form>
                        </div>
                        
                    </div>
                    <div className="col-sm-6">
                        <div className="container text-center">
                            <h5>Requiere Domicilio</h5>
                            <select value={reqDomi} className="form-select mb-3" onChange={onChange} >
                                <option value=""></option>
                                <option value="1">Si</option>
                                <option value="0">No</option>
                            </select>
                        </div>
                        {
                            reqDomi==="0" ?
                            <></>
                            :
                            <div className="container text-center">
                                <table className="table table-info table-hover table-bordered table-responsive table-striped mt-3">
                                    <thead>
                                        <tr>
                                            <th scope="col">NOMBRE</th>  
                                            <th scope="col">DETALLE</th>
                                            <th scope="col">TARIFA</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {domicilios.map((domicilio, index)=>(                                        
                                            <tr key={domicilio.id}>
                                                <td><small>{domicilio.name}</small></td>
                                                <td><small>{domicilio.detalle}</small></td>
                                                <td><small>{"$ "+ new Intl.NumberFormat().format(domicilio.tarifa)}</small></td>
                                                <td>
                                                    {
                                                        domiEleg?.id===domicilio.id ?
                                                        <small>Asignada</small>
                                                        :
                                                        <button type="button" className="btn btn-info btn-sm" onClick={()=>asigTariDomi(domicilio)}>Elegir</button>
                                                    }                                            
                                                </td>
                                            </tr>                                            
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        }

                        <div className="container text-center">
                            <h5>Elija Comisionista</h5>
                            <select value={comiEleg} className="form-select mb-3" onChange={onCambio} >
                                <option value=""></option>
                                {comisionistas?.map((comisionista, index)=>(
                                    <option value={comisionista.id}>{comisionista.name}</option>
                                ))}
                            </select>
                        </div>
                                        
                        <div className="container text-center">                                        
                            <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">COMERCIAL</th>  
                                        <th scope="col">LOTE</th>
                                        <th scope="col">FECHA</th>
                                        <th scope="col">CANT</th>
                                        <th scope="col">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comprados.map((comprado, index)=>(                                        
                                    <tr key={comprado.id}>
                                        <td><small>{comprado.comercial}</small></td>
                                        <td><small>{comprado.lote}</small></td>
                                        <td><small>{comprado.expiration}</small></td>
                                        <td><small>{comprado.cantidad}</small></td>
                                        <td><small>{"$ "+ new Intl.NumberFormat().format(comprado.totalbase)}</small></td>
                                    </tr>                                            
                                    ))}
                                </tbody>
                            </table>                    
                        </div>                
                    </div>
                </div>            
            </div>
            
        </>        
    )
}