import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom"
import Swal from "sweetalert2";
import CalculaImpuesto from "../components/CalculaImpuesto";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};  
  
const patterns = {
//name: /^[A-Za-z]+$/i,
};

export default function CargaProducto (){
    const {id} = useParams()
    const idprod = window.sessionStorage.getItem("IdProd")
    const rutaps = url+"producto/"+idprod
    const alerta = useContext(AlertaContext)
    const [elegido, setElegido] = useState()
    let navegar = useNavigate()
    const [precio, setPrecio] = useState()
    const [descuento, setDescuento] = useState()
    const [util, setUtil] = useState(1)

    const vacio = {
        precio:'',
        precioDescuento:''        
    }

    const volver = ()=>{
        window.sessionStorage.removeItem("IdProd")
        setElegido()
        navegar("/listaprecios/"+id)
    }

    //Seleccionar productos registrados
    const axiosProductoSel = async () => {
        
        await axios.get(rutaps)
        .then((res)=>{                 
            setElegido(res.data);                            
        })
        .catch((error)=>{
            console.log(error)
        })
    }; 

    // Verificar existencia en lista actual
    const axiosutil = async () => {
        const rutaveri = url+"listaprecio/"+id+"/"+idprod
        
        await axios.get(rutaveri)
        .then((res)=>{                 
            if(res.status ===201){
                setUtil(2)
            }                            
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleChange=e=>{
        setPrecio(e.target.value);        
    }

    const handleChangedescuento=e=>{
        setDescuento(e.target.value);        
    }    

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset 
    } = useForm({mode:'onblur'});    
     
    useEffect(()=>{
        axiosProductoSel()
        axiosutil()
    }, [idprod])

    const onSubmit = async () => {

        let precioImpuesto
        let precioTotal 
        const precioBase = precio-descuento
        const valorImp = elegido.impuesto.valor

        precioImpuesto = precioBase*valorImp/100       

        precioTotal = precioBase+precioImpuesto

        const datosMod = {            
            'precio': precio,
            'precioDescuento':descuento,
            'porcImpuesto':elegido.impuesto.valor,
            'precioImpuesto': precioImpuesto,
            'precioTotal': precioTotal,
            'observations': "-- Se anexo el producto a la lista de precios. --- ",
            'lpencabId': id,
            'prodId': idprod
        }

        

        const rutalp = url+"listaprecio"
        
        Swal.fire({
          title: '¿Estas Seguro?',
          text: `¿Quieres agregar: ${elegido.generico}?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, estoy seguro!'
        }).then((result) => {
          if (result.isConfirmed) {
      
             axios.post(rutalp, datosMod)
                .then((response) =>{
                 if(response.status ===201){
                      Swal.fire(
                          '¡AGREGO EL PRODUCTO A LA LISTA DE PRECIOS!',
                          `¡Se anexo satisfactoriamente el producto: ${elegido.generico}?`,
                          'success'
                      )
                      setPrecio("")
                      setDescuento("")                      
                      reset(vacio)
                      alerta();
                      volver()
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

    if(elegido)
    return (
        <>
            <div className="alert alert-primary" role="alert">
                <h5 className="modal-title" id="staticBackdropLabel">
                    Comercial: <strong>{elegido.comercial}</strong>  Generico: <strong>{elegido.generico} </strong> 
                    CUM: <strong>{elegido.cum}</strong> Unidad: <strong>{elegido.unit} </strong>
                    Descripción: <strong>{elegido.description}</strong>
                </h5>
                <button onClick={volver} className="btn btn-primary">Volver</button>
            </div>
            <div className="col-sm-5">
                {
                    util===1 ?
                        <div className="alert alert-info" role="alert">
                            <form onSubmit={handleSubmit(onSubmit)}>            
                                <label htmlFor="precio" className="form-label">Valor antes de impuestos: </label>
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

                                <label htmlFor="precioDescuento" className="form-label">Valor descuento aplicado: </label>
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
                                <CalculaImpuesto precio={precio} idimpuesto={elegido.impuesto.id} descuento={descuento}/>
                                <div className="modal-footer">                        
                                    <button type="submit" className="btn btn-info">Agregar a la Lista</button>
                                </div>  
                            </form>
                        </div> :
                        <div className="alert alert-info" role="alert">
                            <h4>Este producto ya esta incluido en la lista de precios</h4>
                        </div>
                }
                
                
            </div>            
        </>
    )
}