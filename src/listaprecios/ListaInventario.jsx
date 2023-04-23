export default function ListaInventario({inven, setEditValor}){

    
    return (
        <> 
            <tr key={inven.id}>
                <td><small>{inven.generico}</small></td>
                <td><small>{inven.comercial}</small></td>
                <td><small>{inven.unit}</small></td>
                <td><small>{"$ "+ new Intl.NumberFormat().format(inven.listaPrecios[0].precio) }</small></td>
                <td><small>{"$ "+ new Intl.NumberFormat().format(inven.listaPrecios[0].precioDescuento) }</small></td>
                <td><small>{"$ "+ new Intl.NumberFormat().format(inven.listaPrecios[0].precioImpuesto) }</small></td>
                <td><small>{"$ "+ new Intl.NumberFormat().format(inven.impuesto.valor) }</small></td>
                <td><small>{"$ "+ new Intl.NumberFormat().format(inven.listaPrecios[0].precioTotal) }</small></td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">    
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditValor(inven.listaPrecios[0].id)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">$</button>                    
                    </div>
                </td>
            </tr>
        </>
    )
}