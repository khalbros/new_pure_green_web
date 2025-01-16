/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from "react"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { WarehouseContext } from "."
import { IUser } from "../../../interfaces/user"
import { fetchData, getUser } from "../../../utils"
import { IFarmer } from "../../../interfaces/farmer"
import { toast } from "react-toastify"
import { BiEdit } from "react-icons/bi"
import ApprovalDialog from "./components/ApprovalDialog"
import { IWarehouse } from "../../../interfaces/warehouse"
import { FcImageFile } from "react-icons/fc"
import DeleteDialog from "./components/DeleteDialog"
import { Dialog, DialogBody } from "@material-tailwind/react"
import { useQuery } from "react-query"
import { ICooperative } from "../../../interfaces/cooperative"
import { IProject } from "../../../interfaces/project"

const WarehouseDetails: React.FC = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const { state } = useLocation()
  const navigate = useNavigate()
  const [warehouse, setWarehouse] = useState<IWarehouse>(state)
  const [_ctx, dispatch] = useContext(WarehouseContext)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)

  const warehouseCooperativies = useQuery({
    queryKey: ["warehouse", "cooperative"],
    queryFn: async () => {
      return fetchData(`/warehouse/cooperativies/${warehouse?._id}`).then(
        (res) => res.data
      )
    },
  })
  const queryProject = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      return fetchData(`/project`).then((res) => res.data)
    },
  })
  // open or close action dialog
  const toggleDiaglog = () => {
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }

  function handleImageView(url?: string) {
    setImage(url)
    setOpen(!open)
  }

  const handleEditWarehouse = () => {
    dispatch(state)
    navigate("/dashboard/warehouse-management/edit")
  }

  useEffect(() => {
    fetchData(`/warehouse/${warehouse?._id}`)
      .then(
        (res) => {
          setWarehouse(res.data)
        },
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [])

  return (
    <div className="">
      <div className="flex w-full items-center justify-between">
        {/* Action buttons */}
        {(currentUser?.role === "SUPER ADMIN" ||
          currentUser?.role === "DATA ANALYST") && (
          <div className="fixed z-50 grid grid-rows-2 divide-y-2 bottom-4 right-4 gap-2 md:gap-4 place-content-center">
            <span
              className={`flex items-center gap-2 shadow-md md:shadow-lg text-white bg-${
                warehouse?.isApproved ? "red" : "green"
              }-500 px-4 py-1 rounded-full cursor-pointer`}
              onClick={toggleDiaglog}>
              {warehouse?.isApproved ? (
                <MdCancel className="text-xl lg:text-4xl" />
              ) : (
                <MdCheckCircle className="text-xl lg:text-4xl" />
              )}
              <span className="text-base lg:text-xl">
                {warehouse?.isApproved ? "REJECT" : "APPROVE"}
              </span>
            </span>
            <span
              className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-blue-700 px-4 py-1 rounded-full cursor-pointer"
              onClick={handleEditWarehouse}>
              <BiEdit className="text-xl lg:text-4xl" />
              <span className="text-base lg:text-xl">Edit</span>
            </span>
            <span
              className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-red-700 px-4 py-1 rounded-full cursor-pointer"
              onClick={toggleDelete}>
              <MdDeleteForever className="text-xl lg:text-4xl" />
              <span className="text-base lg:text-xl">DELETE</span>
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col  gap-7 text-sm lg:text-xl">
        <div className="py-8 divide-y-2 md:text-2xl">
          {/* Warehouse details */}
          <div className="flex items-center gap-4 md:gap-8 lg:gap-14 mb-4 md:mb-6">
            <div className="w-full">
              <p className="flex flex-wrap w-full gap-x-2 md:gap-4 items-center font-bold text-lg md:text-xl lg:text-3xl capitalize mb-3">
                {warehouse?.name}
                <div
                  className={`flex flex-col rounded-full px-4 bg-${
                    !warehouse?.isApproved ? "red" : "green"
                  }-50`}>
                  {warehouse?.isApproved ? (
                    <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-green-500">
                      {"APPROVED"}
                    </p>
                  ) : (
                    <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-red-500">
                      {"REJECTED"}
                    </p>
                  )}
                </div>
              </p>
              <span className="w-full grid grid-cols-2  gap-1 md:gap-3   whitespace-nowrap capitalize justify-between items-center">
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Warehouse Manager(s):
                  </span>
                  {(warehouse?.warehouse_manager as IUser[])?.map((wm, key) => (
                    <span key={key}>{wm.name}</span>
                  ))}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Supervisor(s):
                  </span>
                  {(warehouse?.warehouse_admin as IUser[])?.map((wm, key) => (
                    <span key={key}>{wm.name}</span>
                  ))}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Capacity:
                  </span>
                  {warehouse?.capacity}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Phone:
                  </span>
                  {(warehouse?.warehouse_manager as IUser[])?.map((wm, key) => (
                    <span key={key}>{wm.phone}</span>
                  ))}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Address:
                  </span>
                  {warehouse?.address}
                </p>
              </span>
            </div>
          </div>

          {/* Warehouse activity */}
          <div className="py-4 flex flex-col gap-6 text-sm lg:text-xl">
            <h4 className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500">
              Warehouse's Loan Details
            </h4>
            <div className="p-4 w-full border rounded-lg">
              <div className="flex gap-[11px] mb-4">
                <p className="text-gray-700 flex-1">Project </p>
                <select
                  name="project"
                  id="project"
                  className="px-3 rounded shadow cursor-pointer">
                  {(queryProject.data as IProject[])?.map((proj, key) => (
                    <option value={proj._id} key={key}>
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* loan */}
              <div className="flex justify-center gap-[5px] mb-[30px]">
                <p className="flex flex-col w-full tracking-wide">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold">
                    Total Loan:
                  </span>
                  {Number(warehouse?.capacity).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
                <p className="flex flex-col w-full tracking-wide">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold">
                    Outstanding Loan:
                  </span>
                  {Number(warehouse?.capacity).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
                <p className="flex flex-col w-full tracking-wide">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold">
                    Loan Repaid:
                  </span>
                  {Number(warehouse?.capacity).toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
              </div>
              {/* chart  */}
            </div>
          </div>

          {/* Cooperative */}

          <div className="flex flex-col md:gap-x-4 gap-1 lg:gap-x-4 text-sm md:text-xl mb-4 md:mb-6">
            <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Cooperativies
            </p>
            <span className="w-full flex flex-col md:grid grid-cols-2 gap-2 lg:divide-x-2 whitespace-nowrap capitalize justify-between items-center">
              {(warehouseCooperativies.data as ICooperative[])?.map(
                (cooperative, key) => (
                  <p
                    className="flex flex-col w-full even:bg-green-50 p-2 px-4 border hover:bg-blue-gray-100 cursor-pointer"
                    key={key}
                    onClick={() =>
                      navigate("/dashboard/cooperative-management/details", {
                        state: cooperative,
                      })
                    }>
                    <div className="flex gap-2 items-center">
                      <div className="flex flex-col w-full">
                        <p className="flex items-center justify-between">
                          <span className="uppercase text-sm md:text-base font-bold tracking-wide">
                            {`${cooperative.name}`}
                          </span>
                          <p className="text-gray-600 capitalize tracking-wide text-xs md:text-sm lg:text-base">
                            <b className="text-black uppercase">farmers: </b>
                            <span className="font-bold">
                              {cooperative.farmers}
                            </span>
                          </p>
                        </p>

                        <div className="flex items-center justify-between text-gray-600 capitalize tracking-wide text-xs md:text-sm lg:text-base">
                          <p>
                            <b className="uppercase">chairman: </b>
                            <span>{cooperative.chairman}</span>
                          </p>
                          <p>
                            <b className="uppercase">phone: </b>
                            <span>{cooperative.phone}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </p>
                )
              )}
            </span>
          </div>
        </div>
        {/* certificate */}
      </div>
      {/* Image Dialog */}
      <Dialog size="sm" open={open} handler={() => setOpen(!open)}>
        <DialogBody className="">
          <div className="flex justify-end">
            {" "}
            <MdCancel
              className="cursor-pointer"
              size={20}
              onClick={() => setOpen(!open)}
            />{" "}
          </div>
          {image ? (
            <img
              src={image}
              className="mx-auto block min-h-[70vh]"
              alt="profile image"
            />
          ) : (
            <FcImageFile
              size={35}
              color="red"
              className="w-full h-full mx-auto items-center justify-center p-2 md:p-4 lg:p-6"
            />
          )}
        </DialogBody>
      </Dialog>
      <ApprovalDialog
        warehouse={warehouse}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
      />
      <DeleteDialog
        warehouse={warehouse}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </div>
  )
}

export default WarehouseDetails
