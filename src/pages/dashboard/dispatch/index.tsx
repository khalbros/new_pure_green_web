import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IDispatch} from "../../../interfaces/dispatch"

const dispatchReducer = (prev: IDispatch, next: IDispatch) => ({
  ...prev,
  ...next,
})

export const DispatchContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function DispatchManagement() {
  return (
    <DispatchContext.Provider value={useReducer(dispatchReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Dispatch management
          </h3>
        </div>
        <Outlet />
      </div>
    </DispatchContext.Provider>
  )
}

export default DispatchManagement
