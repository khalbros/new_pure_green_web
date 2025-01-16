/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFarmer } from "../../../interfaces/farmer"
import logo from "../../../assets/puregreen-logo.png"
import { IUser } from "../../../interfaces/user"
import { shortDateFormatter } from "../../../utils"
import { IEquity as IPayment } from "../../../interfaces/equity"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { IWarehouse } from "../../../interfaces/warehouse"

function Receipt(props: IPayment) {
  const [paymentType, setPaymentType] = useState("")
  const location = useLocation()
  useEffect(() => {
    if (location.pathname.includes("/registration")) {
      return setPaymentType("Registration")
    }
    if (location.pathname.includes("/equity")) {
      return setPaymentType("Equity")
    }
  }, [location.pathname])

  return (
    <div className="max-w-xs mx-auto bg-white justify-center items-center gap-2 capitalize">
      <div className="flex object-contain overflow-hidden w-20 self-center mx-auto my-2">
        <img
          src={logo}
          alt="app-logo"
          className="object-contain justify-center"
        />
      </div>
      <p className="capitalize text-sm text-center">
        pure green agro-chemicals nig ltd
      </p>
      <div className="flex flex-col divide-y mt-4">
        <div className="flex items-ceter justify-between">
          <span>Payment for</span>
          <span>{paymentType}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Farmer</span>
          <span>{(props.farmer as IFarmer)?.first_name}</span>
        </div>
        {props.farmer && (
          <div className="flex items-ceter justify-between">
            <span>FID</span>
            <span>{(props.farmer as IFarmer)?.farmer_id}</span>
          </div>
        )}

        <div className="flex items-ceter justify-between">
          <span>Amount Paid</span>
          <span>
            {Number(props.amount_paid).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Warehouse</span>
          <span>
            {
              (
                ((props.farmer as IFarmer)?.field_officer as IUser)
                  ?.warehouse as IWarehouse
              )?.name
            }
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Paid By</span>
          <span>{(props.paid_by as IUser)?.name}</span>
        </div>

        <div className="flex items-ceter justify-between">
          <span>Status</span>
          <span>{props.status ? "PAID" : "NOT PAID"}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Date</span>
          <span>{shortDateFormatter(props.updatedAt!)}</span>
        </div>
        <div className="flex items-ceter justify-center">
          <span className="text-center                                                                                                        normal-case">
            For enquiries and support, please call <br></br> +2348088885895
          </span>
        </div>
      </div>
    </div>
  )
}

export default Receipt
