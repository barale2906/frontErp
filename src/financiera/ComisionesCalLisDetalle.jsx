export default function ComisionesCalLisDetalle({comision, setEditComision, index}){
    
    return(
        <tr key={index}>
            <td>{comision.id}</td>
            <td>{comision.name}</td>
            <td>{comision.facturaDetalles.length}</td>
            <td>{"$ "+ new Intl.NumberFormat().format(comision.totalFactura) }</td>            
            <td>                
                {
                    comision.calculo?
                    <>{"$ "+ new Intl.NumberFormat().format(comision.calculo)}</>:
                    <button type="button" className="btn btn-warning btn-sm" onClick={()=>{setEditComision(comision)}} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Calcular</button>
                }
            </td>
        </tr>
    )
}