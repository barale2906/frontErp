import axios from "axios";
import { useEffect, useState } from "react";
import MenuEfectivo from "../components/MenuEfectivo";
import Paginacion from "../components/Paginacion";
import Vacio from "../components/Vacio";
import url from "../utils/urlimport";

export default function MovimientosBodega(){
    const [bodegas, setBodegas] = useState([])
    const [bodegaElegida, setBodegaElegida] = useState()
    const [efectivo, setEfectivo] = useState()
    const [saldo, setSaldo] = useState()
    const rutap = url+"bodega"; 

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = efectivo?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;   
    

    // Seleccionar bodegas
    const axiosBodega = async () => { 
        await axios.get(rutap)
        .then((res)=>{        
            setBodegas(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    //Capturar dato
    const onChange = e=>{  
        setBodegaElegida(e.target.value)      
        efectivoconsulta(e.target.value)        
    }

    //Movimientos del efectivo para la bodega seleccionada
    const efectivoconsulta = async(id) =>{
        const rutaefec=url+"efectivo/"+id
        const rutaefecmov=url+"efectivo/"+id+"/bodega"

        await axios.get(rutaefec)
            .then((res)=>{        
                setSaldo(res.data);        
            })
            .catch((error)=>{
                console.log(error)
            })

        await axios.get(rutaefecmov)
            .then((res)=>{        
                setEfectivo(res.data);        
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    useEffect(()=>{
        axiosBodega();
    }, [])

    return(
        <>
            <MenuEfectivo/>            
            <div className="row">
                <div className="container text-center col-md-10">
                    <div className="alert alert-secondary" role="alert">
                        <h4>Seleccione Bodega a revisar</h4>
                    </div>                    
                    <select value={bodegaElegida} className="form-select" onChange={onChange} >
                        <option value=""></option>
                        {bodegas.map((bodega)=>(                                        
                            <option value={bodega.id} key={bodega.id}>{bodega.name}- Dirección: {bodega.adress}- Correo Electrónico: {bodega.email}</option>                                     
                        ))}
                    </select>
                </div>
            </div>
            {
                efectivo && saldo ?
                <div className="row">                    
                    <div className="container text-center">
                        {
                            efectivo.length>0 ?
                            <>
                                <h3 className="mt-4">
                                    <strong>SALDO: {"$ "+ new Intl.NumberFormat().format(saldo.saldo) }</strong>                                    
                                </h3>
                                <h6>
                                    <small> {efectivo?.length} registros encontrados</small>
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
                                            <th>MOVIMIENTO</th>
                                            <th>VALOR</th>
                                            <th>SALDO</th>
                                            <th>DOCUMENTO</th>
                                            <th>OBSERVACIONES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {efectivo.map((efect)=>(
                                            <tr key={efect.id}>
                                                <td>{efect.createdAt}</td>
                                                <td>
                                                    {efect.movimiento===1 ?"Ventas-Ingresos":"Pagos-Egresos"}
                                                </td>
                                                <td>{"$ "+ new Intl.NumberFormat().format(efect.valor) }</td>
                                                <td>{"$ "+ new Intl.NumberFormat().format(efect.saldo) }</td>
                                                <td>{efect.factura}</td>
                                                <td>{efect.observations}</td>
                                            </tr>
                                        )).slice(firstIndex,lastIndex)}
                                    </tbody>
                                </table>
                            </> :
                            <>
                                <h1 className="Display-1">No se encontraron datos para esta bodega</h1>
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