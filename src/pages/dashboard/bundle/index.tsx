import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IBundle} from "../../../interfaces/bundle"

const bundleReducer = (prev: IBundle, next: IBundle) => ({
  ...prev,
  ...next,
})

export const BundleContext = createContext({} as ReturnType<typeof useReducer>)

function BundleManagement() {
  return (
    <BundleContext.Provider value={useReducer(bundleReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Bundle management
          </h3>
        </div>
        <Outlet />
      </div>
    </BundleContext.Provider>
  )
}

export default BundleManagement
