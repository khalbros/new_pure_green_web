/* eslint-disable @typescript-eslint/no-unused-vars */
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
  DialogBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
import { FaEye } from "react-icons/fa"
import { TfiMore } from "react-icons/tfi"
import {
  AiFillCheckCircle,
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../../assets/illustrations/no-data.png"
import { MdAdd, MdCancel, MdDeleteForever } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import usePagination from "../../../../hooks/usePagination"
import Input from "../../../../components/form/input"
import QueryResult from "../../../../components/queryResult"

import { IDisbursement } from "../../../../interfaces/disbursement"
import { DisbursementContext } from "./"
import {
  fetchData,
  generateExcelFile,
  getUser,
  shortDateFormatter,
} from "../../../../utils"
import { useAppDispatch, useAppSelector } from "../../../../store"
import DisbursementDetails from "./details"
import { toast } from "react-toastify"
import { disbursementSelector } from "../../../../store/slices/disbursement/index"
import { IFarmer } from "../../../../interfaces/farmer"
import { IBundle } from "../../../../interfaces/bundle"
import confirmAction from "../../../../assets/illustrations/thinking.png"
import { Dialog } from "@material-tailwind/react"
import {
  approveDisbursementAction,
  deleteDisbursementAction,
} from "../../../../store/actions/disbursement"
import Receipt from "./receipt"
import { useReactToPrint } from "react-to-print"
import { IoMdPrint } from "react-icons/io"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { IUser } from "../../../../interfaces/user"
import { HiDocumentDownload } from "react-icons/hi"
import { IProject } from "../../../../interfaces/project"
import { ICooperative } from "../../../../interfaces/cooperative"
import { useQuery } from "react-query"
import EmptyResult from "../emptyResult"

const DisbursementTable = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["disbursement"],
    queryFn: async () => {
      return fetchData("/disbursement").then((res) => res.data)
    },
  })
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [disbursements, setDisbursements] = useState<IDisbursement[]>(data)
  const [disbursement, setDisbursement] = useState<IDisbursement>()
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(disbursements)
  const [_ctx, dispatch] = useContext(DisbursementContext)
  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const disbursementState = useAppSelector(disbursementSelector)

  // Export Data Handler
  const exportTableData = () => {
    return disbursements?.map((disbursement) => ({
      "Referance ID": disbursement.ref_id,
      "Farmer Name": (disbursement.farmer as IFarmer)?.first_name,
      "Farmer ID": (disbursement.farmer as IFarmer)?.farmer_id,
      Cooperative: (
        (disbursement.farmer as IFarmer)?.cooperative as ICooperative
      )?.name,
      Warehouse: (disbursement.warehouse as IWarehouse)?.name,
      "Hectare(s)": disbursement.hectares,
      Bundle: (disbursement.bundle as IBundle)?.name,
      "Loan Amount": disbursement.loan_amount,
      Equity: disbursement.equity,
      "Repayment Amount": disbursement.repayment_amount,
      "Outstanding Amount": disbursement.outstanding_loan,
      "Overage Amount": disbursement.overage,
      "Booked By": (disbursement.disbursedBy as IUser)?.name,
      Project: (disbursement.project as IProject)?.name,
      Status: disbursement.status,
    }))
  }

  // printing handlers
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint() {
      setOpen(false)
      navigate(-1)
    },
  })

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setDisbursements(data)
      return
    }

    const result = (data as IDisbursement[])?.filter(
      (disbursement) =>
        (disbursement.farmer as IFarmer)?.first_name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (disbursement.farmer as IFarmer)?.farmer_id
          ?.toLowerCase()
          .includes(value.toLowerCase())
    )
    setDisbursements(result)
  }

  // set user context and navigate to edit user
  const handleEdit = (disbursement: IDisbursement) => {
    dispatch(disbursement)
    navigate("edit")
  }

  // handle delete
  const handleDelete = (disbursement: IDisbursement) => {
    dispatchAction(
      deleteDisbursementAction({ ...disbursement }, () =>
        setOpenDelete(!openDelete)
      )
    )
  }
  // handle status
  const handleStatus = (disbursement: IDisbursement) => {
    dispatchAction(
      approveDisbursementAction(
        { ...disbursement, isApproved: disbursement.isApproved ? false : true },
        () => setOpenDialog(!openDialog)
      )
    )
  }

  // open drawer with users details
  const toggleDrawer = (disbursement?: IDisbursement) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDeleteDialog = (disbursement?: IDisbursement) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpenDelete(!openDelete)
  }
  // open or close status dialog
  const toggleDialog = (disbursement?: IDisbursement) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpenDialog(!openDialog)
  }

  const togglePrint = (disbursement?: IDisbursement) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpen(!open)
    // navigate(-1)
  }

  useEffect(() => {
    return () => {
      fetchData("/disbursement")
        .then((res) => {
          if (res.data) setDisbursements(() => res.data)
        })
        .catch((err) => toast.error(err.message))
    }
  }, [data, dispatchAction, disbursementState.data])

  return (
    <>
      <QueryResult
        data={data}
        loading={isLoading}
        error={isError ? String(error) : ""}
        emptyResult={
          <EmptyResult
            item="Loan Booking"
            image={AddUser}
            path="/dashboard/disbursement/input-loan/booking"
          />
        }>
        <div className="flex items-center gap-2">
          {currentUser.role === "WAREHOUSE ADMIN" && (
            <Button
              onClick={() =>
                navigate("/dashboard/disbursement/input-loan/booking")
              }
              className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
              <MdAdd className="text-[18px] lg:text-[30px]" /> Book Loan
            </Button>
          )}
          <Button
            onClick={() =>
              generateExcelFile(exportTableData(), "disbursements")
            }
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
        />
        <>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg capitalize whitespace-nowrap">
              <thead className="bg-green-50 text-[14px] lg:text-[17px]">
                <tr>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    {/* <input type="checkbox" /> */}
                    S/N
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Farmer
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Cooperative
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Hecters
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Bundle
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Warehouse
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Loan amount
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Equity
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Repayment amount
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Outstanding
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Overage
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    LRP type
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Date
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Status
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((disbursement, key) => (
                  <tr key={key} className={`divide-y even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3 text-[14px] lg:text-[17px]">
                      <span>{key + 1}</span>
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px] font-bold">
                      <div className="flex flex-col">
                        <span>
                          {`${(disbursement?.farmer as IFarmer)?.first_name} ${
                            (disbursement?.farmer as IFarmer)?.other_name ?? ""
                          } ${(disbursement?.farmer as IFarmer)?.last_name}`}
                        </span>
                        <span className="text-gray-500 tracking-wider font-bold text-[10px] md:text-sm">
                          {(disbursement?.farmer as IFarmer)?.farmer_id}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px]">
                      {(disbursement?.cooperative as ICooperative)?.name}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px]">
                      {disbursement.hectares}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px]">
                      {(disbursement.bundle as IBundle)?.name}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px]">
                      {(disbursement.warehouse as IWarehouse)?.name}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px] tracking-wider">
                      {disbursement.loan_amount?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px] tracking-wider">
                      {disbursement.equity?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px] tracking-wider">
                      {disbursement.repayment_amount?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px] tracking-wider">
                      {disbursement.outstanding_loan?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px] tracking-wider">
                      {disbursement.overage?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td
                      className={`p-3 text-[14px] lg:text-[17px] uppercase font-bold tracking-wider ${
                        disbursement?.repayment_type === "Grains"
                          ? "text-green-700"
                          : "text-blue-800"
                      }`}>
                      {disbursement.repayment_type}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px]">
                      {shortDateFormatter(disbursement.createdAt!)}
                    </td>
                    <td className="p-3 text-[14px] lg:text-[17px]">
                      <span
                        className={`${
                          disbursement.status === "PAID"
                            ? "bg-green-400"
                            : !disbursement?.isApproved
                            ? "bg-gray-500"
                            : "bg-red-500"
                        } whitespace-nowrap px-4 py-1 text-center text-white uppercase rounded-full cursor-pointer`}>
                        {!disbursement?.isApproved
                          ? "PENDING"
                          : disbursement?.status}
                      </span>
                    </td>

                    <td className="p-3 text-[14px] lg:text-[17px]">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <span className="cursor-pointer">
                            <TfiMore className="text-3xl md:text-4xl" />
                          </span>
                        </MenuHandler>
                        <MenuList>
                          <MenuItem
                            className="border-b-2 inline-flex gap-2"
                            onClick={() => toggleDrawer(disbursement)}>
                            <FaEye size={16} /> View details
                          </MenuItem>

                          {(currentUser?.role === "WAREHOUSE MANAGER" ||
                            currentUser?.role === "WAREHOUSE ADMIN") &&
                            !disbursement?.isApproved && (
                              <MenuItem
                                onClick={() => handleEdit(disbursement)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillEdit size={16} /> Edit
                              </MenuItem>
                            )}

                          {(currentUser?.role === "AREA SALES MANAGER" ||
                            currentUser?.role === "SUPER ADMIN" ||
                            currentUser?.role === "DATA ANALYST") &&
                            disbursement?.isApproved && (
                              <MenuItem
                                onClick={() =>
                                  navigate(
                                    "/dashboard/disbursement/input-loan/affidavit",
                                    {
                                      state: disbursement,
                                    }
                                  )
                                }
                                className="inline-flex gap-2 border-b-2">
                                <IoMdPrint
                                  size={16}
                                  className="text-green-500"
                                />
                                Affidavit
                              </MenuItem>
                            )}

                          {disbursement?.isApproved && (
                            <MenuItem
                              onClick={() => togglePrint(disbursement)}
                              className="inline-flex gap-2 border-b-2">
                              <IoMdPrint size={16} className="text-blue-500" />
                              Print Receipt
                            </MenuItem>
                          )}

                          {(currentUser?.role === "SUPER ADMIN" ||
                            currentUser?.role === "DATA ANALYST" ||
                            currentUser?.role === "WAREHOUSE MANAGER") &&
                          disbursement?.isApproved ? (
                            <>
                              {(disbursement?.status === "PENDING" ||
                                disbursement?.status === "NOT PAID") && (
                                <MenuItem
                                  onClick={() => toggleDialog(disbursement)}
                                  className="inline-flex gap-2 border-b-2">
                                  <AiFillCheckCircle size={16} color="red" />{" "}
                                  Reject
                                </MenuItem>
                              )}
                              <MenuItem
                                onClick={() => toggleDeleteDialog(disbursement)}
                                className="inline-flex gap-2 border-b-2">
                                <MdDeleteForever
                                  size={16}
                                  className="text-red-400"
                                />
                                Delete
                              </MenuItem>
                            </>
                          ) : (currentUser?.role === "SUPER ADMIN" ||
                              currentUser?.role === "DATA ANALYST" ||
                              currentUser?.role === "WAREHOUSE MANAGER") &&
                            !disbursement?.isApproved ? (
                            <>
                              <MenuItem
                                onClick={() => toggleDialog(disbursement)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillCheckCircle size={16} color="green" />{" "}
                                Approve
                              </MenuItem>
                              <MenuItem
                                onClick={() => toggleDeleteDialog(disbursement)}
                                className="inline-flex gap-2 border-b-2">
                                <MdDeleteForever
                                  size={16}
                                  className="text-red-400"
                                />{" "}
                                Delete
                              </MenuItem>
                            </>
                          ) : (
                            <>
                              <MenuItem
                                onClick={() => toggleDeleteDialog(disbursement)}
                                className="inline-flex gap-2 border-b-2">
                                <MdDeleteForever
                                  size={16}
                                  className="text-red-400"
                                />{" "}
                                Delete
                              </MenuItem>
                            </>
                          )}
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
                    currentPage === page ? "bg-gray-100" : ""
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

        {/* action */}
        <Dialog size="sm" open={openDialog} handler={toggleDialog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDialog()}
              />{" "}
            </div>
            <img
              src={confirmAction}
              className="w-[120px] mx-auto mb-7 block"
              alt="delete disbursement"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to{" "}
              {disbursement?.isApproved ? "reject" : "approve"} this
              disbursement
            </p>
            <Button
              onClick={() => handleStatus(disbursement!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>

        {/* delete */}
        <Dialog size="sm" open={openDelete} handler={toggleDeleteDialog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDeleteDialog()}
              />{" "}
            </div>
            <img
              src={confirmAction}
              className="w-[120px] mx-auto mb-7 block"
              alt="delete farmer"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to DELETE disbursement for “
              {(disbursement?.farmer as IFarmer)?.first_name}”
            </p>
            <Button
              onClick={() => handleDelete(disbursement!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
        <DisbursementDetails
          disbursement={disbursement}
          open={openDrawer}
          close={toggleDrawer}
        />

        {/* RECEIPT */}
        <Dialog
          size="sm"
          className="overflow-y-scroll h-full"
          open={open}
          handler={() => setOpen(!open)}>
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
              <Receipt {...disbursement} />
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

export default DisbursementTable
