import * as constants from '../constants/productConstants';

//Login a user
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.USER_LOGIN_REQUEST:
      return { loading: true };
    case constants.USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case constants.USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case constants.USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

//Register a new user
export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.USER_REGISTER_REQUEST:
      return { loading: true };
    case constants.USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload }; //userInfo in this case will pertain to the information provided by the user during registration.
    case constants.USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//Create a profile screen with user detail information (name email etc)
export const userDetailsReducer = (state = { user: {} }, action) => {
  //initial state is the user, but starts off as an empty object
  switch (action.type) {
    case constants.USER_DETAILS_REQUEST:
      return { ...state, loading: true }; //return whatever is in the initial state
    case constants.USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case constants.USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
