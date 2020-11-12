import * as constants from '../constants/productConstants';

export const orderCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.ORDER_CREATE_REQUEST:
      return {
        loading: true,
      };
    case constants.ORDER_CREATE_SUCCESS:
      return {
        loading: false,
        success: true,
        order: action.payload,
      };
    case constants.ORDER_CREATE_FAIL:
      return {
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
