import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IClient} from "../../../interfaces/client"

const initialState: IReduxState<IClient> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const clientSlice = createSlice({
  name: "client",
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

export const {initialize, success, failed, reset} = clientSlice.actions
export const clientSelector = (state: RootState) => state.client
export default clientSlice.reducer
