import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IGrade} from "../../../interfaces/grade"

const initialState: IReduxState<IGrade> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const gradeSlice = createSlice({
  name: "grade",
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

export const {initialize, success, failed, reset} = gradeSlice.actions
export const gradeSelector = (state: RootState) => state.grade
export default gradeSlice.reducer
