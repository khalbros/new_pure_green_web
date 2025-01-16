import {Outlet} from "react-router-dom"
import {IEquity} from "../../../../interfaces/equity"
import {createContext, useReducer} from "react"

const equityReducer = (prev: IEquity, next: IEquity) => ({
  ...prev,
  ...next,
})

export const EquityContext = createContext({} as ReturnType<typeof useReducer>)

function EquityPayment() {
  return (
    <EquityContext.Provider value={useReducer(equityReducer, {})}>
      <Outlet />
    </EquityContext.Provider>
  )
}

export default EquityPayment
