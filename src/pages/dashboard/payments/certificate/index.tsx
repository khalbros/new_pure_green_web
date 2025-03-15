import { Outlet } from "react-router-dom"
import { ICertificate } from "../../../../interfaces/certificate"
import { createContext, useReducer } from "react"

const equityReducer = (prev: ICertificate, next: ICertificate) => ({
  ...prev,
  ...next,
})

export const CertContext = createContext({} as ReturnType<typeof useReducer>)

function CertPayment() {
  return (
    <CertContext.Provider value={useReducer(equityReducer, {})}>
      <Outlet />
    </CertContext.Provider>
  )
}

export default CertPayment
