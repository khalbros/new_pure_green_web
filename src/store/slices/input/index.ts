import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IInput} from "../../../interfaces/input"

const initialState: IReduxState<IInput> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const inputSlice = createSlice({
  name: "input",
  initialState,
  reducers: {
    initialize: (state) => ({...state, isLoading: true}),
    success: (state, action) => ({
      ...state,
      isLoading: false,
      data: action.payload,
      error: undefined,
    }),
    failed: (state, action) => ({
      ...state,
      isLoading: false,
      error: true,
      message: action.payload,
    }),
    reset: () => initialState,
  },
})

export const {initialize, success, failed, reset} = inputSlice.actions
export const inputSelector = (state: RootState) => state.input
export default inputSlice.reducer
