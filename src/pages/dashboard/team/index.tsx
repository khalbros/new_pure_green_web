import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {ITeam} from "../../../interfaces/team"

const teamReducer = (prev: ITeam, next: ITeam) => ({
  ...prev,
  ...next,
})

export const TeamContext = createContext({} as ReturnType<typeof useReducer>)

function TeamManagement() {
  return (
    <TeamContext.Provider value={useReducer(teamReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Team management
          </h3>
        </div>
        <Outlet />
      </div>
    </TeamContext.Provider>
  )
}

export default TeamManagement
