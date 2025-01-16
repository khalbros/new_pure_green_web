/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dialog, DialogBody } from "@material-tailwind/react"
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { IUser } from "../../../interfaces/user"
import { UserContext } from "."
import { IWarehouse } from "../../../interfaces/warehouse"
import { FcImageFile } from "react-icons/fc"
import { fetchData, getUser } from "../../../utils"
import { toast } from "react-toastify"
import { ICooperative } from "../../../interfaces/cooperative"
import { BiEdit } from "react-icons/bi"
import { FaCircleUser, FaGears, FaLocationDot } from "react-icons/fa6"
import { TfiEmail } from "react-icons/tfi"
import { FaPhoneAlt } from "react-icons/fa"
import { TbBuildingWarehouse } from "react-icons/tb"
import { GrUserAdmin } from "react-icons/gr"
import ApprovalDialog from "./components/ApprovalDialog"
import DeleteDialog from "./components/DeleteDialog"

const UserDetails: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [_ctx, dispatch] = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [image, setImage] = useState<string | undefined>(undefined)
  const [state, setUser] = useState<IUser>(location?.state)
  const [cooperativies, setCooperativies] = useState<ICooperative[]>()

  const handleEditUser = () => {
    dispatch(state)
    navigate("/dashboard/user-management/edit")
  }

  function handleImageView(url?: string) {
    setImage(url)
    setOpen(!open)
  }

  // open or close action dialog
  const toggleDiaglog = useCallback(() => {
    setOpenDialog(!openDialog)
  }, [])
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }

  useEffect(() => {
    fetchData(`/users/${location.state?._id}`)
      .then(
        (res) => {
          setUser(res.data)
        },
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))

    if (
      state?.role === "WAREHOUSE ADMIN" ||
      state?.role === "WAREHOUSE MANAGER" ||
      state?.role === "AREA SALES MANAGER"
    ) {
      fetchData(`/cooperative/byuser/${state?._id}`)
        .then(
          (res) => {
            console.log(res.data)

            setCooperativies(res.data)
          },
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    }
    console.log(state)
  }, [openDialog])

  return (
    <div className="">
      <div className="flex w-full items-center justify-between">
        {/* ACTIONS BUTTONS */}
        <div className="fixed grid grid-rows-2 divide-y-2 bottom-4 right-4 gap-2 md:gap-4 place-content-center">
          {currentUser.role === "SUPER ADMIN" && (
            <span
              className={`flex items-center gap-2 shadow-md md:shadow-lg text-white bg-${
                !state?.isEnable ? "green" : state?.isEnable ? "red" : "gray"
              }-500 px-4 py-1 rounded-full cursor-pointer`}
              onClick={toggleDiaglog}>
              {state?.isEnable ? (
                <MdCancel className="text-xl lg:text-4xl" />
              ) : (
                <MdCheckCircle className="text-xl lg:text-4xl" />
              )}
              <span className="text-base lg:text-xl">
                {state?.isEnable ? "DISABLE" : "ACTIVATE"}
              </span>
            </span>
          )}
          {currentUser.role === "SUPER ADMIN" && (
            <>
              <span
                className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-blue-700 px-4 py-1 rounded-full cursor-pointer"
                onClick={handleEditUser}>
                <BiEdit className="text-xl lg:text-4xl" />
                <span className="text-base lg:text-xl">Edit</span>
              </span>
              {!state?.isEnable && (
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

      {/* User details */}
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
              {state?.name}
              <div
                className={`flex flex-col tracking-widest rounded-full px-2 bg-${
                  !state?.isEnable ? "red" : "green"
                }-50`}>
                {state?.isEnable ? (
                  <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-green-500">
                    ACTIVE
                  </p>
                ) : (
                  <p className="text-center rounded-full text-xs md:text-base lg:text-lg text-red-500">
                    DISABLED
                  </p>
                )}
              </div>
            </p>
            <span className="flex flex-col w-full md:grid md:grid-cols-2  gap-1 ">
              <p className="flex gap-3 items-center">
                <span className="text-gray-600">
                  <FaGears />
                </span>{" "}
                {state?.role}
              </p>
              <p className="flex gap-3 items-center lowercase">
                <span className="text-gray-600">
                  <TfiEmail />
                </span>
                {state?.email}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-600">
                  <FaPhoneAlt />
                </span>
                {state?.phone}
              </p>
              {state?.address && (
                <p className="flex items-center gap-3">
                  <span className="text-gray-600">
                    <FaLocationDot />
                  </span>
                  {state?.address}
                </p>
              )}
            </span>
            {state?.warehouse && (
              <p className="flex items-center gap-3 font-bold uppercase tracking-wider">
                <span className="text-gray-600">
                  <TbBuildingWarehouse />
                </span>
                {(state?.warehouse as IWarehouse)?.name}
              </p>
            )}
            {state?.supervisor && (
              <p className="hidden md:flex items-center gap-3">
                <span className="text-gray-600">
                  <GrUserAdmin />
                </span>
                {(state?.supervisor as IUser)?.name}
              </p>
            )}
          </div>
        </div>
        <div>
          {state?.area_warehouse && state?.area_warehouse?.length > 0 && (
            <div className="flex flex-col md:gap-x-4 gap-1 lg:gap-x-4 text-sm md:text-xl mb-4 md:mb-6">
              <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
                WareHouses
              </p>
              <div className="w-full flex flex-col md:grid grid-cols-2 gap-2 lg:divide-x-2 whitespace-nowrap capitalize justify-between items-center">
                {state.area_warehouse?.map((ware: IWarehouse) => (
                  <span
                    className="flex flex-col w-full even:bg-green-50 p-2 px-4 border"
                    key={ware._id}>
                    {ware.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {cooperativies && cooperativies.length > 0 && (
            <div className="flex flex-col md:gap-x-4 gap-1 lg:gap-x-4 text-sm md:text-xl mb-4 md:mb-6">
              <p className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500 mt-2 mb-1 md:mt-3 md:mb-2 lg:mt-4 lg:mb-3">
                Cooperativies
              </p>
              <div className="w-full flex flex-col md:grid grid-cols-2 gap-2 lg:divide-x-2 whitespace-nowrap capitalize justify-between items-center">
                {cooperativies.map((cooperative) => (
                  <span
                    className="flex flex-col w-full even:bg-green-50 p-2 px-4 border"
                    key={cooperative._id}>
                    {cooperative.name},
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* User activity */}
      <hr />
      <div className="px-6 py-8 flex flex-col gap-6">
        <h4 className="font-[500]">User's Statistics</h4>
        <div className="p-4 w-full border rounded-lg">
          <div className="flex gap-[11px] mb-4">
            <select name="" id="">
              <option value="">2023</option>
            </select>
            <select className="bg-gray-100 p-1 rounded" name="" id="">
              <option value="">Weekly</option>
            </select>
          </div>

          <div className="flex justify-center gap-[5px] mb-[30px]">
            <select name="" id="">
              <option value="">Jan 1 - Jan 7</option>
            </select>
            <p className="bg-gray-100 p-1 rounded" id="">
              Week total: 30
            </p>
          </div>

          <div className="flex justify-between">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((key) => (
              <div key={key} className="inline-flex flex-col items-center">
                <div
                  className={`w-[7px] bg-[#546E7A] h-[126px] rounded-t-lg mb-[6px]`}></div>
                <p>{key}</p>
              </div>
            ))}
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
        user={state}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        toggleDiaglog={toggleDiaglog}
      />
      <DeleteDialog
        user={state}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
        toggleDelete={toggleDelete}
      />
    </div>
  )
}

export default UserDetails
