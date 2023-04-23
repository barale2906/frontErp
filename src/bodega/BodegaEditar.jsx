import { useEffect, useState } from "react";
import FormEditar from "./FormEditar";

export default function BodegaEditar({editBodega}){
    const [datos, setDatos] = useState({
        id:'',
        name: '',
        phone:'',
        email: '',
        adress: ''
      })

      useEffect(()=>{
        if(editBodega !== null){
          setDatos(editBodega)
        } else {
          setDatos({
            id:'',
            name: '',
            phone:'',
            email: '',
            adress: ''
          })
        }
      }, [editBodega])


      return (
        <>
          
          <div className="modal-body">
            <div className="mb-3">
                <FormEditar 
                    preloadedValues={datos}          
                />
            </div>
          </div>
          
        </>
      )

}