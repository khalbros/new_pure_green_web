import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IDispatch} from "../../../interfaces/dispatch"

const initialState: IReduxState<IDispatch> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const dispatchSlice = createSlice({
  name: "dispatch",
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

export const {initialize, success, failed, reset} = dispatchSlice.actions
export const dispatchSelector = (state: RootState) => state.dispatch
export default dispatchSlice.reducer
