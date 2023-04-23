import { useRef } from "react"
import ReactToPrint from "react-to-print";

export default function TecnicaImprimir ({seleccionado, productoSel}){

    const ref = useRef()

    return (
        <>
            <div ref={ref} className="d-none d-print-block" >
                <div>
                    <div className="alert alert-primary" role="alert">
                        <h6 className="modal-title" id="productos">
                            CARGAR PRODUCTOS A LA FACTURA: <strong>{seleccionado.factura} </strong> 
                            DE FECHA: <strong>{seleccionado.fecha} </strong>
                            DEL PROVEEDOR: <strong>{seleccionado.proveedore.name} </strong>
                            ESTADO:  
                            {
                                seleccionado.status===2 ?
                                    <strong>APROBADA</strong>  :
                                <></>                            
                            }
                            {
                                seleccionado.status===3 ?
                                <strong>DESAPROBADA</strong>  :
                                <></>
                            }                        
                        </h6>
                        <p>Transportadora: <strong>{seleccionado.transportadora}</strong> Embalaje: <strong>{seleccionado.embalaje}</strong> <small>Creado por: {seleccionado.user.name}</small></p> 
                        
                    </div>
                    
                    <h6>Productos Verificados para esta factura</h6>                                
                    <table className="table table-success table-hover table-bordered table-responsive table-striped">
                        <thead>
                            <tr>                                        
                                <th scope="col"><small>NOMBRE COMERCIAL</small></th>
                                <th scope="col"><small>LOTE</small></th>
                                <th scope="col"><small>VENCIMIENTO</small></th>
                                <th scope="col"><small>CANT</small></th>
                                <th scope="col"><small>UNIDAD</small></th>
                                <th scope="col"><small>COSTO</small></th>
                                <th scope="col"><small>CUM</small></th>
                                <th scope="col"><small>GENERICO</small></th>
                                <th scope="col"><small>COMERCIAL</small></th>
                                <th scope="col"><small>INVIMA</small></th>
                                <th scope="col"><small>TIPO PRODUCTO</small></th>
                                <th scope="col"><small>ETIQUETADO</small></th>
                                <th scope="col"><small>EMBALAJE PRIMARIO</small></th>
                                <th scope="col"><small>EMBALAJE SECUNDARIO</small></th>
                                <th scope="col"><small>PRESENTACIÓN LÍQUIDA</small></th>
                                <th scope="col"><small>CIERRES HERMETICOS</small></th>
                                <th scope="col"><small>CONDICIONES DM</small></th>
                                <th scope="col"><small>OBSERVACIONES</small></th>
                            </tr>
                        </thead>
                        <tbody>
                            {productoSel.map((productose, index)=>(                                        
                                <tr key={productose.id}>
                                    <td><small>{productose.producto.comercial}</small></td>
                                    <td><small>{productose.lote}</small></td>
                                    <td><small>{productose.expiration}</small></td>
                                    <td><small>{productose.cantidad}</small></td>
                                    <td><small>{productose.producto.unit}</small></td>
                                    <td><small>$ {productose.costo}</small></td>
                                    <td><small>{productose.cum}</small></td>
                                    <td><small>{productose.generico}</small></td>
                                    <td><small>{productose.comercial}</small></td>
                                    <td><small>{productose.invima}</small></td>
                                    <td><small>{productose.tipoproducto}</small></td>
                                    <td><small>{productose.etiquetado}</small></td>
                                    <td><small>{productose.embalajePrimario}</small></td>
                                    <td><small>{productose.embalajeSecundario}</small></td>
                                    <td><small>{productose.condicionesPresentacionLiquida}</small></td>
                                    <td><small>{productose.cierresHermeticos}</small></td>
                                    <td><small>{productose.condicionesDM}</small></td>
                                    <td><small>{productose.observations}</small></td>
                                </tr>                                                
                            ))}
                        </tbody>
                    </table>      
                </div>
            </div>
            <ReactToPrint trigger={()=><button type="button" className="btn btn-info btn-sm"  >Imprimir</button>} content={()=>ref.current}/>
        </>
    )
}