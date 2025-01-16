/* eslint-disable @typescript-eslint/no-unused-vars */
import {Drawer} from "@material-tailwind/react"
import React, {useContext, useEffect, useState} from "react"
import {AiFillEdit} from "react-icons/ai"
import {MdCancel} from "react-icons/md"
import {useNavigate} from "react-router-dom"
import {IClient} from "../../../interfaces/client"
import {ClientContext} from "."
import {FcPicture} from "react-icons/fc"
import {IDispatch} from "../../../interfaces/dispatch"
import {fetchData} from "../../../utils"
import {useQuery} from "react-query"

interface IProps {
  open: boolean
  close: () => void
  client?: IClient
}

const ClientDetails: React.FC<IProps> = (props) => {
  const [clientDispatch, setClientDispatch] = useState<IDispatch[]>()
  const [open, setOpen] = useState(false)

  const {data} = useQuery({
    queryKey: ["dispatch", props.client?._id],
    queryFn: async () => {
      return fetchData(`/dispatch`).then((res) => res.data)
    },
  })
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(ClientContext)

  const handleEditClient = () => {
    dispatch(props.client)
    navigate("/dashboard/client-management/edit")
  }

  useEffect(() => {
    const dispatches = data?.filter(
      (dis: IDispatch) => dis.client === props.client?._id
    )
    setClientDispatch(dispatches)
    return () => {}
  }, [])

  return (
    <Drawer
      open={props.open}
      size={700}
      onClose={props.close}
      placement="right"
      className="overflow-y-scroll">
      <div className="px-6 py-10">
        <div className="flex justify-between mb-12">
          <h3 className="font-[500]">Client's details</h3>
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={props.close}
          />
        </div>

        {/* Client details */}
        <div className="grid grid-cols-5 gap-7">
          <div
            className="grid place-items-center h-28 bg-gray-50 hover:transform hover:scale-125 transition-transform duration-300 ease-linear"
            onClick={() => setOpen(!open)}>
            {props.client?.profile_img ? (
              <img src={props.client.profile_img} alt="id card" />
            ) : (
              <FcPicture size={35} color="red" />
            )}
          </div>
          <div className="flex flex-col gap-4 col-span-3 capitalize">
            <p className="font-bold tracking-[0.5 px] capitalize">
              <span className="text-gray-600">Full Name</span>:{" "}
              {props.client?.name}
            </p>

            <p className="lowercase">
              <span className="text-gray-600">Email</span>:{" "}
              {props.client?.email}
            </p>
            <p>
              <span className="text-gray-600">Phone number</span>:{" "}
              {props.client?.phone}
            </p>
            <p>
              <span className="text-gray-600">Address</span>:{" "}
              {props.client?.address}
            </p>
            {clientDispatch && (
              <p>
                <span className="text-gray-600">Client Dispatches</span>:{" "}
                {clientDispatch.map((dis) => (
                  <span>{dis.status} </span>
                ))}
              </p>
            )}
          </div>
          <div className="" onClick={handleEditClient}>
            <span className="cursor-pointer rounded p-1 flex gap-2 items-center bg-gray-100">
              <AiFillEdit /> Edit
            </span>
          </div>
        </div>
      </div>
      {/* Client activity */}
      <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">Client's Statistics</h4>
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
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((key) => (
              <div key={key} className="inline-flex flex-col items-center">
                <div
                  className={`w-[7px] bg-[#546E7A] h-[126px] rounded-t-lg mb-[6px]`}></div>
                <p>{key}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default ClientDetails
