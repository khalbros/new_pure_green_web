/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from "react"
import { Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react"
import { FaEye } from "react-icons/fa"

import { TfiMore } from "react-icons/tfi"
import { MdCancel, MdDeleteForever } from "react-icons/md"
import { IoMdCheckmarkCircle } from "react-icons/io"
import { AiFillEdit } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { getUser } from "../../../../../utils"
import { WarehouseContext } from "../.."
import DeleteDialog from "../DeleteDialog"
import ApprovalDialog from "../ApprovalDialog"
import { IWarehouse } from "../../../../../interfaces/warehouse"

interface IProps {
  warehouses?: IWarehouse[]
}
const DesktopList: React.FC<IProps> = ({ warehouses }) => {
  return (
    <>
      <div className="w-full overflow-x-scroll rounded-lg">
        <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
          <thead className="bg-green-50">
            <tr className="">
              <th className="w-10"></th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Warehouse's Name
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Capacity
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                Address
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                State
              </th>
              <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
            </tr>
          </thead>
          <tbody>
            {warehouses?.map((warehouse, key) => {
              return <Table warehouse={warehouse} count={++key} />
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
export default DesktopList

interface ITProps {
  warehouse?: IWarehouse
  count: number
}
const Table: React.FC<ITProps> = ({ warehouse, count }) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const navigate = useNavigate()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [_ctx, dispatch] = useContext(WarehouseContext)
  // set warehouse context and navigate to edit warehouse
  const handleEditWarehouse = (warehouse: IWarehouse | undefined) => {
    dispatch(warehouse)
    navigate("/dashboard/warehouse-management/edit")
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
        warehouse={warehouse}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
      <ApprovalDialog
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
        warehouse={warehouse}
      />

      <tr
        key={count}
        className={`even:bg-[#FAFAFA] ${
          warehouse?.isApproved ? "" : "bg-[#FFEBEE] opacity-50"
        }`}>
        <td className="w-10 pl-3">
          <span>{count}</span>
        </td>
        <td className="p-3 font-bold">{warehouse?.name}</td>
        <td className="p-3">{warehouse?.capacity}</td>
        <td className="p-3">{warehouse?.address}</td>
        <td className="p-3 uppercase">{warehouse?.state}</td>

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
                  navigate("/dashboard/warehouse-management/details", {
                    state: warehouse,
                  })
                }>
                <FaEye size={16} /> View details
              </MenuItem>
              {(currentUser.role === "DATA ANALYST" ||
                currentUser.role === "SUPER ADMIN") && (
                <>
                  <MenuItem
                    onClick={() => handleEditWarehouse(warehouse)}
                    className="inline-flex gap-2 border-b-2">
                    <AiFillEdit size={16} /> Edit
                  </MenuItem>
                  {!warehouse?.isApproved ? (
                    <>
                      <MenuItem
                        onClick={() => toggleDiaglog()}
                        className="inline-flex gap-2 border-b-2">
                        <IoMdCheckmarkCircle
                          size={16}
                          className="text-green-400"
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
                  ) : (
                    <>
                      <MenuItem
                        onClick={() => toggleDiaglog()}
                        className="inline-flex gap-2 border-b-2">
                        <MdCancel size={16} className="text-red-400" /> Reject
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
                  )}
                </>
              )}
            </MenuList>
          </Menu>
        </td>
      </tr>
    </>
  )
}
