import axios from "axios"
import { useContext } from "react"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"
import AlertaContext from "../providers/AlertaContext"
import UserContext from "../providers/sesion/UserContext"
import url from "../utils/urlimport"

export default function ListaDetalle({lista, setEditLista}){
    const alerta = useContext(AlertaContext)
    const {sesionUser} = useContext(UserContext)
    
    let estado = lista.status
    let oracion = ""
    
    

    const inactivarlista = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Activar lista"
        } else if (estado===2){
            estado = 3
            oracion = "Finalizar lista"
        }
        
        const ruta = url+"listaprencab/"+lista.id+"/"+estado;

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${lista.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, estoy seguro!'
          }).then((result) => {
            if (result.isConfirmed) {

               axios.delete(ruta).then((response) =>{
                   if(response.status ===200){
                        Swal.fire(
                            '¡El estado cambio!',
                            'El Listado ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El Listado',
                           'error'
                       )
                   }
               })              
            }
          })
    }
    
    const reutilizarlista = async ()=>{

        const ruta = url+"listaprencab";
        const rutain=url+"listaprecio/"+lista.id;
        const rutaprod=url+"listaprecio";
        
        let unid = {}
        let factorDescuento
        let precioF
        let precioImp
        let precioTo
        let productos = []

        //Cargar productos de esta lista
        
        
        await axios.get(rutain)
            .then((res)=>{                 
                productos = res.data;              
            })
            .catch((error)=>{
                console.log(error)
            })

        // Objeto crea encabezados
        const listaInfo = {
            "name" :        lista.name+" Reutilizada",
            "inicia":       lista.inicia,
            "fin":          lista.fin,
            "description":  "Lista Reutilizada",
            "userId":       sesionUser.id,
            "bodegaId":     lista.bodegaId
        }

        Swal.fire({
            title: `<h1>REUTILIZAR LISTA</h1><p>Registra el % de aumento o descuento sobre la lista de precios: ${lista.name}</p>`,
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Reulizar Lista<br>Tardará algunos minutos',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                axios.post(ruta, listaInfo)
                .then((response) =>{
                    if(response.status ===201){
                        
                        
                            //Calcular factor de descuento - aumento
                            factorDescuento = (login/100)+1
                            

                            // cargar productos
                            productos.map((producto, index)=>( 

                                precioF = producto.precio*factorDescuento,
                                precioImp = precioF*producto.porcImpuesto/100,
                                precioTo = precioF+precioImp,
                                
                                unid = {                                    
                                    "precio":precioF,
                                    "precioDescuento":0,
                                    "porcImpuesto":producto.porcImpuesto,
                                    "precioImpuesto":precioImp,
                                    "precioTotal":precioTo,
                                    "observations":`Producto creado para la LP: ${response.data.name}`,
                                    "lpencabId":response.data.id,
                                    "prodId":producto.prodId
                                },

                                axios.post(rutaprod, unid)
                                .then((response) =>{
                                    if(response.status ===201){
                                        
                                        //console.log("se guardo correctamente")
                                        
                                    }else{
                                        //console.log("No se guardo")
                                    }
                                }) 

                                
                            ))


                            alerta();
                            Swal.fire({
                                position: 'top-end',
                                icon: 'success',
                                title: `Haz creado la lista de precios: <strong>${response.data.name}</strong>`,
                                showConfirmButton: false,
                                timer: 2500
                            })
                            
                        }else{
                            Swal.fire(
                                '¡IMPORTANTE!',
                                `No fue posible guardar el registro`,
                                'error'
                            )
                        }
                }) 
            },
            allowOutsideClick: () => !Swal.isLoading()
          })        
    }
    
    return(   
        <>
            <tr key={lista.id}>
                <td>{lista.name}</td>
                <td>{lista.description}</td>
                <td>{lista.inicia}</td>
                <td>{lista.fin}</td>
                <td>{lista.bodega.name}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">
                        {lista.status===1 ? 
                            <>
                                
                                <button className="btn btn-success btn-sm" onClick={inactivarlista}>Activar</button>
                                <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditLista(lista)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                                <Link to={lista.id}><button className="btn btn-warning btn-sm">Productos</button></Link>
                            </>
                            : 
                            <></>
                        }
                        {
                            lista.status===2 ?
                            <>
                                <button className="btn btn-danger btn-sm" onClick={inactivarlista}>Inactivar</button>
                                <Link to={lista.id}><button className="btn btn-warning btn-sm">Productos</button></Link>
                                <button className="btn btn-info btn-sm" onClick={reutilizarlista}>Reutilizar</button>
                            </>:
                            <></>
                        }
                        {
                            lista.status===3 ?
                            <h6>Lista Inactiva</h6> :
                            <></>
                        }
                        
                    </div>
                </td>
            </tr>
        </>
              
    )
}