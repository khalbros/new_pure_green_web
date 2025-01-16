import {createSlice} from "@reduxjs/toolkit"
import {RootState} from "../.."
import {IReduxState} from "../../../interfaces/reduxState"
import {ITeam} from "../../../interfaces/team"

const initialState: IReduxState<ITeam> = {
  data: undefined,
  isLoading: false,
  error: undefined,
  message: undefined,
}

const teamSlice = createSlice({
  name: "team",
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

export const {initialize, success, failed, reset} = teamSlice.actions
export const teamSelector = (state: RootState) => state.team
export default teamSlice.reducer
