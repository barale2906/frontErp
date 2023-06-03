import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import axios from "axios";
import Paginacion from "../components/Paginacion";
import Vacio from "../components/Vacio";
import MovimientosCrear from "./MovimientosCrear";

export default function MovimientosListado(){
    
    const [medios, setMedios]=useState([])
    const [medioElegido, setMedioElegido]=useState()
    const [registros, setRegistros]=useState()

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = registros?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage; 

    const rutap = url+"medioPago";

    //Seleccionar medios de pago
    const axiosMedios = async () => { 
        await axios.get(rutap)
        .then((res)=>{        
            setMedios(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    //Capturar dato
    const onChange = e=>{  
        setMedioElegido(e.target.value)      
        medioconsulta(e.target.value)        
    }

    //Movimientos del registros para la bodega seleccionada
    const medioconsulta = async(id) =>{
        
        const rutaefecmov=url+"movimientos/"+id+"/medio"

        await axios.get(rutaefecmov)
            .then((res)=>{        
                setRegistros(res.data);   
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    useEffect(()=>{
        axiosMedios();
    }, [])


    return (
        <>
            <div className="row">
                <div className="container text-center col-md-9">
                    <div className="alert alert-secondary" role="alert">
                        <h4>Seleccione Medio de Pago</h4>
                    </div>                    
                    <select value={medioElegido} className="form-select" onChange={onChange} >
                        <option value=""></option>
                        {medios.map((medio)=>(                                        
                            <option value={medio.id} key={medio.id}>{medio.name}</option>                                     
                        ))}
                    </select>
                </div>
                <div className="container text-center col-md-3">
                    <div className="alert alert-info" role="alert">
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Movimiento
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Movimiento</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <MovimientosCrear medios={medios}/>
                                        </div>                                    
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
            {
                registros ?
                <div className="row">                    
                    <div className="container text-center">
                        {
                            registros.length>0 ?
                            <>                                
                                <h6>
                                    <small> {registros?.length} registros encontrados</small>
                                </h6>
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
                                            <th>FECHA</th>
                                            <th>MONTO</th>
                                            <th>MEDIO DE PAGO</th>
                                            <th>CONCEPTO</th>
                                            <th>TIPO</th>
                                            <th>OBSERVACIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registros?.map((regis)=>(
                                            <tr key={regis.id}>
                                                <td>{regis.fecha}</td>
                                                <td>{"$ "+ new Intl.NumberFormat().format(regis.monto) }</td>
                                                <td>{regis.medioPago.name}</td>
                                                <td>{regis.concepto}</td>
                                                <td>
                                                    {regis.tipoMovimiento===1 ?"Ingresos":"Egresos"}
                                                </td>
                                                <td>{regis.observaciones}</td>
                                            </tr>
                                        )).slice(firstIndex,lastIndex)}
                                    </tbody>
                                </table>
                            </> :
                            <>
                                <h1 className="Display-1">No se encontraron datos para este medio de pago</h1>
                                <Vacio/>
                            </>
                        }

                    </div>
                </div> :
                <>                                       
                    <Vacio/>
                </>
            }
        </>
    )
}