import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import axios from "axios";
import { Link } from "react-router-dom";
import AmbientalCrear from "./AmbientalCrear";
import xlsimag from "../img/xlsimag.png";
import DescargarExcel from "../components/DescargarExcel";
import Paginacion from "../components/Paginacion";

export default function AmbientalLanding(){

    const [ubicacions, setUbicacions] = useState([]); 
    const [temperaturas, setTemperaturas] = useState([]); 
    const [humedades, setHumedades] = useState([]); 
    const [excel, setExcel]=useState()
    const ruta = url+"ambientalubi"; 
    const rutaT = url+"ambientalubi/Temperatura/temperatura"; 
    const rutaH = url+"ambientalubi/Humedad/humedad";  
    
    //parámetros de paginación humedad relativa
    const [itemsPerPagehr, setItemsPerPagehr]=useState(25);
    const [currentPagehr, setCurrentPagehr]=useState(1);
    const totalItemshr = humedades?.length; //Total de registros a paginar
    const lastIndexhr = currentPagehr * itemsPerPagehr;
    const firstIndexhr = lastIndexhr-itemsPerPagehr;

    //parámetros de paginación temperatura
    const [itemsPerPage, setItemsPerPage]=useState(25);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = temperaturas?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;
    

    
    // Consulta para mostrar 
    const axiosUbicacion = async () => {
      await axios.get(ruta)
      .then((res)=>{
        
        setUbicacions(res.data);
        
      })
      .catch((error)=>{
        console.log(error)
      })
    };

    const axiosTemperatura = async () => {
        await axios.get(rutaT)
        .then((res)=>{
          
          setTemperaturas(res.data);
          
        })
        .catch((error)=>{
          console.log(error)
        })  
    } 

    const axiosHumedade = async () => {
        await axios.get(rutaH)
        .then((res)=>{
          
          setHumedades(res.data);
          
        })
        .catch((error)=>{
          console.log(error)
        })  
    }
    
    // Generar Excel
    const imprimir=(consultas)=>{
        

        const envio = consultas.map((consulta)=>(
            
            
            //key=factura.id,
            {
                "UBICACION":consulta.ambientalUbicacion.name,
                "VARIABLE":consulta.variable,
                "VALOR":consulta.valor,
                "FECHA":consulta.createdAt,
                "REGISTRO":consulta.user.name
            }
        ));
        setExcel(envio)  
    } 

    useEffect(()=>{
      axiosUbicacion();
      axiosTemperatura();
      axiosHumedade();
    }, [])


    if(!ubicacions){
        return <Cargando/>
    } else if(ubicacions.length===0){
        
        return (
            <>
                <div className="row container text-center">                
                       <Link to="/ambientalubi">Ir a Crear Ubicación</Link>
                </div> 
                <Vacio/>
                
            </>
        ) 
    } else {
        return (
            <>
                <AlertaContext.Provider value={()=>[axiosUbicacion(), axiosTemperatura(), axiosHumedade()]}>
                    <div className="row">
                        <div className="container text-center col-sm-6">
                            <button type="button" className="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Cargar Registro</button>
                        </div>
                    </div>
                    <div className="row mt-2">                
                        <div className="container text-center col-sm-6">
                            <div className="alert alert-warning" role="alert">
                                <h5>Húmedad Relativa</h5>
                                <Paginacion 
                                    itemsPerPage={itemsPerPagehr} 
                                    setItemsPerPage={setItemsPerPagehr}
                                    currentPage={currentPagehr}
                                    setCurrentPage={setCurrentPagehr}
                                    totalItems={totalItemshr}
                                />
                                <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                    <thead>
                                        <tr>                                        
                                            <th scope="col">
                                                
                                                <button type="button" className="btn btn-sm" onClick={()=>imprimir(humedades)} data-bs-toggle="modal" data-bs-target="#staticExcel">
                                                    <img src={xlsimag} className="img-fluid rounded-start" alt="Descargar en excel" width="30" />
                                                </button>
                                            </th>
                                            <th scope="col">UBICACION</th>
                                            <th scope="col">VALOR</th>
                                            <th scope="col">FECHA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {humedades.map((humedad)=>(                                        
                                            <tr key={humedad.id}>
                                                <td colSpan={2}>{humedad.ambientalUbicacion.name}</td> 
                                                <td>{humedad.valor}</td>
                                                <td>
                                                    {
                                                        new Date(humedad.createdAt).toLocaleString('es-CO')
                                                    }
                                                </td>
                                            </tr>                                         
                                        )).slice(firstIndexhr,lastIndexhr)}
                                    </tbody>
                                </table>
                            </div>                            
                        </div>
                        <div className="container text-center col-sm-6">
                            <div className="alert alert-primary" role="alert">
                                <h5>Temperatura</h5>
                                <Paginacion 
                                    itemsPerPage={itemsPerPage} 
                                    setItemsPerPage={setItemsPerPage}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                    totalItems={totalItems}
                                />
                                <table className="table table-info table-hover table-bordered table-responsive table-striped">
                                    <thead>
                                        <tr>
                                            <th scope="col">
                                                <button type="button" className="btn btn-sm" onClick={()=>imprimir(temperaturas)} data-bs-toggle="modal" data-bs-target="#staticExcel">
                                                    <img src={xlsimag} className="img-fluid rounded-start" alt="Descargar en excel" width="30" />
                                                </button>
                                            </th>                                        
                                            <th scope="col">UBICACION</th>
                                            <th scope="col">VALOR</th>
                                            <th scope="col">FECHA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {temperaturas.map((temperatura)=>(                                        
                                            <tr key={temperatura.id}>
                                                <td colSpan={2}>{temperatura.ambientalUbicacion.name}</td> 
                                                <td>{temperatura.valor}</td>
                                                <td>
                                                    {
                                                        new Date(temperatura.createdAt).toLocaleString('es-CO')
                                                    }
                                                </td>
                                            </tr>                                         
                                        )).slice(firstIndex,lastIndex)}
                                    </tbody>
                                </table>
                            </div>                            
                        </div>                        
                    </div>
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Cargar Registro para </h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                        <AmbientalCrear ubicacions={ubicacions}/>
                                </div>                            
                            </div>
                        </div>                        
                    </div>  
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
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}