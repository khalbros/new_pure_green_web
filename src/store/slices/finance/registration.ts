import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IEquity as IReg} from "../../../interfaces/equity"

const initialState: IReduxState<IReg> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const registrationSlice = createSlice({
  name: "registration",
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

export const {initialize, success, failed, reset} = registrationSlice.actions
export const registrationSelector = (state: RootState) => state.registration
export default registrationSlice.reducer
