export default function CierreDetalle ({consulta}){
    return(
        <>
            <tr key={consulta.id}>
                <td>{consulta.createdAt}</td>
                <td>{consulta.user.name}</td>
                <td>{"$ "+ new Intl.NumberFormat().format(consulta.valor) }</td>
                <td>{consulta.observations}</td>
                <td>{consulta.bodega.name}</td>
            </tr>
        </>
    )
}