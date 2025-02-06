import React, { useState } from "react"
import { IInput } from "../../../../interfaces/input"
import { useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import DeleteDialog from "./DeleteDialog"

interface IProps {
  inputs?: IInput[]
}
const MobileList: React.FC<IProps> = ({ inputs }) => {
  return (
    <div className="flex flex-col gap-2 ">
      {inputs?.map((input) => (
        <MobileCard input={input} />
      ))}
    </div>
  )
}

export default MobileList

interface ICardProps {
  input?: IInput
}
const MobileCard: React.FC<ICardProps> = ({ input }) => {
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }

  return (
    <>
      <div className="relative mr-5">
        <Button
          ripple
          variant="text"
          className={`flex flex-1 w-full justify-between divide-x-2 p-1 gap-2 cursor-pointer`}
          onClick={() =>
            navigate("/dashboard/warehouse-input-management/details", {
              state: input,
            })
          }>
          <div className="relative flex w-full items-center justify-between capitalize tracking-wide font-bold gap-2">
            <div
              className={`flex flex-col top-7 left-4 rounded-full border bg-${
                input?.isApproved ? "green" : "red"
              }-50`}>
              {input?.isApproved ? (
                <MdCheckCircle
                  color="green"
                  className="text-center rounded-full text-xl text-green-500"
                />
              ) : (
                <MdCancel
                  color="red"
                  className="text-center rounded-full text-xl text-red-500"
                />
              )}
            </div>
            <div className="flex flex-col text-start md:gap-1 text-[0.9rem] md:text-[1.3rem] w-full">
              <span className="font-bold">{input?.name}</span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.65rem] md:text-[0.9rem]">
                Available
              </span>
              <span className="text-gray-700 tracking-wider font-extrabold text-[0.7rem] md:text-[0.9rem] truncate w-24 md:w-fit">
                # {Number(input?.quantity ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-start items-start gap-[2px] px-1 pl-2 w-full"></div>
        </Button>
        <div
          className="absolute flex flex-col top-[5px] -right-5 p-1 rounded-full bg-red-50"
          onClick={toggleDelete}>
          <MdDeleteForever
            color="red"
            className="text-center rounded-full text-2xl text-red-500"
          />
        </div>
        <div
          className="absolute flex flex-col top-[5px] -right-5 p-1 rounded-full bg-red-50"
          onClick={toggleDelete}>
          <MdDeleteForever
            color="red"
            className="text-center rounded-full text-2xl text-red-500"
          />
        </div>
      </div>
      <DeleteDialog
        input={input}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </>
  )
}
