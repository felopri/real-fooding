import {
  CLOSE_SNACKBAR,
  OPEN_SNACKBAR,
  UPDATE_DRAWER_STATE,
  UPDATE_OFFLINE,
  UPDATE_PAGE,
  USER_LOGGED
} from '../actions/app.js';

const app = (state = {drawerOpened: false}, action) => {
  switch (action.type) {
    case CLOSE_SNACKBAR:
      return {
        ...state,
        snackbarOpened: false
      };
    case OPEN_SNACKBAR:
      return {
        ...state,
        snackbarOpened: true
      };
    case UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case UPDATE_OFFLINE:
      return {
        ...state,
        offline: action.offline
      };
    case UPDATE_PAGE:
      return {
        ...state,
        page: action.page
      };
    case USER_LOGGED:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

export default app;
