import { ChangeEvent, useEffect, useMemo, useState } from "react"
import { Button } from "@material-tailwind/react"
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import { MdAddCircle } from "react-icons/md"
import { FiFileText, FiSearch } from "react-icons/fi"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import { ICooperative } from "../../../interfaces/cooperative"
import { fetchData, getUser } from "../../../utils"
import { useAppDispatch, useAppSelector } from "../../../store"
import { toast } from "react-toastify"
import { cooperativeSelector } from "../../../store/slices/cooperative/index"
import EmptyResult from "./emptyResult"
import MobileList from "./components/small-screens/list"
import DesktopList from "./components/large-screens/table"
import { useQuery } from "react-query"

const CooperativeTable = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const [cooperatives, setCooperatives] = useState<ICooperative[]>()

  const { currentItems, currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(cooperatives)

  const navigate = useNavigate()
  const dispatchAction = useAppDispatch()
  const cooperativeState = useAppSelector(cooperativeSelector)

  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["cooperative"],
    queryFn: async () => {
      return fetchData("/cooperative/get/all").then((res) => res.data)
    },
  })

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setCooperatives(data)
      return
    }
    const result = (data as ICooperative[])?.filter(
      (cooperative) =>
        cooperative.name?.toLowerCase().includes(value.toLowerCase()) ||
        cooperative.chairman?.toLowerCase().includes(value.toLowerCase()) ||
        cooperative.village?.toLowerCase().includes(value.toLowerCase()) ||
        cooperative.village_head?.toLowerCase().includes(value.toLowerCase()) ||
        cooperative.phone?.toLowerCase().includes(value.toLowerCase())
    )
    setCooperatives(result)
  }

  useEffect(() => {
    return () => {
      fetchData("/cooperative/get/all")
        .then(
          (res) => setCooperatives(res.data),
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    }
  }, [data, dispatchAction, cooperativeState.data])

  return (
    <>
      <QueryResult
        data={data}
        loading={isLoading}
        error={isError ? JSON.stringify(error) : ""}
        emptyResult={
          <EmptyResult
            item="Cooperative"
            image={AddUser}
            path="/dashboard/cooperative-management/add"
          />
        }>
        <div className="sticky">
          <div className="flex flex-col md:flex-row gap-2 mt-5">
            {currentUser?.role === "WAREHOUSE ADMIN" ||
            currentUser.role === "WAREHOUSE MANAGER" ? (
              <Button
                onClick={() =>
                  navigate("/dashboard/cooperative-management/add")
                }
                className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 tracking-wide">
                <MdAddCircle className="text-[24px] lg:text-[30px]" /> Add
                Cooperative
              </Button>
            ) : (
              currentUser.role === "AREA SALES MANAGER" && (
                <>
                  <Button
                    onClick={() =>
                      navigate(
                        "/dashboard/cooperative-management/certificate",
                        {
                          state: cooperatives,
                        }
                      )
                    }
                    className="bg-blue-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 tracking-wide">
                    <FiFileText className="text-[24px] lg:text-[30px]" />{" "}
                    Generate Certificate
                  </Button>
                  <Button
                    onClick={() =>
                      navigate("/dashboard/cooperative-management/affidavit", {
                        state: cooperatives,
                      })
                    }
                    className="bg-teal-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 tracking-wide">
                    <FiFileText className="text-[24px] lg:text-[30px]" />{" "}
                    Generate Affidavit
                  </Button>
                </>
              )
            )}
          </div>
          <Input
            type="search"
            leftIcon={<FiSearch size={24} />}
            placeholder="Search..."
            inputContainerStyle="my-4 px-0.5"
            onChange={handleSearch}
          />
        </div>

        <>
          <div className="lg:hidden">
            <MobileList cooperativies={currentItems} />
          </div>
          <div className="hidden lg:flex">
            <DesktopList cooperativies={currentItems} />
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
      </QueryResult>
    </>
  )
}

export default CooperativeTable
