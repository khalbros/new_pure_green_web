import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IVisitation} from "../../../interfaces/visitation"

const visitationReducer = (prev: IVisitation, next: IVisitation) => ({
  ...prev,
  ...next,
})

export const VisitationContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function VisitationManagement() {
  return (
    <VisitationContext.Provider value={useReducer(visitationReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Visitation management
          </h3>
        </div>
        <Outlet />
      </div>
    </VisitationContext.Provider>
  )
}

export default VisitationManagement
