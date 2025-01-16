import {createSlice} from "@reduxjs/toolkit"
import {RootState} from ".."
import {IUser} from "../../interfaces/user"

export interface IAuthState {
  user?: IUser
  error?: string
  isLoading: boolean
}

const initialState: IAuthState = {
  user: undefined,
  error: undefined,
  isLoading: false,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authenticate: (state) => ({...state, isLoading: true}),
    authenticated: (state, action) => ({
      ...state,
      isLoading: false,
      user: action.payload,
      error: undefined,
    }),
    authenticationError: (state, action) => ({
      ...state,
      isLoading: false,
      error: action.payload,
    }),
    signout: () => ({
      user: undefined,
      error: undefined,
      isLoading: false,
    }),
    reset: () => initialState,
  },
})

export const {
  authenticate,
  authenticated,
  authenticationError,
  signout,
  reset,
} = authSlice.actions
export const authSelector = (state: RootState) => state.auth
export default authSlice.reducer
