import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};  
  
const patterns = {
//name: /^[A-Za-z]+$/i,
};

export default function ListaCrear(){

    const [bodegas, setBodegas] = useState([])
    const ruta = url+"listaprencab";
    const rutap = url+"bodega";        
    const alerta = useContext(AlertaContext)
    const {sesionUser} = useContext(UserContext)
    const vacio = {
        name:'',
        vigencia:'',
        description:'',
        bodegaId:''
    } 

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

    useEffect(()=>{
        axiosBodega();
    }, [])
  
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset 
    } = useForm({mode:'onblur'});
  
  
    const onSubmit = async (listaInfo) => {
        
       axios.post(ruta, listaInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz creado la lista de precios: <strong>${response.data.name}</strong>`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    reset(vacio)
                    alerta();
                    
                    }else{
                        Swal.fire(
                            '¡IMPORTANTE!',
                            `No fue posible guardar el registro`,
                            'error'
                        )
                    }
            })  
    }   
  
  
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <label htmlFor="name" className="form-label">Nombre de la lista:</label>
            <input          
                name="name"
                type="text"
                placeholder="Nombre Lista"
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

            <label htmlFor="inicia" className="form-label">Inicia Vigencia</label>
            <input          
                name="inicia"
                type="date"
                className={`form-control ${errors.inicia && "error" }`}        
                {...register("inicia", {
                required: messages.required,
                pattern: {
                    value: patterns.inicia,
                    message: messages.inicia
                }
                })}
            />
            {errors.inicia && <p className="text-danger">{errors.inicia.message}</p>}


            <label htmlFor="fin" className="form-label">Finaliza Vigencia</label>
            <input          
                name="fin"
                type="date"
                className={`form-control ${errors.fin && "error" }`}        
                {...register("fin", {
                required: messages.required,
                pattern: {
                    value: patterns.fin,
                    message: messages.fin
                }
                })}
            />
            {errors.fin && <p className="text-danger">{errors.fin.message}</p>}
            
    
            <label htmlFor="description" className="form-label">Descripción: </label>
            <input
                name="description"
                type="text"
                placeholder="Registre una descripción"
                className={`form-control ${errors.description && "error"}`}
                {...register("description", {
                    required: messages.required,
                    pattern: {
                    value: patterns.description,
                    message: messages.description
                    }
                })}
            />
            {errors.description && <p className="text-danger">{errors.description.message}</p>}


            <label htmlFor="bodegaId" className="form-label">Seleccione Bodega a la que aplica la lista</label>
            <select          
                name="bodegaId"                                
                className={`form-control ${errors.bodegaId && "error" }`}        
                {...register("bodegaId", {
                    required: messages.required,
                    pattern: {
                    value: patterns.bodegaId,
                    message: messages.bodegaId
                    }
                })}
            >                                
                <option value=""></option>
                {bodegas.map((bodega)=>(                                        
                    <option value={bodega.id} key={bodega.id}>{bodega.name}</option>                                     
                ))}
            </select>
            {errors.bodegaId && <p className="text-danger">{errors.bodegaId.message}</p>}

            <input
                name="userId"
                type="hidden"                                    
                {...register("userId")}
                defaultValue={sesionUser.id}
            />

                        
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            <button type="submit" className="btn btn-info">Crear Lista de Precios</button>
            </div>  
        </form>
    );
}