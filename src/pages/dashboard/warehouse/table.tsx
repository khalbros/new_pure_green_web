/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import { MdAdd } from "react-icons/md"
import { FiSearch } from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "../../../components/queryResult/emptyResult"
import { IWarehouse } from "../../../interfaces/warehouse"
// import useFetch from "../../../hooks/useFetch"
import { WarehouseContext } from "./"
import { useQuery } from "react-query"
import { fetchData } from "../../../utils"
import DesktopList from "./components/large-screens/table"
import { Button } from "@material-tailwind/react"
import MobileList from "./components/small-screens/list"

const WarehouseTable = () => {
  const [warehouses, setWarehouses] = useState<IWarehouse[]>()

  // QUERIES
  // const { data, error, loading, message } = useFetch("/warehouse")
  const { data, error, isLoading } = useQuery({
    queryKey: ["warehouse"],
    queryFn: async () => {
      return fetchData("/warehouse").then((res) => res.data)
    },
  })

  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(warehouses)
  const [_ctx, dispatch] = useContext(WarehouseContext)

  const navigate = useNavigate()

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setWarehouses(data)
      return
    }
    const result = (data as IWarehouse[])?.filter(
      (warehouse) =>
        warehouse.name?.toLowerCase().includes(value.toLowerCase()) ||
        warehouse.state?.toLowerCase().includes(value.toLowerCase()) ||
        warehouse.lga?.toLowerCase().includes(value.toLowerCase()) ||
        warehouse.address?.toLowerCase().includes(value.toLowerCase())
    )
    setWarehouses(result)
  }

  useEffect(() => {
    if (data) {
      setWarehouses(data)
    }
  }, [data, isLoading])

  return (
    <>
      <QueryResult
        data={data}
        loading={isLoading}
        error={error ? (error as string) : ""}
        emptyResult={
          <EmptyResult
            item="Warehouse"
            image={AddUser}
            path="/dashboard/warehouse-management/add"
          />
        }>
        <Button
          onClick={(_) => navigate("/dashboard/warehouse-management/add")}
          className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
          <MdAdd className="text-[18px] lg:text-[30px]" /> Add New Warehouse
        </Button>
        <Input
          type="search"
          leftIcon={<FiSearch size={24} />}
          placeholder="Search..."
          inputContainerStyle="my-4 px-0.5"
          onChange={handleSearch}
        />

        <>
          <div className="lg:hidden">
            <MobileList warehouses={currentItems} />
          </div>
          <div className="hidden lg:flex">
            <DesktopList warehouses={currentItems} />
          </div>
        </>
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
      </QueryResult>
    </>
  )
}

export default WarehouseTable
