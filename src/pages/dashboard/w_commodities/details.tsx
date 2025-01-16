/* eslint-disable @typescript-eslint/no-unused-vars */
import {Drawer} from "@material-tailwind/react"
import React, {useContext} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import {ICommodity} from "../../../interfaces/commodity"
import {WCommodityContext} from "."

interface IProps {
  open: boolean
  close: () => void
  commodity?: ICommodity
}

const CommodityDetails: React.FC<IProps> = (props) => {
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(WCommodityContext)

  const handleEditCommodity = () => {
    dispatch(props.commodity)
    navigate("/dashboard/commodity-management/edit")
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
          <h3 className="font-[500]">Commodity's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={props.close}
          />
        </div>

        {/* Commodity details */}
        <div className="grid grid-cols-5 gap-7">
          <div className="flex flex-1 flex-col gap-4 col-span-4 lg:col-span-3 whitespace-nowrap">
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Commodity Name:</span>
              {props.commodity?.name}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Price:</span>
              <span>Loan:</span> {props.commodity?.price?.loan}
              <span>Trade:</span> {props.commodity?.price?.trade}
              <span>Storage:</span> {props.commodity?.price?.storage}
            </p>
          </div>
          <div className="" onClick={handleEditCommodity}>
            <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
              <AiFillEdit /> Edit
            </span>
          </div>
        </div>
      </div>
      {/* Commodity activity */}
      <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Commodity's Statistics</h4>
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

export default CommodityDetails
