import { createSlice } from "@reduxjs/toolkit"
import { RootState } from "../.."
import { IReduxState } from "../../../interfaces/reduxState"
import { IFarmer } from "../../../interfaces/farmer"

const initialState: IReduxState<IFarmer> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const farmerSlice = createSlice({
  name: "farmer",
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

export const { initialize, success, failed, reset } = farmerSlice.actions
export const farmerSelector = (state: RootState) => state.farmer
export default farmerSlice.reducer
