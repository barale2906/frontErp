import { useContext } from "react"
import AlertaContext from "../providers/AlertaContext"

export default function DetallePagoFacturas({factura, setEditFactura}){
    const alerta = useContext(AlertaContext)
    return (
        <>
        <tr key={factura.id}>
            <td>{factura.fecha}</td>
            <td>{factura.proveedore.name}</td>
            <td>{factura.factura}</td>
            <td>{"$ "+ new Intl.NumberFormat().format(factura.valor) }</td>
            <td>{"$ "+ new Intl.NumberFormat().format(factura.valorPagado) }</td>
            <td>{factura.observaciones}</td>
            <td>
                <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditFactura(factura)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Pagar</button>
            </td>
        </tr>
        </>
    )
}