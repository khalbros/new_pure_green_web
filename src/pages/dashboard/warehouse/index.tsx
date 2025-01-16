import { createContext, useReducer } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { IWarehouse } from "../../../interfaces/warehouse"
import { MdOutlineKeyboardBackspace } from "react-icons/md"

const warehouseReducer = (prev: IWarehouse, next: IWarehouse) => ({
  ...prev,
  ...next,
})

export const WarehouseContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function WarehouseManagement() {
  const navigate = useNavigate()

  return (
    <WarehouseContext.Provider value={useReducer(warehouseReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex gap-2 md:gap-4 items-center">
          <span onClick={() => navigate(-1)}>
            <MdOutlineKeyboardBackspace className="mr-1 md:mr-3 cursor-pointer text-green-500 text-3xl md:text-4xl" />
          </span>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Warehouse management
          </h3>
        </div>
        <Outlet />
      </div>
    </WarehouseContext.Provider>
  )
}

export default WarehouseManagement
