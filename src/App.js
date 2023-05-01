import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AmbientalLanding from "./ambiental/AmbientalLanding";
import LandingUbica from "./ambientalUbicacion/LandingUbica";
import LandingBodega from "./bodega/LandingBodega";
import Menu from "./components/Menu";
import NoEncotrada from "./components/Redirect404";
import Restringido from "./components/Restringido";
import CierreCaja from "./efectivo/CierreCaja";
import CierreReporte from "./efectivo/CierreReporte";
import EfectivoLanding from "./efectivo/EfectivoLanding";
import MovimientosBodega from "./efectivo/MovimientosBodega";
import PagoFacturas from "./efectivo/PagoFacturas";
import TransferirEfectivo from "./efectivo/TransferirEfectivo";
import Basicos from "./facturacion/Basicos";
import FacturacionReporte from "./facturacion/FacturacionReporte";
import FacturaLista from "./facturacion/FacturaLista";
import LandingFactura from "./facturacion/LandingFactura";
import ImpuestosLanding from "./impuestos/ImpuestosLanding";
import InventarioLanding from "./inventario/InventarioLanding";
import InventarioReporte from "./inventario/InventarioReporte";
import LineaLanding from "./linea/LineaLanding";
import AgregaProducto from "./listaprecios/AgregaProducto";
import CargaProducto from "./listaprecios/CargaProducto";
import ListaLanding from "./listaprecios/ListaLanding";
import ListaProductos from "./listaprecios/ListaProductos";
import ProductoLanding from "./producto/ProductoLanding";
import ProveedorLanding from "./proveedor/ProveedorLanding";
import { ProtectedRoute } from "./providers/sesion/ProtectedRoute";
import UserContext from "./providers/sesion/UserContext";
import ProveedoresReporte from "./tecnica/ProveedoresReporte";
import TecnicaDetaProductos from "./tecnica/TecnicaDetaProductos";
import TecnicaLanding from "./tecnica/TecnicaLanding";
import TecnicaNavigate from "./tecnica/TecnicaNavigate";
import LandingUser from "./users/LandingUser";
import Login from "./users/Login";
import MiCuenta from "./users/MiCuenta";
import Roles from "./users/Roles";
import FacturaCoworking from "./facturacion/FacturaCoworking";




export default function App(){
  
  const {sesionUser} = useContext(UserContext)

  return (
    <>      
        <BrowserRouter>
        {
          sesionUser ?            
            <Menu/> :
            <></>
        }
          
          <div className="container mt-2">
            <Routes>
              
              <Route index element={<Login/>}/>  
              
              <Route element={<ProtectedRoute  isAllowed={!!sesionUser} />}>
                <Route path="/dashboard" element={<LandingFactura/>}/>
                <Route path="/coworking" element={<FacturaCoworking/>}/>
                <Route path="/ambientalreg" element={<AmbientalLanding/>}/>
                <Route path="/tecnicas" element={<TecnicaLanding />}/>
                <Route path="/tecnicas/:id" element={<TecnicaDetaProductos/>}/>
                <Route path="/tecnicas/cargar" element={<TecnicaNavigate/>}/>
                <Route path="/restringido" element={<Restringido/>}/>
                <Route path="/micuenta" element={<MiCuenta/>}/>
                <Route path="/inventarios" element={<InventarioLanding/>}/>
              </Route>

              <Route element={<ProtectedRoute 
                redirectTo="/restringido" 
                isAllowed={!!sesionUser && sesionUser.rol===2} />}
              >
                {
                  sesionUser?.rol===3 ? 
                  <></>:
                  <>                  
                  <Route path="/listaprecios" element={<ListaLanding/>}/>
                  <Route path="/facturaslista" element={<FacturaLista/>}/>
                  <Route path="/listaprecios/:id" element={<ListaProductos/> }/>
                  <Route path="/agregaproducto/:id" element={<AgregaProducto/>}/>
                  <Route path="/cargaproducto/:id" element={<CargaProducto/>}/>
                  <Route path="/efectivo" element={<EfectivoLanding/>}/>
                  <Route path="/efectivo/transferir" element={<TransferirEfectivo/>}/>
                  <Route path="/efectivo/pagar" element={<PagoFacturas/>}/>
                  <Route path="/efectivo/cerrar" element={<CierreCaja/>}/>
                  <Route path="/efectivo/movimientos" element={<MovimientosBodega/>}/>
                  <Route path="/reporteFacturacion" element={<FacturacionReporte/>}/>
                  <Route path="/reporteProveedor" element={<ProveedoresReporte/>}/>
                  <Route path="/reporteCierres" element={<CierreReporte/>}/>
                  <Route path="/reporteInventario" element={<InventarioReporte/>}/>
                  </>
                }                
              </Route>
                

              <Route element={<ProtectedRoute 
                redirectTo="/restringido"  
                isAllowed={!!sesionUser && sesionUser.rol===3 } />}> 
                <Route path="/facturaslista" element={<FacturaLista/>}/>               
                <Route path="/listaprecios" element={<ListaLanding/>}/>
                <Route path="/listaprecios/:id" element={<ListaProductos/> }/>
                <Route path="/agregaproducto/:id" element={<AgregaProducto/>}/>
                <Route path="/cargaproducto/:id" element={<CargaProducto/>}/>
                <Route path="/efectivo" element={<EfectivoLanding/>}/>
                <Route path="/efectivo/transferir" element={<TransferirEfectivo/>}/>
                <Route path="/efectivo/pagar" element={<PagoFacturas/>}/>
                <Route path="/efectivo/cerrar" element={<CierreCaja/>}/>
                <Route path="/efectivo/movimientos" element={<MovimientosBodega/>}/>
                <Route path="/bodegas" element={<LandingBodega/>}/>                
                <Route path="/users" element={<LandingUser/>}/>
                <Route path="/rols" element={<Roles/>}/>
                <Route path="/ambientalubi" element={<LandingUbica/>}/>
                <Route path="/lineas" element={<LineaLanding/>}/>
                <Route path="/impuestos" element={<ImpuestosLanding/>}/>
                <Route path="/proveedores" element={<ProveedorLanding/>}/>
                <Route path="/productos" element={<ProductoLanding/>}/>
                <Route path="/reporteFacturacion" element={<FacturacionReporte/>}/>
                <Route path="/reporteProveedor" element={<ProveedoresReporte/>}/>
                <Route path="/reporte/basicos" element={<Basicos/>}/>
                <Route path="/reporteCierres" element={<CierreReporte/>}/>
                <Route path="/reporteInventario" element={<InventarioReporte/>}/>
              </Route>               

                        
              
              <Route path="*" element={<NoEncotrada/>}/>
            </Routes>
          </div>
        </BrowserRouter>      
    </>
  )
}
