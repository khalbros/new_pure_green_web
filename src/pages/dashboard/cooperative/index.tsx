import { createContext, useReducer } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { ICooperative } from "../../../interfaces/cooperative"
import { MdOutlineKeyboardBackspace } from "react-icons/md"

const cooperativeReducer = (prev: ICooperative, next: ICooperative) => ({
  ...prev,
  ...next,
})

export const CooperativeContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function CooperativeManagement() {
  const navigate = useNavigate()
  return (
    <CooperativeContext.Provider value={useReducer(cooperativeReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex gap-4 items-center">
          <span onClick={() => navigate(-1)}>
            <MdOutlineKeyboardBackspace className="mr-3 cursor-pointer text-green-500 text-3xl md:text-4xl" />
          </span>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Cooperative management
          </h3>
        </div>
        <Outlet />
      </div>
    </CooperativeContext.Provider>
  )
}

export default CooperativeManagement
