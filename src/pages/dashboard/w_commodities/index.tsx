import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {ICommodity} from "../../../interfaces/commodity"

const commodityReducer = (prev: ICommodity, next: ICommodity) => ({
  ...prev,
  ...next,
})

export const WCommodityContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function WCommodityManagement() {
  return (
    <WCommodityContext.Provider value={useReducer(commodityReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Commodity management
          </h3>
        </div>
        <Outlet />
      </div>
    </WCommodityContext.Provider>
  )
}

export default WCommodityManagement
