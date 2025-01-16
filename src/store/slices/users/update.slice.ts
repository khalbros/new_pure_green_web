import {createSlice} from "@reduxjs/toolkit"
import {IReduxState} from "../../../interfaces/reduxState"
import {RootState} from "../.."
import {IUser} from "../../../interfaces/user"

const initialState: IReduxState<IUser> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const updateUserSlice = createSlice({
  name: "update-user",
  initialState,
  reducers: {
    updateUser: () => ({isLoading: true}),
    updatedUser: (_state, action) => ({
      isLoading: false,
      error: false,
      data: action.payload,
    }),
    updateUserError: (_state, action) => ({
      isLoading: false,
      error: true,
      message: action.payload,
    }),
    updateUserReset: () => initialState,
  },
})

export const {updateUser, updateUserError, updatedUser, updateUserReset} =
  updateUserSlice.actions
export const updateUserSelector = (state: RootState) => state.update_user
export default updateUserSlice.reducer
