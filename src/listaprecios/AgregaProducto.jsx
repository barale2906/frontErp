import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Paginacion from "../components/Paginacion";
import UserContext from "../providers/sesion/UserContext";

export default function AgregaProducto(){

    const [busca, setBusca] = useState()
    const [buscados, setBuscados] = useState()
    const {id} = useParams()
    let navig = useNavigate() 
    
    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = buscados?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage; 
    
    
    const {productos, buscaproductos} = useContext(UserContext);
    
    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    const reenviar = (uni)=>{
        window.sessionStorage.setItem("IdProd", uni)
        navig("/cargaproducto/"+id)
    }

    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=productos?.filter((elemento)=>{
          if( elemento.comercial?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.code?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          //|| elemento.generico?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          ){
            return elemento;
          }
        });
        setBuscados(resultadosBusqueda);
    }

    const volver = ()=>{
        window.sessionStorage.removeItem("IdProd")
        setBusca()
        setBuscados()
        navig("/listaprecios/"+id)
    }

    useEffect(()=>{
        buscaproductos()
    },[])
    
    return (
        <>
            <div className="container text-center col-sm-10">
                <div className="alert alert-success" role="alert">
                    <h5>Cargar Producto</h5>
                    <input value={busca} onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>
                    <button onClick={volver} className="btn btn-success">Volver</button>
                </div>                            
            </div>
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
                                {buscados.map((buscado, index)=>(                                        
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
        </>
    )
}