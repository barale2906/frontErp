import React, { useContext, useState } from "react";

const edicionContext = React.createContext();
const edicionCambioContext = React.createContext();
const nuevoContext = React.createContext();

export function useEdicionContext(){ // Asi se diseña el hook personalizado el use al inicio del nombre significa que es un hook 
    return useContext(edicionContext)
}

export function useEdicionCambioContext(){
    return useContext(edicionCambioContext)
}

export function useNuevoContext(){
    return useContext(nuevoContext);
}



export function EdicionProvider(props){
    
    const [ediciones, setEdiciones] = useState(false);
    const [nuevo, setNuevo] = useState()

    const activaredicion =()=>{
        setEdiciones(!ediciones); 
        if(nuevo>0){
            setNuevo();
        } else {
            setNuevo(1);
        }
        
        
    } 

    return (
        <edicionContext.Provider value={ediciones}>
            <edicionCambioContext.Provider value={activaredicion}>
                <nuevoContext.Provider value={nuevo}>
                    {props.children}
                </nuevoContext.Provider>
            </edicionCambioContext.Provider>            
        </edicionContext.Provider>
        
    )

}




