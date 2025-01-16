/* eslint-disable @typescript-eslint/no-unused-vars */
import {ChangeEvent, useContext, useEffect, useState} from "react"
import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react"
// import {FaEye} from "react-icons/fa"
import {TfiMore} from "react-icons/tfi"
import {
  AiFillEdit,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
} from "react-icons/ai"
import {useNavigate} from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import {MdAdd, MdCancel, MdDeleteForever} from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import {FiSearch} from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "../../../components/queryResult/emptyResult"
import {IBundle} from "../../../interfaces/bundle"
import useFetch from "../../../hooks/useFetch"
import {BundleContext} from "."
import {useAppDispatch, useAppSelector} from "../../../store"
import {deleteBundleAction} from "../../../store/actions/bundle"
import {bundleSelector} from "../../../store/slices/bundle"
import {toast} from "react-toastify"
import {fetchData} from "../../../utils"

const BundleTable = () => {
  // const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [bundles, setBundles] = useState<IBundle[]>()
  const [bundle, setBundle] = useState<IBundle>()
  const {currentItems, currentPage, pages, nextPage, prevPage, changePage} =
    usePagination(bundles)
  const [_ctx, dispatch] = useContext(BundleContext)
  const {data, error, loading, message} = useFetch("/bundle")
  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const bundleState = useAppSelector(bundleSelector)
  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target
    if (!value) {
      setBundles(data)
      return
    }
    const result = (data as IBundle[])?.filter(
      (bundle) =>
        bundle.name?.toLowerCase().includes(value.toLowerCase()) ||
        bundle.inputs?.filter((input) =>
          input.input.includes(value.toLowerCase())
        )
    )
    setBundles(result)
  }

  // set user context and navigate to edit user
  const handleEdit = (bundle: IBundle) => {
    dispatch(bundle)
    navigate("edit")
  }

  // open drawer with users details
  // const toggleDrawer = (bundle?: IBundle) => {
  //   if (bundle) {
  //     setBundle(bundle)
  //   }
  //   setOpenDrawer(!openDrawer)
  // }

  // open or close delete dialog
  const toggleDiaglog = (bundle?: IBundle) => {
    if (bundle) {
      setBundle(bundle)
    }
    setOpenDialog(!openDialog)
  }

  useEffect(() => {
    if (data) {
      setBundles(data)
    }
    fetchData(`/bundle`)
      .then(
        (res) => setBundles(res.data),
        (err) => toast.error(err)
      )
      .catch((err) => toast.error(err))
  }, [data, dispatchAction, bundleState.isLoading])

  // open or close delete dialog
  const toggleDeleteDialog = (bundle?: IBundle) => {
    if (bundle) {
      setBundle(bundle)
    }
    setOpenDelete(!openDelete)
  }
  // handle delete
  const handleDelete = (bundle: IBundle) => {
    dispatchAction(
      deleteBundleAction({...bundle}, () => setOpenDelete(!openDelete))
    )
  }

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Bundle"
            image={AddUser}
            path="/dashboard/bundle-management/add"
          />
        }>
        <Button
          onClick={() => navigate("/dashboard/bundle-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Create Bundle
        </Button>
        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
        />

        <>
          <div className="w-full overflow-x-scroll rounded-lg">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap capitalize ">
              <thead className="bg-green-50">
                <tr>
                  <th className="w-10">
                    {/* <input type="checkbox" /> */}
                    S/N
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Bundle's Name
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Total Loan Amount
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700">
                    Inputs
                  </th>
                  <th className="py-3 pl-2 text-left font-bold tracking-wide text-green-700"></th>
                </tr>
              </thead>
              <tbody>
                {currentItems?.map((bundle, key) => (
                  <tr key={key} className={`divide-y even:bg-[#FAFAFA]`}>
                    <td className="w-10 pl-3">
                      {key + 1}
                      {/* <input type="checkbox" /> */}
                    </td>
                    <td className="p-3 font-bold">{bundle.name}</td>
                    <td className="p-3 tracking-wide">
                      {Number(bundle.total).toLocaleString("en-NG", {
                        style: "currency",
                        currency: "NGN",
                      })}
                    </td>
                    <td className="p-3 flex flex-wrap gap-2">
                      {bundle.inputs?.map((input) => (
                        <Chip
                          value={`${input.input} ( ${input.quantity} )`}
                          key={input.input._id}
                          className="rounded-full w-fit"
                          color="light-green"
                        />
                      ))}
                    </td>

                    <td className="p-3">
                      <Menu placement="bottom-start">
                        <MenuHandler>
                          <span className="cursor-pointer">
                            <TfiMore className="text-3xl md:text-4xl" />
                          </span>
                        </MenuHandler>
                        <MenuList>
                          {/* <MenuItem
                            className="border-b-2 inline-flex gap-2"
                            onClick={() => toggleDiaglog(bundle)}>
                            <FaEye size={16} /> View details
                          </MenuItem> */}
                          <MenuItem
                            onClick={() => {
                              handleEdit(bundle)
                            }}
                            className="inline-flex gap-2 border-b-2">
                            <AiFillEdit size={16} /> Edit
                          </MenuItem>
                          <MenuItem
                            onClick={() => toggleDeleteDialog(bundle)}
                            className="inline-flex gap-2 border-b-2">
                            <MdDeleteForever
                              size={16}
                              className="text-red-400"
                            />{" "}
                            Delete
                          </MenuItem>
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
        <Dialog size="sm" open={openDialog} handler={toggleDiaglog}>
          <DialogBody className="">
            <div className="flex justify-end">
              {" "}
              <MdCancel
                className="cursor-pointer"
                size={20}
                onClick={() => toggleDiaglog()}
              />{" "}
            </div>
            <img
              src={DeleteUser}
              className="w-[140px] mx-auto mb-7 block"
              alt="delete user"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to disable bundle with the name “
              {bundle?.name}”
            </p>
            <Button
              onClick={() => {}}
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
              Are you sure you want to DELETE “{bundle?.name}”
            </p>
            <Button
              onClick={() => handleDelete(bundle!)}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Delete
            </Button>
          </DialogBody>
        </Dialog>
        {/* <Details user={user} open={openDrawer} close={toggleDrawer} /> */}
      </QueryResult>
    </>
  )
}

export default BundleTable
