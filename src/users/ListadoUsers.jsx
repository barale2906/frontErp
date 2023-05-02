import { useContext, useEffect, useState } from "react";
import url from "../utils/urlimport";
import Cargando from "../components/Cargando";
import Vacio from "../components/Vacio";
import AlertaContext from "../providers/AlertaContext"
import UsuCrear from "./UsuCrear";
import UsuDetalle from "./UsuDetalle";
import UsuEdit from "./UsuEdit";
import axios from "axios";
import UserContext from "../providers/sesion/UserContext";

export default function ListadoUsers({mio=1}){

    const [users, setUsers] = useState([]);
    const {sesionUser} = useContext(UserContext)
    
    
    

    //Modificar usuarios
    const [editUser, setEditUser]=useState(null);
    
    // Consulta para mostrar los usuarios
    const axiosUser = async () => {
        if(mio===2){
            var ruta = url+"user/"+sesionUser.id;            
        } else if (mio===1){
            var ruta = url+"user";            
        }
        
        await axios.get(ruta)
        .then((res)=>{
            
            setUsers(res.data);
            
        })
        .catch((error)=>{
            console.log(error)
        })
        };

    

    useEffect(()=>{
        axiosUser();
    }, [mio])


    if(!users){
        return <Cargando/>
    } else if(users.length===0){
        
        return (
            <>
                <div className="row">                
                        <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Crear Usuario
                            </button>                            
                            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Crear Usuario</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <UsuCrear/>
                                        </div>                                    
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div> 
                <Vacio/>
                
            </>
        ) 
    } else {
        return (
            <>
                <AlertaContext.Provider value={()=>[axiosUser()]}>
                    {
                        mio===1 ? 
                        <div className="row">                
                            <div className="container text-center alert alert-primary col-sm-4 mt-4" role="alert"> 
                                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Crear Usuario
                                </button>                            
                                <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title" id="exampleModalLabel">Crear Usuario</h5>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <UsuCrear/>
                                            </div>                                    
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                        :
                        <></>
                    }
                       
                    <div className="row">                
                        <div className="container text-center col-sm-12">
                            <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                <thead>
                                    <tr>
                                        <th scope="col">IMAGEN</th>
                                        <th scope="col">NOMBRE </th>
                                        <th scope="col">EMAIL</th>
                                        <th scope="col"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user, index)=>(                                        
                                        <UsuDetalle user={user} key={index} setEditUser={setEditUser} mio={mio}/>
                                        
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                    </div> 

                    
                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Modificar Usuario</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>  
                                <div className="modal-body">
                                    <UsuEdit editUser={editUser} mio={mio}/>      
                                </div>
                                           
                            </div>
                        </div>
                    </div>  
                </AlertaContext.Provider>                              
            </>         
        
        )
    }
}