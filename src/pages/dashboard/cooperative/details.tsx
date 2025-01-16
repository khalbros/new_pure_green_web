/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from "react"
import {
  MdCancel,
  MdCheckCircle,
  MdDeleteForever,
  MdVerified,
} from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { CooperativeContext } from "."
import { IUser } from "../../../interfaces/user"
import { fetchData, getUser } from "../../../utils"
import { IFarmer } from "../../../interfaces/farmer"
import { toast } from "react-toastify"
import { ITeam } from "../../../interfaces/team"
import { BiEdit } from "react-icons/bi"
import ApprovalDialog from "./components/ApprovalDialog"
import { IWarehouse } from "../../../interfaces/warehouse"
import { FcImageFile } from "react-icons/fc"
import DeleteDialog from "./components/DeleteDialog"
import { Avatar, Dialog, DialogBody } from "@material-tailwind/react"
import { ICooperative } from "../../../interfaces/cooperative"
import { FaMinusCircle, FaUserCircle } from "react-icons/fa"

const CooperativeDetails: React.FC = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const { state } = useLocation()
  const navigate = useNavigate()
  const [cooperative, setCooperative] = useState<ICooperative>(state)
  const [members, setMembers] = useState<IFarmer[]>([])
  const [_ctx, dispatch] = useContext(CooperativeContext)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [open, setOpen] = useState(false)

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

  const handleEditCooperative = () => {
    dispatch(state)
    navigate("/dashboard/cooperative-management/edit")
  }

  useEffect(() => {
    fetchData(`/cooperative/${cooperative?._id}`)
      .then(
        (res) => {
          setCooperative(res.data)
        },
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
    fetchData(`/cooperative/members/${cooperative?._id}`)
      .then(
        (res) => {
          setMembers(res.data)
        },
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [openDialog])

  return (
    <div className="">
      <div className="flex w-full items-center justify-between">
        {/* Action buttons */}
        {(currentUser?.role === "SUPER ADMIN" ||
          currentUser?.role === "WAREHOUSE MANAGER" ||
          currentUser?.role === "WAREHOUSE ADMIN") && (
          <div className="fixed z-50 grid grid-rows-2 divide-y-2 bottom-4 right-4 gap-2 md:gap-4 place-content-center">
            <span
              className={`flex items-center gap-2 shadow-md md:shadow-lg text-white bg-${
                cooperative?.isApproved ? "red" : "green"
              }-500 px-4 py-1 rounded-full cursor-pointer`}
              onClick={toggleDiaglog}>
              {cooperative?.isApproved ? (
                <MdCancel className="text-xl lg:text-4xl" />
              ) : (
                <MdCheckCircle className="text-xl lg:text-4xl" />
              )}
              <span className="text-base lg:text-xl">
                {cooperative?.isApproved ? "REJECT" : "APPROVE"}
              </span>
            </span>
            <span
              className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-blue-700 px-4 py-1 rounded-full cursor-pointer"
              onClick={handleEditCooperative}>
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
          {/* Cooperative details */}
          <div className="flex items-center gap-4 md:gap-8 lg:gap-14 mb-4 md:mb-6">
            <div className="w-full">
              <p className="flex flex-wrap w-full gap-x-2 md:gap-4 items-center font-bold text-lg md:text-xl lg:text-3xl capitalize mb-3">
                {cooperative?.name}
                <div
                  className={`flex flex-col rounded-full px-2 bg-${
                    !cooperative?.isApproved ? "red" : "green"
                  }-50`}>
                  {cooperative?.isApproved ? (
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
              <span className="w-full grid grid-cols-2  gap-1 md:gap-3 whitespace-nowrap capitalize justify-between items-center">
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Chairman:
                  </span>
                  {cooperative?.chairman}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Phone:
                  </span>
                  {cooperative?.phone}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Village:
                  </span>
                  {cooperative?.village}
                </p>
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Village Head:
                  </span>
                  {cooperative?.village_head}
                </p>
                {cooperative?.team && (
                  <p className="flex flex-col w-full">
                    <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide ">
                      Team:
                    </span>
                    <span className="capitalize">
                      {(cooperative?.team as ITeam)?.name}
                    </span>
                  </p>
                )}
              </span>
            </div>
          </div>

          {/* Certificate */}
          <div className="flex flex-col md:gap-x-4 gap-1 lg:gap-x-4 mb-4 md:mb-6">
            <p className="flex gap-3 md:gap-4 lg:gap-5 font-bold text-sm lg:text-lg uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Cooperative Certificate
              {cooperative?.certificate && (
                <p
                  className={`flex items-center gap-3 ${
                    cooperative?.certificate
                      ? "text-green-400"
                      : "text-orange-200"
                  }`}>
                  <MdVerified />
                </p>
              )}
            </p>
            <div className="flex flex-col md:flex-row items-start gap-2 md:gap-8 lg:gap-10">
              <div
                className="grid place-items-center border rounded w-full h-full max-h-24  md:max-h-48 lg:max-h-96 object-contain bg-gray-50 hover:transform hover:scale-110 transition-transform duration-300 ease-linear overflow-hidden"
                onClick={() => handleImageView(cooperative?.certificate?.url)}>
                {cooperative?.certificate?.url ? (
                  <img
                    src={cooperative?.certificate?.url}
                    alt="id card"
                    className="contain-size"
                  />
                ) : (
                  <FcImageFile
                    size={35}
                    color="red"
                    className="w-full h-full max-h-24 md:max-w-[50%] md:max-h-40 lg:max-h-52 items-center justify-center p-2 md:p-4 lg:p-6 lg:max-w-52"
                  />
                )}
              </div>
            </div>
          </div>

          {/*  Admin details*/}
          <div className="flex flex-col md:gap-x-4 gap-1 lg:gap-x-4 text-sm md:text-xl mb-4 md:mb-6">
            <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Admin Details
            </p>
            <span className="w-full grid grid-cols-2  gap-1   whitespace-nowrap capitalize justify-between items-center">
              {cooperative?.supervisor && (
                <p className="flex flex-col w-full">
                  <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                    Supervisor:
                  </span>
                  <span className="capitalize">
                    {(cooperative?.supervisor as IUser)?.name}
                  </span>
                </p>
              )}
              <p className="flex flex-col w-full">
                <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                  warehouse:
                </span>
                <span className="capitalize">
                  {(cooperative?.warehouse as IWarehouse)?.name}
                </span>
              </p>
            </span>
          </div>

          {/* Cooperative activity */}
          <div className="py-4 flex flex-col gap-6 text-sm lg:text-xl">
            <h4 className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500">
              Cooperative's Loan Details
            </h4>
            <div className="p-4 w-full border rounded-lg">
              <div className="flex gap-[11px] mb-4">
                <p className="text-gray-700 flex-1">Project </p>
                <select name="" id="">
                  <option value="">2021</option>
                  <option value="">2022</option>
                  <option value="">2023</option>
                </select>
              </div>

              <div className="flex justify-center gap-[5px] mb-[30px]"></div>
            </div>
          </div>

          {/* Cooperative activity */}

          {/* Farmers */}
          {/*  Admin details*/}
          <div className="flex flex-col md:gap-x-4 gap-1 lg:gap-x-4 text-sm md:text-xl mb-4 md:mb-6">
            <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Farmers
            </p>
            <span className="w-full flex flex-col md:grid grid-cols-2 gap-2 lg:divide-x-2 whitespace-nowrap capitalize justify-between items-center">
              {members?.map((farmer, key) => (
                <p
                  className="relative flex flex-col w-full even:bg-green-50 p-2 px-4 border hover:bg-blue-gray-100 cursor-pointer"
                  key={key}
                  onClick={() =>
                    navigate("/dashboard/farmer-management/details", {
                      state: farmer,
                    })
                  }>
                  <div className="flex gap-2 items-center">
                    {farmer?.profile_img?.url ? (
                      <Avatar
                        size="md"
                        src={farmer?.profile_img?.url}
                        className="mr-2"
                      />
                    ) : (
                      <FaUserCircle className="mr-3 text-3xl md:text-4xl" />
                    )}
                    <div className="flex flex-col">
                      <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                        {farmer.farmer_id}
                      </span>
                      <span className="capitalize tracking-wide">
                        {`${farmer.first_name} ${farmer.other_name} ${farmer.last_name}`}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`absolute flex flex-col top-7 left-8 md:top-9 md:left-10 rounded-full border bg-${
                      farmer?.isApproved === "REJECTED"
                        ? "red"
                        : farmer?.isApproved === "APPROVED"
                        ? "green"
                        : "gray"
                    }-50`}>
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
                </p>
              ))}
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
        cooperative={cooperative}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
      />
      <DeleteDialog
        cooperative={cooperative}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </div>
  )
}

export default CooperativeDetails
