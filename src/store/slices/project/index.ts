import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {IProject} from "../../../interfaces/project"

const initialState: IReduxState<IProject> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const projectSlice = createSlice({
  name: "project",
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

export const {initialize, success, failed, reset} = projectSlice.actions
export const projectSelector = (state: RootState) => state.project
export default projectSlice.reducer
