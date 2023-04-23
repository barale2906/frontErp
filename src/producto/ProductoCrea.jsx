import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import url from "../utils/urlimport";



const messages = {
    required: "Este campo es obligatorio"  
  };
  
  
  const patterns = {
    //name: /^[A-Za-z]+$/i,
    //email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
  };
  
export default function ProductoCrear() {

  const [lineas, setLineas] = useState([]);
  const [impuestos, setImpuestos] = useState([]); 

  // Seleccionar Lineas de producto
  const axiosLinea = async () => {
      const rutal = url+"productlinea";

      await axios.get(rutal)
      .then((res)=>{
      
      setLineas(res.data);
      
      })
      .catch((error)=>{
          console.log(error)
      })
  };


  // Seleccionar Impuestos
  const axiosimpuesto = async () => {
      const rutai = url+"impuesto";

      await axios.get(rutai)
      .then((res)=>{
      
      setImpuestos(res.data);
      
      })
      .catch((error)=>{
          console.log(error)
      })
  };

  

  useEffect(()=>{
    axiosLinea();
    axiosimpuesto();
  }, [])
    
  const ruta = url+"producto";
  const alerta = useContext(AlertaContext)
  const vacio = {
    cum:'',
    code:'',
    generico:''        ,
    comercial:'',
    description:'',
    unit: '',
    relativa:'',
    temperatura:'',
    maximo:'',
    minimo:'',
    imagen:'',
    lineaId:'',
    impId:''
  } 
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset 
  } = useForm({mode:'onblur'});
  
  
  const onSubmit = async (productoInfo) => {    

    const rutacode = url+"producto/"+productoInfo.code+"/code";
    
    axios.get(rutacode)
    .then((response)=>{
      if(response.data.length>0){
        Swal.fire(
          '¡IMPORTANTE!',
          `Ya existe un producto con este código de barras: ${productoInfo.code}`,
          'error'
        )
      }else{
        creaProducto(productoInfo)
      }
    }).catch((error)=>{
      console.log(error)
  })
      
     
  }

  const creaProducto = async (productoInfo) =>{

    axios.post(ruta, productoInfo)
    .then((response) =>{
      if(response.status ===201){
          
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `Haz creado el producto: <strong>${response.data.comercial}</strong>`,
          showConfirmButton: false,
          timer: 1500
        })
        reset(vacio)
        alerta();
        
      }else{
        Swal.fire(
          '¡IMPORTANTE!',
          `No fue posible guardar el registro`,
          'error'
        )
      }
    }) 
  }

    
  
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="cum" className="form-label">CUM:</label>
      <input          
        name="cum"
        type="text"
        placeholder="Código CUM del producto"
        className={`form-control ${errors.cum && "error" }`}        
        {...register("cum", {
          required: messages.required,
          pattern: {
            value: patterns.cum,
            message: messages.cum
          }
        })}
      />
      {errors.cum && <p className="text-danger">{errors.cum.message}</p>}

      
      <label htmlFor="generico" className="form-label">Nombre Generico:</label>
      <input
        name="generico"
        type="text"
        placeholder="Nombre Generico"
        className={`form-control ${errors.generico && "error"}`}
        {...register("generico", {
          required: messages.required,
          pattern: {
            value: patterns.generico,
            message: messages.generico
          }
        })}
      />
      {errors.generico && <p className="text-danger">{errors.generico.message}</p>}

      <label htmlFor="comercial" className="form-label">Nombre Comercial:</label>
      <input
        name="comercial"
        type="text"
        placeholder="Nombre Comercial del Producto"
        className={`form-control ${errors.comercial && "error"}`}
        {...register("comercial", {
          required: messages.required,
          pattern: {
            value: patterns.comercial,
            message: messages.comercial
          }
        })}
      />
      {errors.comercial && <p className="text-danger">{errors.comercial.message}</p>}


      <label htmlFor="description" className="form-label">Presentación:</label>
      <input
        name="description"
        type="text"
        placeholder="Presentación del Producto"
        className={`form-control ${errors.description && "error"}`}
        {...register("description", {
          required: messages.required,
          pattern: {
            value: patterns.description,
            message: messages.description
          }
        })}
      />
      {errors.description && <p className="text-danger">{errors.description.message}</p>}


      <label htmlFor="unit" className="form-label">Unidad de Presentación:</label>
      <input
        name="unit"
        type="text"
        placeholder="Presentación del producto"
        className={`form-control ${errors.unit && "error"}`}
        {...register("unit", {
          required: messages.required,            
          pattern: {
            value: patterns.unit,
            message: messages.unit
          }
        })}
      />
      {errors.unit && <p className="text-danger">{errors.unit.message}</p>}


      <label htmlFor="relativa" className="form-label">Húmedad Relativa:</label>
      <input
        name="relativa"
        type="text"
        placeholder="Rango de Húmedad Relativa"
        className={`form-control ${errors.relativa && "error"}`}
        {...register("relativa", {
          required: messages.required,            
          pattern: {
            value: patterns.relativa,
            message: messages.relativa
          }
        })}
      />
      {errors.relativa && <p className="text-danger">{errors.relativa.message}</p>}


      <label htmlFor="temperatura" className="form-label">Temperatura:</label>
      <input
        name="temperatura"
        type="text"
        placeholder="Rango de Temperatura"
        className={`form-control ${errors.temperatura && "error"}`}
        {...register("temperatura", {
          required: messages.required,            
          pattern: {
            value: patterns.temperatura,
            message: messages.temperatura
          }
        })}
      />
      {errors.temperatura && <p className="text-danger">{errors.temperatura.message}</p>}



      <label htmlFor="maximo" className="form-label">Cantidad máxima en stock :</label>
      <input
        name="maximo"
        type="text"
        placeholder="Máximo stock"
        className={`form-control ${errors.maximo && "error"}`}
        {...register("maximo", {
          required: messages.required,            
          pattern: {
            value: patterns.maximo,
            message: messages.maximo
          }
        })}
      />
      {errors.maximo && <p className="text-danger">{errors.maximo.message}</p>}

      <label htmlFor="minimo" className="form-label">Cantidad mínima en stock :</label>
      <input
        name="minimo"
        type="text"
        placeholder="Mínimo stock"
        className={`form-control ${errors.minimo && "error"}`}
        {...register("minimo", {
          required: messages.required,            
          pattern: {
            value: patterns.minimo,
            message: messages.minimo
          }
        })}
      />
      {errors.minimo && <p className="text-danger">{errors.minimo.message}</p>}


      <label htmlFor="lineaId" className="form-label">Línea de Producto</label>
      <select          
          name="lineaId"                                
          className={`form-control ${errors.lineaId && "error" }`}        
          {...register("lineaId", {
              required: messages.required,
              pattern: {
              value: patterns.lineaId,
              message: messages.lineaId
              }
          })}
      >                                
          <option value=""></option>
          {lineas.map((linea)=>(                                        
              <option value={linea.id} key={linea.id}>{linea.name}</option>                                     
          ))}
      </select>
      {errors.lineaId && <p className="text-danger">{errors.lineaId.message}</p>}


      <label htmlFor="impId" className="form-label">Impuesto</label>
      <select          
          name="impId"                                
          className={`form-control ${errors.impId && "error" }`}        
          {...register("impId", {
              required: messages.required,
              pattern: {
              value: patterns.impId,
              message: messages.impId
              }
          })}
      >                                
        <option value=""></option>
        {impuestos.map((impuesto)=>(                                        
            <option value={impuesto.id} key={impuesto.id}>{impuesto.name}</option>                                     
        ))}
      </select>
      {errors.impId && <p className="text-danger">{errors.impId.message}</p>}


      <label htmlFor="code" className="form-label">Código:</label>
      <input          
        name="code"
        type="text"
        placeholder="Código de barras del producto"
        className={`form-control `} 
        {...register("code", {
          required: messages.required,            
          pattern: {
            value: patterns.minimo,
            message: messages.minimo
          }
        })}               
      />
      {errors.code && <p className="text-danger">{errors.code.message}</p>}
      
      
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" className="btn btn-info">Crear Producto</button>
      </div>

    </form>
  );
}