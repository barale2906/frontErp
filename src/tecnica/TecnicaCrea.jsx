import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import AlertaContext from "../providers/AlertaContext";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";

const messages = {
    required: "Este campo es obligatorio"
};

const patterns = {
//name: /^[A-Za-z]+$/i,
//email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

};
  
  
export default function TecnicaCrea() {

  const [proveedors, setProveedors] = useState([]);

  const {sesionUser} = useContext(UserContext)

  // Seleccionar proveedores
  const axiosProveedor = async () => {
      const rutap = url+"proveedor";

      await axios.get(rutap)
      .then((res)=>{
      
      setProveedors(res.data);
      
      })
      .catch((error)=>{
          console.log(error)
      })
  };

  useEffect(()=>{
    axiosProveedor();
  }, [])
  
  const ruta = url+"tecnicaencabezado";
  const alerta = useContext(AlertaContext)
  const vacio = {
      fecha:'',
      proveeId:'',
      transportadora:'',
      factura:'',
      embalaje:''
  } 

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset 
  } = useForm({mode:'onblur'});


  const onSubmit = async (tecnicaInfo) => {
      
      
      axios.post(ruta, tecnicaInfo)
          .then((response) =>{
              if(response.status ===201){
                  
                  Swal.fire({
                      position: 'top-end',
                      icon: 'success',
                      title: `Haz creado la Recepción Técnica con fecha: <strong>${response.data.fecha}</strong>`,
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
      <label htmlFor="fecha" className="form-label">Fecha de Recepción:</label>
      <input          
        name="fecha"
        type="date"
        className={`form-control ${errors.fecha && "error" }`}        
        {...register("fecha", {
          required: messages.required,
          pattern: {
            value: patterns.fecha,
            message: messages.fecha
          }
        })}
      />
      {errors.fecha && <p className="text-danger">{errors.fecha.message}</p>}

      <label htmlFor="proveeId" className="form-label">Seleccione Proveedor</label>
      <select          
          name="proveeId"                                
          className={`form-control ${errors.proveeId && "error" }`}        
          {...register("proveeId", {
              required: messages.required,
              pattern: {
              value: patterns.proveeId,
              message: messages.proveeId
              }
          })}
      >                                
          <option value=""></option>
          {proveedors.map((proveedor)=>(                                        
              <option value={proveedor.id} key={proveedor.id}>{proveedor.name}</option>                                     
          ))}
      </select>
      {errors.proveeId && <p className="text-danger">{errors.proveeId.message}</p>}


      <label htmlFor="factura" className="form-label">Factura:</label>
      <input          
        name="factura"
        type="text"
        placeholder="Número de factura con que se recibe el pedido"
        className={`form-control ${errors.factura && "error" }`}        
        {...register("factura", {
          required: messages.required,
          pattern: {
            value: patterns.factura,
            message: messages.factura
          }
        })}
      />
      {errors.factura && <p className="text-danger">{errors.factura.message}</p>}

      <label htmlFor="valor" className="form-label">Valor Factura:</label>
      <input          
        name="valor"
        type="text"
        placeholder="Valor total de la factura."
        className={`form-control ${errors.valor && "error" }`}        
        {...register("valor", {
          required: messages.required,
          pattern: {
            value: patterns.valor,
            message: messages.valor
          }
        })}
      />
      {errors.valor && <p className="text-danger">{errors.valor.message}</p>}

      <label htmlFor="transportadora" className="form-label">Transportadora:</label>
      <input          
        name="transportadora"
        type="text"
        placeholder="Transportadora que trajo los medicamentos"
        className={`form-control ${errors.transportadora && "error" }`}        
        {...register("transportadora", {
          required: messages.required,
          pattern: {
            value: patterns.transportadora,
            message: messages.transportadora
          }
        })}
      />
      {errors.transportadora && <p className="text-danger">{errors.transportadora.message}</p>}

      <label htmlFor="embalaje" className="form-label">Embalaje:</label>
      <input
        name="embalaje"
        type="textarea"
        placeholder="Estado de los empaques"
        className={`form-control ${errors.embalaje && "error"}`}
        {...register("embalaje", {
          required: messages.required,
          pattern: {
            value: patterns.embalaje,
            message: messages.embalaje
          }
        })}
      />
      {errors.embalaje && <p className="text-danger">{errors.embalaje.message}</p>}

      <input
          name="userId"
          type="hidden"                                    
          {...register("userId")}
          defaultValue={sesionUser.id}
      />

      <input
        name="observaciones"
        type="hidden"                                    
        {...register("observaciones")}
        defaultValue="Proceso de recepción"
      />

      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        <button type="submit" className="btn btn-info">Crear</button>
      </div>

    </form>
  );
}