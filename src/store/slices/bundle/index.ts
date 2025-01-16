import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IBundle} from "../../../interfaces/bundle"

const initialState: IReduxState<IBundle> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const bundleSlice = createSlice({
  name: "bundle",
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

export const {initialize, success, failed, reset} = bundleSlice.actions
export const bundleSelector = (state: RootState) => state.bundle
export default bundleSlice.reducer
