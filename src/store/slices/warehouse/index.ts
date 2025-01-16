import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IWarehouse} from "../../../interfaces/warehouse"

const initialState: IReduxState<IWarehouse> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const warehouseSlice = createSlice({
  name: "warehouse",
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

export const {initialize, success, failed, reset} = warehouseSlice.actions
export const warehouseSelector = (state: RootState) => state.warehouse
export default warehouseSlice.reducer
