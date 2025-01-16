import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {ICashLRP} from "../../../../interfaces/cashLRP"

const dispatchReducer = (prev: ICashLRP, next: ICashLRP) => ({
  ...prev,
  ...next,
})

export const DisbursementContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function CashDisbursement() {
  return (
    <DisbursementContext.Provider value={useReducer(dispatchReducer, {})}>
      <div className="">
        <Outlet />
      </div>
    </DisbursementContext.Provider>
  )
}

export default CashDisbursement
