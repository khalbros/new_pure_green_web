import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IUser} from "../../../interfaces/user"

const initialState: IReduxState<IUser> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const createUserSlice = createSlice({
  name: "create-user",
  initialState,
  reducers: {
    createUser: (state) => ({...state, isLoading: true}),
    createdUser: (state, action) => ({
      ...state,
      isLoading: false,
      data: action.payload,
      error: undefined,
    }),
    createUserError: (state, action) => ({
      ...state,
      isLoading: false,
      error: true,
      message: action.payload,
    }),
    createUserReset: () => initialState,
  },
})

export const {createUser, createUserError, createdUser, createUserReset} =
  createUserSlice.actions
export const createUserSelector = (state: RootState) => state.create_user
export default createUserSlice.reducer
