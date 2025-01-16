import { createContext, useReducer } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { IUser } from "../../../interfaces/user"
import { MdOutlineKeyboardBackspace } from "react-icons/md"

export const emptyUser: IUser = {
  name: undefined,
  email: undefined,
  gender: undefined,
  profile_img: undefined,
  phone: undefined,
  role: undefined,
}
const userReducer = (prev: IUser, next: IUser) => ({ ...prev, ...next })

export const UserContext = createContext({} as ReturnType<typeof useReducer>)

function UserManagement() {
  const navigate = useNavigate()
  return (
    <UserContext.Provider value={useReducer(userReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex gap-4 items-center">
          <span onClick={() => navigate(-1)}>
            <MdOutlineKeyboardBackspace className="mr-3 cursor-pointer text-green-500 text-3xl md:text-4xl" />
          </span>
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            User management
          </h3>
        </div>
        <Outlet />
      </div>
    </UserContext.Provider>
  )
}

export default UserManagement
