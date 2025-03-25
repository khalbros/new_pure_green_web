import logo from "../../../../assets/puregreen-logo.png"
import { IUser } from "../../../../interfaces/user"
import { timeFormatter } from "../../../../utils"
import { IFarmer } from "../../../../interfaces/farmer"
import { IBundle } from "../../../../interfaces/bundle"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { IDisbursement } from "../../../../interfaces/disbursement"

function Receipt(props: IDisbursement) {
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
        Pure Green Agro-chemicals nig ltd
      </p>
      <div className="flex flex-col divide-y mt-4">
        <div className="flex items-ceter justify-between">
          <span>Purpose</span>
          <span>Loan Disbursement</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Reference ID</span>
          <span>{props.ref_id}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Farmer</span>
          <span>{(props.farmer as IFarmer)?.first_name}</span>
        </div>

        <div className="flex items-ceter justify-between">
          <span>Farmer ID</span>
          <span>{(props.farmer as IFarmer)?.farmer_id}</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Cooperative</span>
          <span>
            {((props.farmer as IFarmer)?.cooperative as ICooperative)?.name}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Warehouse</span>
          <span>{(props.warehouse as IWarehouse)?.name}</span>
        </div>
        {props.bundle && (
          <>
            <div className="flex items-ceter justify-between">
              <span>Bundle</span>
              <span>{(props.bundle as IBundle)?.name}</span>
            </div>
            <div className="flex items-ceter justify-between">
              <span className="">Inputs</span>
              <span className="flex flex-col items-end flex-wrap divide-y">
                {(props?.bundle as IBundle)?.inputs?.map((input) => (
                  <span className="flex flex-wrap gap-1" key={input._id}>
                    <span className="capitalize">
                      {input.input}
                      <span className="capitalize">
                        {` (${input.quantity * props.hectares!})`}{" "}
                      </span>
                    </span>
                  </span>
                ))}
              </span>
            </div>
          </>
        )}
        <div className="flex items-ceter justify-between">
          <span>Hectares</span>
          <span>{props.hectares}Ha</span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Total Loan</span>
          <span>
            {Number(props.loan_amount)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Equity Paid</span>
          <span>
            {Number(props.equity)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        <div className="flex items-ceter justify-between">
          <span>Repayment Value</span>
          <span>
            {Number(props.repayment_amount)?.toLocaleString("en-NG", {
              style: "currency",
              currency: "NGN",
            })}
          </span>
        </div>
        {props?.payable_amount && (
          <div className="flex items-ceter justify-between">
            <span>Amount Payable</span>
            <span>
              {Number(props.payable_amount)?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
          </div>
        )}

        {props?.outstanding_loan ? (
          props.outstanding_loan > 0 && (
            <div className="flex items-ceter justify-between">
              <span>Outstanding Loan</span>
              <span>
                {Number(props.outstanding_loan)?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </span>
            </div>
          )
        ) : (
          <></>
        )}
        {props?.overage ? (
          props.overage > 0 && (
            <div className="flex items-ceter justify-between">
              <span>Overages</span>
              <span>
                {Number(props.overage)?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </span>
            </div>
          )
        ) : (
          <></>
        )}

        <div className="flex items-ceter justify-between">
          <span>Booked By</span>
          <span>{(props.disbursedBy as IUser)?.name}</span>
        </div>
        {props.repayedBy && (
          <div className="flex items-ceter justify-between">
            <span>Repayed by </span>
            <span>{(props.repayedBy as IUser)?.name}</span>
          </div>
        )}
        {props.repayment_type && (
          <div className="flex items-ceter justify-between">
            <span>Payment Type</span>
            <span>{props.repayment_type}</span>
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
