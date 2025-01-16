/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from "react"
import { IUser } from "../../../../../interfaces/user"
import {
  Avatar,
  Chip,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
import { FaEye, FaUserAlt, FaUserCircle, FaUserSlash } from "react-icons/fa"
import { TfiMore } from "react-icons/tfi"
import { MdDeleteForever, MdRestore } from "react-icons/md"
import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../../../../utils"
import { UserContext } from "../.."
import DeleteDialog from "../DeleteDialog"
import ApprovalDialog from "../ApprovalDialog"
import ResetDialog from "../ResetDialog"

interface IProps {
  users?: IUser[]
}
const DesktopList: React.FC<IProps> = ({ users }) => {
  return (
    <>
      <div className="w-full overflow-x-scroll rounded-lg">
        <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
          <thead className="bg-green-50">
            <tr>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                User's Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Email Address
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Phone Number
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Role
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user, key) => (
              <Table user={user} count={++key} key={user._id} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default DesktopList

interface ITProps {
  user?: IUser
  count: number
}
const Table: React.FC<ITProps> = ({ user, count }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openDialogReset, setOpenDialogReset] = useState<boolean>(false)
  const [selectedUser, setUser] = useState<IUser>()
  const navigate = useNavigate()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [_ctx, dispatch] = useContext(UserContext)
  // set user context and navigate to edit user
  const handleEditUser = (user: IUser | undefined) => {
    dispatch(user)
    navigate("/dashboard/user-management/edit")
  }
  // open or close action dialog
  const toggleDiaglog = () => {
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }
  // open or close reset dialog
  const toggleDiaglogReset = (user?: IUser) => {
    if (user) {
      setUser(user)
    }
    setOpenDialogReset(!openDialogReset)
  }

  return (
    <>
      <DeleteDialog
        user={user}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
      <ApprovalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
        user={user}
      />
      <ResetDialog
        user={selectedUser}
        setOpenReset={setOpenDialogReset}
        toggleDiaglogReset={toggleDiaglogReset}
        openDialogReset={openDialogReset}
      />

      <tr
        className={`divide-y even:bg-[#FAFAFA] ${
          user?.isEnable ? "" : "opacity-10"
        }`}>
        <td className="w-10 pl-3">{count}</td>
        <td className="p-3 flex flex-wrap gap-1 md:gap-2 items-center capitalize tracking-wide font-bold">
          {user?.profile_img ? (
            <Avatar
              size="sm"
              src={user?.profile_img.url}
              className="mr-2 hidden xl:flex"
            />
          ) : (
            <FaUserCircle className="text-lg md:text-xl hidden xl:flex" />
          )}
          {user?.name}
        </td>
        <td className="p-3">{user?.email}</td>
        <td className="p-3">{user?.phone}</td>
        <td className="p-3">
          <Chip
            className="w-fit text-center rounded-full tracking-wide"
            color={
              user?.role === "SUPER ADMIN"
                ? "deep-orange"
                : user?.role === "DATA ANALYST"
                ? "teal"
                : user?.role === "WAREHOUSE MANAGER"
                ? "light-green"
                : user?.role === "WAREHOUSE ADMIN"
                ? "light-blue"
                : user?.role === "FINANCIAL OFFICER"
                ? "amber"
                : user?.role === "FIELD OFFICER"
                ? "blue-gray"
                : "purple"
            }
            value={user?.role}
          />
        </td>
        <td className="p-3">
          <Menu placement="bottom-start">
            <MenuHandler>
              <span className="cursor-pointer">
                <TfiMore className="text-3xl md:text-4xl" />
              </span>
            </MenuHandler>
            <MenuList>
              <MenuItem
                className="border-b-2 inline-flex gap-2"
                onClick={() =>
                  navigate("/dashboard/user-management/details", {
                    state: user,
                  })
                }>
                <FaEye size={16} /> View details
              </MenuItem>
              {currentUser.role === "SUPER ADMIN" && (
                <>
                  <MenuItem
                    onClick={() => handleEditUser(user)}
                    className="inline-flex gap-2 border-b-2">
                    <AiFillEdit size={16} /> Edit
                  </MenuItem>
                  <MenuItem onClick={() => toggleDiaglog()}>
                    {user?.isEnable ? (
                      <>
                        <FaUserSlash
                          className="mr-2 inline"
                          color="red"
                          size={16}
                        />{" "}
                        Disable
                      </>
                    ) : (
                      <>
                        <FaUserAlt className="mr-2 inline" size={16} /> Enable
                      </>
                    )}
                  </MenuItem>
                  <MenuItem
                    onClick={() => toggleDiaglogReset(user)}
                    className="inline-flex gap-2 border-b-2">
                    <MdRestore size={16} className="text-blue-400" /> Reset
                    Password
                  </MenuItem>
                  <MenuItem
                    onClick={() => toggleDelete()}
                    className="inline-flex gap-2 border-b-2">
                    <MdDeleteForever size={16} className="text-red-400" />{" "}
                    Delete
                  </MenuItem>
                </>
              )}
            </MenuList>
          </Menu>
        </td>
      </tr>
    </>
  )
}
