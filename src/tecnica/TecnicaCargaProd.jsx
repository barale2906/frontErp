import axios from "axios";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function TecnicaCargaProd(){

    const [elegido, setElegido] = useState(
        window.sessionStorage.getItem("IdProd")
    )
    const [encabId, setEncabId] = useState(
        window.sessionStorage.getItem("Idencab")
    )
    let navigate = useNavigate();

    const {sesionUser} = useContext(UserContext)

    

    const ruta = url+"tecnicadetalle";
    const rutap = "/tecnicas/"+encabId
    const alerta = useContext(AlertaContext)
    const vacio = {
        lote:'',
        expiration:'',
        tipoproducto:'',
        cantidad:'',
        observations:''
    } 

    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});


    const onSubmit = async (cargaInfo) => {
        axios.post(ruta, cargaInfo)
            .then((response) =>{
                if(response.status ===201){
                    
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: `Haz cargado el producto satisfactoriamente`,
                        showConfirmButton: false,
                        timer: 1500
                        })
                    
                    reset(vacio)
                    alerta();
                    navigate(rutap)
                    window.sessionStorage.removeItem("IdProd")

                    
                    }else{
                    Swal.fire(
                        '¡IMPORTANTE!',
                        `No fue posible guardar el registro`,
                        'error'
                    )
                    }
            })  
    }

    if(elegido)
    return (
        <>  
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="modal-body">
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="alert alert-primary" role="alert">
                                <label htmlFor="lote" className="form-label">Lote:</label>
                                <input          
                                    name="lote"
                                    type="text"
                                    placeholder="Registre el numero del lote"
                                    className={`form-control ${errors.lote && "error" }`}        
                                    {...register("lote", {
                                    required: messages.required,
                                    pattern: {
                                        value: patterns.lote,
                                        message: messages.lote
                                    }
                                    })}
                                />
                                {errors.lote && <p className="text-danger">{errors.lote.message}</p>}


                                <label htmlFor="expiration" className="form-label">Fecha de vencimiento:</label>
                                <input          
                                    name="expiration"
                                    type="date"
                                    placeholder="REgistra fecha de vencimiento."
                                    className={`form-control ${errors.expiration && "error" }`}        
                                    {...register("expiration", {
                                    required: messages.required,
                                    pattern: {
                                        value: patterns.expiration,
                                        message: messages.expiration
                                    }
                                    })}
                                />
                                {errors.expiration && <p className="text-danger">{errors.expiration.message}</p>}


                                <label htmlFor="cantidad" className="form-label">Cantidad Recibida:</label>
                                <input          
                                    name="cantidad"
                                    type="text"
                                    placeholder="Registre en unidades de venta."
                                    className={`form-control ${errors.cantidad && "error" }`}        
                                    {...register("cantidad", {
                                    required: messages.required,
                                    pattern: {
                                        value: patterns.cantidad,
                                        message: messages.cantidad
                                    }
                                    })}
                                />
                                {errors.cantidad && <p className="text-danger">{errors.cantidad.message}</p>}



                                <label htmlFor="costo" className="form-label">Costo por unidad (antes de impuestos):</label>
                                <input          
                                    name="costo"
                                    type="text"
                                    placeholder="Registre valor por unidad antes de impuestos."
                                    className={`form-control ${errors.costo && "error" }`}        
                                    {...register("costo", {
                                    required: messages.required,
                                    pattern: {
                                        value: patterns.costo,
                                        message: messages.costo
                                    }
                                    })}
                                />
                                {errors.costo && <p className="text-danger">{errors.costo.message}</p>}


                                <label htmlFor="observations" className="form-label">Observaciones:</label>
                                <textarea          
                                    name="observations"
                                    placeholder="Registre las observaciones que estime conveniente."
                                    className={`form-control ${errors.observations && "error" }`}        
                                    {...register("observations", {
                                    required: messages.required,
                                    pattern: {
                                        value: patterns.observations,
                                        message: messages.observations
                                    }
                                    })}
                                />
                                {errors.observations && <p className="text-danger">{errors.observations.message}</p>}

                                <label htmlFor="tipoproducto" className="form-label">Tipo de Producto:</label>
                                <input          
                                    name="tipoproducto"
                                    type="text"
                                    placeholder="Registre el tipo de producto"
                                    className={`form-control ${errors.tipoproducto && "error" }`}        
                                    {...register("tipoproducto", {
                                    required: messages.required,
                                    pattern: {
                                        value: patterns.tipoproducto,
                                        message: messages.lote
                                    }
                                    })}
                                />
                                {errors.tipoproducto && <p className="text-danger">{errors.tipoproducto.message}</p>}
                                
                            </div>                                             
                        </div>
                        <div className="col-sm-4 ">
                            <div className="alert alert-info" role="alert">
                                <label htmlFor="cum" className="form-label">CUM:</label>
                                <select          
                                    name="cum"                                
                                    className={`form-control ${errors.cum && "error" }`}        
                                    {...register("cum", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.cum,
                                        message: messages.cum
                                        }
                                    })}
                                >                                
                                    <option value="cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                    
                                </select>
                                {errors.cum && <p className="text-danger">{errors.cum.message}</p>}


                                <label htmlFor="generico" className="form-label">Nombre Generico</label>
                                <select          
                                    name="generico"                                
                                    className={`form-control ${errors.generico && "error" }`}        
                                    {...register("generico", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.generico,
                                        message: messages.generico
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.generico && <p className="text-danger">{errors.generico.message}</p>}


                                <label htmlFor="comercial" className="form-label">Nombre Comercial</label>
                                <select          
                                    name="comercial"                                
                                    className={`form-control ${errors.comercial && "error" }`}        
                                    {...register("comercial", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.comercial,
                                        message: messages.comercial
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.comercial && <p className="text-danger">{errors.comercial.message}</p>}


                                <label htmlFor="invima" className="form-label">INVIMA</label>
                                <select          
                                    name="invima"                                
                                    className={`form-control ${errors.invima && "error" }`}        
                                    {...register("invima", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.invima,
                                        message: messages.invima
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.invima && <p className="text-danger">{errors.invima.message}</p>}                               
                                

                                <label htmlFor="etiquetado" className="form-label">Etiquetado</label>
                                <select          
                                    name="etiquetado"                                
                                    className={`form-control ${errors.etiquetado && "error" }`}        
                                    {...register("etiquetado", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.etiquetado,
                                        message: messages.etiquetado
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.etiquetado && <p className="text-danger">{errors.etiquetado.message}</p>}
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="alert alert-success" role="alert">
                                <label htmlFor="embalajePrimario" className="form-label">Embalaje Primario</label>
                                <select          
                                    name="embalajePrimario"                                
                                    className={`form-control ${errors.embalajePrimario && "error" }`}        
                                    {...register("embalajePrimario", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.embalajePrimario,
                                        message: messages.embalajePrimario
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.embalajePrimario && <p className="text-danger">{errors.embalajePrimario.message}</p>}


                                <label htmlFor="embalajeSecundario" className="form-label">Embalaje Secundario</label>
                                <select          
                                    name="embalajeSecundario"                                
                                    className={`form-control ${errors.embalajeSecundario && "error" }`}        
                                    {...register("embalajeSecundario", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.embalajeSecundario,
                                        message: messages.embalajeSecundario
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.embalajeSecundario && <p className="text-danger">{errors.embalajeSecundario.message}</p>}


                                <label htmlFor="condicionesPresentacionLiquida" className="form-label">Presentación Liquida</label>
                                <select          
                                    name="condicionesPresentacionLiquida"                                
                                    className={`form-control ${errors.condicionesPresentacionLiquida && "error" }`}        
                                    {...register("condicionesPresentacionLiquida", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.condicionesPresentacionLiquida,
                                        message: messages.condicionesPresentacionLiquida
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.condicionesPresentacionLiquida && <p className="text-danger">{errors.condicionesPresentacionLiquida.message}</p>}


                                <label htmlFor="cierresHermeticos" className="form-label">Cierres Hermeticos</label>
                                <select          
                                    name="cierresHermeticos"                                
                                    className={`form-control ${errors.cierresHermeticos && "error" }`}        
                                    {...register("cierresHermeticos", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.cierresHermeticos,
                                        message: messages.cierresHermeticos
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.cierresHermeticos && <p className="text-danger">{errors.cierresHermeticos.message}</p>}


                                <label htmlFor="condicionesDM" className="form-label">Condiciones del Dispositivo Médico</label>
                                <select          
                                    name="condicionesDM"                                
                                    className={`form-control ${errors.condicionesDM && "error" }`}        
                                    {...register("condicionesDM", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.condicionesDM,
                                        message: messages.condicionesDM
                                        }
                                    })}
                                >                                
                                    <option value="Cumple">Cumple</option>
                                    <option value="No Cumple">No Cumple</option>
                                    <option value="No Aplica">No Aplica</option>
                                </select>
                                {errors.condicionesDM && <p className="text-danger">{errors.condicionesDM.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-md-center">
                        <div className="col-sm-7 ">
                            <div className="alert alert-warning" role="alert">
                                <label htmlFor="cumple" className="form-label">CUMPLE LA RECEPCIÓN TÉCNICA</label>
                                <select          
                                    name="cumple"                                
                                    className={`form-control ${errors.cumple && "error" }`}        
                                    {...register("cumple", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.cumple,
                                        message: messages.cumple
                                        }
                                    })}
                                >                                
                                    <option value="1">Cumple</option>
                                    <option value="2">No Cumple</option>
                                </select>
                                {errors.cumple && <p className="text-danger">{errors.cumple.message}</p>}

                                <div className="modal-footer">                                    
                                    <button type="submit" className="btn btn-warning">Insertar</button>
                            </div>
                            </div>
                        </div>
                    </div>

                    <input
                        name="prodId"
                        type="hidden"                                    
                        {...register("prodId")}
                        defaultValue={elegido}
                    />

                    <input
                        name="encabId"
                        type="hidden"                                    
                        {...register("encabId")}
                        defaultValue={encabId}
                    />

                    <input
                        name="bodegaId"
                        type="hidden"                                    
                        {...register("bodegaId")}
                        defaultValue={sesionUser.bodega}
                    />

                </div>
                
            </form>   
        </>
    )
}