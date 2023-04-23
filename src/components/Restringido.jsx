import restringido from '../img/restringido.gif';

export default function Restringido(){
    return <div className="container text-center card mb-3 col-sm-6 mt-4">
                <div className="row g-0">
                <div className="col-md-4">
                    <img src={restringido} className="img-fluid rounded-start" alt="Acceso Restringido..." width="200" />
                </div>
                <div className="col-md-8">
                    <div className="card-body">
                    <h5 className="card-title">!NO TIENES ACCESO A ESTA PÁGINA!</h5>
                    <p className="card-text">Comunícate con el administrador.</p>                    
                    </div>
                </div>
                </div>
            </div>
}