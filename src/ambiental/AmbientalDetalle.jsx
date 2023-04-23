export default function AmbientalDetalle({ubicacion, setEditRegistro }){
    return (
        <tr key={ubicacion.id}>
            <td>{ubicacion.name}</td>
            <td>
                <div className="btn-group" role="group" aria-label="Basic mixed styles example">                        
                    <button type="button" className="btn btn-info btn-sm" onClick={()=>setEditRegistro(ubicacion)} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Cargar Registro</button>
                </div>
            </td>
        </tr> 
    )
}