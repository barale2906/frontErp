export default function DomiciliosDetalle ({domicilio, setEditDomicilio, setDomi}){
    
    return(
        <>
            <tr key={domicilio.id}>
                <td>{domicilio.factId}</td>
                <td>{domicilio.facturaEncabezado.name}</td>
                <td>{domicilio.facturaEncabezado.phone}</td>
                <td>{domicilio.facturaEncabezado.adress}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(domicilio.facturaEncabezado.totalFactura)}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(domicilio.facturaEncabezado.domiTarifa)}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(domicilio.facturaEncabezado.totalFactura+domicilio.facturaEncabezado.domiTarifa)}</td>
                <td>{domicilio.name}</td>
                <td>{domicilio.observaciones}</td>
                <td>
                    {
                        domicilio.status===1 ?
                        <small>Creado</small>:
                        <small>En Entrega</small>
                    }
                </td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        {
                            domicilio.status===1 ?
                            <button type="button" className="btn btn-info btn-sm" onClick={()=>{setDomi(domicilio)}} >Recoger</button>
                            :
                            <></>
                        }
                        {
                            domicilio.status===2 ?
                            <button type="button" className="btn btn-success btn-sm" onClick={()=>{setEditDomicilio(domicilio)}} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Legalizar</button>
                            :
                            <></>
                        }
                        {
                            domicilio.status===3 ?
                            <button type="button" className="btn btn-warning btn-sm" onClick={()=>{setEditDomicilio(domicilio)}} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Factura</button>
                            :
                            <></>
                        }
                        {
                            domicilio.status===4 ?
                                <p>CERRADO</p>
                            :
                            <></>
                        }
                    </div>
                </td>
            </tr>
        </>
    )
}