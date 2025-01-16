/* eslint-disable @typescript-eslint/no-explicit-any */
import {IWarehouse} from "../../../interfaces/warehouse"
import {IClient} from "../../../interfaces/client"
import logo from "../../../assets/puregreen-logo.png"
import {IUser} from "../../../interfaces/user"
import {IGrade} from "../../../interfaces/grade"
import {ICommodity} from "../../../interfaces/commodity"
import {dateTimeFormatter} from "../../../utils"
import {IDispatch} from "../../../interfaces/dispatch"

function Receipt(props: IDispatch) {
  return (
    <div className="max-w-sm mx-auto bg-white justify-center items-center gap-2 capitalize">
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
          <span>
            {props.warehouse ? "warehouse" : props.client ? "client" : "name"}
          </span>
          <span>
            {props.warehouse
              ? (props.warehouse as IWarehouse)?.name
              : props.client
              ? (props.client as IClient)?.name
              : ""}
          </span>
        </div>
        {props.client && (
          <div className="flex items-ceter justify-between">
            <span>CID</span>
            <span>{(props.client as IClient)?.client_id}</span>
          </div>
        )}
        <div className="flex items-ceter justify-between">
          <span>Type</span>
          <span>{`Dispatch (${props.type})`}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Item</span>
          {props.commodity && props.commodity != null && (
            <span>{(props.commodity as ICommodity)?.name}</span>
          )}
          {props.input && props.input != null && (
            <span>{(props.input as ICommodity)?.name}</span>
          )}
        </div>
        {props.commodity && props.commodity != null && (
          <div className="flex items-ceter justify-between">
            <span>Grade</span>
            <span>{(props?.grade as IGrade)?.name}</span>
          </div>
        )}
        <div className="flex items-ceter justify-between">
          <span>Quantity</span>
          <span>{props.num_bags} bags/pck/ltr</span>
        </div>
        {props.commodity && props.commodity != null && (
          <>
            <div className="flex items-ceter justify-between">
              <span>Gross Weight</span>
              <span>{props.gross_weight}Kg</span>
            </div>
            <div className="flex items-ceter justify-between">
              <span>Net Weight</span>
              <span>{props.net_weight}Kg</span>
            </div>
          </>
        )}
        <div className="flex items-ceter justify-between">
          <span>Raised By</span>
          <span>{(props.createdBy as IUser)?.name}</span>
        </div>
        {props.receivedBy && (
          <div className="flex items-ceter justify-between">
            <span>Received By</span>
            <span>{(props.receivedBy as IUser)?.name}</span>
          </div>
        )}
        <div className="flex items-ceter justify-between">
          <span>Driver</span>
          <span>{props?.driver}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Truck Number</span>
          <span>{props.truck_num}</span>
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
