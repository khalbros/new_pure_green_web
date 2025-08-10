/* eslint-disable @typescript-eslint/no-unused-vars */
import { Drawer } from "@material-tailwind/react"
import React, { useContext, useMemo } from "react"
import { MdCancel } from "react-icons/md"
import { IVisitation } from "../../../interfaces/visitation"

import { IUser } from "../../../interfaces/user"
import { getTimeAgo, getUser, shortDateFormatter } from "../../../utils"
import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { VisitationContext } from "."

interface IProps {
  open: boolean
  close: () => void
  visitation?: IVisitation
}

interface IUpload {
  url: string
  public: string
}

const VisitationDetails: React.FC<IProps> = (props) => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(VisitationContext)

  const handleEditVisitation = () => {
    dispatch(props.visitation)
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
          <h3 className="font-[500]">Visitation's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={30}
            onClick={props.close}
          />
        </div>

        {/* Visitation details */}
        <div className="grid grid-cols-5 gap-7">
          <div className="flex flex-1 flex-col gap-4 col-span-4 lg:col-span-3 whitespace-nowrap">
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize font-bold">
              <span className="text-gray-600">Visitation:</span>
              {props.visitation?.visitation_count === 1
                ? "1st"
                : props.visitation?.visitation_count === 2
                ? "2nd"
                : "3rd"}
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Visitation date:</span>
              <span className="capitalize">
                {getTimeAgo(props.visitation?.createdAt as string)}
              </span>
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Supervisor:</span>
              <span className="capitalize">
                {(props.visitation?.visited_by as IUser)?.name}
              </span>
            </p>

            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Commodities:</span>
              <span className="flex flex-col gap-1">
                {props.visitation?.commodity?.map((commodity) => (
                  <span className="capitalize" key={commodity}>
                    {commodity}
                  </span>
                ))}
              </span>
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Expected havest date:</span>
              <span className="capitalize">
                {shortDateFormatter(props.visitation?.havest_date as string)}
              </span>
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Status:</span>
              <span className="capitalize">{props.visitation?.status}</span>
            </p>
            <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
              <span className="text-gray-600">Comment:</span>
              <span className="capitalize">{props.visitation?.comment}</span>
            </p>
          </div>
          {props.visitation?.visited_by === currentUser?._id ? (
            <div className="" onClick={handleEditVisitation}>
              <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
                <AiFillEdit /> Edit
              </span>
            </div>
          ) : null}
        </div>
      </div>
      {/* Visitation activity */}
      <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Farm location</h4>
        <p className="grid grid-flow-col items-start gap-2 place-content-start capitalize">
          {/* <span className="text-gray-600">Coodinates:</span>
          <span className="flex gap-1">
            <span className="text-gray-600">Latitude:</span>
            <span className="capitalize">
              {props.visitation?.farm_location?.lat}
            </span>
          </span>
          <span className="flex gap-1">
            <span className="text-gray-600">Longitude:</span>
            <span className="capitalize">
              {props.visitation?.farm_location?.lng}
            </span>
          </span> */}
          <span className="capitalize">
            {props.visitation?.farm_location?.lat}
          </span>
        </p>
        <div className="p-4 w-full border rounded-lg">
          <img
            src={String((props.visitation?.upload as unknown as IUpload).url)}
            alt="farm picture"
          />
        </div>
      </div>
    </Drawer>
  )
}

export default VisitationDetails
