/* eslint-disable @typescript-eslint/no-unused-vars */
import {Drawer} from "@material-tailwind/react"
import React, {useContext, useMemo} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import {IDisbursement} from "../../../../interfaces/disbursement"
import {DisbursementContext} from "."
import {getUser, timeFormatter} from "../../../../utils"
import {IFarmer} from "../../../../interfaces/farmer"
import {IBundle} from "../../../../interfaces/bundle"
import {IUser} from "../../../../interfaces/user"
import {ICashLRP, ICashLRPPayload} from "../../../../interfaces/cashLRP"
import {ICooperative} from "../../../../interfaces/cooperative"
import {IWarehouse} from "../../../../interfaces/warehouse"

interface IProps {
  open: boolean
  close: () => void
  disbursement?: ICashLRP
}

const CashDisbursementDetails: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(DisbursementContext)
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])

  const handleEditDisbursement = () => {
    dispatch(props.disbursement)
    navigate("/dashboard/payment/loan/edit")
  }

  return (
    <Drawer
      open={props.open}
      size={700}
      onClose={props.close}
      placement="right"
      className="overflow-y-scroll">
      <div className="px-6 py-10">
        <div className="flex justify-between mb-12">
          <h3 className="font-[500]">Disbursement's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={props.close}
          />
        </div>

        {/* Disbursement details */}
        <div className="grid grid-cols-5 gap-7">
          <div className="flex flex-1 flex-col gap-4 col-span-4 lg:col-span-3 whitespace-nowrap">
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Status :</span>
              {props.disbursement?.status}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Reference Number :</span>
              {props.disbursement?.ref_id}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Farmer Name :</span>
              {
                (
                  (props.disbursement?.disbursement as unknown as IDisbursement)
                    ?.farmer as IFarmer
                )?.name
              }
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Farmer ID :</span>
              {
                (
                  (props.disbursement?.disbursement as unknown as IDisbursement)
                    ?.farmer as IFarmer
                )?.farmer_id
              }
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Cooperative :</span>
              {
                (
                  (
                    (
                      props.disbursement
                        ?.disbursement as unknown as IDisbursement
                    )?.farmer as IFarmer
                  )?.cooperative as ICooperative
                )?.name
              }
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Warehouse :</span>
              {
                (
                  (props.disbursement?.disbursement as unknown as IDisbursement)
                    ?.warehouse as IWarehouse
                )?.name
              }
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Bundle :</span>
              {
                (
                  (props.disbursement?.disbursement as unknown as IDisbursement)
                    ?.bundle as IBundle
                )?.name
              }
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Hectares :</span>
              {
                (props?.disbursement?.disbursement as unknown as IDisbursement)
                  ?.hectares
              }
              Ha
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Loan amount :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.disbursement?.loan_amount?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Equity :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.disbursement?.equity?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Repayment amount :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.disbursement?.repayment_amount?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Processing Fee :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.processing_fee?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Logistics Fee :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.logistics_fee?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Cash Paid :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.cash_paid?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Outstanding amount :</span>
              {(
                props.disbursement as ICashLRPPayload
              )?.outstanding_loan?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Overage amount :</span>
              {(props.disbursement as ICashLRPPayload)?.overage?.toLocaleString(
                "en-NG",
                {
                  style: "currency",
                  currency: "NGN",
                }
              )}
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Booked By :</span>
              {
                (
                  (props.disbursement as ICashLRPPayload)?.disbursement
                    ?.disbursedBy as IUser
                )?.name
              }
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Repayed By :</span>
              {(props.disbursement as ICashLRPPayload)?.repayedBy?.name}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Date:</span>

              {timeFormatter(props.disbursement?.createdAt as string)}
            </p>
          </div>
          {currentUser?.role === "SUPER ADMIN" ||
            currentUser?.role === "WAREHOUSE ADMIN" ||
            (currentUser.role === "DATA ANALYST" && (
              <div className="" onClick={handleEditDisbursement}>
                <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
                  <AiFillEdit /> Edit
                </span>
              </div>
            ))}
        </div>
      </div>
      {/* Disbursement activity */}
      <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Disbursement's Statistics</h4>
        {/* <div className="p-4 w-full border rounded-lg">
          <div className="flex gap-[11px] mb-4">
            <p className="text-gray-700 flex-1">No of rides completed </p>
            <select name="" id="">
              <option value="">2023</option>
            </select>
            <select className="bg-gray-100 p-1 rounded" name="" id="">
              <option value="">Weekly</option>
            </select>
          </div>

          <div className="flex justify-center gap-[5px] mb-[30px]">
            <select name="" id="">
              <option value="">Jan 1 - Jan 7</option>
            </select>
            <p className="bg-gray-100 p-1 rounded" id="">
              Week total: 30
            </p>
          </div>

          <div className="flex justify-between">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((key) => (
              <div key={key} className="inline-flex flex-col items-center">
                <div
                  className={`w-[7px] bg-[#546E7A] h-[126px] rounded-t-lg mb-[6px]`}></div>
                <p>{key}</p>
              </div>
            ))}
          </div>
        </div> */}
      </div>
    </Drawer>
  )
}

export default CashDisbursementDetails
