import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

export default function CierreCaja(){
    const [users, setUsers]=useState([])
    const [usuElegido, setUsuElegido]=useState()
    const [usuariod, setUsuariod]=useState()
    const [movimientos, setMovimientos]=useState([])
    const [noEfectivo, setNoEfectivo]=useState([])
    const [facturas, setFacturas]=useState([])
    const [noEfectivoValor, setNoEfectivoValor]=useState(0)
    const [pagos, setPagos]=useState([])
    const [ventas, setVentas]=useState([])
    const [transferencias, setTransferencias]=useState([])
    const [cuentas, setCuentas]=useState([])
    const [saldoCuentas, setSaldoCuentas]=useState([])
    const [saldoTransferencias, setSaldoTransferencias]=useState(0)
    const [saldoPagos, setSaldoPagos]=useState(0)
    const [saldoVentas, setSaldoVentas]=useState(0)
    const [entrega, setEntrega]=useState(0)
    const [cierre, setCierre]=useState(0)
    const {sesionUser} = useContext(UserContext)        
    let key
    let rutastatus
    const ruta=url+"user"
    const rutaefe=url+"efectivo"

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

    //Capturar dato
    const onChange = e=>{  
        setUsuElegido(e.target.value)
        setCierre(0)
        cargarMovimientos(e.target.value)
        cargarNoEfectivo(e.target.value)    
        usuario(e.target.value)    
    }

    //Obtener datos del usuario
    const usuario=async(id)=>{
        const urlu=url+"user/"+id
        await axios.get(urlu)
        .then((res)=>{        
            setUsuariod(res.data);              
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    //Cargar los movimientos del usuario
    const cargarMovimientos = async(id)=>{
        const urlm=url+"efectivo/"+id+"/user"
        await axios.get(urlm)
        .then((res)=>{        
            setMovimientos(res.data);              
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    // Cargar facturas diferentes a efectivo
    const cargarNoEfectivo = async(id)=>{
        const urlm=url+"facturaEncabezado/"+id
        await axios.get(urlm)
        .then((res)=>{        
            setFacturas(res.data);                      
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    //Función de acumulación
    const acumular = (acumulador,numero)=>acumulador+numero;



    //Calcula entradas para el cierre
    const calculaCierre = ()=>{
        //Cargar entradas
        const movimientouno = item=>item.movimiento===1
        const entradas = movimientos.filter(movimientouno)
        const entrasaldo = entradas.map(function(mov){
            return mov.valor;            
        })        
        setVentas(entradas)
        const saldoentra=entrasaldo.length>0 ? entrasaldo.reduce(acumular):0;
        setSaldoVentas(saldoentra)
        
        calculaDiferente()
    }

    // Totalizar Facturas diferentes a Efectivo
    const calculaDiferente=()=>{
        // Cargar diferentes a Efectivo
        const facturaDiferente= item=>item.formaPago!=="efectivo"
        const facturaOtros=facturas.filter(facturaDiferente)
        const factuOtro = facturaOtros.map(function(mov){
            return mov.totalFactura
        })
        setNoEfectivo(facturaOtros)
        const totalDiferente= factuOtro.length>0 ? factuOtro.reduce(acumular):0;
        setNoEfectivoValor(totalDiferente)

        calculaSalidasCierre()
    }

    // Calcula salidas para el cierre
    const calculaSalidasCierre = ()=>{
        const movimientodos = item=>item.movimiento===2 && item.factura!=="bodega" && item.factura!=="cuenta"
        //Cargar salidas
        const salidas = movimientos.filter(movimientodos)
        const salesaldo = salidas.map(function(mov){
            return mov.valor;            
        })   
        
        setPagos(salidas)        
        const saldosale=salesaldo.length>0 ? salesaldo.reduce(acumular):0;
        setSaldoPagos(saldosale)   
        calculaTransferencias()        
    }

    // Calcula transferencias a bodega
    const calculaTransferencias=()=>{
        const movimientotrans = item=>item.movimiento===2 && item.factura==="bodega" 
        //Cargar salidas
        const salidastrans = movimientos.filter(movimientotrans)
        const salesaldotrans = salidastrans.map(function(mov){
            return mov.valor;            
        }) 
        setTransferencias(salidastrans)        
        const saldotrans=salesaldotrans.length>0 ? salesaldotrans.reduce(acumular):0;
        setSaldoTransferencias(saldotrans)
        calculaCuentas()
             
    }

    // Calcula transferencias a cuenta
    const calculaCuentas=()=>{
        const movimientocuenta = item=>item.movimiento===2 && item.factura==="cuenta" 
        //Cargar salidas
        const salidascuenta = movimientos.filter(movimientocuenta)
        const salesaldocuenta = salidascuenta.map(function(mov){
            return mov.valor;            
        }) 
        setCuentas(salidascuenta)        
        const saldocuenta=salesaldocuenta.length>0 ? salesaldocuenta.reduce(acumular):0;       
        
        setSaldoCuentas(saldocuenta)
        
        setCierre(1) 
        
    }

    //Calcula saldo del cierre
    const calculaSaldo=()=>{
        const tiene=saldoVentas-saldoPagos-saldoTransferencias-saldoCuentas

        setEntrega(tiene)
    }

    // Generar cierre
    const generaCierre=async()=>{
        Swal.fire({
            title: '¿Estas Seguro(a) de cerrar caja?',
            text: `Recuerda que el sistema registrará que recibiste $ ${new Intl.NumberFormat().format(entrega)} de ${usuariod.name}.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro(a)!'
          }).then((result) => {
            if (result.isConfirmed) {

                //Obtener saldo de la bodega 
                const rutasaldo=url+"efectivo/"+usuariod.bodega

                axios.get(rutasaldo)
                    .then((res)=>{ 
                        
                        const info={
                            "valor":entrega,
                            "saldo":res.data.saldo-entrega,
                            "movimiento":2,
                            "observations":`CIERRE DE CAJA: Se recibio de: ${usuariod.name}, la suma de $ ${entrega}, tuvo facturación y transferencias de: $ ${saldoVentas}, pago facturas por: $ ${saldoPagos}, transfirio a otras bodegas: $ ${saldoTransferencias}, transfirio a cuentas de la empresa: $ ${saldoCuentas}`,
                            "factura":"cierre",
                            "userId":sesionUser.id,
                            "bodegaId":usuariod.bodega,
                            "status":2
                        }

                        generaCierrEnc(info)
                    })
                    .catch((error)=>{
                        console.log(error)
                    }) //

                
            }
          })          
    }

    // Generar cierre
    const generaCierrEnc=(info)=>{
        axios.post(rutaefe, info)
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

    //Actualizar status de los movimientos cargados
    const cargarDetalle=async(data)=>{

        const listainfo={
            "status":data.id
        }

        movimientos.map((movimiento)=>(
            
            rutastatus=url+"efectivo/"+movimiento.id,
            key=movimiento.id,
            
            axios.put(rutastatus, listainfo).then((response) =>{
                if(response.status ===200){
                    
                    
                } else {
                    
                }
            }) 
            
            
        ))        

        cierraFacturas(data.id)
    }

    // Actualizar status de las facturas
    const cierraFacturas=async(data)=>{
        const listainfo={
            "status":data
        }

        facturas.map((factura)=>(
            
            rutastatus=url+"facturaEncabezado/"+factura.id,
            key=factura.id,
            
            axios.put(rutastatus, listainfo).then((response) =>{
                if(response.status ===200){
                    
                    
                } else {
                    
                }
            }) 
            
            
        ))

        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `Haz creado el cierre de caja N°: <strong>${data}</strong> al usuario: <strong>${usuariod.name}</strong>`,
            showConfirmButton: false,
            timer: 2500 
        })


        valorInicial()
    }

    //REstablecer valores iniciales
    const valorInicial=()=>{

        setUsuElegido()
        setUsuariod()
        setMovimientos([])
        setNoEfectivo([])
        setFacturas([])
        setNoEfectivoValor(0)
        setPagos([])
        setVentas([])
        setTransferencias([])
        setCuentas([])
        setSaldoCuentas([])
        setSaldoTransferencias(0)
        setSaldoPagos(0)
        setSaldoVentas(0)
        setEntrega(0)
        setCierre(0)
    }

    
    useEffect(()=>{
        axiosUsurs();
    }, [])

    useEffect(()=>{
        calculaSaldo()
    }, [saldoCuentas])

    return (
        <>
            <div className="row">
                <div className="container text-center col-md-10">
                    <div className="alert alert-info" role="alert">
                        <h4>Seleccione Usuario a recibir</h4>
                    </div>                     
                    <select value={usuElegido} className="form-select" onChange={onChange} >
                        <option value=""></option>
                        {users.map((user)=>(                                        
                            <option value={user.id} key={user.id}>{user.name}</option>                                     
                        ))}
                    </select>
                </div>
            </div>
            {
                movimientos.length>0 ?
                <div className="row">                    
                    
                    {
                        cierre===0 ?
                        <>
                            <div className="alert alert-info" role="alert">
                                <button type="button" className="btn btn-info btn-sm" onClick={()=>calculaCierre()} >Calcular Cierre</button>
                            </div>
                            <div className="container">
                                <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                    <thead>
                                        <tr>
                                            <th>FECHA</th>
                                            <th>DOCUMENTO</th>
                                            <th>OBSERVACIONES</th>
                                            <th>VALOR</th>
                                            <th>BODEGA</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {movimientos.map((movimiento)=>(                                        
                                            <tr key={movimiento.id}>
                                                <td>{movimiento.createdAt}</td>
                                                <td>{movimiento.factura}</td>
                                                <td>{movimiento.observations}</td>
                                                <td>
                                                    {"$ "+ new Intl.NumberFormat().format(movimiento.valor) }
                                                </td>
                                                <td>{movimiento.bodega.name}</td>
                                            </tr>                                    
                                        ))}
                                        
                                    </tbody>
                                </table>
                            </div>
                        </>
                            :
                        <>
                            <div className="alert alert-warning" role="alert">
                                <h4>{usuariod.name} debe legalizar {"$ "+ new Intl.NumberFormat().format(entrega) }</h4>
                                <button type="button" className="btn btn-warning btn-lg" onClick={()=>generaCierre()} >Cerrar</button>
                            </div>
                            <div className="row">                                
                                <div className="col-md-4">
                                    {ventas.length>0 ? 
                                        <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                            <thead>
                                                <tr>
                                                    <th colSpan={3}>Saldo por Ventas:  {"$ "+ new Intl.NumberFormat().format(saldoVentas) }</th>
                                                </tr>
                                                <tr>
                                                    <th><small>Bodega</small></th>
                                                    <th><small>Observaciones</small></th>
                                                    <th><small>Valor</small></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {ventas.map((venta)=>(   
                                                    <tr key={venta.id}>
                                                        <td><small>{venta.bodega.name}</small></td>
                                                        <td><small>{venta.observations}</small></td>
                                                        <td><small>{"$ "+ new Intl.NumberFormat().format(venta.valor)}</small></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table> :
                                        <p>El usuario no genero ventas</p>
                                    }
                                        
                                                                       
                                </div>
                                <div className="col-md-4">
                                    {pagos.length>0 ?
                                        <table className="table table-secondary table-hover table-bordered table-responsive table-striped">
                                            <thead>
                                                <tr>
                                                    <th colSpan={3}>Valor pagado:  {"$ "+ new Intl.NumberFormat().format(saldoPagos) }</th>
                                                </tr>
                                                <tr>
                                                    <th><small>Bodega</small></th>
                                                    <th><small>Observaciones</small></th>
                                                    <th><small>Valor</small></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pagos.map((pago)=>(   
                                                    <tr key={pago.id}>
                                                        <td><small>{pago.bodega.name}</small></td>
                                                        <td><small>{pago.observations}</small></td>
                                                        <td><small>{"$ "+ new Intl.NumberFormat().format(pago.valor)}</small></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>:
                                        <p>El usuario no genero pagos</p>
                                    }
                                    {noEfectivo.length>0 ?
                                        <table className="table table-secondary table-hover table-bordered table-responsive table-striped">
                                            <thead>
                                                <tr>
                                                    <th colSpan={4}>Valor facturado otros medios:  {"$ "+ new Intl.NumberFormat().format(noEfectivoValor) }</th>
                                                </tr>
                                                <tr>
                                                    <th><small>Bodega</small></th>
                                                    <th><small>Factura N°:</small></th>
                                                    <th><small>Valor</small></th>
                                                    <th><small>Medio</small></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {noEfectivo.map((noEfec)=>(   
                                                    <tr key={noEfec.id}>
                                                        <td><small>{noEfec.bodega.name}</small></td>
                                                        <td><small>{noEfec.id}</small></td>
                                                        <td><small>{"$ "+ new Intl.NumberFormat().format(noEfec.totalFactura)}</small></td>
                                                        <td><small>{noEfec.formaPago}</small></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>:
                                        <p>El usuario no hizo ventas con pago por otros medios</p>
                                    }
                                </div>
                                <div className="col-md-4">
                                    { transferencias.length>0 ? 
                                        <table className="table table-info table-hover table-bordered table-responsive table-striped">
                                            <thead>
                                                <tr>
                                                    <th colSpan={3}>Valor transferido a bodegas:  {"$ "+ new Intl.NumberFormat().format(saldoTransferencias) }</th>
                                                </tr>
                                                <tr>
                                                    <th><small>Bodega</small></th>
                                                    <th><small>Observaciones</small></th>
                                                    <th><small>Valor</small></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {transferencias.map((transferencia)=>(   
                                                    <tr key={transferencia.id}>
                                                        <td><small>{transferencia.bodega.name}</small></td>
                                                        <td><small>{transferencia.observations}</small></td>
                                                        <td><small>{"$ "+ new Intl.NumberFormat().format(transferencia.valor)}</small></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>:
                                        <p>El usuario no genero transferencias a bodegas</p>
                                    }
                                    { cuentas.length>0 ? 
                                        <table className="table table-info table-hover table-bordered table-responsive table-striped">
                                            <thead>
                                                <tr>
                                                    <th colSpan={3}>Valor transferido a cuentas:  {"$ "+ new Intl.NumberFormat().format(saldoCuentas) }</th>
                                                </tr>
                                                <tr>
                                                    <th><small>Bodega</small></th>
                                                    <th><small>Observaciones</small></th>
                                                    <th><small>Valor</small></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {cuentas.map((cuenta)=>(   
                                                    <tr key={cuenta.id}>
                                                        <td><small>{cuenta.bodega.name}</small></td>
                                                        <td><small>{cuenta.observations}</small></td>
                                                        <td><small>{"$ "+ new Intl.NumberFormat().format(cuenta.valor)}</small></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>:
                                        <p>El usuario no genero transferencias a cuentas</p>
                                    }
                                    
                                </div>
                            </div>
                        </>                            
                    }
                </div>
                :
                <div className="container text-center">
                    <div className="alert alert-warning" role="alert">
                        <h2>No hay movimientos para esta consulta</h2>
                    </div>                    
                </div>
            }
            
        </>
    )
}