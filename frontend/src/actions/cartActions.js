import axios from 'axios';
import * as constants from '../constants/productConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);
  dispatch({
    type: constants.CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInstock: data.countInstock,
      qty,
    },
  });
  localStorage.setItem('cartitems', JSON.stringify(getState().cart.cartItems)); //this saves the cart in local storage so that people can come back and buy later.
  //getstate gives us a JS object so we want to stringify it, because we can only save strings in local storage.
};
