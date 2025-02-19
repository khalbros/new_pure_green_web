/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from "react"
import { IFarmer } from "../../../../../interfaces/farmer"
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
import { FaEye, FaUserCircle } from "react-icons/fa"
import { ICooperative } from "../../../../../interfaces/cooperative"
import { ITeam } from "../../../../../interfaces/team"
import { TfiMore } from "react-icons/tfi"
import { MdCancel, MdDeleteForever } from "react-icons/md"
import { IoMdCheckmarkCircle } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../../../../utils"
import { FarmerContext } from "../.."
import DeleteDialog from "../DeleteDialog"
import ApprovalDialog from "../ApprovalDialog"

interface IProps {
  farmers?: IFarmer[]
}
const DesktopList: React.FC<IProps> = ({ farmers }) => {
  return (
    <>
      <div className="w-full overflow-x-scroll rounded-lg">
        <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-pre-wrap">
          <thead className="bg-green-50">
            <tr>
              <th className="w-10"></th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Farmer's Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Cooperative
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Team
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Role
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Phone number
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Village
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Farm Location
              </th>

              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Data Capture Fee
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Equity
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Loan
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Status
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
            </tr>
          </thead>
          <tbody>
            {farmers?.map((farmer, key) => (
              <Table farmer={farmer} count={++key} key={farmer._id} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default DesktopList

interface ITProps {
  farmer?: IFarmer
  count: number
}
const Table: React.FC<ITProps> = ({ farmer, count }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const navigate = useNavigate()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [_ctx, dispatch] = useContext(FarmerContext)
  // set farmer context and navigate to edit farmer
  const handleEditFarmer = (farmer: IFarmer | undefined) => {
    dispatch(farmer)
    navigate("/dashboard/farmer-management/edit")
  }
  // open or close action dialog
  const toggleDiaglog = () => {
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }
  return (
    <>
      <DeleteDialog
        farmer={farmer}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
      <ApprovalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
        farmer={farmer}
      />

      <tr className={`divide-y even:bg-[#FAFAFA]`}>
        <td className="w-10 pl-3">{count}</td>
        <td className="p-3 flex gap-1 lg:gap-2 items-center capitalize tracking-wide font-bold">
          {farmer?.profile_img?.url ? (
            <Avatar size="md" src={farmer?.profile_img?.url} className="mr-2" />
          ) : (
            <FaUserCircle className="mr-3 ml-2 text-4xl md:text-4xl" />
          )}
          <div className="flex flex-col">
            <span>
              {farmer?.first_name +
                ` ${
                  farmer?.other_name !== "undefined" && farmer?.other_name
                } ` +
                farmer?.last_name}
            </span>
            <span className="text-gray-500 tracking-wider font-bold text-[10px] md:text-sm">
              {farmer?.farmer_id}
            </span>
          </div>
        </td>
        <td className="p-3 capitalize">
          {(farmer?.cooperative as ICooperative)?.name}
        </td>
        <td className="p-3 capitalize">
          {((farmer?.cooperative as ICooperative)?.team as ITeam)?.name}
        </td>

        <td className="p-3">{farmer?.role}</td>
        <td className="p-3">{farmer?.phone}</td>
        <td className="p-3">{farmer?.village}</td>
        <td className="p-3">{farmer?.farm_location ?? null}</td>

        <td className="p-3 uppercase">
          {farmer?.reg_amount ? (
            <span className="flex items-center w-fit text-green-400 rounded-full font-bold tracking-wider p-2">
              {Number(farmer?.reg_amount)?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
          ) : (
            <span className="flex items-center w-fit text-red-600 rounded-full p-2">
              Not Paid
            </span>
          )}
        </td>
        <td className="p-3 uppercase">
          {Number(farmer?.equity_amount) > 0 ? (
            <span className="flex items-center w-fit text-green-400 rounded-full font-bold tracking-wider p-2">
              {Number(farmer?.equity_amount)?.toLocaleString("en-NG", {
                style: "currency",
                currency: "NGN",
              })}
            </span>
          ) : (
            <span className="flex items-center w-fit text-red-600 rounded-full p-2">
              Not Paid
            </span>
          )}
        </td>
        <td className="p-3 uppercase">
          {farmer?.hasLoan === "PAID" ? (
            <span className="text-green-400 uppercase tracking-wide px-2 rounded-full bg-green-100">
              {farmer.hasLoan}
            </span>
          ) : farmer?.hasLoan === "NONE" ? (
            <span className="text-gray-500 uppercase tracking-wide px-2 rounded-full bg-gray-100">
              {farmer?.hasLoan}
            </span>
          ) : (
            <span className="text-orange-500 uppercase tracking-wide px-2 rounded-full bg-orange-100">
              {farmer?.hasLoan}
            </span>
          )}
        </td>
        <td className="p-3 uppercase">
          {farmer?.isApproved === "APPROVED" ? (
            <span className="flex items-center w-fit text-green-600 rounded-full p-2">
              {farmer?.isApproved}
            </span>
          ) : farmer?.isApproved === "REJECTED" ? (
            <span className="flex items-center w-fit text-red-600 rounded-full p-2">
              {farmer?.isApproved}
            </span>
          ) : (
            <span className="flex items-center w-fit text-gray-400 rounded-full p-2">
              {farmer?.isApproved}
            </span>
          )}
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
                  navigate("/dashboard/farmer-management/details", {
                    state: farmer,
                  })
                }>
                <FaEye size={16} /> View details
              </MenuItem>
              {currentUser.role === "WAREHOUSE ADMIN" ||
              currentUser.role === "FIELD OFFICER" ? (
                <MenuItem
                  onClick={() => handleEditFarmer(farmer)}
                  className="inline-flex gap-2 border-b-2">
                  <AiFillEdit size={16} /> Edit
                </MenuItem>
              ) : (
                <></>
              )}
              {currentUser.role === "WAREHOUSE ADMIN" ? (
                farmer?.isApproved === "APPROVED" ? (
                  <MenuItem onClick={() => toggleDiaglog()}>
                    <MdCancel className="mr-2 inline" color="red" size={16} />{" "}
                    Reject
                  </MenuItem>
                ) : (
                  <>
                    <MenuItem onClick={() => toggleDiaglog()}>
                      <IoMdCheckmarkCircle
                        className="mr-2 inline"
                        color="green"
                        size={16}
                      />{" "}
                      Approve
                    </MenuItem>
                    <MenuItem
                      onClick={() => toggleDelete()}
                      className="inline-flex gap-2 border-b-2">
                      <MdDeleteForever
                        className="mr-2 inline"
                        color="red"
                        size={16}
                      />{" "}
                      Delete
                    </MenuItem>
                  </>
                )
              ) : null}
            </MenuList>
          </Menu>
        </td>
      </tr>
    </>
  )
}
