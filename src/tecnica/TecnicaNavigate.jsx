import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import url from "../utils/urlimport"
import TecnicaCargaProd from "./TecnicaCargaProd"

export default function TecnicaNavigate(){

    let navegar = useNavigate()
    const idprod = window.sessionStorage.getItem("IdProd")
    const idencab = window.sessionStorage.getItem("Idencab")
    const [elegido, setElegido] = useState()
    const ruta = "/tecnicas/"+idencab
    const rutaps = url+"producto/"+idprod


    const volver = ()=>{
        window.sessionStorage.removeItem("IdProd")
        setElegido()
        navegar(ruta)
    }

    //Seleccionar productos registrados
    const axiosProductoSel = async () => {
        await axios.get(rutaps)
        .then((res)=>{                 
            setElegido(res.data);                            
        })
        .catch((error)=>{
            console.log(error)
        })
    }; 

    

    useEffect(()=>{
        axiosProductoSel()
    }, [idprod])
if(elegido)
    return (
        <>
            <div className="alert alert-primary" role="alert">
                <h5 className="modal-title" id="staticBackdropLabel">
                    Comercial: <strong>{elegido.comercial}</strong>  Generico: <strong>{elegido.generico} </strong> 
                    CUM: <strong>{elegido.cum}</strong> Unidad: <strong>{elegido.unit} </strong>
                    Descripción: <strong>{elegido.description}</strong>
                </h5>
                <button onClick={volver} className="btn btn-primary">Volver</button>
            </div>
            <div className="alert alert-primary" role="alert">
                <TecnicaCargaProd />
            </div>
            
        </>
    )
}