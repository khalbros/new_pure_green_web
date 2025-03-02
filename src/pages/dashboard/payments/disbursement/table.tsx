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
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../../assets/illustrations/no-data.png"
import {
  MdAdd,
  MdCancel,
  MdDeleteForever,
  MdOutlineKeyboardBackspace,
} from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import usePagination from "../../../../hooks/usePagination"
import Input from "../../../../components/form/input"
import QueryResult from "../../../../components/queryResult"
import EmptyResult from "../emptyResult"
import useFetch from "../../../../hooks/useFetch"
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
import Receipt from "./receipt"
import { useReactToPrint } from "react-to-print"
import { IoMdPrint } from "react-icons/io"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { IUser } from "../../../../interfaces/user"
import { HiDocumentDownload } from "react-icons/hi"
import { IProject } from "../../../../interfaces/project"
import { ICooperative } from "../../../../interfaces/cooperative"
import { ICashLRP } from "../../../../interfaces/cashLRP"
import { IDisbursement } from "../../../../interfaces/disbursement"
import { deleteCashLRPAction } from "../../../../store/actions/disbursement"

const CashDisbursementTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [disbursements, setDisbursements] = useState<ICashLRP[]>()
  const [disbursement, setDisbursement] = useState<ICashLRP>()
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(disbursements)
  const [_ctx, dispatch] = useContext(DisbursementContext)
  const { data, error, loading, message } = useFetch(`/disbursement/cash`)
  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const disbursementState = useAppSelector(disbursementSelector)

  // Export Data Handler
  const exportTableData = () => {
    return disbursements?.map((disburse) => ({
      "Referance ID": disburse.ref_id,
      "Farmer Name": (
        (disburse?.disbursement as unknown as IDisbursement)?.farmer as IFarmer
      )?.first_name,
      "Farmer ID": (
        (disburse?.disbursement as unknown as IDisbursement)?.farmer as IFarmer
      )?.farmer_id,
      Cooperative: (
        (
          (disburse?.disbursement as unknown as IDisbursement)
            ?.farmer as IFarmer
        )?.cooperative as ICooperative
      )?.name,
      Warehouse: (
        (disburse.disbursement as unknown as IDisbursement)
          ?.warehouse as IWarehouse
      )?.name,
      "Hectare(s)": (disburse?.disbursement as unknown as IDisbursement)
        ?.hectares,
      Bundle: (
        (disburse?.disbursement as unknown as IDisbursement)?.bundle as IBundle
      )?.name,
      "Loan Amount": (disburse?.disbursement as unknown as IDisbursement)
        ?.loan_amount,
      Equity: (disburse?.disbursement as unknown as IDisbursement)?.equity,
      "Repayment Amount": (disburse?.disbursement as unknown as IDisbursement)
        ?.repayment_amount,
      "Cash Paid": disburse.cash_paid,
      "Outstanding Amount": disburse?.outstanding_loan,
      "Overage Amount": disburse?.overage,
      "Logistics Fee": disburse.logistics_fee,
      "Processing Fee": disburse.processing_fee,
      "Booked By": (
        (disburse?.disbursement as unknown as IDisbursement)
          ?.disbursedBy as IUser
      )?.name,
      Date: disburse.updatedAt,
      Project: (
        (disburse?.disbursement as unknown as IDisbursement)
          ?.project as IProject
      )?.name,
      Status: disburse.status,
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
    const result = (data as ICashLRP[])?.filter(
      (disburse) =>
        (
          (disburse?.disbursement as unknown as IDisbursement)
            ?.farmer as IFarmer
        )?.first_name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (
          (disburse?.disbursement as unknown as IDisbursement)
            ?.farmer as IFarmer
        )?.farmer_id?.toLowerCase() ||
        (
          (
            (disburse?.disbursement as unknown as IDisbursement)
              ?.farmer as IFarmer
          )?.cooperative as ICooperative
        )?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (
          (disburse.disbursement as unknown as IDisbursement)
            ?.warehouse as IWarehouse
        )?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        String(
          (disburse?.disbursement as unknown as IDisbursement)?.hectares
        )?.includes(value.toLowerCase()) ||
        (
          (disburse?.disbursement as unknown as IDisbursement)
            ?.bundle as IBundle
        )?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        String(
          (disburse?.disbursement as unknown as IDisbursement)?.loan_amount
        )?.includes(value.toLowerCase()) ||
        String(
          (disburse?.disbursement as unknown as IDisbursement)?.equity
        )?.includes(value.toLowerCase()) ||
        String(disburse.cash_paid)?.includes(value.toLowerCase()) ||
        (
          (disburse?.disbursement as unknown as IDisbursement)
            ?.disbursedBy as IUser
        )?.name
          ?.toLowerCase()
          .includes(value.toLowerCase())
    )
    setDisbursements(result)
  }

  // set user context and navigate to edit user
  const handleEdit = (disbursement: ICashLRP) => {
    dispatch(disbursement)
    navigate("edit")
  }

  // handle delete
  const handleDelete = (disbursement: ICashLRP) => {
    dispatchAction(
      deleteCashLRPAction(disbursement as IDisbursement, () =>
        setOpenDelete(!openDelete)
      )
    )
  }

  // open drawer with users details
  const toggleDrawer = (disbursement?: ICashLRP) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDeleteDialog = (disbursement?: ICashLRP) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpenDelete(!openDelete)
  }

  const togglePrint = (disbursement?: ICashLRP) => {
    if (disbursement) {
      setDisbursement(disbursement)
    }
    setOpen(!open)
    // navigate(-1)
  }

  useEffect(() => {
    return () => {
      fetchData("/disbursement/cash")
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
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Disbursement"
            image={AddUser}
            path="/dashboard/payment/loan/repayment"
          />
        }>
        <div className="flex items-center md:m-6 m-4">
          <span onClick={() => navigate(-1)}>
            <MdOutlineKeyboardBackspace
              size={24}
              className="mr-3 cursor-pointer text-green-500"
            />
          </span>
          <h4 className="text-lg lg:text-xl text-green-500">Cash LRP</h4>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/dashboard/payment/loan/repayment")}
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[18px] lg:text-[30px]" />
            New Cash LRP
          </Button>

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
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">
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
                    Warehouse
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Hecters
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Bundle
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
                    Cash Paid
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Outstanding
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Overage
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Booked By
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
                {currentItems?.map((disburse, key) => (
                  <tr key={key} className={`divide-y even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3">
                      <span>{key + 1}</span>
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">
                      <div className="flex flex-col">
                        <span>
                          {
                            (
                              (
                                disburse?.disbursement as unknown as IDisbursement
                              )?.farmer as IFarmer
                            )?.first_name
                          }
                        </span>
                        <span className="text-gray-500 tracking-wider font-bold text-[10px] md:text-sm">
                          {
                            (
                              (
                                disburse?.disbursement as unknown as IDisbursement
                              )?.farmer as IFarmer
                            )?.farmer_id
                          }
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {
                        (
                          (
                            (disburse?.disbursement as unknown as IDisbursement)
                              ?.farmer as IFarmer
                          )?.cooperative as ICooperative
                        )?.name
                      }
                    </td>
                    <td className="p-3">
                      {
                        (
                          (disburse.disbursement as unknown as IDisbursement)
                            ?.warehouse as IWarehouse
                        )?.name
                      }
                    </td>
                    <td className="p-3">
                      {
                        (disburse?.disbursement as unknown as IDisbursement)
                          ?.hectares
                      }
                    </td>
                    <td className="p-3">
                      {
                        (
                          (disburse?.disbursement as unknown as IDisbursement)
                            ?.bundle as IBundle
                        )?.name
                      }
                    </td>
                    <td className="p-3">
                      {(
                        disburse?.disbursement as unknown as IDisbursement
                      )?.loan_amount?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] tracking-wider">
                      {(
                        disburse?.disbursement as unknown as IDisbursement
                      )?.equity?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] tracking-wider">
                      {(
                        disburse?.disbursement as unknown as IDisbursement
                      )?.repayment_amount?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] tracking-wider">
                      {disburse?.cash_paid?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] tracking-wider">
                      {disburse?.outstanding_loan?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 text-[14px] tracking-wider">
                      {disburse?.overage?.toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3">
                      {
                        (
                          (disburse?.disbursement as unknown as IDisbursement)
                            ?.disbursedBy as IUser
                        )?.name
                      }
                    </td>
                    <td className="p-3">
                      {shortDateFormatter(disburse.updatedAt!)}
                    </td>
                    <td className="p-3">
                      <span
                        className={`${
                          disburse.status === "PAID"
                            ? "bg-green-600"
                            : disburse.status === "PART PAYMENT"
                            ? "bg-blue-700"
                            : "bg-red-500"
                        } whitespace-nowrap px-4 py-1 text-center text-white uppercase rounded-full cursor-pointer`}>
                        {disburse?.status}
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
                            onClick={() => toggleDrawer(disburse)}>
                            <FaEye size={16} /> View details
                          </MenuItem>

                          {currentUser?.role === "FINANCIAL OFFICER" && (
                            <>
                              <MenuItem
                                onClick={() => handleEdit(disburse)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillEdit size={16} /> Edit
                              </MenuItem>
                              <MenuItem
                                onClick={() => togglePrint(disburse)}
                                className="inline-flex gap-2 border-b-2">
                                <IoMdPrint
                                  size={16}
                                  className="text-blue-500"
                                />
                                Print
                              </MenuItem>
                              <MenuItem
                                onClick={() => toggleDeleteDialog(disburse)}
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
              {
                (
                  (disbursement?.disbursement as unknown as IDisbursement)
                    ?.farmer as IFarmer
                )?.first_name
              }
              ”
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

export default CashDisbursementTable
