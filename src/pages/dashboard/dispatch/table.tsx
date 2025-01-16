/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import {
  Button,
  Dialog,
  DialogBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
import {FaEye} from "react-icons/fa"
import {TfiMore} from "react-icons/tfi"
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import {MdAdd, MdCancel} from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import {FiSearch} from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import {DispatchContext} from "."
import useFetch from "../../../hooks/useFetch"
import {
  acceptDispatchAction,
  approveDispatchAction,
  deleteDispatchAction,
  verifyDispatchAction,
} from "../../../store/actions/dispatch"
import {useAppDispatch, useAppSelector} from "../../../store"
import {IoMdCheckmarkCircle, IoMdPrint} from "react-icons/io"
import {fetchData, generateExcelFile, getUser} from "../../../utils"
import {IClient} from "../../../interfaces/client"
import {IWarehouse} from "../../../interfaces/warehouse"
import {ICommodity} from "../../../interfaces/commodity"
import {IGrade} from "../../../interfaces/grade"
import {IDispatch} from "../../../interfaces/dispatch"
import {dispatchSelector} from "../../../store/slices/dispatch"
import {toast} from "react-toastify"
import DispatchDetails from "./details"
import EmptyResult from "./emptyResult"
import {IUser} from "../../../interfaces/user"
import {useReactToPrint} from "react-to-print"
import Receipt from "./receipt"
import {HiDocumentDownload} from "react-icons/hi"
import {IInput} from "../../../interfaces/input"

const DispatchTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openOtpBox, setOpenOtpBox] = useState<boolean>(false)
  const [openStatusDialog, setStatusDialog] = useState<boolean>(false)
  const [openConfirmDialog, setConfirmDialog] = useState<boolean>(false)
  const [openDeleteDialog, setDeleteDialog] = useState<boolean>(false)
  const [dispatches, setDispatches] = useState<IDispatch[]>()
  const [dispatche, setDispatche] = useState<IDispatch>()
  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(dispatches)
  const [_ctx, dispatch] = useContext(DispatchContext)
  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const dispatchState = useAppSelector(dispatchSelector)

  const [otp, setOtp] = useState<string[]>([])
  const [open, setOpen] = useState<boolean>(false)

  // export data handler
  const exportTableData = () => {
    return dispatches?.map((dispatchs) => ({
      "Warehouse / Client": dispatchs?.client
        ? (dispatchs.client as IClient)?.name
        : (dispatchs.warehouse as IWarehouse)?.name,
      Type: dispatchs.type,
      item: (dispatchs.item as ICommodity)?.name,
      Grade: (dispatchs.grade as IGrade)?.name,
      "Number of Bags": dispatchs.num_bags,
      "Gross weight": dispatchs.gross_weight,
      Status: dispatchs.status,
    }))
  }

  // printing handlers
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint() {
      setOpen(false)
    },
  })
  const togglePrint = (dispatche?: IDispatch) => {
    if (dispatche) {
      setDispatche(dispatche)
    }
    setOpen(!open)
  }
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value
    const updatedOtp = [...otp]
    updatedOtp[index] = value
    setOtp(updatedOtp)
    if (value.length > 0 && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handleInputPaste = (e: React.ClipboardEvent) => {
    const pasteData = e.clipboardData.getData("text")
    const otpArray = pasteData.split("").slice(0, inputRefs.length)
    otpArray.forEach((value, index) => {
      inputRefs[index].current!.value = value
      if (index < inputRefs.length - 1) {
        inputRefs[index + 1].current?.focus()
      }
    })

    if (otpArray.length === 4) {
      setOtp(otpArray)
    }
    e.preventDefault()
  }

  const handleInputKeyDown = (e: any, index: number) => {
    if (e.key === "Backspace" && index > 0 && e.target.value === "") {
      inputRefs[index - 1].current?.focus()
    }
  }

  useEffect(() => {
    inputRefs[0].current?.focus()
  }, [])

  const {data, error, loading, message} = useFetch(`/dispatch`)

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (!value) {
      setDispatches(data)
      return
    }
    const result = (data as IDispatch[])?.filter(
      (dispatch) =>
        dispatch.type?.toLowerCase().includes(value.toLowerCase()) ||
        dispatch.status?.toLowerCase().includes(value.toLowerCase()) ||
        (dispatch.client as IClient)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        dispatch.status?.toLowerCase().includes(value.toLowerCase()) ||
        (dispatch.client as IClient)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (dispatch.warehouse as IWarehouse)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (dispatch.grade as IGrade)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase())
    )
    setDispatches(result)
  }

  // set user context and navigate to edit dispitch
  const handleEdit = (dispatches: IDispatch) => {
    dispatch(dispatches)
    navigate("edit")
  }

  // set user context and change status
  const handleStatus = (dispatche: IDispatch, isApproved: boolean) => {
    dispatchAction(
      approveDispatchAction({...dispatche, isApproved}, () =>
        toggleStatusDiaglog(dispatche)
      )
    )
  }

  // set user context and change status
  const handleCompletion = (dispatche: IDispatch, isReceived: boolean) => {
    dispatchAction(
      acceptDispatchAction({...dispatche, isReceived}, () =>
        toggleConfirmDiaglog(dispatche)
      )
    )
  }
  // set context and delete
  const handleDelete = (dispatche: IDispatch) => {
    dispatchAction(
      deleteDispatchAction({...dispatche}, () => setDeleteDialog(false))
    )
    toggleDeleteDiaglog()
  }

  // set context and delete
  const handleVerification = (id: string, otp: string) => {
    dispatchAction(
      verifyDispatchAction({id, otp}, () => {
        setOpenOtpBox(false)
        togglePrint()
      })
    )
    if (dispatchState.error) {
      setOtp([])
    }
    console.log(id)
  }
  // open drawer with users details
  const toggleDrawer = (dispatche?: IDispatch) => {
    if (dispatche) {
      setDispatche(dispatche)
    }
    setOpenDrawer(!openDrawer)
  }
  // open or close status dialog
  const toggleStatusDiaglog = (dispatche?: IDispatch, status?: string) => {
    if (dispatche) {
      setDispatche({...dispatche, status})
    }
    setStatusDialog(!openStatusDialog)
  }
  // open or close confirm dialog
  const toggleConfirmDiaglog = (dispatche?: IDispatch, status?: string) => {
    if (dispatche) {
      setDispatche({...dispatche, status})
    }
    setConfirmDialog(!openConfirmDialog)
  }
  // open or close delete dialog
  const toggleDeleteDiaglog = (dispatche?: IDispatch) => {
    if (dispatche) {
      setDispatche({...dispatche})
    }
    setDeleteDialog(!openDeleteDialog)
  }

  // otp box
  const toggleOtpBox = (dispatche?: IDispatch) => {
    if (dispatche) {
      setDispatche(dispatche)
    }
    setOpenOtpBox(!openOtpBox)
  }

  useEffect(() => {
    if (data) {
      setDispatches(data)
    }
    fetchData(`/dispatch`)
      .then(
        (res) => setDispatches(res.data),
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [data, dispatchAction, dispatchState.data])

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Dispatch"
            image={AddUser}
            path="/dashboard/dispatch-management/add"
          />
        }>
        <div className="flex items-center gap-2">
          {currentUser?.role === "WAREHOUSE MANAGER" && (
            <Button
              onClick={() => navigate("/dashboard/dispatch-management/add")}
              className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
              <MdAdd className="text-[18px] lg:text-[30px]" /> New Dispatch
            </Button>
          )}
          <Button
            onClick={() => generateExcelFile(exportTableData(), "dispatch")}
            className="bg-blue-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <HiDocumentDownload className="text-[18px] lg:text-[30px]" />
            Export
          </Button>
        </div>

        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
          // rightIcon={
          //   <Menu placement="bottom-start">
          //     <MenuHandler>
          //       <span className="search-filter">
          //         <FaFilter /> Filter
          //       </span>
          //     </MenuHandler>
          //     <MenuList>
          //       <MenuItem>Completed</MenuItem>
          //       <MenuItem>Pending</MenuItem>
          //       <MenuItem>Approved</MenuItem>
          //       <MenuItem>Rejected</MenuItem>
          //     </MenuList>
          //   </Menu>
          // }
        />

        <>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
              <thead className="bg-green-50">
                <tr className="">
                  <th className="w-10">S/N</th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Client's Name / Warehouse
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Dispatch Type
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Item
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Grade
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Weight {" (Kg)"}
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Number Of Bags
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Status
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((dispatchs, key) => (
                  <tr
                    key={key}
                    className={`divide-y capitalize even:bg-[#FAFAFA] whitespace-nowrap`}>
                    <td className="w-10 pl-3">
                      <span>{key + 1}</span>
                    </td>
                    <td className="p-3 font-bold tracking-wide">
                      {dispatchs?.client
                        ? (dispatchs.client as IClient)?.name
                        : (dispatchs.warehouse as IWarehouse)?.name}
                    </td>
                    <td className="p-3">{dispatchs.type}</td>
                    <td className="p-3">
                      {dispatchs.commodity
                        ? (dispatchs.commodity as ICommodity)?.name
                        : (dispatchs.input as IInput)?.name}
                    </td>
                    <td className="p-3">
                      {(dispatchs?.grade as IGrade)?.name}
                    </td>
                    <td className="p-3">{dispatchs?.gross_weight}</td>
                    <td className="p-3">{dispatchs?.num_bags}</td>
                    <td className="p-3 flex items-center flex-nowrap">
                      <span
                        className={` flex flex-nowrap w-fit px-2 md:px-4 md:py-1 text-center ${
                          dispatchs.status === "PENDING"
                            ? "bg-gray-600"
                            : dispatchs.status === "DISAPPROVED"
                            ? "bg-orange-500"
                            : dispatchs.status === "REJECTED"
                            ? "bg-red-600"
                            : dispatchs.status === "APPROVED"
                            ? "bg-blue-600"
                            : dispatchs.status === "VERIFIED"
                            ? "bg-teal-500"
                            : "bg-green-600"
                        } text-white uppercase rounded-full cursor-pointer truncate text-ellipsis`}>
                        {dispatchs.status}
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
                            onClick={() => toggleDrawer(dispatchs)}>
                            <FaEye size={16} /> View details
                          </MenuItem>

                          {currentUser?.role !== "SUPER ADMIN" &&
                          !dispatchs.isApproved &&
                          dispatchs.status === "PENDING" ? (
                            <>
                              <MenuItem
                                onClick={() => handleEdit(dispatchs)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillEdit size={16} /> Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => toggleDeleteDiaglog(dispatchs)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillDelete
                                  size={16}
                                  className="text-red-400"
                                />
                                Delete
                              </MenuItem>
                            </>
                          ) : null}
                          {currentUser?.role === "SUPER ADMIN" &&
                            (!dispatchs?.isApproved ? (
                              <>
                                <MenuItem
                                  onClick={() =>
                                    toggleStatusDiaglog(dispatchs, "APPROVED")
                                  }
                                  className="inline-flex gap-2 border-b-2">
                                  <IoMdCheckmarkCircle
                                    size={16}
                                    className="text-green-400"
                                  />{" "}
                                  Approve
                                </MenuItem>
                                <MenuItem
                                  onClick={() =>
                                    toggleStatusDiaglog(
                                      dispatchs,
                                      "DISAPPROVED"
                                    )
                                  }
                                  className="inline-flex gap-2 border-b-2">
                                  <MdCancel
                                    size={16}
                                    className="text-red-400"
                                  />{" "}
                                  Reject
                                </MenuItem>
                              </>
                            ) : null)}

                          {currentUser?.role === "WAREHOUSE MANAGER" &&
                            (dispatchs?.isApproved &&
                            dispatchs.status === "APPROVED" &&
                            (dispatchs.createdBy as IUser)?._id ===
                              currentUser?._id ? (
                              <>
                                <MenuItem
                                  onClick={() => toggleOtpBox(dispatchs)}
                                  className="inline-flex gap-2 border-b-2">
                                  <IoMdCheckmarkCircle
                                    size={16}
                                    className="text-green-400"
                                  />
                                  Confirm Dispatch
                                </MenuItem>
                              </>
                            ) : dispatchs.status === "VERIFIED" ? (
                              (dispatchs.warehouse as IWarehouse)?._id ===
                                (currentUser?.warehouse as IWarehouse)?._id && (
                                <>
                                  <MenuItem
                                    onClick={() =>
                                      toggleConfirmDiaglog(
                                        dispatchs,
                                        "COMPLETED"
                                      )
                                    }
                                    className="inline-flex gap-2 border-b-2">
                                    <IoMdCheckmarkCircle
                                      size={16}
                                      className="text-green-400"
                                    />
                                    Accept
                                  </MenuItem>
                                  <MenuItem
                                    onClick={() =>
                                      toggleConfirmDiaglog(
                                        dispatchs,
                                        "REJECTED"
                                      )
                                    }
                                    className="inline-flex gap-2 border-b-2">
                                    <IoMdCheckmarkCircle
                                      size={16}
                                      className="text-red-400"
                                    />
                                    Reject
                                  </MenuItem>
                                </>
                              )
                            ) : (
                              dispatchs.status === "COMPLETED" && (
                                <>
                                  <MenuItem
                                    onClick={() => togglePrint(dispatchs)}
                                    className="inline-flex gap-2 border-b-2">
                                    <IoMdPrint
                                      size={16}
                                      className="text-green-400"
                                    />
                                    Print
                                  </MenuItem>
                                </>
                              )
                            ))}
                        </MenuList>
                      </Menu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-8">
            {/* Previous Button */}
            <Button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="next-prev-btn"
              variant="outlined">
              <AiOutlineArrowLeft /> previous
            </Button>
            {/* pages */}
            <ul className="flex">
              {pages?.map((page) => (
                <li
                  onClick={() => changePage(page)}
                  key={page}
                  className={`pagination-item ${
                    currentPage === page ? "bg-gray-200" : ""
                  }`}>
                  {page}
                </li>
              ))}
            </ul>
            {/* Next Button */}
            <Button
              onClick={nextPage}
              disabled={currentPage === pages?.length}
              className="next-prev-btn"
              variant="outlined">
              next <AiOutlineArrowRight />
            </Button>
          </div>
        </>
        {/* delete */}
        <Dialog size="sm" open={openDeleteDialog} handler={toggleDeleteDiaglog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDeleteDiaglog()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete user"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to{" DELETE "}this dispatch for “
              {(dispatche?.client as IClient)?.name}”
            </p>
            <Button
              onClick={() => handleDelete(dispatche!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>

        {/* Status */}
        <Dialog size="sm" open={openStatusDialog} handler={toggleStatusDiaglog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleStatusDiaglog()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete user"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to{" "}
              {dispatche?.status === "DISAPPROVED" ? "REJECTE" : "APPROVE"} this
              dispatch for “
              {dispatche?.client
                ? (dispatche?.client as IClient)?.name
                : (dispatche?.warehouse as IWarehouse)?.name}{" "}
              ”
            </p>
            <Button
              onClick={() =>
                handleStatus(
                  dispatche!,
                  dispatche?.status === "APPROVED"
                    ? true
                    : dispatche?.status === "APPROVED"
                    ? false
                    : !!dispatche?.isApproved
                )
              }
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        {/* COMPLETE DISPATCH */}
        <Dialog
          size="sm"
          open={openConfirmDialog}
          handler={toggleConfirmDiaglog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleConfirmDiaglog()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete user"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to{" "}
              {dispatche?.status === "REJECTED" ? "REJECT" : "COMPLETE"} this
              dispatch for “
              {dispatche?.client
                ? (dispatche?.client as IClient)?.name
                : (dispatche?.warehouse as IWarehouse)?.name}{" "}
              ”
            </p>
            <Button
              onClick={() =>
                handleCompletion(
                  dispatche!,
                  dispatche?.status === "COMPLETED" ? true : false
                )
              }
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>

        {/* OtP Box */}
        <Dialog size="sm" open={openOtpBox} handler={toggleOtpBox}>
          <DialogBody className="">
            <div className="flex justify-end">
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={toggleOtpBox}
              />
            </div>

            <h5 className="flex text-2xl items-center justify-center text-green-800 font-sans font-semibold m-5">
              Complete Dispatch
            </h5>
            <p className="flex items-center justify-center text-red-600 font-sans text-base m-5">
              {dispatchState.message}
            </p>

            {/*  */}
            <div className="flex flex-1 items-center justify-center mt-4">
              {inputRefs?.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  value={otp[index] || ""}
                  type="text"
                  maxLength={1}
                  className={`w-9 h-9 md:w-12 md:h-12 m-3 text-2xl md:text-3xl text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-700 ${
                    otp[index] && "ring-2 ring-green-700 text-green-900"
                  }`}
                  onChange={(e) => handleInputChange(e, index)}
                  onKeyDown={(e) => handleInputKeyDown(e, index)}
                  onPaste={handleInputPaste}
                />
              ))}
            </div>
            {/*  */}
            <div className="flex flex-col w-full items-center justify-between my-4 gap-5">
              <Button
                className="bg-green-700 w-[70%] my-4 py-3"
                onClick={() =>
                  handleVerification(dispatche?._id as string, otp.join(""))
                }>
                Verify
              </Button>
            </div>
          </DialogBody>
        </Dialog>
        {/* details box */}
        <DispatchDetails
          dispatch={dispatche}
          open={openDrawer}
          close={toggleDrawer}
        />
        {/* RECEIPT */}
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
            <div ref={componentRef}>
              <Receipt {...dispatche} />
            </div>
            <Button
              onClick={handlePrint}
              className="bg-green-600 w-60p mx-auto block my-10">
              Print
            </Button>
          </DialogBody>
        </Dialog>
      </QueryResult>
    </>
  )
}

export default DispatchTable
