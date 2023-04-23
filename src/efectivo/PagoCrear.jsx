import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    descripcion: "Describe la línea de producto"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};

export default function PagoCrear({editPago}){

    const [bodegas, setBodegas] = useState([])
    const [bodegaElegida, setBodegaElegida] = useState()
    const [saldo, setSaldo] = useState()    
    const alerta = useContext(AlertaContext) 
    const {sesionUser} = useContext(UserContext)
    const aPagar=editPago?.valor-editPago?.valorPagado
    //Agregar fecha de pago
    // crea un nuevo objeto `Date`
    let today = new Date();
    
    // obtener la fecha y la hora
    let now = today.toLocaleString();
    let status=5
    let mensaje="Se Pago completamente la factura"
    let observacionmen=" ¡PAGO! "
    let saldoact
    let cargaDatos={}
    const rutap = url+"bodega/"+sesionUser.bodega; 
    const rutaefe = url+"efectivo"

    useEffect(()=>{
        reset(editPago)
      }, [editPago])

    const {
        register,
        handleSubmit,
        formState: { errors },        
        reset    
      } = useForm({mode:'onblur'});

    const vacio={
        pagar:'',
        descripcion:''
    }

    const onSubmit = async (facturaInfo) => {

        //Verificar si el valor pagado es mayor al que se le debe
        if(facturaInfo.pagar>aPagar){
            Swal.fire(
                '¡Error!',
                'El valor registrado para pago es mayor a la deuda, modifique el valor',
                'error'
            )
        } else {

            //Verificar si el disponible es menor que el valor registrado para pago
            if(bodegaElegida!=="a" && facturaInfo.pagar<=saldo.saldo){
                verificarVariables(facturaInfo)
            }

            

            if(bodegaElegida==="a"){
                verificarVariables(facturaInfo)
            }

            if(bodegaElegida!=="a" && facturaInfo.pagar>saldo.saldo){
                Swal.fire(
                    '¡Error!',
                    'El valor registrado para pago es mayor al saldo disponible en la caja, modifique el valor o elija otro medio de pago',
                    'error'
                )
            }
            
        }

                
    }

    const verificarVariables=(facturaInfo)=>{
        //Verificar si la factura queda saldada
        if(facturaInfo.pagar<aPagar){
            status=4
            observacionmen=" ¡ABONO! "  
            mensaje="Se Abono la factura"          
        }
        registrarPago(facturaInfo)
    }

    const registrarPago = async(datos)=>{
        const rutareg = url+"tecnicaencabezado/"+editPago.id;

        const info={
            "valorPagado": parseFloat(editPago.valorPagado)+parseFloat(datos.pagar),
            "observaciones":now+" -- "+sesionUser.name+observacionmen+" genero un pago de esta forma: "+datos.descripcion+" ----- "+editPago.observaciones,
            "status":status
        }

    
        Swal.fire({
        title: '¿Estas Seguro(a)?',
        text: `¿Quieres registrar el pago para la factura: ${editPago.factura}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, estoy seguro(a)!'
        }).then((result) => {
        if (result.isConfirmed) {
    
            axios.put(rutareg, info).then((response) =>{
                if(response.status ===200){
                    Swal.fire(
                        '¡SE REGISTRO EL PAGO!',
                        'El pago se registro correctamente',
                        'success'
                    )
                    alerta();
                    actualizaSaldoBodega(datos)
                    reset(vacio)
                    status=5                    
                    mensaje="Se Pago completamente la factura"
                    observacionmen=" ¡PAGO! "
                    setBodegaElegida("a")
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Hubo un problema al registrar el pago',
                        'error'
                    )
                }
            })
    
            
        }
        })

    }

    //Actualizar Saldo de la bodega
    const actualizaSaldoBodega = async(registroInfo)=>{ 

        if(bodegaElegida!=="a"){

            //Actualizar Saldo
            const rutaefec=url+"efectivo/"+bodegaElegida        

            await axios.get(rutaefec)
                .then((res)=>{        
                    saldoact=res.data.saldo                           
                })

            cargaDatos={
                "valor":registroInfo.pagar,
                "saldo":parseFloat(saldoact)-parseFloat(registroInfo.pagar),
                "movimiento":2,
                "observations":`${now} ${sesionUser.name} realizó un pago a la factura: ${editPago.factura} por: $ ${registroInfo.pagar} ---`,
                "factura":editPago.factura,
                "userId":sesionUser.id,
                "bodegaId":bodegaElegida
            }       
            
            axios.post(rutaefe, cargaDatos)
                .then((response) =>{
                    if(response.status ===201){
                        
                            cargaDatos={}
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
        if(e.target.value!=="a"){              
            efectivoconsulta(e.target.value)   
        }              
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

    useEffect(()=>{
        axiosBodega();
    }, [])


    
    return(
        <>
            <div className="alert alert-primary" role="alert">
                <h4>Cargar pago a la factura: {editPago?.factura}</h4>
                <p>Valor de la factura: {"$ "+ new Intl.NumberFormat().format(editPago?.valor) }</p>
                <p>Valor abonado: {"$ "+ new Intl.NumberFormat().format(editPago?.valorPagado) }</p>
                <p>Total a pagar: {"$ "+ new Intl.NumberFormat().format(editPago?.valor-editPago?.valorPagado) }</p>
                <p  className="text-secondary">
                    <small>¡<strong>RECUERDE</strong> que el valor pagado debe ser igual al valor de la factura, de lo contrario el sistema siempre lo va a mostrar como pendiente!</small>
                </p >
                <p className="text-secondary">
                    <small>¡El valor total <strong>INCLUYE</strong> descuentos, retenciones, etc los cuales deberá especificar en las observaiones de pago</small>
                </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                
                <label htmlFor="pagar" className="form-label">Valor a pagar:</label>
                <input          
                name="pagar"
                type="text"
                placeholder={aPagar}
                className={`form-control ${errors.pagar && "error" }`}        
                {...register("pagar", {
                    required: messages.required,
                    pattern: {
                    value: patterns.pagar,
                    message: messages.pagar,
                    
                    }
                })}
                />
                {errors.pagar && <p className="text-danger">{errors.pagar.message}</p>}
        
                <label htmlFor="descripcion" className="form-label">Descripción:</label>
                    <textarea
                        name="descripcion"
                        placeholder="Registre pago, descuentos, retenciones, etc"
                        className={`form-control ${errors.descripcion && "error"}`}
                        {...register("descripcion", {
                            required: messages.required,
                            pattern: {
                            value: patterns.descripcion,
                            message: messages.descripcion
                            }
                        })}
                    ></textarea>
                {errors.descripcion && <p className="text-danger">{errors.descripcion.message}</p>}

                <label htmlFor="formapago" className="form-label">Seleccione Forma de Pago:</label>
                <select value={bodegaElegida} className="form-select" onChange={onChange} >
                    
                    <option value=""></option>
                    <option value="a">Cuenta o Dinero diferente a caja</option>
                    <option value={bodegas.id} >{bodegas.name}</option>
                    
                </select>
                {
                    bodegaElegida==="a" ?
                    <h6>El pago se realizará desde una cuenta u otro efectivo</h6>:
                    <></>
                }

                {
                    bodegaElegida>0 ?
                    <h6>El saldo disponible para pago es de: {"$ "+ new Intl.NumberFormat().format(saldo?.saldo) }</h6>:
                    <></>
                }
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="submit" className="btn btn-info">Cargar Pago</button>
                </div>  
            </form>
        </>
    )
}