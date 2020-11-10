import * as constants from '../constants/productConstants';
import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({
      type: constants.USER_LOGIN_REQUEST,
    });

    //create a config object bc when we are sending data, we want to send a header with content type of application/json, and also pass in token for protected routes here.
    const config = {
      'Content-Type': 'application/json',
    };
    //make our request
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );

    //same process as with product list and details. dispatch the type and with the payload we send the data that we get back from the request.
    //if we go to userController.js in the backend we see that we are hitting route /api/users/login and getting back id, name, email, isadmin and token
    dispatch({
      type: constants.USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: constants.USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message //the second thing here is looking for the custom messages that we have made
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  dispatch({ type: constants.USER_LOGOUT });
};
