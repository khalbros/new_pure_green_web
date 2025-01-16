/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useState } from "react"
import { IClient } from "../../../../../interfaces/client"
import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import { FaEye, FaUserSlash } from "react-icons/fa"
import { TfiMore } from "react-icons/tfi"

import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { ClientContext } from "../.."
import DeleteDialog from "../DeleteDialog"
import ApprovalDialog from "../ApprovalDialog"

interface IProps {
  clients?: IClient[]
}

const DesktopList: React.FC<IProps> = ({ clients }) => {
  return (
    <>
      <div className="w-full overflow-x-scroll rounded-lg">
        <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap capitalize">
          <thead className="bg-green-50">
            <tr>
              <th className="w-10"></th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Client's Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Email Address
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Phone Number
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Residential Address
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Bank Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Account Number
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
            </tr>
          </thead>
          <tbody>
            {clients?.map((client, key) => (
              <Table client={client} count={++key} key={client?._id} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default DesktopList

interface ITProps {
  client?: IClient
  count: number
}
const Table: React.FC<ITProps> = ({ client, count }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(ClientContext)
  // set client context and navigate to edit client
  const handleEditClient = (client: IClient | undefined) => {
    dispatch(client)
    navigate("/dashboard/client-management/edit")
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
        client={client}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
      <ApprovalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
        client={client}
      />

      <tr className={`divide-y even:bg-[#FAFAFA]`}>
        <td className="w-10 pl-3">{count}</td>
        <td className="p-3 flex flex-col flex-wrap gap-1 md:gap-2 items-start capitalize tracking-wide font-bold">
          <span>{client?.name}</span>
          <span className="text-gray-500 tracking-wider font-bold text-[10px] md:text-xs">
            {client?.client_id}
          </span>
        </td>
        <td className="p-3">{client?.email}</td>
        <td className="p-3">{client?.phone}</td>
        <td className="p-3">{client?.address}</td>
        <td className="p-3 uppercase tracking-wider">{client?.bank_name}</td>
        <td className="p-3">{client?.account_number}</td>

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
                  navigate("/dashboard/client-management/details", {
                    state: client,
                  })
                }>
                <FaEye size={16} /> View details
              </MenuItem>
              <MenuItem
                onClick={() => handleEditClient(client)}
                className="inline-flex gap-2 border-b-2">
                <AiFillEdit size={16} /> Edit
              </MenuItem>
              <MenuItem onClick={() => toggleDelete()}>
                <FaUserSlash className="mr-2 inline" color="red" size={16} />{" "}
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </td>
      </tr>
    </>
  )
}
