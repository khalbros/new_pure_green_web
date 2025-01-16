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
  AiFillCheckCircle,
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import AddUser from "../../../../assets/illustrations/no-data.png"
import {MdAdd, MdCancel, MdDeleteForever} from "react-icons/md"
import DeleteUser from "../../../../assets/illustrations/thinking.png"
import {FiSearch} from "react-icons/fi"
import {ITransaction} from "../../../../interfaces/transaction"
import usePagination from "../../../../hooks/usePagination"
import {TransactionContext} from ".."
import useFetch from "../../../../hooks/useFetch"
import QueryResult from "../../../../components/queryResult"
import EmptyResult from "../../../../components/queryResult/emptyResult"
import Input from "../../../../components/form/input"
import {ICommodity} from "../../../../interfaces/commodity"
import {IGrade} from "../../../../interfaces/grade"
import {IClient} from "../../../../interfaces/client"
import TransactionDetails from "./details"
import {useReactToPrint} from "react-to-print"
import Receipt from "../receipt"
import {IoMdPrint} from "react-icons/io"
import {fetchData, generateExcelFile, getUser} from "../../../../utils"
import {useAppDispatch, useAppSelector} from "../../../../store"
import {transactionSelector} from "../../../../store/slices/transaction"
import {
  approveTransactionAction,
  deleteTransactionAction,
} from "../../../../store/actions/transaction"
import {toast} from "react-toastify"
import {HiDocumentDownload} from "react-icons/hi"

const TransactionTradingTable = () => {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [transactions, setTransactions] = useState<ITransaction[]>()
  const [transaction, setTransaction] = useState<ITransaction>()
  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(transactions)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_ctx, dispatch] = useContext(TransactionContext)
  const navigate = useNavigate()
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const {data, error, loading, message} = useFetch(`/transaction?type=Trade`)

  const [open, setOpen] = useState<boolean>(false)
  const dispatchAction = useAppDispatch()

  const transactionState = useAppSelector(transactionSelector)

  // export data handler
  const exportTableData = () => {
    return transactions?.map((transaction) => ({
      Client: (transaction?.client as IClient)?.name,
      "Client ID": (transaction?.client as IClient)?.client_id,
      Commodity: (transaction.commodity as ICommodity)?.name,
      Grade: (transaction?.grade as IGrade)?.name,
      "No. Bags": transaction.num_bags,
      Type: transaction.type,
      Amount: transaction.amount,
      Status: transaction.status,
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
  const togglePrint = (transaction?: ITransaction) => {
    if (transaction) {
      setTransaction(transaction)
    }
    setOpen(!open)
  }
  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (!value) {
      setTransactions(data)
      return
    }
    const result = (data as ITransaction[])?.filter(
      (transaction) =>
        transaction.type?.toLowerCase().includes(value.toLowerCase()) ||
        (transaction.client as IClient).name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (transaction.client as IClient).client_id
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        transaction.amount?.toLowerCase().includes(value.toLowerCase()) ||
        transaction.status?.toLowerCase().includes(value.toLowerCase()) ||
        transaction.num_bags?.toLowerCase().includes(value.toLowerCase()) ||
        (transaction.commodity as ICommodity).name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        (transaction?.grade as IGrade)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase())
    )
    setTransactions(result)
  }

  // set transaction context and navigate to edit transaction
  const handleEdit = (transaction: ITransaction) => {
    dispatch(transaction)
    navigate("edit")
  }

  // handle status
  const handleStatus = (transaction: ITransaction) => {
    dispatchAction(
      approveTransactionAction({...transaction, status: "APPROVED"}, () =>
        setOpenDialog(!openDialog)
      )
    )
  }
  // handle delete
  const handleDelete = (transaction: ITransaction) => {
    dispatchAction(
      deleteTransactionAction({...transaction}, () =>
        setOpenDelete(!openDelete)
      )
    )
  }

  // open drawer with transactions details
  const toggleDrawer = (transaction?: ITransaction) => {
    if (transaction) {
      setTransaction(transaction)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close status dialog
  const toggleDialog = (transaction?: ITransaction) => {
    if (transaction) {
      setTransaction(transaction)
    }
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDeleteDialog = (transaction?: ITransaction) => {
    if (transaction) {
      setTransaction(transaction)
    }
    setOpenDelete(!openDelete)
  }

  useEffect(() => {
    return () => {
      fetchData("/transaction?type=Trade")
        .then((res) => {
          if (res.data) setTransactions(() => res.data)
        })
        .catch((err) => toast.error(err.message))
    }
  }, [data, dispatchAction, transactionState.isLoading])

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult item="Transaction" image={AddUser} path="add" />
        }>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("add")}
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[18px] lg:text-[30px]" /> Create Transaction
          </Button>
          <Button
            onClick={() => generateExcelFile(exportTableData(), "transactions")}
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
                  <th className="w-10">S/N</th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Client's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Commodity
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Grade
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Number Of Bags
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Type
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Payable Amount
                  </th>

                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Status
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((transactions, key) => (
                  <tr key={key} className={`divide-y even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3">{key + 1}</td>
                    <td className="p-3 flex flex-col flex-wrap gap-1 md:gap-2 items-start capitalize tracking-wide font-bold">
                      <span> {(transactions.client as IClient)?.name}</span>
                      <span className="text-gray-500 tracking-wider font-bold text-[10px] md:text-xs">
                        {(transactions.client as IClient)?.client_id}
                      </span>
                    </td>
                    <td className="p-3">
                      {(transactions.commodity as ICommodity)?.name}
                    </td>
                    <td className="p-3">
                      {(transactions?.grade as IGrade)?.name}
                    </td>

                    <td className="p-3">{transactions.num_bags}</td>
                    <td className="p-3">{transactions.type}</td>
                    <td className="p-3 font-bold tracking-wide">
                      {" "}
                      {Number(transactions.amount).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3">
                      <span
                        className={`${
                          transactions.status === "PENDING"
                            ? "bg-blue-600"
                            : transactions.status === "APPROVED"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } flex flex-nowrap w-fit px-2 md:px-4 md:py-1 text-center text-white uppercase rounded-full cursor-pointer truncate text-ellipsis`}>
                        {transactions.status}
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
                            onClick={() => toggleDrawer(transactions)}>
                            <FaEye size={16} /> View details
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleEdit(transactions)}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillEdit size={16} /> Edit
                          </MenuItem>
                          {transactions?.status != "PENDING" && (
                            <MenuItem
                              onClick={() => togglePrint(transactions)}
                              className="inline-flex gap-2 border-b-2">
                              <IoMdPrint size={16} className="text-green-400" />
                              Print
                            </MenuItem>
                          )}
                          {(currentUser?.role === "SUPER ADMIN" ||
                            currentUser?.role === "DATA ANALYST") && (
                            <>
                              <MenuItem
                                onClick={() => toggleDialog(transactions)}
                                className="inline-flex gap-2 border-b-2">
                                <AiFillCheckCircle size={16} color="green" />{" "}
                                Approve
                              </MenuItem>
                              <MenuItem
                                onClick={() => toggleDeleteDialog(transactions)}
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
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete transaction"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to approve this transaction for “
              {(transaction?.client as IClient)?.name}”
            </p>
            <Button
              onClick={() => handleStatus(transaction!)}
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
              src={DeleteUser}
              className="w-[120px] mx-auto mb-7 block"
              alt="delete farmer"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to DELETE this Transaction for “
              {(transaction?.client as IClient)?.name}”
            </p>
            <Button
              onClick={() => handleDelete(transaction!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
        {/* transaction details */}
        <TransactionDetails
          transaction={transaction}
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
              <Receipt {...transaction} />
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

export default TransactionTradingTable
