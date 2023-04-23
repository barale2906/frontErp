import axios from "axios"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import MenuReportes from "../components/MenuReportes";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport"
import BasicosDetalle from "./BasicosDetalle";
import BasicosEdit from "./BasicosEdit";


export default function Basicos(){

    const [basico, setBasico]=useState()
    const [modBasico, setModBasico]=useState(null)
    const ruta=url+"basicos"

    const axiosBasico=async()=>{
        await axios.get(ruta)
        .then((res)=>{
            if(res.data.length>0){
                setBasico(res.data)
            } else {
                cargaEmpresa()
            }
        })

        .catch((error)=>{
            console.log(error)
        })        
    }

    const cargaEmpresa=async()=>{
        const datos={
            "nit":"900800700-6",
            "name":"Drogueria Vital L.P.",
            "phone":"3104549471",
            "email":"drogueria@gmail.com",
            "adress":"Pereira",
            "actividad":5320,
            "ciudad":"Pereira",
            "resolucion":"resfact2032568",
            "representante":"Paola Cuervo"
        }
        await axios.post(ruta, datos)
        .then((res)=>{
            setBasico(res.data)
        })
    }

    

    useEffect(() => {
        axiosBasico()
      }, []);

    
    if(basico)
    return(
        <>
            <MenuReportes/>
            <AlertaContext.Provider value={()=>[axiosBasico()]}>
                <BasicosDetalle basico={basico} setModBasico={setModBasico}/>
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">Modificar Datos</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>  
                            <div className="modal-body">
                                <BasicosEdit modBasico={modBasico}/>
                            </div>                                    
                        </div>
                    </div>
                </div>
            </AlertaContext.Provider>
        </>
    )
}