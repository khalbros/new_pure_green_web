import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IUser} from "../../../../interfaces/user"

export const emptyUser: IUser = {
  name: undefined,
  email: undefined,
  gender: undefined,
  profile_img: undefined,
  phone: undefined,
  role: undefined,
  address: undefined,
}
const userReducer = (prev: IUser, next: IUser) => ({...prev, ...next})

export const UserContext = createContext({} as ReturnType<typeof useReducer>)

function ProfileManagement() {
  return (
    <UserContext.Provider value={useReducer(userReducer, {})}>
      <div className="">
        <Outlet />
      </div>
    </UserContext.Provider>
  )
}

export default ProfileManagement
