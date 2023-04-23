export default function Paginacion({itemsPerPage,currentPage,setCurrentPage,totalItems,setItemsPerPage}){
    const pageNumbers=[]

    for(let i = 1; i <= Math.ceil(totalItems/itemsPerPage); i++){
        pageNumbers.push(i);
    }

    const previusPage=()=>{
        setCurrentPage(currentPage-1);
    }

    const nextPage=()=>{
        setCurrentPage(currentPage+1);
    }

    const specificPage=(n)=>{
        setCurrentPage(n);
    }

    const onChange = e=>{  
        setCurrentPage(1) 
        setItemsPerPage(e.target.value)         
    }

    if(totalItems>10)
    return (
            
            <div className="row">
                <div className="col-sm-2"> 
                    <select value={itemsPerPage} className="form-select" onChange={onChange} >
                        <option value="15">15</option>
                        <option value="25">25</option>                                                           
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="500">500</option>                                                         
                    </select>
                </div>
                <div className="col-sm-10">
                    <nav aria-label="Page navigation example">                
                        <ul className="pagination">
                            <li className={`page-item`}>
                                <a className={`page-link ${currentPage===1 ? 'disabled':'' }`} onClick={previusPage} aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            {pageNumbers.length<20 ?
                                pageNumbers.map(pgeno =>(
                                    <li className="page-item" key={pgeno}>
                                        <a className={`page-link ${pgeno===currentPage ? 'active':'' }`} onClick={()=>specificPage(pgeno)}>
                                            {pgeno}
                                        </a>
                                    </li>
                                )):
                                <h6>Navega con las flechas</h6>
                            }
                            
                            <li className={`page-item`}>
                                <a className={`page-link ${currentPage>=pageNumbers.length ? 'disabled':'' }`} onClick={nextPage} aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
}