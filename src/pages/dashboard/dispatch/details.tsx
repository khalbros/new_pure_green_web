/* eslint-disable @typescript-eslint/no-unused-vars */
import {Drawer} from "@material-tailwind/react"
import React, {useContext} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import {DispatchContext} from "."
import {IDispatch} from "../../../interfaces/dispatch"

import {IUser} from "../../../interfaces/user"
import {IWarehouse} from "../../../interfaces/warehouse"
import {IClient} from "../../../interfaces/client"
import {ICommodity} from "../../../interfaces/commodity"
import {IGrade} from "../../../interfaces/grade"

interface IProps {
  open: boolean
  close: () => void
  dispatch?: IDispatch
}

const DispatchDetails: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(DispatchContext)

  const handleEditDispatch = () => {
    dispatch(props?.dispatch)
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
          <h3 className="font-[500]">Dispatch's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={props.close}
          />
        </div>

        {/* Dispatch details */}
        <div className="grid grid-cols-5 gap-7">
          <div className="flex flex-col gap-4 col-span-4 lg:col-span-3 capitalize">
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Status:</span>
              {props.dispatch?.status}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Dispatch Type:</span>
              {props.dispatch?.type}
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Raised by:</span>
              {(props.dispatch?.createdBy as IUser)?.name}
            </p>

            {props.dispatch?.warehouse && (
              <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                <span className="text-gray-600">Dispatch to:</span>
                {(props.dispatch?.warehouse as IWarehouse)?.name}
              </p>
            )}
            {props.dispatch?.client && (
              <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                <span className="text-gray-600">Dispatch to:</span>
                {(props.dispatch?.client as IClient)?.name}
              </p>
            )}
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600 font-bold">Commodity: </span>
              <p className="grid grid-flow-row items-start gap-2 place-content-start capitalize">
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                  <span className="text-gray-600 font-bold">Name: </span>
                  {(props.dispatch?.commodity as ICommodity)?.name}
                </p>
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                  <span className="text-gray-600 font-bold">Price: </span>
                  {Number(
                    (props.dispatch?.commodity as ICommodity)?.price
                  ).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                  <span className="text-gray-600 font-bold">Grade: </span>
                  {(props.dispatch?.grade as IGrade)?.name}
                </p>
                <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
                  <span className="text-gray-600 font-bold">% deduction: </span>
                  {(props.dispatch?.grade as IGrade)?.percentage}%
                </p>
              </p>
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600 font-bold">Number of bags: </span>
              {Number(props.dispatch?.num_bags).toLocaleString()}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Gross weight {"(kg)"}: </span>
              {Number(props.dispatch?.gross_weight).toLocaleString()}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Net weight{"(kg)"}: </span>
              {Number(props.dispatch?.net_weight).toLocaleString()}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Dirver: </span>
              {props.dispatch?.driver}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Vehicle number: </span>
              {props.dispatch?.truck_num}
            </p>
          </div>
          {props.dispatch?.status === "PENDING" && (
            <div className="" onClick={handleEditDispatch}>
              <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
                <AiFillEdit /> Edit
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Dispatch activity */}
      {/* <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Dispatch's Statistics</h4>
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
            src={props?.dispatch?.profile_img}
            className="mx-auto block"
            alt="profile image"
          />
        </DialogBody>
      </Dialog> */}
    </Drawer>
  )
}

export default DispatchDetails
