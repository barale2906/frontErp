import cargando from '../img/cargando.gif';

export default function Cargando(){
    return <div className="container text-center card mb-3 col-sm-6 mt-4">
                <div className="row g-0">
                <div className="col-md-4">
                    <img src={cargando} className="img-fluid rounded-start" alt="Esperando los datos..." width="100" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                    <h5 className="card-title">!ESTAMOS CARGANDO TUS DATOS!</h5>
                    <p className="card-text">Gracias por tu espera</p>                    
                    </div>
                </div>
                </div>
            </div>
}