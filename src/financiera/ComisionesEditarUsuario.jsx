import { useContext, useEffect, useState } from "react";
import AlertaContext from "../providers/AlertaContext";
import { useForm } from "react-hook-form";
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

export default function ComisionesEditarUsuario({editUsuario}){

    const [comisiones, setComisiones] = useState([]);
    const rutam = url+"comisionencabezado";
    const alerta = useContext(AlertaContext);

    // Consulta para mostrar las comisiones
    const axiosComisiones = async () => {
        await axios.get(rutam)
        .then((res)=>{            
            setComisiones(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };
    useEffect(()=>{
        axiosComisiones();
    }, [])

    useEffect(()=>{
        reset(editUsuario)
    }, [editUsuario])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    const onSubmit = async (listaInfo) => {

        const ruta = url+"comisionusuario/"+editUsuario.id;
        
        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres modificar: ${editUsuario.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
        }).then((result) => {
        if (result.isConfirmed) {

            axios.put(ruta, listaInfo).then((response) =>{
                if(response.status ===200){
                    Swal.fire(
                        '¡MODIFICO EL USUARIO!',
                        'El usuario ha sido modificado correctamente',
                        'success'
                    )
                    alerta();
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Hubo un problema al modificar el usuario',
                        'error'
                    )
                }
            })

            
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

            <label htmlFor="tipoDocumento" className="form-label">Tipo Documento:</label>
            <select          
                name="tipoDocumento"                                
                className={`form-control ${errors.tipoDocumento && "error" }`}        
                {...register("tipoDocumento", {
                    required: messages.required,
                    pattern: {
                    value: patterns.tipoDocumento,
                    message: messages.tipoDocumento
                    }
                })}
            >                                
                
                <option value="Cédula">Cédula</option>
                <option value="NIT">NIT</option>                        
            </select>
            {errors.tipoDocumento && <p className="text-danger">{errors.tipoDocumento.message}</p>}

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

            <label htmlFor="comiEncaId" className="form-label">Seleccione comisiones asignadas</label>
            <select          
                name="comiEncaId"                                
                className={`form-control ${errors.comiEncaId && "error" }`}        
                {...register("comiEncaId", {
                    required: messages.required,
                    pattern: {
                    value: patterns.comiEncaId,
                    message: messages.comiEncaId
                    }
                })}
            >                                
                <option value=""></option>
                {comisiones.map((comision)=>(                                        
                    <option value={comision.id} key={comision.id}>{comision.name}</option>                                     
                ))}
            </select>
            {errors.comiEncaId && <p className="text-danger">{errors.comiEncaId.message}</p>}           
                            
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-info">Modificar Usuario</button>
            </div>  
        </form>
    )
}