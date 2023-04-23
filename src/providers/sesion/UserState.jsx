import React, { useReducer } from "react";
import axios from "axios";

import UserContext from "./UserContext";
import UserReducer from "./UserReducer";
import { GET_USER, PRODUCTOS, RESET, VALIDA_USER } from "./types";
import url from "../../utils/urlimport";
import Swal from "sweetalert2";
import md5 from "md5";

const UserState = (props) => {
    
  const initialState = {
      sesionUser: null,
      user: false,
      productos: null
    }



const [state, dispatch] = useReducer(UserReducer, initialState);

const validar = async(userInfo)=>{
    try{
        const ruta=url+"user/"+userInfo.email+"/login"        
        
        axios.get(ruta, userInfo)
            .then((response) =>{
                if(response.status ===202 && response.data.status===1){
                        password(response.data, userInfo)
                    } else {
                      Swal.fire(
                        '¡RESTRINGIDO!',
                        `El usuario se encuentra <strong>INACTIVO</strong>, comuníquese con el administrador`,
                        'error'
                      )
                    }
                if(response.status===200){
                    Swal.fire(
                        '¡IMPORTANTE!',
                        `No se encuentra registrado en el sistema`,
                        'error'
                    )
                }
                })  
    

    
    } catch (error) {}

    const password=(info, userInfo)=>{

        const encriptado=md5(userInfo.password)
        
        if(info.password===encriptado){
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: `Bienvenid@: <strong>${info.name}</strong>.`,
                showConfirmButton: false,
                timer: 2500
              })

              const sesionData = {
                "id":info.id,
                "name":info.name,
                "bodega":info.bodega,
                "imagen":info.imagen,
                "email":info.email,
                "rol":info.rol
              }
              
              dispatch({ type: GET_USER, payload: sesionData });
              dispatch({ type: VALIDA_USER, payload: true });
              
              
        }else{
            Swal.fire(
                '¡IMPORTANTE!',
                `Usuario/Contraseña incorrecto`,
                'error'
            )
        }
    }
}

const cierraSesion = ()=>{
  dispatch({ type: RESET, payload: initialState });
}

const buscaproductos = async()=>{
  const rutap = url+"producto"
        await axios.get(rutap)
        .then((res)=>{                
          organizaProductos(res.data)
        })
        .catch((error)=>{
            console.log(error)
        })
}

const organizaProductos=(datos)=>{
   const ordenados=datos.map((dato)=>(        
    {
      "id":dato.id,
      "code":dato.code,
      "comercial":dato.comercial,
      "unit":dato.unit
    }                                       
))
  dispatch({type: PRODUCTOS, payload: ordenados});
}

const cargaproductos = async()=>{
  const rutap = url+"producto"
        await axios.get(rutap)
        .then((res)=>{                
          dispatch({type: PRODUCTOS, payload: res.data});
        })
        .catch((error)=>{
            console.log(error)
        })
}

return (
    <UserContext.Provider
      value={{
        user: state.user,
        sesionUser: state.sesionUser,
        productos: state.productos,
        validar, 
        cierraSesion,       
        buscaproductos,
        cargaproductos,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );

}
export default UserState;