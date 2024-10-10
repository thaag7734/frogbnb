import { csrfFetch } from './csrf.js';

const LOGIN_USER = 'session/loginUser';
const LOGOUT_USER = 'session/logoutUser';

/**
 * A User object from the backend DB
 * @typedef { Object } User
 * @property { number } id
 * @property { string } email
 * @property { username } string
 * @property { firstName } string
 * @property { lastName } string
 */

/**
 * @typedef { Object } UserWithPassProperties
 * @property { string } password
 * @typedef {User & UserWithPassProperties} UserWithPassword
 */

/**
 * Set the user state
 * @param { User } user
 * @returns { { type: string, user: User } }
 */
export const loginUser = (user) => {
  return {
    type: LOGIN_USER,
    user,
  };
}

/**
 * Set the user to null on the state
 * @returns { { type: string } }
 */
export const logoutUser = () => {
  return {
    type: LOGOUT_USER,
  };
}

/**
 * Send a request to the login endpoint on the backend
 * @param { string } credential Either the username or email for the user
 * @param { string } password
 * @returns { User } The user object returned from the backend
 */
export const login = (credential, password) => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({ credential, password }),
  });

  if (res.ok) {
    const user = (await res.json()).user;
    dispatch(loginUser(user));

    return user;
  }
}

/**
 * Send a request to the logout endpoint on the backend
 * @returns { { message: string } | undefined }
 */
export const logout = () => async (dispatch) => {
  const res = await csrfFetch('/api/session', {
    method: 'DELETE',
  });

  if (res.ok) {
    dispatch(logoutUser());

    return await res.json();
  }
}

/**
 * Hit the GET /api/session endpoint to restore user cookie and set state
 */
export const restoreUser = () => async (dispatch) => {
  const res = await csrfFetch('/api/session');
  const user = (await res.json()).user;

  dispatch(loginUser(user));

  return res;
};

/**
 * Send a request to the signup endpoint on the backend
 * @param { UserWithPassword } user The user object to sign up
 * @returns { User } The user object returned from the backend
 */
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password
    })
  });
  const data = await response.json();
  dispatch(loginUser(data.user));
  return response;
};

/**
 * @typedef { Object } SessionState
 * @property { User | null } user
 */

/**
 * @param { SessionState } state
 */
const sessionReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, user: action.user };
    case LOGOUT_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default sessionReducer;
