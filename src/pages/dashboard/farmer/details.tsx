/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogBody } from "@material-tailwind/react"
import { useContext, useEffect, useMemo, useState } from "react"
import {
  MdCancel,
  MdCheckCircle,
  MdDeleteForever,
  MdOutlineHolidayVillage,
  MdOutlineNumbers,
  MdOutlineVilla,
  MdVerified,
} from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { FarmerContext } from "."
import { ICooperative } from "../../../interfaces/cooperative"
import Chart from "react-apexcharts"
import { FaPhoneAlt, FaTransgender } from "react-icons/fa"
import { FaCircleUser, FaLocationDot, FaUser } from "react-icons/fa6"
import { BsFillCalendarDateFill } from "react-icons/bs"
import { GiBank, GiOrganigram } from "react-icons/gi"
import { FcImageFile } from "react-icons/fc"
import { TbBuildingWarehouse } from "react-icons/tb"
import {
  PiBuildingsBold,
  PiFarm,
  PiIdentificationBadgeFill,
} from "react-icons/pi"
import { IFarmer } from "../../../interfaces/farmer"
import { IWarehouse } from "../../../interfaces/warehouse"
import { IoWallet } from "react-icons/io5"
import { BiEdit } from "react-icons/bi"
import ApprovalDialog from "./components/ApprovalDialog"
import { fetchData, getUser, shortDateFormatter } from "../../../utils"
import { toast } from "react-toastify"
import DeleteDialog from "./components/DeleteDialog"
import { IUser } from "../../../interfaces/user"
import { GrUserAdmin } from "react-icons/gr"

const FarmerDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [_ctx, dispatch] = useContext(FarmerContext)
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [state, setFarmer] = useState<IFarmer>(location?.state)

  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  // const state: IFarmer = location.state

  // open or close action dialog
  const toggleDiaglog = () => {
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }
  const options = {
    series: [44, 55, 13, 33],
    chartOptions: {
      labels: ["Apple", "Mango", "Orange", "Watermelon"],
    },
  }

  function handleImageView(url?: string) {
    setImage(url)
    setOpen(!open)
  }

  const handleEditFarmer = () => {
    dispatch(state)
    navigate("/dashboard/farmer-management/edit")
  }

  useEffect(() => {
    fetchData(`/farmer/${location.state?._id}`)
      .then(
        (res) => {
          setFarmer(res.data)
        },
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [openDialog])

  return (
    <div className="">
      <div className="flex w-full items-center justify-between">
        {/* ACTIONS BUTTONS */}
        <div className="fixed z-50 grid grid-rows-2 divide-y-2 bottom-4 right-4 gap-2 md:gap-4 place-content-center">
          {currentUser.role === "WAREHOUSE ADMIN" && (
            <span
              className={`flex items-center gap-2 shadow-md md:shadow-lg text-white bg-${
                state?.isApproved === "REJECTED"
                  ? "green"
                  : state?.isApproved === "APPROVED"
                  ? "red"
                  : "gray"
              }-500 px-4 py-1 rounded-full cursor-pointer`}
              onClick={toggleDiaglog}>
              {state?.isApproved === "APPROVED" ? (
                <MdCancel className="text-xl lg:text-4xl" />
              ) : state?.isApproved === "REJECTED" ? (
                <MdCheckCircle className="text-xl lg:text-4xl" />
              ) : (
                <MdCheckCircle className="text-xl lg:text-4xl" />
              )}
              <span className="text-base lg:text-xl">
                {state?.isApproved === "APPROVED" ? "REJECT" : "APPROVE"}
              </span>
            </span>
          )}
          {(currentUser.role === "WAREHOUSE ADMIN" ||
            currentUser.role === "FIELD OFFICER") && (
            <>
              <span
                className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-blue-700 px-4 py-1 rounded-full cursor-pointer"
                onClick={handleEditFarmer}>
                <BiEdit className="text-xl lg:text-4xl" />
                <span className="text-base lg:text-xl">Edit</span>
              </span>
              {state?.isApproved != "APPROVED" && (
                <span
                  className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-red-700 px-4 py-1 rounded-full cursor-pointer"
                  onClick={toggleDelete}>
                  <MdDeleteForever className="text-xl lg:text-4xl" />
                  <span className="text-base lg:text-xl">DELETE</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {/* Farmer details */}
      <div className="flex flex-col  gap-7 text-sm lg:text-xl">
        <div className="py-10 divide-y-2 md:text-2xl">
          {/* Profile */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 lg:gap-14 mb-4 md:mb-6">
            <div
              className=" grid place-items-center border rounded-full w-full h-full max-h-36 max-w-36 md:max-w-40 md:max-h-40 lg:max-h-52  lg:max-w-52 object-contain bg-gray-50 hover:transform hover:scale-125 transition-transform duration-300 ease-linear overflow-hidden"
              onClick={() => handleImageView(state?.profile_img?.url)}>
              {state?.profile_img?.url ? (
                <img
                  src={state?.profile_img?.url}
                  alt="id card"
                  className="contain-size"
                />
              ) : (
                <FaCircleUser
                  size={35}
                  color="gray"
                  className="w-full h-full max-h-36 max-w-36 md:max-w-40 md:max-h-40 lg:max-h-52 items-center justify-center p-2 md:p-4 lg:p-6 lg:max-w-52"
                />
              )}
            </div>
            <div className="w-full">
              <p className="flex flex-wrap w-full gap-x-2 items-center font-bold text-base md:text-lg lg:text-3xl capitalize mb-1">
                {`${state?.first_name} ${state?.other_name ?? ""} ${
                  state?.last_name
                }`}
                <div
                  className={`flex flex-col rounded-full px-2 bg-${
                    state?.isApproved === "REJECTED"
                      ? "red"
                      : state?.isApproved === "APPROVED"
                      ? "green"
                      : "gray"
                  }-50`}>
                  {state?.isApproved === "APPROVED" ? (
                    <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-green-500">
                      {state?.isApproved}
                    </p>
                  ) : state?.isApproved === "REJECTED" ? (
                    <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-red-500">
                      {state?.isApproved}
                    </p>
                  ) : (
                    <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-gray-500">
                      {state?.isApproved}
                    </p>
                  )}
                </div>
              </p>
              <span className="flex flex-col w-full md:grid md:grid-cols-2  gap-1 ">
                <p className="flex gap-3 items-center">
                  <span className="text-gray-600">
                    <FaUser />
                  </span>
                  {state?.farmer_id}
                </p>

                <p className="flex items-center gap-3">
                  <span className="text-gray-600">
                    <FaTransgender />
                  </span>
                  {state?.gender}
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-gray-600">
                    <BsFillCalendarDateFill />
                  </span>
                  {shortDateFormatter(state?.date_of_birth as string)}
                </p>

                <p className="flex items-center gap-3">
                  <span className="text-gray-600">
                    <TbBuildingWarehouse />
                  </span>
                  {(state?.warehouse as IWarehouse)?.name}
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-gray-600">
                    <GiOrganigram />
                  </span>
                  {(state?.cooperative as ICooperative)?.name}
                </p>
                <p className="hidden md:flex items-center gap-3">
                  <span className="text-gray-600">
                    <GrUserAdmin />
                  </span>
                  {(state?.supervisor as IUser)?.name}
                </p>
              </span>
            </div>
          </div>

          {/* Farmer activity */}
          <div className="px-6 py-4 flex flex-col gap-6 text-sm lg:text-xl">
            <h4 className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500">
              Farmer's Loan Details
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

              <div className="flex justify-center gap-[5px] mb-[30px]">
                <Chart type="donut" options={options} />
              </div>
            </div>
          </div>

          {/* contact details */}
          <div className="flex flex-col  gap-1 ">
            <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Contact Details
            </p>
            <span className="flex flex-col md:grid md:grid-cols-2  gap-1 ">
              <p className="flex gap-3 items-center">
                <span className="text-gray-600">
                  <PiBuildingsBold />
                </span>
                {state?.state}
              </p>

              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <MdOutlineVilla />
                </span>
                {state?.lga}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <MdOutlineHolidayVillage />
                </span>
                {state?.village}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <FaLocationDot />
                </span>
                {state?.address}
              </p>

              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <PiFarm />
                </span>
                {state?.farm_location}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <FaPhoneAlt />
                </span>
                {state?.phone}
              </p>
            </span>
          </div>

          {/* credentials */}
          <div className="flex flex-col  gap-1 ">
            <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Credentails
            </p>
            <div className="flex flex-col md:flex-row items-start gap-2 md:gap-8 lg:gap-10">
              <div
                className="grid place-items-center border rounded w-full h-full max-h-24 md:max-w-[50%] md:max-h-40 lg:max-h-52  lg:max-w-96 object-contain bg-gray-50 hover:transform hover:scale-125 transition-transform duration-300 ease-linear overflow-hidden"
                onClick={() => handleImageView(state?.id_card?.url)}>
                {state?.id_card?.url ? (
                  <img
                    src={state?.id_card?.url}
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
              <div className="flex flex-col w-full">
                <p className="flex items-center gap-3 font-bold">
                  {state?.isValidId}
                </p>
                <span className="grid grid-cols-2  gap-1 ">
                  <p className="flex gap-3 items-center uppercase">
                    <span className="text-gray-600">
                      <PiIdentificationBadgeFill />
                    </span>
                    {state?.id_type}
                  </p>

                  <p className="flex items-center gap-3 uppercase">
                    <span className="text-gray-600">
                      <MdOutlineNumbers />
                    </span>
                    {state?.id_number}
                  </p>
                  <p className="flex items-center gap-3 uppercase">
                    <span className="text-gray-600 font-bold">
                      <GiBank />
                    </span>
                    {state?.bank_name}
                  </p>
                  <p className="flex items-center gap-3 uppercase">
                    <span className="text-gray-600 font-bold">
                      <IoWallet />
                    </span>
                    {state?.account_number}
                  </p>
                  <p className="flex items-center gap-3 uppercase">
                    <span className="text-gray-600 font-bold">BVN</span>
                    {state?.bvn}
                  </p>
                </span>
                <span className="grid grid-cols-2 gap-x-8 gap-1  border-t-2 my-2 w-full text-xs lg:text-base py-2">
                  <p
                    className={`flex items-center gap-3 ${
                      state?.isValidName === "VALID"
                        ? "text-green-400"
                        : state?.isValidName === "INVALID"
                        ? "text-red-400"
                        : "text-orange-200"
                    }`}>
                    <span className="uppercase">NAME</span>
                    <MdVerified />
                  </p>
                  <p
                    className={`flex items-center gap-3 ${
                      state?.isValidDateOfBirth === "VALID"
                        ? "text-green-400"
                        : state?.isValidDateOfBirth === "INVALID"
                        ? "text-red-400"
                        : "text-orange-200"
                    }`}>
                    <span className="uppercase">DATE OF BIRTH</span>
                    <MdVerified />
                  </p>
                  <p
                    className={`flex items-center gap-3 ${
                      state?.isValidAccount === "VALID"
                        ? "text-green-400"
                        : state?.isValidAccount === "INVALID"
                        ? "text-red-400"
                        : "text-orange-200"
                    }`}>
                    <span className="uppercase">ACCOUNT</span>
                    <MdVerified />
                  </p>
                </span>
              </div>
            </div>
          </div>

          {/* Guatantors details */}
          <div className="flex flex-col  gap-1  text-sm md:text-xl">
            <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Guatantors Details
            </p>
            <span className="flex flex-col md:grid md:grid-cols-2  gap-1 ">
              <p className="flex font-bold text-base lg:text-2xl capitalize">
                {state?.guarantor_name}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <FaPhoneAlt />
                </span>
                {state?.guarantor_number}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <FaLocationDot />
                </span>
                {state?.guarantor_address}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <MdOutlineHolidayVillage />
                </span>
                {state?.guarantor_village}
              </p>
              <p className="flex gap-3 items-center uppercase">
                <span className="text-gray-600">
                  <PiIdentificationBadgeFill />
                </span>
                {state?.guarantor_id_type}
              </p>

              <p className="flex items-center gap-3 uppercase">
                <span className="text-gray-600">
                  <MdOutlineNumbers />
                </span>
                {state?.guarantor_id_number}
              </p>
            </span>
          </div>
          {/* Guarantor's ID */}
          <div className="flex flex-col  gap-1 ">
            <p className="flex gap-3 md:gap-4 lg:gap-5 font-bold text-sm lg:text-lg uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
              Guarantor's ID
              {state?.isValidGuarantorId && (
                <p
                  className={`flex items-center gap-3 ${
                    state?.isValidAccount === "VALID"
                      ? "text-green-400"
                      : state?.isValidAccount === "INVALID"
                      ? "text-red-400"
                      : "text-orange-200"
                  }`}>
                  <MdVerified />
                </p>
              )}
            </p>
            <div className="flex flex-col md:flex-row items-start gap-2 md:gap-8 lg:gap-10">
              <div
                className="grid place-items-center border rounded w-full h-full max-h-24 md:max-w-[50%] md:max-h-40 lg:max-h-52  lg:max-w-96 object-contain bg-gray-50 hover:transform hover:scale-125 transition-transform duration-300 ease-linear overflow-hidden"
                onClick={() => handleImageView(state?.guarantor_id?.url)}>
                {state?.guarantor_id?.url ? (
                  <img
                    src={state?.guarantor_id?.url}
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
        </div>
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
        farmer={state}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
      />
      <DeleteDialog
        farmer={state}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </div>
  )
}

export default FarmerDetails
