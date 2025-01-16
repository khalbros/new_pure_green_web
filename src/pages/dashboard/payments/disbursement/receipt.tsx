/* eslint-disable @typescript-eslint/no-explicit-any */
import logo from "../../../../assets/puregreen-logo.png"
import { IUser } from "../../../../interfaces/user"
import { timeFormatter } from "../../../../utils"
import { IDisbursement } from "../../../../interfaces/disbursement"
import { IFarmer } from "../../../../interfaces/farmer"
import { IBundle } from "../../../../interfaces/bundle"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { ICashLRP } from "../../../../interfaces/cashLRP"

function Receipt(props: ICashLRP) {
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
        Pure Green Agro-chemicals Nig ltd.
      </p>
      <div className="flex flex-col divide-y mt-4">
        <div className="flex items-ceter justify-between">
          <span>Purpose</span>
          <span>{"Cash LRP"}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Reference ID</span>
          <span>{props.ref_id}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Farmer</span>
          <span>
            {
              (
                (props?.disbursement as unknown as IDisbursement)
                  ?.farmer as IFarmer
              )?.first_name
            }
          </span>
        </div>

        <div className="flex items-ceter justify-between">
          <span>Farmer ID</span>
          <span>
            {
              (
                (props?.disbursement as unknown as IDisbursement)
                  ?.farmer as IFarmer
              )?.farmer_id
            }
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Cooperative</span>
          <span>
            {
              (
                (
                  (props?.disbursement as unknown as IDisbursement)
                    ?.farmer as IFarmer
                )?.cooperative as ICooperative
              )?.name
            }
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Warehouse</span>
          <span>
            {
              (
                (props.disbursement as unknown as IDisbursement)
                  ?.warehouse as IWarehouse
              )?.name
            }
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Bundle</span>
          <span>
            {
              (
                (props?.disbursement as unknown as IDisbursement)
                  ?.bundle as IBundle
              )?.name
            }
          </span>
        </div>

        <div className="flex items-ceter justify-between">
          <span>Hectares</span>
          <span>
            {(props?.disbursement as unknown as IDisbursement)?.hectares}Ha
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Total Loan</span>
          <span>
            {Number(
              (props?.disbursement as unknown as IDisbursement)?.loan_amount
            )?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Equity Paid</span>
          <span>
            {Number(
              (props?.disbursement as unknown as IDisbursement)?.equity
            )?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Repayment Value</span>
          <span>
            {Number(
              (props?.disbursement as unknown as IDisbursement)
                ?.repayment_amount
            )?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Processing Fee</span>
          <span>
            {Number(props.processing_fee)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Logistics Fee</span>
          <span>
            {Number(props.logistics_fee)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Cash Paid</span>
          <span>
            {Number(props.cash_paid)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Outstanding Loan</span>
          <span>
            {Number(props?.outstanding_loan)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Overages</span>
          <span>
            {Number(props?.overage)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Booked By</span>
          <span>
            {
              (
                (props?.disbursement as unknown as IDisbursement)
                  ?.disbursedBy as IUser
              )?.name
            }
          </span>
        </div>
        {props.repayedBy && (
          <div className="flex items-ceter justify-between">
            <span>Repayed by </span>
            <span>{(props.repayedBy as IUser)?.name}</span>
          </div>
        )}

        <div className="flex items-ceter justify-between">
          <span>Status</span>
          <span>{props.status}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Date</span>
          <span>{timeFormatter(props.updatedAt!)}</span>
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
