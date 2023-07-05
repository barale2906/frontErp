import { useEffect, useState } from "react"
import url from "../utils/urlimport";
import Vacio from "../components/Vacio";
import axios from "axios";
import ComisionesCalLisDetalle from "./ComisionesCalLisDetalle";
import ComisionCalcular from "./ComisionCalcular";
import ComisionPago from "./ComisionPago";

export default function ComisionesCalculoListado(){
    const [usuarios, setUsuarios]=useState([])
    const [usuarioElegido, setUsuarioElegido]=useState()
    const [comisionesUsuario, setComisionesUsuario]=useState([])
    const [registro, setRegistro]=useState(0)
    const ruta=url+"comisionusuario"


    //Editar Comision
    const [editComision, setEditComision]=useState(null)

    // Consulta para mostrar las membresias
    const axiosUsuarios = async () => {
        await axios.get(ruta)
        .then((res)=>{            
            setUsuarios(res.data);        
        })
        .catch((error)=>{
            console.log(error)
        })
    };

    //Capturar dato
    const onChange = e=>{  
        setUsuarioElegido(e.target.value)      
        usuarioComision(e.target.value)        
    }

    //Movimientos del efectivo para la bodega seleccionada
    const usuarioComision = async(id) =>{
        const rutaefec=url+"facturaEncabezado/"+id+"/comi"

        await axios.get(rutaefec)
            .then((res)=>{        
                setComisionesUsuario(res.data);
                window.sessionStorage.clear();
                usuarioDato(id)
            })
            .catch((error)=>{
                console.log(error)
            })        
    }

    //Obtener datos del usuario
    const usuarioDato = (id)=>{
        const resultadosBusqueda=usuarios?.filter((elemento)=>{
            if(elemento.id===id){
                return elemento;
            }
        });
        window.sessionStorage.setItem("usuario", JSON.stringify(resultadosBusqueda[0]))
    }
    useEffect(()=>{
        axiosUsuarios();
    }, [])

    if(usuarios){
        return(
            <>
                {
                    registro===0 ?
                    <>
                        <div className="row">
                            <div className="container text-center col-md-10 mb-2">
                                <div className="alert alert-secondary" role="alert">
                                    <h4>Seleccione Usuario</h4>
                                </div>                    
                                <select value={usuarioElegido} className="form-select" onChange={onChange} >
                                    <option value=""></option>
                                    {usuarios.map((usuario)=>(                                        
                                        <option value={usuario.id} key={usuario.id}>{usuario.name}</option>                                     
                                    ))}
                                </select>
                            </div>
                        </div>
                        {
                            comisionesUsuario.length>0?
                            <>
                                <div className="row">
                                    <div className="container text-center">
                                        <p>Registros encontrados {comisionesUsuario.length} <button type="button" className="btn btn-info btn-sm" onClick={()=>setRegistro(1)} >Generar Pago</button></p>
                                        <table className="table table-success table-hover table-bordered table-responsive table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">N° FACTURA</th>  
                                                    <th scope="col">NOMBRE</th>
                                                    <th scope="col">CANTIDAD PRODUCTOS</th>
                                                    <th scope="col">TOTAL FACTURA</th>
                                                    <th scope="col">VALOR CALCULADO</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {comisionesUsuario.map((comision, index)=>(                                        
                                                    <ComisionesCalLisDetalle comision={comision} key={index} setEditComision={setEditComision}/>                                    
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false"  aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div className="modal-dialog modal-dialog-scrollable">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="staticBackdropLabel">Calcular comisiones para esta factura</h5>
                                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>  
                                                    <div className="modal-body">
                                                        {
                                                            editComision ?
                                                                <ComisionCalcular editComision={editComision} comisionesUsuario={comisionesUsuario} setComisionesUsuario={setComisionesUsuario}/>  
                                                            :
                                                                <></> 
                                                        }
                                                    </div>                                           
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                            :
                            <></>
                        }                
                    </>
                    :
                    <ComisionPago setRegistro={setRegistro} comisionesUsuario={comisionesUsuario} usuarioComision={usuarioComision} />
                }
            </> 
        )
    }else{
        <Vacio/>
    }
    
}