import axios from "axios";
import { useEffect, useState } from "react";
import url from "../utils/urlimport";

export default function InventarioReporte(){

    // Búsqueda
    const [busca, setBusca] = useState()
    const [buscados, setBuscados] = useState()
    const [inventarios, setInventarios]=useState([])
    const rutainv = url+"inventario";

    //parámetros de paginación
    const [itemsPerPage, setItemsPerPage]=useState(25);
    const [currentPage, setCurrentPage]=useState(1);
    const totalItems = buscados?.length; //Total de registros a paginar
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex-itemsPerPage;


    // carga datos a buscar
    const handleChange=e=>{
        setBusca(e.target.value);
        filtrar(e.target.value)
    }

    // Carga productos enconstrados según parámetros
    const filtrar=(terminoBusqueda)=>{
        const resultadosBusqueda=inventarios?.filter((elemento)=>{
          if(elemento.generico?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.code?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          || elemento.comercial?.toString().toLowerCase().includes(terminoBusqueda.toLowerCase())
          ){
            return elemento;
          }
        });
        setBuscados(resultadosBusqueda);
    }

    // Seleccionar inventario
    const axiosInventario = async () => {
        

        await axios.get(rutainv)
        .then((res)=>{        
            setInventarios(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    useEffect(()=>{        
        axiosInventario();
    }, [])

    

    return (
        <>
            <div className="container text-center">
                <div className="alert alert-success" role="alert">                    
                    <h5>Buscar Producto</h5>
                    <input value={busca} autoFocus onChange={handleChange} type="text" placeholder='Buscar producto' className='form-control'/>                            
                    <h4>Selecciona el rango de fechas</h4>
                    
                </div>                            
            </div>
        </>
    )
}