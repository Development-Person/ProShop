import * as constants from '../constants/productConstants';
import axios from 'axios';

//ACTION FOR LOGGING IN
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

//ACTION FOR LOGGING OUT
export const logout = () => (dispatch) => {
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cartItems'); //
  localStorage.removeItem('shippingAddress'); // these additions clear what is saved in localstorage so that users can't see orders from other users
  localStorage.removeItem('paymentMethod'); //
  dispatch({ type: constants.USER_LOGOUT });
  dispatch({ type: constants.USER_LIST_RESET });
  document.location.href = '/login'; //
};

//ACTION FOR REGISTERING A NEW USER
export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch({
      type: constants.USER_REGISTER_REQUEST,
    });

    const config = {
      'Content-Type': 'application/json',
    };

    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );

    dispatch({
      type: constants.USER_REGISTER_SUCCESS,
      payload: data,
    });

    dispatch({
      type: constants.USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: constants.USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//ACTION FOR BRINGING UP USER DETAILS
export const getUserDetails = (id) => async (dispatch, getState) => {
  //we can get our user info from getState which has the token in it
  try {
    dispatch({
      type: constants.USER_DETAILS_REQUEST,
    });

    //userInfo is created by userLoginReducer (in userReducers.js) which sets it to equal action.payload. Login in userActions.js dispatches USER.LOGIN.REQUEST which then leads to USER.LOGIN.SUCCESS with the payload.
    const {
      userLogin: { userInfo },
    } = getState(); //we put brackets here because we are destructuring from a function

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    //id might be profile (when we call it from the profile screen we pass in profile) or it might be id
    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch({
      type: constants.USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: constants.USER_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//ACTION FOR UPDATING USER DETAILS
export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch({
      type: constants.USER_UPDATE_PROFILE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/profile`, user, config);

    dispatch({
      type: constants.USER_UPDATE_PROFILE_SUCCESS,
      payload: data,
    });

    //we dispatch this so that it logs back in straight away after updating the profile, so that the navbar updates with the new name (this is part of the fix)
    dispatch({
      type: constants.USER_LOGIN_SUCCESS,
      payload: data,
    });

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: constants.USER_UPDATE_PROFILE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//ACTION FOR BRINGING UP A LIST OF USERS - ADMIN ONLY
export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: constants.USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users`, config);

    dispatch({
      type: constants.USER_LIST_SUCCESS,
      payload: data,
    });

    /*localStorage.setItem('userInfo', JSON.stringify(data)); commented out because it was crashing the page after userDelete and then refresh of the page*/
  } catch (error) {
    dispatch({
      type: constants.USER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

//ACTION FOR DELETING A USER - ADMIN ONLY
export const deleteUser = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: constants.USER_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${id}`, config);

    dispatch({ type: constants.USER_DELETE_SUCCESS });
  } catch (error) {
    dispatch({
      type: constants.USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
