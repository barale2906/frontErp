import MiCuentaDatos from "./MiCuentaDatos"
import UserContext from "../providers/sesion/UserContext"
import { useContext } from "react"

export default function MiCuenta(){
    const {sesionUser} = useContext(UserContext) 
    
    return(
        <MiCuentaDatos sesionUser={sesionUser}/>
    )
}