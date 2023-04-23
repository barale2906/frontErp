import axios from "axios";
import { useContext, useEffect} from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio",
    name: "El formato introducido no es el correcto",
    description: "Detalla el tipo de impuesto",
    valor: "Digite mínimo 8 caracteres"    
};
  

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
};
export default function Facturar({comprados,impuestos, descuentos, totalFactura, setGenFactura, setLastFactura}){

    const {sesionUser} = useContext(UserContext)
    const ruta = url+"facturaEncabezado"
    const rutadet = url+"facturaDetalle"
    const rutasaldo=url+"efectivo/"+sesionUser.bodega
    const rutaefectivo=url+"efectivo"  
    
    let listaDet={}
    let listainfo
    let key
    let status = 2

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setFocus    
    } = useForm({mode:'onblur'});


    const onSubmit = async (listaInfo) => {  
        console.log(listaInfo)
        axios.post(ruta, listaInfo)
            .then((response) =>{
                if(response.status ===201){
                    cargarDetalle(response.data,listaInfo.formaPago)
                    
                    }else{
                        Swal.fire(
                            '¡IMPORTANTE!',
                            `No fue posible guardar el registro`,
                            'error'
                        )
                    }
            })    
            
    }

    // Verificar datos para cargar a la factura
    const cargarDetalle= async (data,forma) =>{

        comprados.map((comprado)=>(
            key=comprado.id,
            verinven(comprado, data.id)            
        ))
        setGenFactura(data.id)
        setLastFactura(data)
        if(forma==="efectivo"){
            movEfectivo(data.id)
        }
        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Haz creado la Factura N°: <strong>${data.id}</strong> al cliente: <strong>${data.name}</strong>`,
            showConfirmButton: false,
            timer: 1500 
        })
    }

    // Determinar cantidad 
    const verinven = async(datos,id)=>{
        const rutainv = url+"inventario/"+datos.invId
        // obtiene saldo
        
        await axios.get(rutainv)
        .then((res)=>{ 
               
              cargardetaverificado(datos,id,res.data.cantidad)      
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    

    // Verificar 
    const cargardetaverificado = async(datos,id,cantidad)=>{
        
        if(cantidad>=datos.cantidad){
            const rutainv = url+"inventario/"+datos.invId

            if(cantidad===datos.cantidad){
                status = 4
            } 

            
            listainfo={
                "cantidad":cantidad-datos.cantidad,
                "status":2
            }

            await axios.put(rutainv, listainfo).then((response) =>{
                if(response.status ===200){
                    status=2
                    
                } else {
                    status=2
                }
            })

            cargaritemes(datos,id)
            

        }else{
            const rutaenc = url+"facturaEncabezado/"+id
            // OJO VERIFICAR ACTUALIZACIÓN DE ENCABEZADO
            listainfo={
                "totalFactura":totalFactura-datos.totalBase,
                "impuestos":impuestos-datos.impuestobase,
                "descuentos":descuentos-datos.descuentobase
            }

            await axios.put(rutaenc, listainfo).then((response) =>{
                if(response.status ===200){
                    setLastFactura(response.data) 
                } else {
                    // Verificar si hay errores
                }
            })

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `El item ${datos.comercial} no se cargo por no haber suficiente inventario`,
                showConfirmButton: false,
                timer: 1500 
            })
        }
    }

    // y cargar detalles 
    const cargaritemes = async(datos,id)=>{
        listaDet={                            
            "comercial":datos.comercial,
            "cantidad":datos.cantidad,
            "precio":datos.precio,
            "preciobase":datos.preciobase,
            "descuento":datos.descuento,
            "descuentobase":datos.descuentobase,
            "impuesto":datos.impuesto,
            "impuestobase":datos.impuestobase,
            "impuestoporc":datos.impuestoporc,
            "total":datos.total,
            "totalbase":datos.totalbase,
            "lpId":datos.lpId,
            "invId":datos.invId,
            "prodId":datos.prodId, 
            "factId":id 
        }


        await axios.post(rutadet, listaDet)
            .then((response) =>{
                if(response.status ===201){                    
                    listaDet={}                    
                }else{
                    console.log(`No cargo el: <strong>${datos.id}</strong>`)
                }
            })
    }

    // Cargar efectivo
    const movEfectivo = async(factura)=>{
        
        await axios.get(rutasaldo)
            .then((res)=>{ 
                cargaEfectivo(res.data, factura)
            })
            .catch((error)=>{
                console.log(error)
            })
    }

    // Registro del movimiento
    const cargaEfectivo = async(saldo,factura)=>{
        //console.log(saldo+"-"+factura)
        listainfo={
                    "saldo":saldo.saldo+totalFactura,
                    "valor":totalFactura,
                    "observations":`Venta en efectivo por la factura N°: ${factura}`,
                    "factura":factura,
                    "userId":sesionUser.id,
                    "bodegaId":sesionUser.bodega
                    }

        await axios.post(rutaefectivo, listainfo).then((response) =>{
            if(response.status ===201){
                //console.log("se cargaron: "+response)
            } else {
                // Verificar si hay errores
            }
        })
    }

    useEffect(() => {
        setFocus("name");
      }, [setFocus]);

    

    return (
        <div className="container text-center">
            <div className="alert alert-info" role="alert">
                <h6 className="modal-title" id="productos">
                    TOTAL: <strong>{"$ "+ new Intl.NumberFormat().format(totalFactura) } </strong>    
                    DESCUENTOS: <strong>{"$ "+ new Intl.NumberFormat().format(descuentos) } </strong><br/>
                    IMPUESTOS: <strong>{"$ "+ new Intl.NumberFormat().format(impuestos) } </strong>
                </h6> 
                <button className="btn btn-danger btn-sm" onClick={()=>setGenFactura(0)}>Seguir Cargando Productos a la Factura </button>               
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="alert alert-warning" role="alert">
                        <form onSubmit={handleSubmit(onSubmit)}>
                        
                            <label htmlFor="name" className="form-label">Nombre:</label>
                            <input          
                                name="name"
                                type="text"
                                onFocus
                                defaultValue="cliente Mostrador"
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
                                defaultValue="99999999"
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
                                defaultValue="Calle 1 # 1 - 10"
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
                                defaultValue="99999999"
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
                                defaultValue="mostrador@dominio.com"
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

                            <label htmlFor="formaPago" className="form-label">Forma de Pago:</label>
                            <select          
                                name="formaPago"                                
                                className={`form-control ${errors.formaPago && "error" }`}        
                                {...register("formaPago", {
                                    required: messages.required,
                                    pattern: {
                                    value: patterns.formaPago,
                                    message: messages.formaPago
                                    }
                                })}
                            >                                
                                
                                <option value="efectivo">Efectivo</option>
                                <option value="tc">Tarjeta de Crédito</option>
                                <option value="otros">Otros</option>
                            </select>
                            {errors.formaPago && <p className="text-danger">{errors.formaPago.message}</p>}

                            <input
                                name="userId"
                                type="hidden"                                    
                                {...register("userId")}
                                defaultValue={sesionUser.id}
                            />
                            <input
                                name="bodegaId"
                                type="hidden"                                    
                                {...register("bodegaId")}
                                defaultValue={sesionUser.bodega}
                            />
                            <input
                                name="totalFactura"
                                type="hidden"                                    
                                {...register("totalFactura")}
                                defaultValue={totalFactura}
                            />
                            <input
                                name="impuestos"
                                type="hidden"                                    
                                {...register("impuestos")}
                                defaultValue={impuestos}
                            />
                            <input
                                name="descuentos"
                                type="hidden"                                    
                                {...register("descuentos")}
                                defaultValue={descuentos}
                            />
                                        
                            <div className="modal-footer">                    
                                <button type="submit" className="btn btn-warning">FACTURAR</button>
                            </div>  
                        </form>
                    </div>  

                </div>
                <div className="col-sm-6">                
                    <div className="container text-center">                                        
                        <table className="table table-success table-hover table-bordered table-responsive table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">COMERCIAL</th>  
                                    <th scope="col">LOTE</th>
                                    <th scope="col">FECHA</th>
                                    <th scope="col">CANT</th>
                                    <th scope="col">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comprados.map((comprado, index)=>(                                        
                                <tr key={comprado.id}>
                                    <td><small>{comprado.comercial}</small></td>
                                    <td><small>{comprado.lote}</small></td>
                                    <td><small>{comprado.expiration}</small></td>
                                    <td><small>{comprado.cantidad}</small></td>
                                    <td><small>{"$ "+ new Intl.NumberFormat().format(comprado.totalbase)}</small></td>
                                </tr>                                            
                                ))}
                            </tbody>
                        </table>                    
                    </div>                
                </div>
            </div>            
        </div>
    )
}