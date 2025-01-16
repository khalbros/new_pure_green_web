/* eslint-disable @typescript-eslint/no-unused-vars */
import { Drawer } from "@material-tailwind/react"
import React, { useContext } from "react"
import { AiFillEdit } from "react-icons/ai"
import { MdCancel } from "react-icons/md"
import { useNavigate } from "react-router-dom"
import { RegistrationContext } from "."
import { IEquity } from "../../../../interfaces/equity"
import { IUser } from "../../../../interfaces/user"
import { IFarmer } from "../../../../interfaces/farmer"
import { shortDateFormatter } from "../../../../utils/index"

interface IProps {
  open: boolean
  close: () => void
  payment?: IEquity
}

const RegDetails: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(RegistrationContext)

  const handleEditTransaction = () => {
    dispatch(props?.payment)
    navigate("edit")
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
          <h3 className="font-[500]">Transaction's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={props.close}
          />
        </div>

        {/* Transaction details */}
        <div className="grid grid-cols-5 gap-7">
          <div className="flex flex-col gap-4 col-span-4 lg:col-span-3 capitalize">
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Payment status:</span>
              {props.payment?.status ? "PAID" : "NOT PAID"}
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Paid by:</span>
              {(props.payment?.paid_by as IUser)?.name}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Farmer:</span>
              {(props.payment?.farmer as IFarmer)?.first_name}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Farmer ID:</span>
              {(props.payment?.farmer as IFarmer)?.farmer_id}
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize tracking-wide">
              <span className="text-gray-600 font-bold"> Amount Paid:</span>
              {Number(props.payment?.amount_paid).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize tracking-wide">
              <span className="text-gray-600 font-bold"> Date:</span>
              {props.payment?.updatedAt &&
                shortDateFormatter(props.payment?.updatedAt)}
            </p>
          </div>
          <div className="" onClick={handleEditTransaction}>
            <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
              <AiFillEdit /> Edit
            </span>
          </div>
        </div>
      </div>
      {/* Transaction activity */}
    </Drawer>
  )
}

export default RegDetails
