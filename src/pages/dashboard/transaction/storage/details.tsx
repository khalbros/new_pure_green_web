/* eslint-disable @typescript-eslint/no-unused-vars */
import {Drawer} from "@material-tailwind/react"
import React, {useContext} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import {TransactionContext} from "../"
import {ITransaction} from "../../../../interfaces/transaction"
import {IUser} from "../../../../interfaces/user"
import {ICommodity} from "../../../../interfaces/commodity"
import {IGrade} from "../../../../interfaces/grade"

interface IProps {
  open: boolean
  close: () => void
  transaction?: ITransaction
}

const TransactionDetails: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(TransactionContext)

  const handleEditTransaction = () => {
    dispatch(props?.transaction)
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
              <span className="text-gray-600">Transaction status:</span>
              {props.transaction?.status}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Transaction Type:</span>
              {props.transaction?.type}
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Raised by:</span>
              {(props.transaction?.createdBy as IUser)?.name}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Client:</span>
              {(props.transaction?.client as IUser)?.name}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600 font-bold">Commodity: </span>
              <p className="grid grid-flow-row items-start gap-2 place-content-start capitalize">
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                  <span className="text-gray-600 font-bold">Name: </span>
                  {(props.transaction?.commodity as ICommodity)?.name}
                </p>
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize tracking-wide">
                  <span className="text-gray-600 font-bold">
                    Price per {"kg"}:{" "}
                  </span>
                  {Number(
                    (props.transaction?.commodity as ICommodity)?.price
                  ).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                  <span className="text-gray-600 font-bold">Grade: </span>
                  {(props.transaction?.grade as IGrade)?.name}
                </p>
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize tracking-wide">
                  <span className="text-gray-600 font-bold">% deduction: </span>
                  {(props.transaction?.grade as IGrade)?.percentage}%
                </p>
              </p>
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600 font-bold">Number of bags: </span>
              {Number(props.transaction?.num_bags).toLocaleString()}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Gross weight {"(kg)"}: </span>
              {Number(props.transaction?.gross_weight).toLocaleString()}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Net weight{"(kg)"}: </span>
              {Number(props.transaction?.net_weight).toLocaleString()}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize tracking-wide">
              <span className="text-gray-600 font-bold">Payable amount:</span>
              {Number(props.transaction?.amount).toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Dirver: </span>
              {props.transaction?.driver}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Vehicle number: </span>
              {props.transaction?.truck_number}
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
      {/* <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Transaction's Statistics</h4>
        <div className="p-4 w-full border rounded-lg">
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (key, index) => (
                <div key={key} className="inline-flex flex-col items-center">
                  <div
                    className={`w-[7px] bg-[#546E7A] h-[126px] rounded-t-lg mb-[6px]`}></div>
                  <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">{key}</p>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      <Dialog size="sm" open={open} handler={() => setOpen(!open)}>
        <DialogBody className="">
          <div className="flex justify-end">
            {" "}
            <MdCancel
              className="cursor-pointer"
              size={20}
              onClick={() => setOpen(!open)}
            />{" "}
          </div>
          <img
            src={props?.transaction?.profile_img}
            className="mx-auto block"
            alt="profile image"
          />
        </DialogBody>
      </Dialog> */}
    </Drawer>
  )
}

export default TransactionDetails
