/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from "react"
import { ICooperative } from "../../../../../interfaces/cooperative"
import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import { FaEye } from "react-icons/fa"

import { TfiMore } from "react-icons/tfi"
import { MdCancel, MdDeleteForever } from "react-icons/md"
import { IoMdCheckmarkCircle } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../../../../utils"
import { CooperativeContext } from "../.."
import DeleteDialog from "../DeleteDialog"
import ApprovalDialog from "../ApprovalDialog"

interface IProps {
  cooperativies?: ICooperative[]
}
const DesktopList: React.FC<IProps> = ({ cooperativies }) => {
  return (
    <>
      <div className="w-full overflow-x-scroll rounded-lg">
        <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap capitalize">
          <thead className="bg-green-50">
            <tr>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Cooperative's Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Cooperative's Chairman
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Phone Number
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Village
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Village Head
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Status
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
            </tr>
          </thead>
          <tbody>
            {cooperativies?.map((cooperative, key) => {
              return <Table cooperative={cooperative} count={++key} />
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default DesktopList

interface ITProps {
  cooperative?: ICooperative
  count: number
}
const Table: React.FC<ITProps> = ({ cooperative, count }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const navigate = useNavigate()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [_ctx, dispatch] = useContext(CooperativeContext)
  // set cooperative context and navigate to edit cooperative
  const handleEditCooperative = (cooperative: ICooperative | undefined) => {
    dispatch(cooperative)
    navigate("/dashboard/cooperative-management/edit")
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
        cooperative={cooperative}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
      <ApprovalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
        cooperative={cooperative}
      />

      <tr key={count} className={`divide-y even:bg-[#FAFAFA]`}>
        <td className="w-10 pl-3">
          <span>{count}</span>
          {/* <input type="checkbox" /> */}
        </td>
        <td className="p-3 font-bold">{cooperative?.name}</td>
        <td className="p-3">{cooperative?.chairman}</td>
        <td className="p-3">{cooperative?.phone}</td>
        <td className="p-3">{cooperative?.village}</td>
        <td className="p-3">{cooperative?.village_head}</td>
        <td className="p-3">
          <span
            className={`${
              cooperative?.isApproved ? "bg-green-400" : "bg-red-500"
            } whitespace-nowrap px-4 py-1 text-center text-white uppercase rounded-full cursor-pointer`}>
            {cooperative?.isApproved ? "Approved" : "Not Approved"}
          </span>
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
                  navigate("/dashboard/cooperative-management/details", {
                    state: cooperative,
                  })
                }>
                <FaEye size={16} /> View details
              </MenuItem>
              {(currentUser?.role === "WAREHOUSE ADMIN" ||
                currentUser.role === "FIELD OFFICER") && (
                <MenuItem
                  onClick={() => handleEditCooperative(cooperative)}
                  className="inline-flex gap-2 border-b-2">
                  <AiFillEdit size={16} /> Edit
                </MenuItem>
              )}

              {(currentUser?.role === "WAREHOUSE ADMIN" ||
                currentUser.role === "WAREHOUSE MANAGER" ||
                currentUser.role === "DATA ANALYST" ||
                currentUser.role === "SUPER ADMIN") &&
                (!cooperative?.isApproved ? (
                  <MenuItem
                    onClick={() => toggleDiaglog()}
                    className="inline-flex gap-2 border-b-2">
                    <IoMdCheckmarkCircle size={16} className="text-green-400" />{" "}
                    Approve
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => toggleDiaglog()}
                    className="inline-flex gap-2 border-b-2">
                    <MdCancel size={16} className="text-red-400" /> Reject
                  </MenuItem>
                ))}

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
            </MenuList>
          </Menu>
        </td>
      </tr>
    </>
  )
}
