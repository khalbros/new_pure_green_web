import { Outlet } from "react-router-dom"
import Header from "./components/Header"

function AccountLayout() {
  return (
    <div>
      <div className="relative overflow-y-auto h-screen max-w-[100vw] box-border">
        <Header />
        <div className="flex flex-wrap px-5 md:px-10 lg:px-20">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
