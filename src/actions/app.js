export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const UPDATE_PAGE = 'UPDATE_PAGE';
export const USER_LOGGED = 'USER_LOGGED';

export const navigate = (path) => (dispatch) => {
  // Extract the page name from path.
  const page = path === '/' ? 'image' : path.slice(1);

  // Any other info you might want to extract from the path (like page type),
  // you can do here
  dispatch(loadPage(page));

  // Close the drawer - in case the *path* change came from a link in the drawer.
  dispatch(updateDrawerState(false));
};

const loadPage = (page) => (dispatch) => {
  switch(page) {
    case 'image':
      import('../components/image-manager.js').then((module) => {
      });
      break;
    case 'result':
      import('../components/result-view.js');
      break;
    default:
      page = 'view404';
      import('../components/my-view404.js');
  }

  dispatch(updatePage(page));
};

const updatePage = (page) => {
  return {
    type: UPDATE_PAGE,
    page
  };
};

let snackbarTimer;

export const checkUserLogged = () => (dispatch, getState) => {
  console.log('checkUserLogged', getState().app);
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      dispatch({
        type: USER_LOGGED,
        user
      });
    }
  });
};

export const loginUser = (user) => (dispatch) => {
  dispatch({
    type: USER_LOGGED,
    user
  });
};

export const logoutUser = (user) => (dispatch) => {
  firebase.auth().signOut();
  dispatch({
    type: USER_LOGGED,
    user: null
  });
};

export const showSnackbar = () => (dispatch) => {
  dispatch({
    type: OPEN_SNACKBAR
  });
  clearTimeout(snackbarTimer);
  snackbarTimer = setTimeout(() =>
    dispatch({ type: CLOSE_SNACKBAR }), 3000);
};

export const updateOffline = (offline) => (dispatch, getState) => {
  // Show the snackbar, unless this is the first load of the page.
  if (getState().app.offline !== undefined) {
    dispatch(showSnackbar());
  }
  dispatch({
    type: UPDATE_OFFLINE,
    offline
  });
};

export const updateLayout = (wide) => (dispatch, getState) => {
  if (getState().app.drawerOpened) {
    dispatch(updateDrawerState(false));
  }
};

export const updateDrawerState = (opened) => (dispatch, getState) => {
  if (getState().app.drawerOpened !== opened) {
    dispatch({
      type: UPDATE_DRAWER_STATE,
      opened
    });
  }
};
