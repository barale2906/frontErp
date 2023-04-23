import vacio from '../img/vacio.gif';

export default function Vacio(){
    return <div className="container text-center card mb-3 col-sm-6 mt-4">
                <div className="row g-0">
                <div className="col-md-4">
                    <img src={vacio} className="img-fluid rounded-start" alt="No se encontraron datos..." width="300" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                    <h5 className="card-title">!NO HAY DATOS PARA MOSTRAR!</h5>
                    <p className="card-text">Revisa los parámetros.</p>                    
                    </div>
                </div>
                </div>
            </div>
}