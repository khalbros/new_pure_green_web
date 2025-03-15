import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../.."
import { IReduxState } from "../../../interfaces/reduxState"
import { ICertificate } from "../../../interfaces/certificate"

const initialState: IReduxState<ICertificate> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
    initialize: (state) => ({ ...state, isLoading: true }),
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

export const { initialize, success, failed, reset } = certificateSlice.actions
export const certificateSelector = (state: RootState) => state.certificate
export default certificateSlice.reducer
