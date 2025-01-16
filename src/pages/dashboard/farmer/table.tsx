import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@material-tailwind/react"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { useNavigate, useLocation } from "react-router-dom"
import noData from "../../../assets/illustrations/no-data.png"
import { MdAddCircle } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import { IFarmer } from "../../../interfaces/farmer"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import useFetch from "../../../hooks/useFetch"
import { ICooperative } from "../../../interfaces/cooperative"
import {
  fetchData,
  generateExcelFile,
  getUser,
  shortDateFormatter,
} from "../../../utils"
import { farmerSelector } from "../../../store/slices/farmer"
import { useAppDispatch, useAppSelector } from "../../../store"
import { toast } from "react-toastify"
import { ITeam } from "../../../interfaces/team"
import EmptyResult from "./emptyResult"
import { HiDocumentDownload } from "react-icons/hi"
import MobileList from "./components/small-screens/list"
import DesktopList from "./components/large-screens/table"
import { IUser } from "../../../interfaces/user"

const FarmerTable = () => {
  const [farmers, setFarmers] = useState<IFarmer[]>()
  const navigate = useNavigate()
  const location = useLocation()

  const verified = useMemo(
    () => location.pathname.includes("/verified"),
    [location]
  )
  const unverified = useMemo(
    () => location.pathname.includes("/unverified"),
    [location]
  )
  const unsync = useMemo(
    () => location.pathname.includes("/unsync"),
    [location]
  )

  const currentUser = useMemo(() => JSON.parse(getUser()!), [])

  const dispatchAction = useAppDispatch()
  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(farmers)

  const { data, error, loading, message } = useFetch(
    `${
      currentUser?.role === "WAREHOUSE MANAGER"
        ? `/farmer/all`
        : `/farmer/${
            verified
              ? "approved"
              : unverified
              ? "not_approved"
              : unsync
              ? "unsync"
              : "all"
          }`
    }`
  )

  const farmerState = useAppSelector(farmerSelector)

  // Export Data Handler
  const exportTableData = () => {
    return farmers?.map((farmer) => ({
      "Farmer Name":
        farmer.first_name + " " + farmer.other_name &&
        farmer.other_name + " " + farmer.last_name,
      "Farmer ID": farmer.farmer_id,
      Cooperative: (farmer.cooperative as ICooperative)?.name ?? "Deleted",
      Team: ((farmer.cooperative as ICooperative)?.team as ITeam)?.name,
      Role: farmer.role,
      "Phone Number": farmer.phone,
      VIllage: farmer.village,
      "Farmer Location": farmer.farm_location,
      Guarantor: farmer.guarantor_name,
      "Guarantor No.": farmer.guarantor_number,
      "Registered By":
        (farmer.field_officer as IUser).name ??
        (farmer.supervisor as IUser).name ??
        "Deleted",
      "Guarantor Address.": farmer.guarantor_address,
      Status: farmer.isApproved ? "Verified" : "Not Verified",
      "Reg. Fee": farmer.reg_amount && shortDateFormatter(farmer.reg_amount),
      "Equity Paid":
        farmer.equity_amount && shortDateFormatter(farmer.equity_amount),
      "Reg. Date": farmer.updatedAt && shortDateFormatter(farmer.updatedAt),
    }))
  }

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setFarmers(data)
      return
    }
    const result = (data as IFarmer[])?.filter(
      (farmer) =>
        farmer.first_name?.toLowerCase().includes(value.toLowerCase()) ||
        farmer.other_name?.toLowerCase().includes(value.toLowerCase()) ||
        farmer.last_name?.toLowerCase().includes(value.toLowerCase()) ||
        farmer.farmer_id?.toLowerCase().includes(value.toLowerCase()) ||
        (farmer.cooperative as ICooperative)?.name
          ?.toLowerCase()
          .includes(value.toLowerCase()) ||
        farmer.phone?.includes(value)
    )
    setFarmers(result)
  }

  useEffect(() => {
    if (data) {
      setFarmers(data)
    }
  }, [data])

  useEffect(() => {
    return () => {
      fetchData(
        `${
          currentUser?.role === "WAREHOUSE MANAGER"
            ? `/farmer/all`
            : `/farmer/${
                verified
                  ? "approved"
                  : unverified
                  ? "not_approved"
                  : unsync
                  ? "unsync"
                  : "all"
              }`
        }`
      )
        .then(
          (res) => setFarmers(res.data),
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    }
  }, [
    currentUser?.role,
    dispatchAction,
    farmerState.data,
    unsync,
    unverified,
    verified,
  ])

  return (
    <>
      <QueryResult
        data={data}
        loading={loading}
        error={error ? message : ""}
        emptyResult={
          <EmptyResult
            item="Farmer"
            image={noData}
            path="/dashboard/farmer-management/add"
          />
        }>
        <div className="flex items-center gap-2">
          {(currentUser?.role === "WAREHOUSE ADMIN" ||
            currentUser?.role === "FIELD OFFICER") && (
            <Button
              onClick={() => navigate("/dashboard/farmer-management/add")}
              className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
              <MdAddCircle className="text-[18px] lg:text-[30px]" /> Add Farmer
            </Button>
          )}
          <Button
            onClick={() => generateExcelFile(exportTableData(), "farmers")}
            className="bg-blue-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <HiDocumentDownload className="text-[18px] lg:text-[30px]" />
            Export
          </Button>
        </div>
        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-3 px-0.5"
          onChange={handleSearch}
        />
        <div className="lg:hidden">
          <MobileList farmers={currentItems} />
        </div>
        <div className="hidden lg:flex">
          <DesktopList farmers={currentItems} />
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

        {/* Approval */}
      </QueryResult>
    </>
  )
}

export default FarmerTable
