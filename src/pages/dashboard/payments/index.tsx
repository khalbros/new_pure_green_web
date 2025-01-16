import {Outlet} from "react-router-dom"

function PaymentManagement() {
  return (
    <div className="">
      {/* <div className="flex justify-between items-center">
          <h3 className="text-xl lg:text-2xl font-bold text-gray-800">
            Payments management
          </h3>
        </div> */}
      <Outlet />
    </div>
  )
}

export default PaymentManagement
