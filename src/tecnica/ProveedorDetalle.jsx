export default function ProveedorDetalle ({consulta}){
    
    return(
        <>
            <tr key={consulta.id}>
                <td>{consulta.fecha}</td>
                <td>{consulta.proveedore.name}</td>
                <td>{consulta.consulta}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(consulta.valor) }</td>
                <td>{"$ "+ new Intl.NumberFormat().format(consulta.valorPagado) }</td>
                <td>{consulta.observaciones}</td>            
            </tr>
        </>
    )
}