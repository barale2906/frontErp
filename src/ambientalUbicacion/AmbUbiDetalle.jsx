export default function AmbUbiDetalle({ubicas, setEditUbicas}){
    /*
    const alerta = useContext(AlertaContext)
    let estado = user.status
    let oracion = ""
    
    

    const inactivarusuario = async ()=>{
        
        if(estado===1){
            estado = 2
            oracion = "Desactivar el usuario"
        } else {
            estado = 1
            oracion = "Activar el usuario"
        }
        
        const ruta = url+"user/"+user.id+"/"+estado;
        

        Swal.fire({
            title: '¿Estas Seguro?',
            text: `¿Quieres ${oracion}: ${user.name}?`,
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
                            'El usuario ha sido modificado correctamente',
                            'success'
                        )
                        alerta();
                   } else {
                       Swal.fire(
                           '¡Error!',
                           'Hubo un problema al desactivar El usuario',
                           'error'
                       )
                   }
               })

              
            }
          })
    }*/
    
    return(   
        <>
            <tr key={ubicas.id}>
                <td>{ubicas.name}</td>
                <td>
                    <div className="btn-group" role="group" aria-label="Basic mixed styles example">                        
                        <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditUbicas(ubicas)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>
                    </div>
                </td>
            </tr> 
        </>
              
)
}