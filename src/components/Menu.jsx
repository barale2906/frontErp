import React, { useContext } from "react";

import { NavLink } from "react-router-dom";
import UserContext from "../providers/sesion/UserContext";

export default function Menu(){
    const {cierraSesion, sesionUser, bodegaActual} = useContext(UserContext)
    const salir = ()=>{
        cierraSesion()
    }
    return (
        <nav className="navbar navbar-expand-lg bg-secondary">
            <div className="container-fluid text fs-4">
                <NavLink className="nav-link" to="/Dashboard">FARMACIA</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                    <div className="collapse navbar-collapse " id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 position-relative">                            
                            <li className="nav-item dropdown"> 
                                <a className="nav-link dropdown-toggle fs-6" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="">
                                    USUARIOS
                                </a>
                                <ul className="dropdown-menu">
                                    <li><NavLink className="dropdown-item" to="/micuenta">Mi Cuenta</NavLink></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><NavLink className="dropdown-item" to="/users">Usuarios</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle fs-6" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="">
                                    INVENTARIOS
                                </a>
                                <ul className="dropdown-menu">
                                    <li><NavLink className="dropdown-item" to="/tecnicas">Recepción </NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/ambientalreg">Ambientales</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/inventarios">Inventario</NavLink></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><NavLink className="dropdown-item" to="/bodegas">Bodegas</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/ambientalubi">Ubicaciones Ambiente</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/lineas">Líneas</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/productos">Productos</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/proveedores">Proveedores</NavLink></li>                                    
                                </ul>
                            </li>
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle fs-6" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="">
                                    FACTURACIÓN
                                </a>
                                <ul className="dropdown-menu">                                    
                                    <li><NavLink className="dropdown-item" to="/facturaslista">Lista de Facturas</NavLink></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><NavLink className="dropdown-item" to="/coworking">Coworking</NavLink></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><NavLink className="dropdown-item" to="/membresia">Membresia</NavLink></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><NavLink className="dropdown-item" to="/impuestos">Impuestos</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/listaprecios">Definir Lista de Precios</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/efectivo">Efectivo</NavLink></li>
                                    <li><NavLink className="dropdown-item" to="/reporteFacturacion">Reportes</NavLink></li>
                                </ul>
                            </li>
                            <li className="nav-item dropdown"> 
                                <a className="nav-link dropdown-toggle fs-6" role="button" data-bs-toggle="dropdown" aria-expanded="false" href="">
                                    FINANCIERA
                                </a>
                                <ul className="dropdown-menu">
                                    <li><NavLink className="dropdown-item" to="/movimientos">Movimientos</NavLink></li>
                                    <li><hr className="dropdown-divider"/></li>
                                    <li><NavLink className="dropdown-item" to="/comisiones">Comisiones</NavLink></li>
                                </ul>
                            </li>                        
                        </ul>
                        <h6>{sesionUser.name} / Bodega: {bodegaActual.name} </h6>
                        <button type="button" class="btn-close" aria-label="Close" onClick={()=>salir()}></button>
                        
                    </div>
            </div>
        </nav>
    )
}  