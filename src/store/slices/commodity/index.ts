import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {ICommodity} from "../../../interfaces/commodity"

const initialState: IReduxState<ICommodity> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const commoditySlice = createSlice({
  name: "commodity",
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

export const {initialize, success, failed, reset} = commoditySlice.actions
export const commoditySelector = (state: RootState) => state.commodity
export default commoditySlice.reducer
