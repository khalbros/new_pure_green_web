import React, { useState } from "react"
import { IClient } from "../../../../../interfaces/client"
import { useNavigate } from "react-router-dom"
import { Avatar, Button } from "@material-tailwind/react"
import { FaMinusCircle, FaUserCircle } from "react-icons/fa"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import DeleteDialog from "../DeleteDialog"

interface IProps {
  clients?: IClient[]
}
const MobileList: React.FC<IProps> = ({ clients }) => {
  return (
    <div className="">
      {clients?.map((client) => (
        <MobileCard client={client} key={client._id} />
      ))}
    </div>
  )
}

export default MobileList

interface ICardProps {
  client?: IClient
}
const MobileCard: React.FC<ICardProps> = ({ client }) => {
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }
  return (
    <>
      <div className="relative mr-5 border-t first:border-none">
        <Button
          ripple
          variant="text"
          className={`flex w-full justify-between divide-x-2 px-1 py-2 gap-2 cursor-pointer`}
          onClick={() =>
            navigate("/dashboard/client-management/details", { state: client })
          }>
          <div className="relative flex items-center capitalize tracking-wide font-bold">
            {client?.profile_img?.url ? (
              <Avatar
                size="xl"
                src={client?.profile_img?.url}
                className="mr-2"
              />
            ) : (
              <FaUserCircle className="mr-3 text-4xl md:text-5xl" />
            )}
            <div className="flex flex-col text-start gap-[2px] md:gap-1 text-[0.8rem] md:text-[1.2rem] ml-2">
              <span className="text-ellipsis text-pretty truncate">
                {client?.name}
              </span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.7rem] md:text-[1rem]">
                {client?.client_id}
              </span>
              <span className="text-ellipsis text-pretty truncate">
                {client?.phone}
              </span>
            </div>
            <div
              className={`absolute flex flex-col top-7 left-4 rounded-full border bg-${
                client?.isApproved ? "green" : "red"
              }-50`}>
              {client?.isApproved ? (
                <MdCheckCircle
                  color="green"
                  className="text-center rounded-full text-xl text-green-500"
                />
              ) : !client?.isApproved ? (
                <MdCancel
                  color="red"
                  className="text-center rounded-full text-xl text-red-500"
                />
              ) : (
                <FaMinusCircle
                  color="gray"
                  className="text-center rounded-full text-xl text-gray-500"
                />
              )}
            </div>
          </div>
        </Button>
        <div
          className="absolute flex flex-col top-4 -right-5 p-1 rounded-full bg-red-50"
          onClick={toggleDelete}>
          <MdDeleteForever
            color="red"
            className="text-center rounded-full text-2xl text-red-500"
          />
        </div>
      </div>
      <DeleteDialog
        client={client}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </>
  )
}
