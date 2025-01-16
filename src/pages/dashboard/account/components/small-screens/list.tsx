import React, { useState } from "react"
import { IFarmer } from "../../../../../interfaces/farmer"
import { useNavigate } from "react-router-dom"
import { Avatar, Button } from "@material-tailwind/react"
import { FaMinusCircle, FaUserCircle } from "react-icons/fa"
import { ICooperative } from "../../../../../interfaces/cooperative"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import DeleteDialog from "../DeleteDialog"

interface IProps {
  farmers?: IFarmer[]
}
const MobileList: React.FC<IProps> = ({ farmers }) => {
  return (
    <div className="">
      {farmers?.map((farmer) => (
        <MobileCard farmer={farmer} />
      ))}
    </div>
  )
}

export default MobileList

interface ICardProps {
  farmer?: IFarmer
}
const MobileCard: React.FC<ICardProps> = ({ farmer }) => {
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
          className={`flex w-full justify-between divide-x-2 p-1 gap-2 cursor-pointer`}
          onClick={() =>
            navigate("/dashboard/farmer-management/details", { state: farmer })
          }
        >
          <div className="relative flex items-center capitalize tracking-wide font-bold">
            {farmer?.profile_img?.url ? (
              <Avatar
                size="md"
                src={farmer?.profile_img?.url}
                className="mr-2"
              />
            ) : (
              <FaUserCircle className="mr-3 text-3xl md:text-4xl" />
            )}
            <div className="flex flex-col text-start md:gap-1 text-[0.8rem] md:text-[1.2rem]">
              <span>
                {farmer?.first_name +
                  ` ${farmer?.other_name && farmer.other_name} ` +
                  farmer?.last_name}
              </span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.7rem] md:text-[1rem]">
                {farmer?.farmer_id}
              </span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.65rem] md:text-[0.9rem]">
                {(farmer?.cooperative as ICooperative)?.name}
              </span>
            </div>
            <div
              className={`absolute flex flex-col top-7 left-4 rounded-full border bg-${
                farmer?.isApproved === "REJECTED"
                  ? "red"
                  : farmer?.isApproved === "APPROVED"
                  ? "green"
                  : "gray"
              }-50`}
            >
              {farmer?.isApproved === "APPROVED" ? (
                <MdCheckCircle
                  color="green"
                  className="text-center rounded-full text-xl text-green-500"
                />
              ) : farmer?.isApproved === "REJECTED" ? (
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
          <div className="flex flex-col ite gap-1 px-1 pl-2">
            <span className="flex gap-1 items-center justify-between">
              <span className="text-[0.65rem] md:text-[0.77rem] uppercase">
                Reg.
              </span>
              {Number(farmer?.reg_amount) > 0 ? (
                <span className="text-green-400 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-green-100">
                  paid
                </span>
              ) : (
                <span className="text-red-400 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-red-100">
                  not paid
                </span>
              )}
            </span>
            <span className="flex gap-1 items-center justify-between">
              <span className="text-[0.65rem] md:text-[0.77rem] uppercase">
                Equity.
              </span>
              {Number(farmer?.equity_amount) > 0 ? (
                <span className="text-green-400 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-green-100">
                  paid
                </span>
              ) : (
                <span className="text-red-400 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-red-100">
                  not paid
                </span>
              )}
            </span>
            <span className="flex gap-1 items-center justify-between">
              <span className="text-[0.65rem] md:text-[0.77rem] uppercase">
                Loan.
              </span>
              {farmer?.hasLoan === "PAID" ? (
                <span className="text-green-400 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-green-100">
                  {farmer.hasLoan}
                </span>
              ) : farmer?.hasLoan === "NONE" ? (
                <span className="text-gray-500 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-gray-100">
                  {farmer?.hasLoan}
                </span>
              ) : (
                <span className="text-orange-500 uppercase tracking-wide text-[0.65rem] md:text-[0.77rem] px-2 rounded-full bg-orange-100">
                  {farmer?.hasLoan}
                </span>
              )}
            </span>
          </div>
        </Button>
        <div
          className="absolute flex flex-col top-4 -right-5 p-1 rounded-full bg-red-50"
          onClick={toggleDelete}
        >
          <MdDeleteForever
            color="red"
            className="text-center rounded-full text-2xl text-red-500"
          />
        </div>
      </div>
      <DeleteDialog
        farmer={farmer}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </>
  )
}
