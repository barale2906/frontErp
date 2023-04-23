import cargando from '../img/noEncontrado.gif';

export default function NoEncotrada(){
    return <div className="container text-center card mb-3 col-sm-6 mt-4">
                <div className="row g-0">
                    <div className="col-md-4">
                        <img src={cargando} className="img-fluid rounded-start" alt="No encontrada la página..." width="150" />
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                        <h5 className="card-title">!404, PÁGINA NO ENCONTRADA!</h5>
                        <p className="card-text">Usa la barra de navegación para ir a donde quieras.</p>                    
                        </div>
                    </div>
                </div>
            </div>
}