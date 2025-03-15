import logo from "../../../../assets/puregreen-logo.png"
import { IUser } from "../../../../interfaces/user"
import { shortDateFormatter } from "../../../../utils"
import { ICertificate as IPayment } from "../../../../interfaces/certificate"

import { IWarehouse } from "../../../../interfaces/warehouse"
import { ICooperative } from "../../../../interfaces/cooperative"

function Receipt(props: IPayment) {
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
        pure green agrochemicals nig ltd
      </p>
      <div className="flex flex-col divide-y mt-4">
        <div className="flex items-ceter justify-between">
          <span>Payment for</span>
          <span>Certificate</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Cooperative</span>
          <span>{(props?.cooperative as ICooperative)?.name}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Chairman</span>
          <span>{(props?.cooperative as ICooperative)?.chairman}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Warehouse</span>
          <span>{(props.warehouse as IWarehouse)?.name}</span>
        </div>
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
          <span>Paid By</span>
          <span>{(props.paid_by as IUser)?.name}</span>
        </div>

        <div className="flex items-ceter justify-between">
          <span>Status</span>
          <span>{props.status}</span>
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
