import React, { useState } from "react"
import { IWarehouse } from "../../../../../interfaces/warehouse"
import { useNavigate } from "react-router-dom"
import { Button } from "@material-tailwind/react"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import DeleteDialog from "../DeleteDialog"
import { IUser } from "../../../../../interfaces/user"

interface IProps {
  warehouses?: IWarehouse[]
}
const MobileList: React.FC<IProps> = ({ warehouses }) => {
  return (
    <div className="flex flex-col gap-2 ">
      {warehouses?.map((warehouse) => (
        <MobileCard warehouse={warehouse} />
      ))}
    </div>
  )
}

export default MobileList

interface ICardProps {
  warehouse?: IWarehouse
}
const MobileCard: React.FC<ICardProps> = ({ warehouse }) => {
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
            navigate("/dashboard/warehouse-management/details", {
              state: warehouse,
            })
          }>
          <div className="relative flex w-full items-center justify-between capitalize tracking-wide font-bold gap-2">
            <div
              className={`flex flex-col top-7 left-4 rounded-full border bg-${
                warehouse?.isApproved ? "green" : "red"
              }-50`}>
              {warehouse?.isApproved ? (
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
              <span>{warehouse?.name}</span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.65rem] md:text-[0.9rem]">
                # {warehouse?.capacity}
              </span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.6rem] md:text-[0.8rem] truncate w-24 md:w-fit">
                {(warehouse?.warehouse_manager?.[0] as IUser)?.name}
              </span>
            </div>
          </div>
          <div className="flex flex-col text-start items-start gap-[2px] px-1 pl-2 w-full">
            <span className="text-gray-500 tracking-wider font-bold text-[0.7rem] md:text-[1rem]">
              {warehouse?.state}
            </span>
            <span className="text-gray-500 tracking-wider font-bold text-[0.6rem] md:text-[0.9rem]">
              {warehouse?.lga}
            </span>
          </div>
        </Button>
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
        warehouse={warehouse}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </>
  )
}
