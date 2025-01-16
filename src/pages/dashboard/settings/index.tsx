import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {IRoute, routes} from "../../../routes"

import {IUser} from "../../../interfaces/user"
import NavBar from "../../../components/navbar"

export const emptyUser: IUser = {
  _id: undefined,
  name: undefined,
  email: undefined,
  gender: undefined,
  password: undefined,
  address: undefined,
  profile_img: undefined,
  phone: undefined,
  isEnable: undefined,
  role: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}

const userReducer = (prev: IUser, next: IUser) => ({...prev, ...next})

export const UserContext = createContext({} as ReturnType<typeof useReducer>)

const Settings = () => {
  return (
    <UserContext.Provider value={useReducer(userReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <main className="">
          <NavBar
            title="Settings"
            routes={
              routes.find((route) => route.name === "settings")
                ?.children as IRoute[]
            }
          />
          <Outlet />
        </main>
      </div>
    </UserContext.Provider>
  )
}

export default Settings
