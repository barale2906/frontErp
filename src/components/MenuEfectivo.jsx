import { NavLink } from "react-router-dom";

export default function MenuEfectivo(){
    return(
        <div className="row">
                <div className="container text-center">
                    <h4>GESTIÓN DEL EFECTIVO</h4>
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <NavLink to="/efectivo/movimientos"><button type="button" className="btn btn-secondary">Movimientos por Bodega</button></NavLink>
                        <NavLink to="/efectivo"><button type="button" className="btn btn-info">Cierre de Caja</button></NavLink>
                        <NavLink to="/efectivo/pagar"><button type="button" className="btn btn-success">Pago de Facturas</button></NavLink>
                        <NavLink to="/efectivo/transferir"><button type="button" className="btn btn-warning">Transferir Dinero</button></NavLink>                        
                    </div>
                </div>                
            </div>
    )
}