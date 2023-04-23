import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import MenuEfectivo from "../components/MenuEfectivo";
import Vacio from "../components/Vacio";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",    
};
  
  
const patterns = {
    //valor: /^[0-9]+$/i
};

export default function TransferirEfectivo(){
    const [bodegas, setBodegas] = useState([])
    const [users, setUsers]=useState([])
    const [bodegaElegida, setBodegaElegida] = useState()
    const [bodegaSalida, setBodegaSalida] = useState()
    const [bodegaEntrada, setBodegaEntrada] = useState()
    const [saldo, setSaldo] = useState()
    const [saldod, setSaldod] = useState()
    const rutap = url+"bodega"; 
    const rutaefe = url+"efectivo"
    let cargaDatos={}
    let cargaNueva={}
    let navig = useNavigate()
    const ruta=url+"user"
    const {sesionUser} = useContext(UserContext)

    // Seleccionar usuarios
    const axiosUsurs = async () => { 
        await axios.get(ruta)
        .then((res)=>{        
            setUsers(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };
    

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

    //Capturar dato
    const onChange = e=>{  
        setBodegaElegida(e.target.value) 
        efectivoconsulta(e.target.value)
        salida(e.target.value)    
    }

    //Obtener detalles de la bodega de Sálida
    const salida = async(id)=>{
        const rutasal=url+"bodega/"+id            

            await axios.get(rutasal)
                .then((res)=>{        
                    setBodegaSalida(res.data);        
                })
                .catch((error)=>{
                    console.log(error)
                })
    }

    //Movimientos del efectivo para la bodega seleccionada
    const efectivoconsulta = async(id) =>{
        const rutaefec=url+"efectivo/"+id
        

        await axios.get(rutaefec)
            .then((res)=>{        
                setSaldo(res.data);        
            })
            .catch((error)=>{
                console.log(error)
            })       
    }


    const reenviar = ()=>{
        navig("/efectivo/movimientos")
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
        
    } = useForm({mode:'onblur'});

    //Cargar registro
    const onSubmit = async (registroInfo) => {

        if(bodegaElegida===registroInfo.bodegaId){
            Swal.fire(
                '¡IMPORTANTE!',
                `¡No se puede enviar dinero a la misma bodega, elija otro destino!`,
                'error'
            )
        }else{
            //Obtener saldo disponible actualizado
   
            const rutaefec=url+"efectivo/"+bodegaElegida            

            await axios.get(rutaefec)
                .then((res)=>{        
                    setSaldo(res.data);        
                })
                .catch((error)=>{
                    console.log(error)
                })

            //Obtener saldo bodega Destino
            if(registroInfo.bodegaId>0){
                
                const rutaefecd=url+"efectivo/"+registroInfo.bodegaId           

                await axios.get(rutaefecd)
                    .then((res)=>{        
                            setSaldod(res.data.saldo)
                            entra(registroInfo)
                            
                    })
                    .catch((error)=>{
                        console.log(error)
                    })

               

                
            }else{

                cargaDatos={
                    "valor":registroInfo.valor,
                    "saldo":saldo.saldo-registroInfo.valor,
                    "movimiento":2,
                    "observations":registroInfo.observations+"--- Traslado de dinero a las cuentas de la empresa --",
                    "factura":"cuenta",
                    "userId":sesionUser.id,
                    "bodegaId":bodegaElegida
                }
                
                axios.post(rutaefe, cargaDatos)
                    .then((response) =>{
                        if(response.status ===201){
                            
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: `Se registro la salida de: <strong>$ ${response.data.valor}</strong>, hacia las cuentas de la empresa`,
                                showConfirmButton: false,
                                timer: 1500
                            })
                            
                            reenviar()
                            
                            }else{
                            Swal.fire(
                                '¡IMPORTANTE!',
                                `No fue posible guardar el registro`,
                                'error'
                            )
                            }
                    }) 
            }
        } 
    }
    
    //Cargar bodega de entrada
    const entra = async(registroInfo)=>{

        const rutaent=url+"bodega/"+registroInfo.bodegaId           

        await axios.get(rutaent)
            .then((res)=>{        
                setBodegaEntrada(res.data)
                espera(registroInfo)                         
            })
            .catch((error)=>{
                console.log(error)
            })
            
    }
    
    const espera = (registroInfo)=>{
        if(bodegaEntrada){
            cargarMovimiento(registroInfo)
            
        }
    }
    
    //Actualizar movimiento
    const cargarMovimiento = async(registroInfo)=>{ 
            cargaDatos={
                "valor":registroInfo.valor,
                "saldo":saldo.saldo-registroInfo.valor,
                "movimiento":2,
                "observations":`${registroInfo.observations} ---Se envía $ ${registroInfo.valor} a la bodega: ${bodegaEntrada.name}---`,
                "factura":"bodega",
                "userId":sesionUser.id,
                "bodegaId":bodegaElegida
            }
            cargaNueva={
                "valor":registroInfo.valor,
                "saldo":parseFloat(registroInfo.valor)+parseFloat(saldod),
                "movimiento":1,
                "observations":`${registroInfo.observations} ---Se recibe $ ${registroInfo.valor} de la bodega: ${bodegaSalida.name}---`,
                "factura":"bodega",
                "userId":registroInfo.usuario,
                "bodegaId":registroInfo.bodegaId
            }
            
            axios.post(rutaefe, cargaDatos)
                .then((response) =>{
                    if(response.status ===201){
                        
                        
                        }else{
                        Swal.fire(
                            '¡IMPORTANTE!',
                            `No fue posible guardar el registro`,
                            'error'
                        )
                        }
                })
            axios.post(rutaefe, cargaNueva)
                .then((response) =>{
                    if(response.status ===201){
                        
                        Swal.fire({
                            position: 'top-end',
                            icon: 'success',
                            title: `Se registro el envío de: <strong>$ ${response.data.valor}</strong>, desde la bodega: ${bodegaSalida.name} hacia la bodega: ${bodegaEntrada.name}`,
                            showConfirmButton: false,
                            timer: 5500
                        })
                        
                        reenviar()
                        
                        }else{
                        Swal.fire(
                            '¡IMPORTANTE!',
                            `No fue posible guardar el registro`,
                            'error'
                        )
                        }
                })
    }

    useEffect(()=>{
        axiosBodega();
        axiosUsurs();
    }, [])

    return(
        <>
            <MenuEfectivo/>
            <div className="row">
                <div className="container text-center col-md-10">
                    <div className="alert alert-warning" role="alert">
                        <h4>Seleccione Bodega de Sálida</h4>
                    </div>                     
                    <select value={bodegaElegida} className="form-select" onChange={onChange} >
                        <option value=""></option>
                        {bodegas.map((bodega)=>(                                        
                            <option value={bodega.id} key={bodega.id}>{bodega.name}- Dirección: {bodega.adress}- Correo Electrónico: {bodega.email}</option>                                     
                        ))}
                    </select>
                </div>
            </div>
            {
                saldo ?
                <>
                    {
                        saldo.saldo>0 ?
                        <div className="container text-center">
                            <h3 className="mt-4"><strong>SALDO: {"$ "+ new Intl.NumberFormat().format(saldo.saldo) }</strong></h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="bodegaId" className="form-label">Elija Destino</label>
                                <select          
                                    name="bodegaId"                                                                   
                                    className={`form-control ${errors.variable && "error" }`}        
                                    {...register("bodegaId", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.bodegaId,
                                        message: messages.bodegaId
                                        }
                                    })}
                                >                                
                                    <option value=""></option>
                                    <option value="0">Cuenta de la empresa</option>
                                    {bodegas.map((bodega)=>( 
                                        <option value={bodega.id} key={bodega.id}>{bodega.name}- Dirección: {bodega.adress}- Correo Electrónico: {bodega.email}</option>
                                    ))}
                                </select>
                                {errors.bodegaId && <p className="text-danger">{errors.bodegaId.message}</p>}

                                <label htmlFor="usuario" className="form-label">Usuario que recibe (aplica para transferencias entre bodegas)</label>
                                <select          
                                    name="usuario"                                                                   
                                    className={`form-control ${errors.usuario && "error" }`}        
                                    {...register("usuario", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.usuario,
                                        message: messages.usuario
                                        }
                                    })}
                                >                                
                                    {users.map((user)=>( 
                                        sesionUser.id !==user.id? <option value={user.id} key={user.id}>{user.name}</option>:<></>
                                    ))}
                                </select>
                                {errors.usuario && <p className="text-danger">{errors.usuario.message}</p>}

                                
                                <label htmlFor="valor" className="form-label">Valor</label>
                                <input          
                                    name="valor"
                                    type="text"
                                    placeholder="Cantidad a Transferir"
                                    className={`form-control ${errors.valor && "error" }`}        
                                    {...register("valor", {
                                        required: messages.required,
                                        pattern: {
                                        value: patterns.valor,
                                        message: messages.valor
                                        }
                                    })}
                                />
                                {errors.valor && <p className="text-danger">{errors.valor.message}</p>}

                                <label htmlFor="observations" className="form-label">Observaciones</label>
                                <input          
                                    name="observations"
                                    type="text"
                                    placeholder="Comentarios al respecto"
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
                        
                                <input
                                    name="userId"
                                    type="hidden"                                    
                                    {...register("userId")}
                                    defaultValue={sesionUser.id}
                                />
                                <div className="modal-footer mt-4">                                    
                                    <button type="submit" className="btn btn-info">Transferir</button>
                                </div>
                        
                            </form>
                        </div>
                            :
                        <>
                            <div className="container text-center mt-4">
                                <h3 className="">¡Esta bodega no cuenta con efectivo disponible!</h3>
                            </div>                    
                            <Vacio/>
                        </>
                    }                    
                </>:
                <>
                    
                </>
            }
        </>
    )
}