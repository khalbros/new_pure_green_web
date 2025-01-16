import React, { useState } from "react"
import { ICooperative } from "../../../../../interfaces/cooperative"
import { useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import DeleteDialog from "../DeleteDialog"

interface IProps {
  cooperativies?: ICooperative[]
}
const MobileList: React.FC<IProps> = ({ cooperativies }) => {
  return (
    <div className="flex flex-col gap-2">
      {cooperativies?.map((cooperative) => (
        <MobileCard cooperative={cooperative} />
      ))}
    </div>
  )
}

export default MobileList

interface ICardProps {
  cooperative?: ICooperative
}
const MobileCard: React.FC<ICardProps> = ({ cooperative }) => {
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
            navigate("/dashboard/cooperative-management/details", {
              state: cooperative,
            })
          }
        >
          <div className="relative flex w-full items-center justify-between capitalize tracking-wide font-bold gap-2">
            <div
              className={`flex flex-col top-7 left-4 rounded-full border bg-${
                cooperative?.isApproved ? "green" : "red"
              }-50`}
            >
              {cooperative?.isApproved ? (
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
            <div className="flex flex-col text-start md:gap-1 text-[0.8rem] md:text-[1.2rem] w-full">
              <span>{cooperative?.name}</span>
              {/* <span className="text-gray-500 tracking-wider font-bold text-[0.65rem] md:text-[0.9rem]">
                {(cooperative?.warehouse as IWarehouse)?.name}
              </span> */}
              <span className="text-gray-500 tracking-wider font-bold text-[0.7rem] md:text-[1rem]">
                {cooperative?.village}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-start items-start gap-1 px-1 pl-2 w-full">
            <span className="text-gray-500 tracking-wider font-bold text-[0.7rem] md:text-[1rem]">
              {cooperative?.chairman}
            </span>
            <span className="text-gray-500 tracking-wider font-bold text-[0.65rem] md:text-[0.9rem]">
              {cooperative?.phone}
            </span>
          </div>
        </Button>
        <div
          className="absolute flex flex-col top-[5px] -right-5 p-1 rounded-full bg-red-50"
          onClick={toggleDelete}
        >
          <MdDeleteForever
            color="red"
            className="text-center rounded-full text-2xl text-red-500"
          />
        </div>
      </div>
      <DeleteDialog
        cooperative={cooperative}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </>
  )
}
