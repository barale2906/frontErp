import axios from "axios";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};   
const patterns = {
//name: /^[A-Za-z]+$/i,
};

export default function ComisionesCrearUsuario({id}){

    const ruta = url+"comisionusuario";
    const alerta = useContext(AlertaContext);
    const vacio = {
        name:'',
        documento:'',
        adress:'',
        phone:'',
        email:''
    }

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
                        title: `Haz creado el usuario: <strong>${response.data.name}</strong>`,
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

    return(
        <form onSubmit={handleSubmit(onSubmit)}>            
            
            <label htmlFor="name" className="form-label">Nombre:</label>
            <input          
                name="name"
                type="text"
                onFocus
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

            <label htmlFor="documento" className="form-label">Documento:</label>
            <input          
                name="documento"
                type="text"
                className={`form-control ${errors.documento && "error" }`}        
                {...register("documento", {
                    required: messages.required,
                    pattern: {
                    value: patterns.documento,
                    message: messages.documento
                    }
                })}
            />
            {errors.documento && <p className="text-danger">{errors.documento.message}</p>}

            <label htmlFor="adress" className="form-label">Dirección: </label>
            <input
                name="adress"
                type="text"
                className={`form-control ${errors.adress && "error"}`}
                {...register("adress", {
                    required: messages.required,
                    pattern: {
                    value: patterns.adress,
                    message: messages.adress
                    }
                })}
            />
            {errors.adress && <p className="text-danger">{errors.adress.message}</p>}

            <label htmlFor="phone" className="form-label">Teléfono:</label>
            <input          
                name="phone"
                type="text"
                className={`form-control ${errors.phone && "error" }`}        
                {...register("phone", {
                    required: messages.required,
                    pattern: {
                    value: patterns.phone,
                    message: messages.phone
                    }
                })}
            />
            {errors.phone && <p className="text-danger">{errors.phone.message}</p>}

            <label htmlFor="email" className="form-label">Correo Electrónico:</label>
            <input          
                name="email"
                type="email"
                className={`form-control ${errors.email && "error" }`}        
                {...register("email", {
                    required: messages.required,
                    pattern: {
                    value: patterns.email,
                    message: messages.email
                    }
                })}
            />
            {errors.email && <p className="text-danger">{errors.email.message}</p>}

            <input
                name="comiEncaId"
                type="hidden"                                    
                {...register("comiEncaId")}
                defaultValue={id}
            />
                            
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-info">Crear Usuario</button>
            </div>  
        </form>
    )
}