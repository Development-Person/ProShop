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
    case constants.USER_DETAILS_RESET:
      return { user: {} };
    default:
      return state;
  }
};

//Update user details
export const userUpdateProfileReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.USER_UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true }; //return whatever is in the initial state
    case constants.USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case constants.USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case constants.USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

//Get user list - admin only
export const userListReducer = (state = { users: [] }, action) => {
  switch (action.type) {
    case constants.USER_LIST_REQUEST:
      return { loading: true }; //return whatever is in the initial state
    case constants.USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case constants.USER_LIST_FAIL:
      return { loading: false, error: action.payload };
    case constants.USER_LIST_RESET:
      return { users: [] };
    default:
      return state;
  }
};

//Delete a user - admin only
export const userDeleteReducer = (state = {}, action) => {
  switch (action.type) {
    case constants.USER_DELETE_REQUEST:
      return { loading: true };
    case constants.USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case constants.USER_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

//Update a user - admin only
export const userUpdateReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case constants.USER_UPDATE_REQUEST:
      return { loading: true };
    case constants.USER_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case constants.USER_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    case constants.USER_UPDATE_RESET:
      return { user: {} };
    default:
      return state;
  }
};
