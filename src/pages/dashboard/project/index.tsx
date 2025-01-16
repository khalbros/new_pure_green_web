import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IProject} from "../../../interfaces/project"

const projectReducer = (prev: IProject, next: IProject) => ({
  ...prev,
  ...next,
})

export const ProjectContext = createContext({} as ReturnType<typeof useReducer>)

function ProjectManagement() {
  return (
    <ProjectContext.Provider value={useReducer(projectReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Project management
          </h3>
        </div>
        <Outlet />
      </div>
    </ProjectContext.Provider>
  )
}

export default ProjectManagement
