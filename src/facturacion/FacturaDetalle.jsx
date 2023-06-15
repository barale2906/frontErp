export default function FacturaDetalle ({variable, setDetalle, imprime}){
    
    return(
        <>
            <tr key={variable.id}>
                <td>{variable.id}</td>
                <td>{variable.createdAt}</td>
                <td>{variable.tipoDocumento}</td>
                <td>{variable.documento}</td>
                <td>{variable.name}</td>
                <td>{variable.adress}</td>
                <td>{variable.phone}</td>
                <td>{variable.email}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(variable.descuentos)}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(variable.impuestos)}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(variable.totalFactura)}</td>
                <td>{variable.medioPago.name}</td>
                <td>{variable.user.name}</td>
                <td>{variable.bodega.name}</td>
                
                    {imprime===2 ?
                        <></>:
                        <td>
                            <button type="button" className="btn btn-info btn-sm" onClick={()=>setDetalle(variable)} >Ver</button>
                        </td>
                    }
            </tr>
        </>
    )
}