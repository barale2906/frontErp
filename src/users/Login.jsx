import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import UserContext from "../providers/sesion/UserContext";
import url from "../utils/urlimport";
import axios from "axios";

const messages = {
    required: "Este campo es obligatorio",
    email: "Debes introducir un email correcta",
    password: "Digite mínimo 8 caracteres"    
  };  
  
  const patterns = {
    email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    
  };
export default function Login(){
    const [basico, setBasico]=useState([])
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setFocus 
      } = useForm({mode:'onblur'});

      let navig = useNavigate()

      const { validar, user } = useContext(UserContext);
    const onSubmit = async (userInfo) => {

        validar(userInfo)
    }

    if(user===true){
        navig("/dashboard")
    }

     // Cargar Básicos
     const axiosBasico=async()=>{
        const rutaBasico=url+"basicos"

        await axios.get(rutaBasico)
        .then((res)=>{
            setBasico(res.data)
        })

        .catch((error)=>{
            console.log(error)
        })
    }

    useEffect(()=>{
        axiosBasico()
    },[])

    useEffect(() => {
        setFocus("email");        
      }, [setFocus]);

    

    
    if(basico)
    return (
        <>
            <div className="row">
                <div className="alert alert-info text-center" role="alert">
                    <h1>¡HOLA BIENVENID@ AL SISTEMA DE {basico[0]?.name}!</h1>
                </div>
                <div className="container text-center col-md-4 mt-5">

                    <div className="card text-center" >
                        <div className="card-header bg-info">
                            <h3>INICIA SESIÓN</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)}>
                            
                                <label htmlFor="email" className="form-label">Correo Electrónico:</label>
                                <input
                                name="email"
                                type="email"
                                placeholder="Correo Electrónico"
                                className={`form-control ${errors.email && "error"}`}
                                {...register("email", {
                                    required: messages.required,
                                    pattern: {
                                    value: patterns.email,
                                    message: messages.email
                                    }
                                })}
                                />
                                {errors.email && <p className="text-danger">{errors.email.message}</p>}
                        
                                <label htmlFor="password" className="form-label">Contraseña:</label>
                                <input
                                name="password"
                                type="password"
                                placeholder="Contraseña"
                                className={`form-control ${errors.password && "error"}`}
                                {...register("password", {
                                    required: messages.required,
                                    minLength: {
                                    value: 8,
                                    message: messages.password
                                    },
                                    pattern: {
                                    value: patterns.password,
                                    message: messages.password
                                    }
                                })}
                                />
                                {errors.password && <p className="text-danger">{errors.password.message}</p>}
                                <button type="submit" className="btn btn-info mt-2">Iniciar</button>
                            </form>
                        </div>
                    </div>
                    
                </div>
            </div>            
        </>
    )
}