import NoEncotrada from "../components/Redirect404";
import Login from "./users/Login";

const rutas=[
    {path: '/', componente : {Login}},
    {path: '*', component : {NoEncotrada}}
]

export default rutas;