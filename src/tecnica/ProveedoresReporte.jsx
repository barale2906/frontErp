import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import MenuReportes from "../components/MenuReportes";
import Paginacion from "../components/Paginacion";
import url from "../utils/urlimport";
import xlsimag from "../img/xlsimag.png";
import DescargarExcel from "../components/DescargarExcel";
import ProveedorDetalle from "./ProveedorDetalle";

const messages = {
    required: "Este campo es obligatorio",
    inicio: "Debe incluir una fecha",
    fin: "Debe incluir una fecha"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function (){

    const [consultas, setConsultas]=useState([]) 
    const [excel, setExcel]=useState()

    //parámetros de paginación 
    const [itemsPerPage, setItemsPerPage]=useState(15);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = consultas?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});

    const vacio = {
        inicio:'',
        fin:''        
    } 

    const onSubmit = async (reporteInfo) => {

        const pri=reporteInfo.inicio
        const ult=reporteInfo.fin
                
        const ruta=url+"tecnicaEncabezado/"+pri+"/"+ult
        
        axios.get(ruta)
             .then((response) =>{
                 if(response.status ===201){
                     
                    setConsultas(response.data)
                    reset(vacio)
                    
                    
                    }else{
                    Swal.fire(
                        '¡IMPORTANTE!',
                        `No fue posible guardar el registro`,
                        'error'
                    )
                    }
             })  
    }

    const imprimir=()=>{
        

        const envio = consultas.map((consulta)=>(
            
            
            //key=consulta.id,
            {
                "ID":consulta.id,
                "FECHA":consulta.fecha,
                "PROVEEDOR":consulta.proveedore.name,
                "FACTURA":consulta.consulta,
                "VALOR FACTURA":consulta.valor,
                "VALOR ABONADO":consulta.valorPagado,
                "OBSERVACIONES":consulta.observaciones
            }
        ));
        setExcel(envio)  
    }  
    
    return(
        
        <>
            <MenuReportes/>
            <div className="row container text-center mt-4">
                <div className="alert alert-success" role="alert">
                    <h4>Selecciona el rango de fechas</h4>
                    <form onSubmit={handleSubmit(onSubmit)} className="row row-cols-lg-auto g-3 align-items-center">
                        <div className="col-sm-5">
                            <label htmlFor="inicio" className="col-sm-3 col-form-label">Inicio:</label>
                            <input          
                            name="inicio"
                            type="date"
                            className={`col-sm-9 form-control ${errors.inicio && "error" }`}        
                            {...register("inicio", {
                                required: messages.required,
                                pattern: {
                                value: patterns.inicio,
                                message: messages.inicio
                                }
                            })}
                            />
                            {errors.inicio && <p className="text-danger">{errors.inicio.message}</p>}
                        </div>
                        <div className="col-sm-5">
                            <label htmlFor="fin" className="col-sm-2 col-form-label">Fin:</label>
                            <input
                            name="fin"
                            type="date"
                            className={`form-control ${errors.fin && "error"}`}
                            {...register("fin", {
                                required: messages.required,
                                pattern: {
                                value: patterns.fin,
                                message: messages.fin
                                }
                            })}
                            />
                            {errors.fin && <p className="text-danger">{errors.fin.message}</p>}
                        </div>
                        <div className="col-sm-2">
                            <button type="submit" className="btn btn-success">Buscar</button>
                        </div>
                    </form>
                </div>
            </div>

            {consultas.length>0 ?
                <div className="row">
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
                                <th colspan="5">Se encontrarón {consultas.length} registros</th>
                                <th>
                                    <button type="button" className="btn btn-sm" onClick={()=>imprimir()} data-bs-toggle="modal" data-bs-target="#staticExcel">
                                        <img src={xlsimag} className="img-fluid rounded-start" alt="Descargar en excel" width="30" />
                                    </button>
                                </th>
                            </tr>
                            <tr>
                                <th>FECHA</th>
                                <th>PROVEEDOR</th>
                                <th>FACTURA</th>
                                <th>VALOR FACTURA</th>
                                <th>VALOR ABONADO</th>
                                <th>OBSERVACIONES</th>                               
                            </tr>
                        </thead>
                        <tbody>
                            {
                                
                                consultas.map((consulta, index)=>(
                                    <>
                                        <ProveedorDetalle consulta={consulta} key={index} />
                                    </>                                    
                                )).slice(firstIndex,lastIndex)
                            }
                            
                        </tbody>
                    </table> 
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
                </div>:

                <h4>Selecciona un lapso para conocer las facturas de proveedores.</h4>                
            }
        </>
    )
}