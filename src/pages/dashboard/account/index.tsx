/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer } from "react"
import { Outlet } from "react-router-dom"
import { IAccount } from "../../../interfaces/account"

export const emptyAccount: IAccount = {}
const accountReducer = (prev: IAccount, next: IAccount) => ({
  ...prev,
  ...next,
})

export const AccountContext = createContext({} as ReturnType<typeof useReducer>)

function AccountManagement() {
  return (
    <AccountContext.Provider value={useReducer(accountReducer, {})}>
      <div className="h-full max-w-screen p-3 lg:px-8 lg:py-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Account management
          </h3>
        </div>
        <Outlet />
      </div>
    </AccountContext.Provider>
  )
}

export default AccountManagement
