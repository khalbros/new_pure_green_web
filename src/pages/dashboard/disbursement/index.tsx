import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IGrainFormData} from "../../../interfaces/grainLRP"

const dispatchReducer = (prev: IGrainFormData, next: IGrainFormData) => ({
  ...prev,
  ...next,
})

export const DisbursementContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function DisbursementManagement() {
  return (
    <DisbursementContext.Provider value={useReducer(dispatchReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Disbursement management
          </h3>
        </div>
        <Outlet />
      </div>
    </DisbursementContext.Provider>
  )
}

export default DisbursementManagement
