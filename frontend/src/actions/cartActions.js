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
      countInStock: data.countInStock,
      qty: qty,
    },
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems)); //this saves the cart in local storage so that people can come back and buy later.
  //getstate gives us a JS object so we want to stringify it, because we can only save strings in local storage.
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: constants.CART_REMOVE_ITEM,
    payload: id,
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

//taking in form data, and dispatching the form data as the payload
export const saveShippingAddress = (data) => (dispatch) => {
  dispatch({
    type: constants.CART_SAVE_SHIPPING_ADDRESS,
    payload: data,
  });
  localStorage.setItem('shippingAddress', JSON.stringify(data));
};
