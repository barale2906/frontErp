import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import CalculaImpuesto from "../components/CalculaImpuesto";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

    const messages = {
        required: "Este campo es obligatorio"
            
    };
  
  
  const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
  };

export default function EditarValor({editValor}){

    const [actual, setActual] = useState()
    const [precio, setPrecio] = useState()
    const [descuento, setDescuento] = useState()
    const vacio = {
        precio:'',
        precioDescuento:''        
    }


    // Seleccionar productos en Inventario
    const axiosconsulta = async () => {
        const rutain=url+"listaprecio/"+editValor+"/deta"
        
        await axios.get(rutain)
        .then((res)=>{ 
            setActual(res.data)
           // reset(res.data)             
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    useEffect(()=>{
        axiosconsulta();
    }, [editValor])

    
    const alerta = useContext(AlertaContext) 

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset    
    } = useForm({mode:'onblur'});

    const handleChange=e=>{
        setPrecio(e.target.value);        
    }

    const handleChangedescuento=e=>{
        setDescuento(e.target.value);        
    }


    const onSubmit = async (listaInfo) => {

        let precioImpuesto
        let precioTotal 
        const precioBase = precio-descuento
        let observations = listaInfo.observations
        const idImpuues = actual.producto.impId
        let valorImp 
        

        const rutaimp=url+"impuesto/"+idImpuues
        
        await axios.get(rutaimp)
        .then((res)=>{ 
            valorImp = res.data.valor                    
        })
        .catch((error)=>{
            console.log(error)
        })

        precioImpuesto = precioBase*valorImp/100       

        precioTotal = precioBase+precioImpuesto

        const datosMod = {
            
            "precio": precio,
            "precioDescuento": descuento,
            "precioImpuesto": precioImpuesto,
            "precioTotal": precioTotal,
            "observations": "-- Alexander Barajas Modifico el valor. --- "+observations
        }

        const ruta = url+"listaprecio/"+editValor
        
        Swal.fire({
          title: '¿Estas Seguro?',
          text: `¿Quieres modificar: ${actual.producto.generico}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, estoy seguro!'
        }).then((result) => {
          if (result.isConfirmed) {
      
             axios.put(ruta, datosMod).then((response) =>{
                 if(response.status ===200){
                      Swal.fire(
                          '¡MODIFICO UN PRODUCTO DE LA LISTA!',
                          `¡Se modifico satisfactoriamente el precio de: ${actual.producto.generico}?`,
                          'success'
                      )
                      setPrecio("")
                      setDescuento("")                      
                      reset(vacio)
                      alerta();
                 } else {
                     Swal.fire(
                         '¡Error!',
                         'Hubo un problema al modificar la lista',
                         'error'
                     )
                 }
             })
      
            
          }
        })
    }
    
    if(actual)
    return (
        <>
            <h5>Modificar precio a {actual.producto.generico}</h5>
            <form onSubmit={handleSubmit(onSubmit)}>            
                <label htmlFor="precio" className="form-label">Valor antes de impuestos: <strong>{"$ "+ new Intl.NumberFormat().format(actual.precio) }</strong></label>
                <input          
                    name="precio"
                    type="text"
                    placeholder="Digita nuevo precio"
                    
                    className={`form-control ${errors.precio && "error" }`}        
                    {...register("precio", {
                        required: messages.required,
                        pattern: {
                        value: patterns.precio,
                        message: messages.precio
                        }
                    })}
                    onChange={handleChange}
                />
                {errors.precio && <p className="text-danger">{errors.precio.message}</p>}

                <label htmlFor="precioDescuento" className="form-label">Valor descuento aplicado: <strong>{"$ "+ new Intl.NumberFormat().format(actual.precioDescuento) }</strong></label>
                <input          
                    name="precioDescuento"
                    type="text"
                    placeholder="Digita nuevo descuento"
                    
                    className={`form-control ${errors.precioDescuento && "error" }`}        
                    {...register("precioDescuento", {
                        required: messages.required,
                        pattern: {
                        value: patterns.precioDescuento,
                        message: messages.precioDescuento
                        }
                    })}
                    onChange={handleChangedescuento}
                    
                />
                {errors.precioDescuento && <p className="text-danger">{errors.precioDescuento.message}</p>}
                <br/>                
                <CalculaImpuesto precio={precio} idimpuesto={actual.producto.impId} descuento={descuento}/>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" className="btn btn-info">Modificar Precio</button>
                </div>  
            </form>
        </>
    )    
}