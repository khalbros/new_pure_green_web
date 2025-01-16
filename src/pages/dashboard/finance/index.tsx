import {Outlet} from "react-router-dom"

function FinanceManagement() {
  return (
    <div className="h-full p-4 lg:px-8 lg:py-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
          Finance management
        </h3>
      </div>
      <Outlet />
    </div>
  )
}

export default FinanceManagement
