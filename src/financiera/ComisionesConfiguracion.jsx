import { useContext, useEffect, useState } from "react"
import { NavLink, useParams } from "react-router-dom"
import url from "../utils/urlimport"
import axios from "axios"
import Paginacion from "../components/Paginacion"
import Vacio from "../components/Vacio"
import AlertaContext from "../providers/AlertaContext"
import UserContext from "../providers/sesion/UserContext"
import Swal from "sweetalert2"
import ComisionesProductoDetalle from "./ComisionesProductoDetalle"
import ComisionesCrearUsuario from "./ComisionesCrearUsuario"
import ComisionesUsuariosDetalle from "./ComisionesUsuariosDetalle"
import ComisionesEditarUsuario from "./ComisionesEditarUsuario"


export default function ComisionesConfiguracion(){

    const {id} = useParams()
    const [seleccionado, setSeleccionado] = useState()
    const [estadoact, setEstadoact] = useState("Proceso");
    const [sigEstado, setSigEstado] = useState();
    const [texto, setTexto] = useState();
    const [usuarios, setUsuarios] = useState([])
    const [usuComision, setUsuComision] = useState([])
    const [producSel, setProducSel] = useState([])
    const [editUsuario, setEditUsuario]=useState(null);
    const [busca, setBusca] = useState()
    const [buscados, setBuscados] = useState()
    const alerta = useContext(AlertaContext)
    const {productos, buscaproductos} = useContext(UserContext);

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = usuarios?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;    
    

    //Seleccionar datos básicos del encabezado
    const axiosEncabezado = async () => {
        const ruta=url+"comisionencabezado/"+id
        await axios.get(ruta)
        .then((res)=>{                 
            setSeleccionado(res.data);
            estadoactual(res.data.status)            
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    // Seleccionar Usuarios cargados
    const axiosUsuariosCarga = async()=>{
        const ruta=url+"comisionUsuario"
        await axios.get(ruta)
        .then((res)=>{                 
            setUsuarios(res.data)
            filtrActual()          
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // Seleccionar los usuarios de esta membresia
    const filtrActual=()=>{
        const filtrados=usuarios?.filter((elemento)=>{
            if(elemento.comiEncaId===seleccionado.id){
                return elemento
            }
        });
        setUsuComision(filtrados);
    }

    // Seleccionar Productos cargados
    const axiosProductosCarga = async()=>{
        const rutapro=url+"comisionproducto/"+id
        
        await axios.get(rutapro)
        .then((res)=>{                 
            setProducSel(res.data)          
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const estadoactual = (status)=>{
        switch(status){
            case(1):
                setEstadoact("Proceso")
                setSigEstado(2)
                setTexto("Activar")
                break;
            case(2):
                setEstadoact("Activa")
                setSigEstado(3)
                setTexto("Inactivar")
                break;
            case(3):
                setEstadoact("Inactiva")
                break;
        }
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

    //Verificar que el producto esta seleccionado
    const elegir = async (uni)=>{        
        
        const ruta=url+"comisionproducto/"+id+"/"+uni
        
        await axios.get(ruta)
            .then((res)=>{                 
                if(res.data===null){        
                    asignarlo(uni)
                }else{
                    Swal.fire(
                        '¡Error!',
                        'Este producto ya esta asignado a esta comisión.',
                        'error'
                    )                
                }
            })
            .catch((error)=>{
                console.log(error)
            })

    }

    //Cargar el producto
    const asignarlo = async(uni)=>{
        const ruta=url+"comisionproducto"
        
        const { value: porcentaje } = await Swal.fire({
            title: 'Registre el porcentaje de comisión para este producto',
            input: 'text',
            inputLabel: 'Porcentaje:',
            inputValue: seleccionado.percentage,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'Es necesario registrar un porcentaje!'
                }
            }
        })

        if (porcentaje) {
            const info={
                "percentage":porcentaje,
                "prodId":uni,
                "comiEncaId":id
            }        
            await axios.post(ruta, info)
            .then((res)=>{                 
                setBusca("")
                axiosProductosCarga()
                alerta()
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        
    }

    //Actualizar estado 
    const updateEstado = async()=>{
        const ruta=url+"comisionencabezado/"+id
        const info={
            status:sigEstado
        }
        await axios.put(ruta, info)
        .then((res)=>{                 
            setSeleccionado(res.data);
            estadoactual(res.data.status)            
        })
        .catch((error)=>{
            console.log(error)
        })
    }



    // Cargar datos
    useEffect(()=>{
        axiosEncabezado()  
        axiosUsuariosCarga()
        axiosProductosCarga()
        buscaproductos()
    }, [])
    
    if(seleccionado)
    return(        
        <AlertaContext.Provider value={()=>[axiosUsuariosCarga(), axiosProductosCarga()]}>
            <div className="container text-center">
                <div className="alert alert-primary" role="alert">
                    <h5 className="modal-title" id="productos">
                        
                        COMISIONES: <strong>{seleccionado.name} </strong><br/>
                        DESCRIPCION: <strong>{seleccionado.description} </strong><br/>
                        DESCUENTO: <strong>{seleccionado.percentage} %</strong><br/>
                        USUARIOS ASIGNADOS: <strong>{usuComision?.length}</strong> <br/>
                        PRODUCTOS ASIGNADOS: <strong>{producSel?.length}</strong><br/>
                        ESTADO:<strong> {estadoact} </strong>
                        {
                            seleccionado.status<=2 && usuComision.length>0 && producSel.length>0 ?
                            <>
                                <button className="btn btn-info btn-sm" onClick={()=>updateEstado()}>{texto}</button> 
                            </>
                            :
                            <>
                            </>
                        }
                        <NavLink to="/comisiones"><button type="button" className="btn btn-primary btn-sm">volver</button></NavLink>
                    </h5>
                </div>
                {
                    seleccionado.status<=2 ?
                    <div className="row">
                        <div class="col">
                            <div className="container text-center alert alert-primary col-sm-10 mt-4" role="alert">
                                <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                        Crear Usuarios
                                    </button>
                                </div>                        
                                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Crear Usuario</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <ComisionesCrearUsuario id={id} />
                                            </div>                                    
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col">
                            <div className="container text-center alert alert-info  mt-4" role="alert">
                                <h5>Buscar Producto</h5>
                                <input value={busca} autoFocus onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>
                            </div>
                        </div>                    
                    </div>:
                    <></>
                } 
                
                <div className="row">
                    <div class="col">
                        {
                            usuarios.length>0?
                            <>
                                <h6>Seleccione Productos <small>{usuarios?.length} registros encontrados</small></h6>
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
                                            <th>Nombre</th>
                                            <th>Documento</th>
                                            <th>Email</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>                        
                                        {usuarios.map((usuario, index)=>(                                        
                                            <ComisionesUsuariosDetalle usuario={usuario} key={index} setEditUsuario={setEditUsuario} id={id}/>
                                        )).slice(firstIndex,lastIndex)}                        
                                    </tbody>
                                </table>
                                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="staticBackdropLabel">Modificar Usuario</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>  
                                            <div className="modal-body">
                                                <ComisionesEditarUsuario editUsuario={editUsuario} id={id}/>      
                                            </div>                                           
                                        </div>
                                    </div>
                                </div> 
                            </>
                            :
                            <>
                                <Vacio/>
                            </>
                        }
                    </div>
                    <div class="col">
                        {
                            busca ?
                            
                                <div className="alert alert-info" role="alert">                                    
                                    <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                        <thead>
                                            <tr>
                                                
                                                <th scope="col"><small>COMERCIAL</small></th>
                                                <th scope="col"><small>UNIDAD</small></th>
                                                <th scope="col"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {buscados.map((buscado, index)=>(                                        
                                                <tr key={buscado.id}>                                        
                                                    <td><small>{buscado.comercial}</small></td>
                                                    <td><small>{buscado.unit}</small></td>
                                                    <td>                                        
                                                        <button className="btn btn-warning btn-sm" onClick={()=>elegir(buscado.id)}>Elegir</button>
                                                    </td>
                                                </tr>                                        
                                            )).slice(firstIndex,lastIndex)}
                                        </tbody>
                                    </table>
                                </div>
                        
                            :
                            <></>
                        }
                        {
                            producSel.length>0?
                            <>
                                <h6>Seleccione Productos <small>{producSel?.length} registros encontrados</small></h6>
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
                                            <th>Producto</th>
                                            <th>Unidad</th>
                                            <th>Porcentaje (%)</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>                        
                                        {producSel.map((produc, index)=>(                                        
                                            <ComisionesProductoDetalle produc={produc} key={index} id={id}/>
                                        )).slice(firstIndex,lastIndex)}                        
                                    </tbody>
                                </table>
                            </>
                            :
                            <>
                                <Vacio/>
                            </>
                        }
                    </div>
                </div>
            </div>
        </AlertaContext.Provider> 
    )
}