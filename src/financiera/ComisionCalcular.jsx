import { useEffect, useState } from "react";
import url from "../utils/urlimport";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

const messages = {
    required: "Este campo es obligatorio"
};

const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/    
};

export default function ComisionCalcular({editComision, setComisionesUsuario, comisionesUsuario}){
    const [encabezadoUsu, setEncabezadoUsu]=useState()
    const [esquema, setEsquema]=useState([])
    const [factura, setFactura]=useState([])
    const [sinFac, setsinFac]=useState([])
    const [crt, setCrt]=useState(0)
    let key
    

    useEffect(()=>{
        reset(editComision)
    }, [editComision])

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'}); 
    
    //Cargar productos de la factura
    const cargar = ()=>{
        setFactura(editComision.facturaDetalles)
    }
    

    //Determinar comisión aplicable
    const axiosComisionUsu = async () => {
        const ruta = url+"comisionusuario/"+editComision.comiId
        
        await axios.get(ruta)
        .then((res)=>{            
            setEncabezadoUsu(res.data);            
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    //Cargar nuevo array
    const nuevoarray = ()=>{
        const sinEstaFactura=comisionesUsuario?.filter((elemento)=>{
            if(elemento.id!==editComision.id){
                return elemento;
            }
        });
        setsinFac(sinEstaFactura)
    }

    useEffect(()=>{
        axiosComisionUsu();
        cargar();
        nuevoarray();
        setCrt(0);
    }, [editComision])


    //Determinar detalles de la comision
    const axiosEsquema = async () => {
        const ruta = url+"comisionencabezado/"+encabezadoUsu?.comiEncaId
        
        await axios.get(ruta)
        .then((res)=>{            
            setEsquema(res.data[0].comisionesProductos);            
        })
        .catch((error)=>{
            //console.log(error)
        })
    };

    useEffect(()=>{
        axiosEsquema();
    }, [encabezadoUsu])

    const onSubmit = async () => {  
        window.sessionStorage.setItem("comisionCargada", parseFloat(0))      
        factura.map((comprado)=>(
            key=comprado.id,
            filtrar(comprado)
        ))
        cerrar()
    }

    //Determinar valor de la comisión
    const filtrar = (comprado)=>{
        const resultadosBusqueda=esquema?.filter((elemento)=>{
            if(elemento.prodId===comprado.prodId){
                return elemento;
            }
        });
        if(resultadosBusqueda.length>0){
            const preciocom=(comprado.preciobase-comprado.descuentobase)*resultadosBusqueda[0].percentage/100
            const preciocomis=Math.round(preciocom)
            
            const storag=window.sessionStorage.getItem("comisionCargada")            
            let x = parseFloat(preciocomis);
            let y = parseFloat(storag);
            const valor=x+y            
            window.sessionStorage.setItem("comisionCargada", parseFloat(valor))        
        }
    }
    const cerrar = ()=>{

        const acumulado=window.sessionStorage.getItem("comisionAcumulada")        
        const acumuladoSer=parseFloat(acumulado)
        const comiActual=window.sessionStorage.getItem("comisionCargada")
        const comiActualSer=parseFloat(comiActual)
        if(acumuladoSer>0){
            const nuevoAcum=acumuladoSer+comiActualSer
            window.sessionStorage.setItem("comisionAcumulada", parseFloat(nuevoAcum))
        }else{
            window.sessionStorage.setItem("comisionAcumulada", parseFloat(comiActual))
        }
        const actual ={
            "id":editComision.id,
            "name":editComision.name,
            "facturaDetalles":editComision.facturaDetalles,
            "totalFactura":editComision.totalFactura,
            "calculo":window.sessionStorage.getItem("comisionCargada"),
            "comiId":editComision.comiId
        }
        const itemes=[actual, ...sinFac]
        
        setComisionesUsuario(itemes)
        setCrt(1)
    }

    if(editComision)
    
    return(
        <>
        
        {
            crt === 0 ?
                <form onSubmit={handleSubmit(onSubmit)}>            
                
                    <label htmlFor="id" className="form-label">Factura N°:</label>
                    <input          
                        name="id"
                        type="text"
                        placeholder="Nombre Esquema Comisión"
                        className={`form-control ${errors.id && "error" }`}        
                        {...register("id", {
                            required: messages.required,
                            pattern: {
                            value: patterns.id,
                            message: messages.id
                            }
                        })}
                    />
                    {errors.id && <p className="text-danger">{errors.id.message}</p>}

                    <label htmlFor="name" className="form-label">Cliente:</label>
                    <input          
                        name="name"
                        type="text"
                        placeholder="Nombre Esquema Comisión"
                        className={`form-control ${errors.name && "error" }`}        
                        {...register("name", {
                            required: messages.required,
                            pattern: {
                            value: patterns.name,
                            message: messages.name
                            }
                        })}
                    />
                    {errors.name && <p className="text-danger">{errors.name.message}</p>}

                    <label htmlFor="totalFactura" className="form-label">Total de la Factura:</label>
                    <input          
                        name="totalFactura"
                        type="text"
                        placeholder="Escriba solo números"
                        className={`form-control ${errors.totalFactura && "error" }`}        
                        {...register("totalFactura", {
                            required: messages.required,
                            pattern: {
                            value: patterns.totalFactura,
                            message: messages.totalFactura
                            }
                        })}
                    />
                    {errors.totalFactura && <p className="text-danger">{errors.totalFactura.message}</p>}
                    <label htmlFor="productos" className="form-label">Productos de la Factura:</label>
                        <table className="table table-info table-hover table-bordered table-responsive table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">NOMBRE</th>
                                    <th scope="col">CANTIDAD</th>
                                    <th scope="col">UNITARIO</th>
                                    <th scope="col">TOTAL</th>
                                </tr>
                            </thead>
                            <tbody>
                            {factura.map((producto, index)=>(                                        
                                <tr key={index}>
                                    <td>{producto.comercial}</td>
                                    <td>{producto.cantidad}</td>
                                    <td>{"$ "+ new Intl.NumberFormat().format(producto.precio) }</td>
                                    <td>{"$ "+ new Intl.NumberFormat().format(producto.totalbase) }</td>
                                </tr>    
                            ))}
                            </tbody>
                        </table>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="submit" className="btn btn-info">Calcular comisión para esta factura</button>
                    </div>  
                </form>
            :
            <>
                <h5>La factura N°: {editComision.id} genero: {"$ "+ new Intl.NumberFormat().format(window.sessionStorage.getItem("comisionCargada")) } para un acumulado de {"$ "+ new Intl.NumberFormat().format(window.sessionStorage.getItem("comisionAcumulada")) }</h5>
            </>
        }
    </>    
    ) 
    
}