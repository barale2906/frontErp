import { NavLink } from "react-router-dom";

export default function DomiciliosListado(){
    return(
        <>
            <div className="row">
                <div className="container text-center alert alert-primary col-sm-10 mt-2" role="alert"></div>
                <div className="container text-center alert alert-info col-sm-2 mt-2" role="alert">
                    <NavLink to="/domiciliosTarifas"><button type="button" className="btn btn-info">Tarifas</button></NavLink>
                </div>
            </div>
        </>
    )
}