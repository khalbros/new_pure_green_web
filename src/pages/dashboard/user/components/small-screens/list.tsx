import React, { useState } from "react"
import { IUser } from "../../../../../interfaces/user"
import { useNavigate } from "react-router-dom"
import { Avatar, Button } from "@material-tailwind/react"
import { FaMinusCircle, FaUserCircle } from "react-icons/fa"
import { MdCheckCircle, MdDeleteForever } from "react-icons/md"
import DeleteDialog from "../DeleteDialog"

interface IProps {
  users?: IUser[]
}
const MobileList: React.FC<IProps> = ({ users }) => {
  return (
    <div className="divide-y mb-4">
      {users?.map((user) => (
        <MobileCard user={user} key={user._id} />
      ))}
    </div>
  )
}

export default MobileList

interface ICardProps {
  user?: IUser
}
const MobileCard: React.FC<ICardProps> = ({ user }) => {
  const navigate = useNavigate()
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }
  return (
    <>
      <div className="relative mr-5 py-2">
        <Button
          ripple
          variant="text"
          className={`flex w-full justify-between items-center p-1 gap-2 cursor-pointer`}
          onClick={() =>
            navigate("/dashboard/user-management/details", { state: user })
          }>
          <div className="relative flex items-center capitalize tracking-wide font-bold">
            {user?.profile_img?.url ? (
              <Avatar size="md" src={user?.profile_img?.url} className="mr-2" />
            ) : (
              <FaUserCircle className="mr-3 text-3xl md:text-4xl" />
            )}
            <div className="flex flex-1 w-full flex-col text-start md:gap-1 text-[0.8rem] md:text-[1.2rem]">
              <span>{user?.name}</span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.7rem] md:text-[1rem]">
                {user?.email}
              </span>
              <span className="text-gray-500 tracking-wider font-bold text-[0.65rem] md:text-[0.9rem]">
                {user?.phone}
              </span>
              <span
                className={`font-bold ${
                  user?.role === "SUPER ADMIN"
                    ? "text-deep-orange-500"
                    : user?.role === "DATA ANALYST"
                    ? "text-teal-900"
                    : user?.role === "WAREHOUSE MANAGER"
                    ? "text-light-green-500"
                    : user?.role === "WAREHOUSE ADMIN"
                    ? "text-light-blue-500"
                    : user?.role === "FINANCIAL OFFICER"
                    ? "text-amber-500"
                    : user?.role === "FIELD OFFICER"
                    ? "text-blue-gray-500"
                    : "text-purple-500"
                }`}>
                {user?.role}
              </span>
            </div>
            <div
              className={`absolute flex flex-col top-7 left-4 rounded-full border bg-${
                user?.isEnable ? "green" : "gray"
              }-50`}>
              {user?.isEnable ? (
                <MdCheckCircle
                  color="green"
                  className="text-center rounded-full text-xl text-green-500"
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
        user={user}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </>
  )
}
