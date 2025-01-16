/* eslint-disable @typescript-eslint/no-explicit-any */
import {IClient} from "../../../interfaces/client"
import logo from "../../../assets/puregreen-logo.png"
import {IUser} from "../../../interfaces/user"
import {IGrade} from "../../../interfaces/grade"
import {ICommodity} from "../../../interfaces/commodity"
import {dateTimeFormatter} from "../../../utils"
import {ITransaction} from "../../../interfaces/transaction"

function Receipt(props: ITransaction) {
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
          <span>Client</span>
          <span>{(props.client as IClient)?.name}</span>
        </div>
        {props.client && (
          <div className="flex items-ceter justify-between">
            <span>CID</span>
            <span>{(props.client as IClient)?.client_id}</span>
          </div>
        )}

        <div className="flex items-ceter justify-between">
          <span>Type</span>
          <span>{props.type}</span>
        </div>
        {props.ref_id && (
          <div className="flex items-ceter justify-between">
            <span>Reference ID</span>
            <span>{props.ref_id}</span>
          </div>
        )}
        <div className="flex items-ceter justify-between">
          <span>Commodity</span>
          <span>{(props.commodity as ICommodity)?.name}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Grade</span>
          <span>{(props?.grade as IGrade)?.name}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Number of bags</span>
          <span>{props.num_bags}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Gross Weight</span>
          <span>{props.gross_weight}Kg</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Net Weight</span>
          <span>{props.net_weight}Kg</span>
        </div>
        {props?.duration && (
          <div className="flex items-ceter justify-between">
            <span>Duration</span>
            <span>
              {props.duration} {"month(s)"}
            </span>
          </div>
        )}
        <div className="flex items-ceter justify-between">
          <span>Payeble amount</span>
          <span>
            {Number(props.amount).toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Raised By</span>
          <span>{(props.createdBy as IUser)?.name}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Driver</span>
          <span>{props?.driver}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Truck Number</span>
          <span>{props.truck_number}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Status</span>
          <span>{props.status}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Date</span>
          <span>{dateTimeFormatter(props.updatedAt!)}</span>
        </div>
        <div className="flex items-ceter justify-center">
          <span className="text-center normal-case">
            For enquiries and support, please call <br></br> +2348088885895
          </span>
        </div>
      </div>
    </div>
  )
}

export default Receipt
