import { createContext, useReducer } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { ICommodity } from "../../../interfaces/commodity"
import { MdOutlineKeyboardBackspace } from "react-icons/md"

const commodityReducer = (prev: ICommodity, next: ICommodity) => ({
  ...prev,
  ...next,
})

export const CommodityContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function CommodityManagement() {
  const navigate = useNavigate()
  return (
    <CommodityContext.Provider value={useReducer(commodityReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex gap-4 items-center">
          <span onClick={() => navigate(-1)}>
            <MdOutlineKeyboardBackspace className="mr-3 cursor-pointer text-green-500 text-3xl md:text-4xl" />
          </span>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Commodity management
          </h3>
        </div>
        <Outlet />
      </div>
    </CommodityContext.Provider>
  )
}

export default CommodityManagement
