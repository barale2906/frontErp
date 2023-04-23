import { GET_USER, PRODUCTOS, RESET, VALIDA_USER } from "./types";



export default (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case VALIDA_USER:
      return {
        ...state,
        user: payload,
      };
    case GET_USER:
      return {
        ...state,
        sesionUser: payload,
      };
    case PRODUCTOS:
      return {
        ...state,
        productos: payload,
      };
    case RESET:
        /*return init(
          state.payload,
        );  */
        return {
          state: payload
        }
    
    default:
      return state;
  }
};