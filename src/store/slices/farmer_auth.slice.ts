import { createSlice } from "@reduxjs/toolkit"
import { IReduxState } from "../../interfaces/reduxState"
import { IFarmer } from "../../interfaces/farmer"
import { RootState } from "../reducers"

const initialState: IReduxState<IFarmer> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const farmerAuthSlice = createSlice({
  name: "auth_farmer",
  initialState,
  reducers: {
    initialize: (state) => ({ ...state, isLoading: true }),
    success: (state, action) => ({
      ...state,
      isLoading: false,
      data: action.payload,
      error: undefined,
      message: undefined,
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

export const { initialize, success, failed, reset } = farmerAuthSlice.actions
export const farmerAuthSelector = (state: RootState) => state.auth_farmer
export default farmerAuthSlice.reducer
