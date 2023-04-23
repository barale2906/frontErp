import { useEffect, useState } from "react"
import * as XLSX from 'xlsx/xlsx.mjs';



export default function DescargarExcel(data){

    const [datos, setDatos]=useState(null)

    useEffect(()=>{
        setDatos(data.data);

    },[data])

    const handleOnExport=()=>{
        var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(datos);

        XLSX.utils.book_append_sheet(wb, ws, "Descarga");
        XLSX.writeFile(wb, "descarga.xlsx");
    }

    if(datos)
    return (
        <>
            <div className="content">
                <button type="button" className="btn" onClick={()=>handleOnExport()}>
                    Clic Aquí para Descargar
                </button>
                <table className="table table-bordered d-none d-print-block">
                    <thead>
                        <tr>
                            {Object.keys(datos[0]).map((h)=>(
                                <th key={h}>{h}</th>
                            ))}                                               
                        </tr>
                    </thead>
                    <tbody>
                        {datos.map((row)=>(
                            <tr key={row.id}>
                                {Object.keys(row).map((c,i)=>(
                                    <td key={caches.id+"-"+i}>{row[c]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}