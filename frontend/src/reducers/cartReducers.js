import * as constants from '../constants/productConstants';

export const cartReducer = (
  state = { cartItems: [], shippingAddress: {} },
  action
) => {
  switch (action.type) {
    case constants.CART_ADD_ITEM:
      const item = action.payload; //the payload will contain a lot of information about the product. The Id in the payload will be called product, hence calling item.product will call the id of the product that's been sent with the payload.
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        //if existItem true
        return {
          ...state, //return and spread state so that we have everything already in the state
          cartItems: state.cartItems.map(
            (x) => (x.product === existItem.product ? item : x) //map through current cart items (which are x). If x.product equals existItem.product, return the new item, otherwise just return the current product (x)
          ),
        };
      } else {
        return {
          //if existItem is false then push it into the array
          ...state, //return and spread state so that we have everything already in the state
          cartItems: [...state.cartItems, item], //array with current car items plus the new item
        };
      }
    case constants.CART_REMOVE_ITEM:
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
    case constants.CART_SAVE_SHIPPING_ADDRESS:
      return {
        ...state,
        shippingAddress: action.payload,
      };
    case constants.CART_SAVE_PAYMENT_METHOD:
      return {
        ...state,
        paymentMethod: action.payload,
      };
    default:
      return state;
  }
};
