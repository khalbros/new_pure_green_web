import { createContext, useReducer } from "react"
import { Outlet } from "react-router-dom"
import { IGrainFormData } from "../../../../interfaces/grainLRP"

const dispatchReducer = (prev: IGrainFormData, next: IGrainFormData) => ({
  ...prev,
  ...next,
})

export const DisbursementContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function InputLoan() {
  return (
    <DisbursementContext.Provider value={useReducer(dispatchReducer, {})}>
      <div className="">
        <Outlet />
      </div>
    </DisbursementContext.Provider>
  )
}

export default InputLoan
