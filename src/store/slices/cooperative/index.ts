import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {ICooperative} from "../../../interfaces/cooperative"

const initialState: IReduxState<ICooperative> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const cooperativeSlice = createSlice({
  name: "cooperative",
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

export const {initialize, success, failed, reset} = cooperativeSlice.actions
export const cooperativeSelector = (state: RootState) => state.cooperative
export default cooperativeSlice.reducer
