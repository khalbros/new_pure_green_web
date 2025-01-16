import {createContext, useReducer} from "react"
import {Outlet} from "react-router-dom"
import {ITransaction} from "../../../interfaces/transaction"

const transactionReducer = (prev: ITransaction, next: ITransaction) => ({
  ...prev,
  ...next,
})

export const TransactionContext = createContext(
  {} as ReturnType<typeof useReducer>
)

function TransactionManagement() {
  return (
    <TransactionContext.Provider value={useReducer(transactionReducer, {})}>
      <div className="h-full p-4 lg:px-8 lg:py-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Transaction management
          </h3>
        </div>
        <Outlet />
      </div>
    </TransactionContext.Provider>
  )
}

export default TransactionManagement
