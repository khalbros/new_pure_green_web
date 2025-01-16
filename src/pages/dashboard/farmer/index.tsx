/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { IFarmer } from "../../../interfaces/farmer"
import { MdOutlineKeyboardBackspace } from "react-icons/md"

export const emptyFarmer: IFarmer = {
  first_name: undefined,
  last_name: undefined,
  other_name: undefined,
  gender: undefined,
  date_of_birth: undefined,
  phone: undefined,
  state: undefined,
  lga: undefined,
  village: undefined,
  address: undefined,
  id_type: undefined,
  id_number: undefined,
  id_card: undefined,
  cooperative: undefined,
  role: undefined,
  guarantor_name: undefined,
  guarantor_number: undefined,
  guarantor_village: undefined,
  guarantor_id_type: undefined,
  guarantor_id_number: undefined,
  guarantor_id: undefined,
  guarantor_address: undefined,
}
const farmerReducer = (prev: IFarmer, next: IFarmer) => ({ ...prev, ...next })

export const FarmerContext = createContext({} as ReturnType<typeof useReducer>)

function FarmerManagement() {
  const navigate = useNavigate()
  return (
    <FarmerContext.Provider value={useReducer(farmerReducer, {})}>
      <div className="h-full max-w-screen p-3 lg:px-8 lg:py-4">
        <div className="flex items-center gap-4">
          <span onClick={() => navigate(-1)}>
            <MdOutlineKeyboardBackspace className="mr-3 cursor-pointer text-green-500 text-3xl md:text-4xl" />
          </span>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Farmer management
          </h3>
        </div>
        <Outlet />
      </div>
    </FarmerContext.Provider>
  )
}

export default FarmerManagement
