export default function ComisionesCalLisDetalle({comision, index}){
    return(
        <tr key={index}>
            <td>{comision.id}</td>
            <td>{comision.name}</td>
            <td>{"$ "+ new Intl.NumberFormat().format(comision.totalFactura) }</td>
            <td>{comision.facturaDetalles.length}</td>
            <td></td>
        </tr>
    )
}