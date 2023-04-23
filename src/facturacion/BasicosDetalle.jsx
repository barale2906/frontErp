export default function BasicosDetalle({basico, setModBasico}){
    
    return (
        <>
            <div className="alert alert-info" role="alert">
                <h6 className="modal-title" id="basicos">
                    NIT: <strong>{basico[0].nit}</strong><br />
                    NOMBRE: <strong>{basico[0].name} </strong> <br />   
                    DIRECCIÓN: <strong>{basico[0].adress} </strong><br/>
                    TELÉFONO: <strong>{basico[0].phone} </strong><br/>
                    CORREO ELECTRÓNICO: <strong>{basico[0].email} </strong><br />
                    RESOLUCIÓN: <strong>{basico[0].resolucion}</strong><br />
                    REPRESENTANTE LEGAL: <strong>{basico[0].representante}</strong><br />

                </h6> 
                <button type="button" className="btn btn-info btn-sm" onClick={()=>setModBasico(basico[0])} data-bs-toggle="modal" data-bs-target="#staticBackdrop">Modificar</button>            
            </div>
        </>
    )    
} 