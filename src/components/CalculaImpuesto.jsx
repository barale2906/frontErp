import axios from "axios";
import { useEffect, useState } from "react";
import url from "../utils/urlimport";


export default function CalculaImpuesto({precio, idimpuesto, descuento}){

    const [impuesto, setImpuesto] = useState()

    // Seleccionar productos en Inventario
    const axiosimpuesto = async () => {
        const rutain=url+"impuesto/"+idimpuesto
        
        await axios.get(rutain)
        .then((res)=>{ 
            setImpuesto(res.data)                       
        })
        .catch((error)=>{
            console.log(error)
        })
    };
    useEffect(()=>{
        axiosimpuesto();
    }, [precio])

    if(impuesto)
    return (
        <>
            <div class="alert alert-primary" role="alert">
                <h4>¡RECUERDA QUE PARA ACTUALIZAR EL VALOR DEBES DIGITAR CAMBIOS EN EL PRECIO Y EN EL DESCUENTO</h4>                
                <strong>Si registras un valor de: </strong>{"$ "+ new Intl.NumberFormat().format(precio) },<br/>
                <strong>y aplicas un descuento de: </strong>{"$ "+ new Intl.NumberFormat().format(descuento) },<br/>                
                <strong>Tendría un impuesto de {impuesto.name}, por: </strong>{"$ "+ new Intl.NumberFormat().format((precio-descuento)*impuesto.valor/100) }<br/>
                <h4><strong>Para un costo Total de: </strong>{"$ "+ new Intl.NumberFormat().format(((precio-descuento))+(precio-descuento)*impuesto.valor/100) }</h4>
            </div>
        </>
    )
}