import { useContext, useEffect, useState } from "react";
import UserContext from "../providers/sesion/UserContext";

export default function BuscaProductos({setBuscados}){

    const [busca, setBusca] = useState();
    const {productos, cargaproductos} = useContext(UserContext);

    // carga datos a buscar
    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    // Carga productos enconstrados según parámetros
    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=productos?.filter((elemento)=>{
          if(elemento.generico?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.code?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.comercial?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          ){
            return elemento;
          }
        });
        setBuscados(resultadosBusqueda);
    }

    useEffect(()=>{      
        cargaproductos()
    }, [])

    return (
        <>
            <div className="container text-center">
                <div className="row justify-content-md-center">
                    <div className="col-sm-6">
                        <div className="alert alert-success" role="alert">
                            <h5>Buscar Producto</h5>
                            <input value={busca} autoFocus onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>                            
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}