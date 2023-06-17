import { NavLink } from "react-router-dom";

export default function DomiciliosEncabezado(){
    return(
        <>
            <div className="row">
                <div className="container text-center alert alert-primary col-sm-9 mt-2" role="alert">
                    <h5>A continuación se presentan todos los domicilios pendientes por gestión</h5>
                </div>
                <div className="container text-center alert alert-info col-sm-3 mt-2" role="alert">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <NavLink to="/domiciliosTarifas"><button type="button" className="btn btn-info">Tarifas</button></NavLink>
                        <NavLink to="/domicilios"><button type="button" className="btn btn-primary">Enrutar</button></NavLink>
                        <NavLink to="/domicilioslega"><button type="button" className="btn btn-success">Cierre</button></NavLink>                        
                    </div>                    
                </div>
            </div>
        </>
    )
}