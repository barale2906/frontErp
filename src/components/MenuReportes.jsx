import { NavLink } from "react-router-dom";

export default function MenuReportes(){
    return(
        <div className="row">
            <div className="container text-center">
                <h4>GESTIÓN DE REPORTES</h4>
                <div className="btn-group" role="group" aria-label="Basic example">
                    <NavLink to="/reporte/basicos"><button type="button" className="btn btn-secondary">Básicos</button></NavLink>
                    <NavLink to="/reporteFacturacion"><button type="button" className="btn btn-success">Facturación</button></NavLink>
                    <NavLink to="/reporteProveedor"><button type="button" className="btn btn-info">Proveedores</button></NavLink>
                    <NavLink to="/reporteCierres"><button type="button" className="btn btn-primary">Cierres de Caja</button></NavLink>                        
                </div>
            </div>                
        </div>
    )
}