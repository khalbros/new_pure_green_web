import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IGrade} from "../../../interfaces/grade"

const gradeReducer = (prev: IGrade, next: IGrade) => ({
  ...prev,
  ...next,
})

export const GradeContext = createContext({} as ReturnType<typeof useReducer>)

function GradeManagement() {
  return (
    <GradeContext.Provider value={useReducer(gradeReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Grade management
          </h3>
        </div>
        <Outlet />
      </div>
    </GradeContext.Provider>
  )
}

export default GradeManagement
