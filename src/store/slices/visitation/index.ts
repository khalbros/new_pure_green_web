import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IVisitation} from "../../../interfaces/visitation"

const initialState: IReduxState<IVisitation> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const visitationSlice = createSlice({
  name: "visitation",
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

export const {initialize, success, failed, reset} = visitationSlice.actions
export const visitationSelector = (state: RootState) => state.visitation
export default visitationSlice.reducer
