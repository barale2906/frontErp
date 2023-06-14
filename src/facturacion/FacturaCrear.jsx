import axios from "axios"
import { useContext, useEffect } from "react"
import UserContext from "../providers/sesion/UserContext"
import url from "../utils/urlimport"
import Swal from "sweetalert2"

export default function FacturaCrear({setGenFactura, setLastFactura, setPinFact}){

    const {sesionUser} = useContext(UserContext)
    const ruta = url+"facturaEncabezado"
    const rutadet = url+"facturaDetalle"
    const rutasaldo=url+"efectivo/"+sesionUser.bodega
    const rutaefectivo=url+"efectivo" 
    let totalFactura = JSON.parse(window.sessionStorage.getItem("totalFactura"))
    let impuestos = window.sessionStorage.getItem("impuestos")
    let descuentos = window.sessionStorage.getItem("descuentos")
    let form = JSON.parse(window.sessionStorage.getItem("listaInfo"))
    let productos = JSON.parse(window.sessionStorage.getItem("productosComprados"))
    let aplicaDomi = JSON.parse(window.sessionStorage.getItem("aplicaDomicilio"))
    let domi = JSON.parse(window.sessionStorage.getItem("domiEleg"))
    let comi = JSON.parse(window.sessionStorage.getItem("comiEleg"))
    
    let listaDet={}
    let listainfo
    let key
    let status = 2   

    const onSubmit = async () => {
        
        axios.post(ruta, form)
            .then((response) =>{
                if(response.status ===201){
                    cargarDetalle(response.data)
                    
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
    const cargarDetalle= async (data) =>{
        const medio = form.medioId

        productos.map((comprado)=>(
            key=comprado.id,
            verinven(comprado, data.id)            
        ))        

        if(medio==1){
            movEfectivo(data.id)
        }

        if(aplicaDomi==="1"){
            apliDomi(data.id)
        }

        if(comi!=="0"){
            aplicaComi(data.id)
        }

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Haz creado la Factura N°: <strong>${data.id}</strong> al cliente: <strong>${data.name}</strong>`,
            showConfirmButton: false,
            timer: 1500 
        })

        setGenFactura(data.id)
        setLastFactura(data)
        sessionStorage.clear()
        setPinFact()
    }

    // Carga domicilio
    const apliDomi = async(id)=>{
        const rutaUpdate = ruta+"/"+id        

        const domicilio={
            "domiId":domi.id,
            "domiName":domi.name,
            "domiTarifa":domi.tarifa
        }
        axios.put(rutaUpdate, domicilio)
        .then((response) =>{
            if(response.status ===201){
                //console.log(response.data)
            }else{
                
            }
        })
    }


    // Carga Comisionista
    const aplicaComi = async(id)=>{
        const rutaUpdate = ruta+"/"+id

        const comision={
            "comiId":comi
        }
        axios.put(rutaUpdate, comision)
        .then((response) =>{
            if(response.status ===201){
                //console.log(response.data)                
            }else{
                
            }
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
        onSubmit()
    }, []);

}