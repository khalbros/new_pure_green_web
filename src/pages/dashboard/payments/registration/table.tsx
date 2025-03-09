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
  Dialog,
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
import { MdAdd, MdCancel, MdDeleteForever } from "react-icons/md"
import DeleteUser from "../../../../assets/illustrations/thinking.png"
import { FiSearch } from "react-icons/fi"
import { IEquity as IPayment } from "../../../../interfaces/equity"
import usePagination from "../../../../hooks/usePagination"
import { RegistrationContext } from "."
import QueryResult from "../../../../components/queryResult"

import Input from "../../../../components/form/input"
import { IFarmer } from "../../../../interfaces/farmer"
import PaymentDetails from "./details"
import { useReactToPrint } from "react-to-print"
import { IoMdPrint } from "react-icons/io"
import Receipt from "../receipt"
import {
  fetchData,
  generateExcelFile,
  getUser,
  shortDateFormatter,
} from "../../../../utils"
import { useAppDispatch, useAppSelector } from "../../../../store"
import { registrationSelector } from "../../../../store/slices/finance/registration"
import { deleteRegistrationPaymentAction } from "../../../../store/actions/finance"
import { toast } from "react-toastify"
import { HiDocumentDownload } from "react-icons/hi"
import { IUser } from "../../../../interfaces/user"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { useQuery, useQueryClient } from "react-query"
import EmptyResult from "../emptyResult"

const PaymentRegTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [payments, setPayments] = useState<IPayment[]>()
  const [payment, setPayment] = useState<IPayment>()
  const [_ctx, dispatch] = useContext(RegistrationContext)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["payment", "registration"],
    queryFn: async () => {
      return fetchData("/payment/list/registration").then((res) => res.data)
    },
  })
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(payments)

  const [open, setOpen] = useState<boolean>(false)
  const dispatchAction = useAppDispatch()

  const paymentState = useAppSelector(registrationSelector)

  // export data handler
  const exportTableData = () => {
    return payments?.map((payment) => ({
      "Payment For": "Registration",
      Farmer: (payment?.farmer as IFarmer)?.first_name,
      "Farmer ID": (payment?.farmer as IFarmer)?.farmer_id,
      Cooperative: ((payment?.farmer as IFarmer)?.cooperative as ICooperative)
        ?.name,
      Warehouse: (
        ((payment?.farmer as IFarmer)?.field_officer as IUser)
          ?.warehouse as IWarehouse
      )?.name,
      "Amount Paid": payment?.amount_paid,
      Hectares: payment?.hectares,
      Status: payment?.status ? "PAID" : "NOT PAID",
      "Paid By": (payment?.paid_by as IUser).name,
      Date: payment?.updatedAt && shortDateFormatter(payment?.updatedAt),
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
  const togglePrint = (payment?: IPayment) => {
    if (payment) {
      setPayment(payment)
    }
    setOpen(!open)
  }

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setPayments(data)
      return
    }
    const result = (data as IPayment[])?.filter(
      (payment) =>
        (payment.farmer as IFarmer).first_name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (payment.paid_by as IUser).name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (payment.farmer as IFarmer).farmer_id
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (
          ((payment?.farmer as IFarmer)?.field_officer as IUser)
            ?.warehouse as IWarehouse
        )?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        ((payment?.farmer as IFarmer)?.cooperative as ICooperative)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        shortDateFormatter(payment?.updatedAt as string)
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        String(payment?.amount_paid)
          ?.toLowerCase()
          .includes(value.toLowerCase())
    )
    setPayments(result)
  }

  // set payment context and navigate to edit payment
  const handleEdit = (payment: IPayment) => {
    dispatch(payment)
    navigate("edit")
  }

  // handle status
  // const handleStatus = (payment: IPayment) => {
  //   dispatchAction(
  //     approvePaymentAction({...payment, status: "APPROVED"}, () =>
  //       setOpenDialog(!openDialog)
  //     )
  //   )
  // }

  // handle delete
  const handleDelete = (payment: IPayment) => {
    dispatchAction(
      deleteRegistrationPaymentAction({ ...payment }, () => {
        queryClient.invalidateQueries(["payment", "registration"], {
          exact: true,
        })
        setOpenDelete(!openDelete)
      })
    )
    setRefresh(!refresh)
  }

  // open drawer with payments details
  const toggleDrawer = (payment?: IPayment) => {
    if (payment) {
      setPayment(payment)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDeleteDialog = (payment?: IPayment) => {
    if (payment) {
      setPayment(payment)
    }
    setOpenDelete(!openDelete)
  }

  useEffect(() => {
    fetchData("/payment/list/registration")
      .then((res) => {
        if (res.data) setPayments(res.data)
      })
      .catch((err) => toast.error(err.message))
  }, [data, dispatchAction, paymentState.data, refresh])

  return (
    <>
      <QueryResult
        data={data}
        loading={isLoading}
        error={isError ? String(error) : ""}
        emptyResult={<EmptyResult item="Payment" image={AddUser} path="add" />}>
        <div className="flex items-center m-4">
          <h4 className="text-xl lg:text-2xl text-green-500">Data Captured</h4>
        </div>
        <div className="flex items-center gap-2">
          {currentUser.role === "FINANCIAL OFFICER" && (
            <Button
              onClick={() => navigate("add")}
              className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
              <MdAdd className="text-[18px] lg:text-[30px]" /> Pay Now
            </Button>
          )}
          <Button
            onClick={() =>
              generateExcelFile(exportTableData(), "registrations")
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
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap capitalize">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">{/* <input type="checkbox" /> */}</th>
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
                    Amount Paid
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Hectares
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Paid By
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Date
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((payments, key) => (
                  <tr
                    key={key}
                    className={`flex-wrap divide-y even:bg-[#FAFAFA] place-items-center`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 flex flex-col flex-wrap gap-1 md:gap-2 items-start capitalize tracking-wide ">
                      <span className="font-bold">
                        {" "}
                        {(payments?.farmer as IFarmer)?.first_name +
                          " " +
                          ((payments?.farmer as IFarmer)?.other_name
                            ? (payments?.farmer as IFarmer)?.other_name + " "
                            : "") +
                          (payments?.farmer as IFarmer)?.last_name}
                      </span>
                      <span>{(payments?.farmer as IFarmer)?.farmer_id}</span>
                    </td>

                    <td className="p-3">
                      {(payments?.cooperative as ICooperative)?.name}
                    </td>
                    <td className="p-3">
                      {(payments.warehouse as IWarehouse)?.name}
                    </td>

                    <td className="p-3 font-bold tracking-wide">
                      {Number(payments?.amount_paid).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 font-bold tracking-wide">
                      {Number(payments?.hectares)}
                    </td>
                    <td className="p-3">
                      {(payments?.paid_by as IUser)?.name}
                    </td>
                    <td className="p-3">
                      {payments?.updatedAt &&
                        shortDateFormatter(payments?.updatedAt)}
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
                            onClick={() => toggleDrawer(payments)}>
                            <FaEye size={16} /> View details
                          </MenuItem>
                          {currentUser.role === "FINANCIAL OFFICER" && (
                            <>
                              <MenuItem
                                onClick={() => handleEdit(payments)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillEdit size={16} /> Edit
                              </MenuItem>

                              <MenuItem
                                onClick={() => togglePrint(payments)}
                                className="inline-flex gap-2 border-b-2">
                                <IoMdPrint
                                  size={16}
                                  className="text-green-400"
                                />
                                Print
                              </MenuItem>

                              <MenuItem
                                onClick={() => toggleDeleteDialog(payments)}
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
              src={DeleteUser}
              className="w-[120px] mx-auto mb-7 block"
              alt="delete farmer"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to DELETE this Payment for “
              {(payment?.farmer as IFarmer)?.first_name}”
            </p>
            <Button
              onClick={() => handleDelete(payment!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
        <PaymentDetails
          payment={payment}
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
              <Receipt {...payment} />
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

export default PaymentRegTable
