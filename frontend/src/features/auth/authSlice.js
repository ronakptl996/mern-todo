import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  loggedInUser: {},
  isLoading: true,
  todos: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isAuth = Boolean(action.payload);
    },
    setLoggedInUserDetails: (state, action) => {
      state.isAuth = true;
      state.loggedInUser = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setTodos: (state, action) => {
      state.todos = action.payload;
    },
  },
});

export const { setIsLoggedIn, setLoggedInUserDetails, setLoading, setTodos } =
  authSlice.actions;

export default authSlice.reducer;

export function fetchLoggedInUserDetails() {
  return async function fetchLoggedInUserDetailsThunk(dispatch, getState) {
    try {
      dispatch(setLoading(true));
      try {
        let response = await fetch("/api/user", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        let data = await response.json();
        if (data && data.success) {
          dispatch(setLoggedInUserDetails(data.data.decoded));
        } else {
          dispatch(setIsLoggedIn(false));
        }
      } catch (error) {
        console.log(`FetchLoggedInUserDetailsThunk Error ${error}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
