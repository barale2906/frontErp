import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
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

export default function TecnicaEditar({editTecnica}) {

  const [proveedors, setProveedors] = useState([]);
  const alerta = useContext(AlertaContext) 
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
    

  useEffect(()=>{
    reset(editTecnica)
  }, [editTecnica])

    const {
      register,
      handleSubmit,
      formState: { errors },
      reset    
    } = useForm({mode:'onblur'});


  const onSubmit = async (tecnicaInfo) => {

    const ruta = url+"tecnicaencabezado/"+editTecnica.id;
    
    Swal.fire({
      title: '¿Estas Seguro?',
      text: `¿Quieres modificar: ${editTecnica.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, estoy seguro!'
    }).then((result) => {
      if (result.isConfirmed) {
  
         axios.put(ruta, tecnicaInfo).then((response) =>{
             if(response.status ===200){
                  Swal.fire(
                      '¡MODIFICO LOS DATOS BASE!',
                      'Ha sido modificada correctamente',
                      'success'
                  )
                  alerta();
             } else {
                 Swal.fire(
                     '¡Error!',
                     'Hubo un problema al modificar la información',
                     'error'
                 )
             }
         })
  
        
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
          placeholder="Descripcción de la línea de Producto"
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
  
        
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="submit" className="btn btn-info">Editar</button>
        </div>
  
      </form>
  );
}

