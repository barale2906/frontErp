import { useForm } from "react-hook-form";
import AlertaContext from "../providers/AlertaContext";
import { useContext } from "react";
import url from "../utils/urlimport";
import Swal from "sweetalert2";
import axios from "axios";

const messages = {
    required: "Este campo es obligatorio"
};


const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};
export default function DomiciliosEntregar({elegidos, setElegidos, setGenEntrega}){

    let today = new Date();  // crea un nuevo objeto `Date`        
    let now = today.toISOString(); // obtener la fecha y la hora
    let key
    const vacio={
        name:''
    }

    const alerta = useContext(AlertaContext) 

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    const onSubmit = async (Info) => {
        cargar(Info)   
    }

    const cargar=(Info)=>{
        elegidos.map((elegido)=>(
            key=elegido.id,
            cargaDetalle(elegido,Info)            
        ))  
        fina(Info)
    }

    const cargaDetalle=(domi, Info)=>{
        const rutam=url+"domicilio/"+domi.id
        const datos={
            "name":Info.name,
            "fechaRecoleccion":now,
            "status":2,
            "observaciones":"+--+"+now+" Se le asigno el domicilio a: "+Info.name+"--"+domi.observaciones
        }        
        axios.put(rutam, datos)
        .then((response) =>{

        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const fina=(Info)=>{
        alerta();
        setElegidos([])
        setGenEntrega(2)
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Los domicilios fueron asignados correctamente a: <strong>${Info.name}</strong>`,
            showConfirmButton: false,
            timer: 1500
        })
        reset(vacio)        
    }

    
    return(
        <>
        {
            elegidos.length>0 ?
            <>
                <div className="container text-center alert alert-primary mt-2" role="alert">
                    <p>Asignar los siguientes domicilios:</p>
                    <ul className="list-group">
                        {elegidos.map((elegido, index)=>(                
                            <li className="list-group-item" key={elegido.id}>
                                Factura: {elegido.factId}, Valor: {"$ "+ new Intl.NumberFormat().format(elegido.facturaEncabezado.domiTarifa)} Valor recaudar: {"$ "+ new Intl.NumberFormat().format(elegido.facturaEncabezado.totalFactura+elegido.facturaEncabezado.domiTarifa)}
                            </li>
                        ))}                
                    </ul>
                    a:
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="name" className="form-label">Nombre del mensajero</label>
                        <input          
                        name="name"
                        type="text"
                        placeholder="Nombre Mensajero"
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

                        <hr/>
                        <button type="button" className="btn btn-secondary" onClick={()=>{setGenEntrega(0)}}>Cerrar</button>
                        <button type="submit" className="btn btn-info">Asignar</button>
                        
                    </form>
                    
                </div>            

            </>:
            <>
                <p>Da clic en Reiniciar para continuar asignando</p>
            </>
        }
        </>
    )
}