import {Outlet} from "react-router-dom"
import {IEquity} from "../../../../interfaces/equity"
import {createContext, useReducer} from "react"

const regReducer = (prev: IEquity, next: IEquity) => ({
  ...prev,
  ...next,
})

export const RegistrationContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function RegistrationPayment() {
  return (
    <RegistrationContext.Provider value={useReducer(regReducer, {})}>
      <Outlet />
    </RegistrationContext.Provider>
  )
}

export default RegistrationPayment
