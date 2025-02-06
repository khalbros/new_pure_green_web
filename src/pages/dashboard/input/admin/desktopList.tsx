/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from "react"
import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"

import { TfiMore } from "react-icons/tfi"
import { MdDeleteForever } from "react-icons/md"
import { IoMdCheckmarkCircle, IoMdCloseCircle } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../../../utils"
import { InputContext } from "../"
import DeleteDialog from "./DeleteDialog"
import ApprovalDialog from "./ApprovalDialog"
import { IInput } from "../../../../interfaces/input"

interface IProps {
  inputs?: IInput[]
}
const DesktopList: React.FC<IProps> = ({ inputs }) => {
  return (
    <>
      <div className="w-full overflow-x-scroll rounded-lg">
        <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
          <thead className="bg-green-50">
            <tr>
              <th className="w-10 text-green-700"></th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Input's Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Quantity
              </th>

              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Status
              </th>

              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
            </tr>
          </thead>
          <tbody>
            {inputs?.map((input, key) => {
              return <Table input={input} count={++key} />
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default DesktopList

interface ITProps {
  input?: IInput
  count: number
}
const Table: React.FC<ITProps> = ({ input, count }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const navigate = useNavigate()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [_ctx, dispatch] = useContext(InputContext)
  // set input context and navigate to edit input
  const handleEditInput = (input: IInput | undefined) => {
    dispatch(input)
    navigate("/dashboard/input-management/edit")
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
        input={input}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
      <ApprovalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
        input={input}
      />

      <tr key={count} className={`divide-y even:bg-[#FAFAFA]`}>
        <td className="w-10 pl-3">{count + 1}</td>
        <td className="p-3 font-bold">{input?.name}</td>
        <td className="p-3">{input?.quantity ?? 0}</td>

        <td className="p-3">
          <span
            className={`${
              input?.isApproved
                ? "bg-green-400"
                : !input?.isApproved
                ? "bg-gray-500"
                : "bg-red-500"
            } whitespace-nowrap px-4 py-1 text-center text-white uppercase rounded-full cursor-pointer`}>
            {!input?.isApproved ? "PENDING" : "APPROVED"}
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
              {currentUser?.role === "AREA SALES MANAGER" &&
                (input?.isApproved ? (
                  <MenuItem
                    onClick={() => toggleDiaglog()}
                    className="inline-flex gap-2 border-b-2">
                    <IoMdCloseCircle size={16} className="text-orange-800" />{" "}
                    Reject
                  </MenuItem>
                ) : (
                  <MenuItem
                    onClick={() => toggleDiaglog()}
                    className="inline-flex gap-2 border-b-2">
                    <IoMdCheckmarkCircle size={16} className="text-green-400" />{" "}
                    Approve
                  </MenuItem>
                ))}
              <MenuItem
                onClick={() => handleEditInput(input)}
                className="inline-flex gap-2 border-b-2">
                <AiFillEdit size={16} /> Edit
              </MenuItem>
              <MenuItem
                onClick={() => toggleDelete()}
                className="inline-flex gap-2 border-b-2">
                <MdDeleteForever size={16} className="text-red-400" /> Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </td>
      </tr>
    </>
  )
}
