import axios from 'axios';
import * as constants from '../constants/productConstants';

/*this pretty much does what useEffect does. Fetch from api/products, get the data back and then map them
you can think of this as the action creator, and then LIST REQUEST for example is the action
we want to make an async request, so redux thunk allows us to add a function within a function, allowing us to pass in dispatch which then goes to the next function*/
export const listProducts = () => async (dispatch) => {
  try {
    dispatch({ type: constants.PRODUCT_LIST_REQUEST });
    const { data } = await axios.get('/api/products');
    dispatch({
      type: constants.PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: constants.PRODUCT_LIST_FAIL,
      payload:
        error.response && error.response.data.message //the second thing here is looking for the custom messages that we have made
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: constants.PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({
      type: constants.PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: constants.PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message //the second thing here is looking for the custom messages that we have made
          ? error.response.data.message
          : error.message,
    });
  }
};

//ACTION FOR DELETING A PRODUCT
export const deleteProduct = (id) => async (dispatch, getState) => {
  //don't need to pass anything in here because it knows who we are by our token
  try {
    dispatch({
      type: constants.PRODUCT_DELETE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${id}`, config);

    dispatch({
      type: constants.PRODUCT_DELETE_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: constants.PRODUCT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
