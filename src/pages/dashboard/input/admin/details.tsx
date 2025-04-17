/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useMemo, useState } from "react"
import { MdCancel, MdCheckCircle, MdDeleteForever } from "react-icons/md"
import { useLocation, useNavigate } from "react-router-dom"
import { InputContext } from "../"
import { fetchData, getUser } from "../../../../utils"
import { BiEdit } from "react-icons/bi"
import ApprovalDialog from "./ApprovalDialog"
import DeleteDialog from "./DeleteDialog"
import { useQuery } from "react-query"
import { IProject } from "../../../../interfaces/project"
import Loading from "../../../../components/Loading"
import Error from "../../../../components/queryResult/error"

const AdminInputDetails: React.FC = () => {
  const currentUser = useMemo(() => JSON.parse(getUser()!), [])
  const { state } = useLocation()
  const navigate = useNavigate()
  const [_ctx, dispatch] = useContext(InputContext)
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)

  const queryProject = useQuery({
    queryKey: ["project"],
    queryFn: async () => {
      return fetchData(`/project`).then((res) => res.data)
    },
  })
  const {
    data: input,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["input", "details", `${state._id}`],
    queryFn: async () => {
      return fetchData(`/input/by-warehouse/${state?._id}`).then(
        (res) => res.data
      )
    },
  })
  // open or close action dialog
  const toggleDiaglog = () => {
    setOpenDialog(!openDialog)
  }
  // open or close delete dialog
  const toggleDelete = () => {
    setOpenDelete(!openDelete)
  }

  const handleEditInput = () => {
    dispatch(state)
    navigate("/dashboard/input-management/edit")
  }

  // useEffect(() => {
  //   console.log(state)

  //   if (state._id)
  //     fetchData(`/input/by-warehouse/${state?._id}`)
  //       .then(
  //         (res) => setInput(res.data),
  //         (err) => toast.error(err)
  //       )
  //       .catch((err) => toast.error(err))
  // }, [state, openDelete, openDialog])
  // console.log(input)

  if (isLoading) return <Loading />
  if (isError) return <Error error={error as string} />
  console.log(input)

  if (input)
    return (
      <div className="">
        <div className="flex w-full items-center justify-between">
          {/* Action buttons */}

          <div className="fixed z-50 grid grid-rows-2 divide-y-2 bottom-4 right-4 gap-2 md:gap-4 place-content-center">
            {currentUser?.role === "SUPER ADMIN" && (
              <span
                className={`flex items-center gap-2 shadow-md md:shadow-lg text-white bg-${
                  input?.isApproved ? "red" : "green"
                }-500 px-4 py-1 rounded-full cursor-pointer`}
                onClick={toggleDiaglog}>
                {input?.isApproved ? (
                  <MdCancel className="text-xl lg:text-4xl" />
                ) : (
                  <MdCheckCircle className="text-xl lg:text-4xl" />
                )}
                <span className="text-base lg:text-xl">
                  {input?.isApproved ? "REJECT" : "APPROVE"}
                </span>
              </span>
            )}
            <span
              className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-blue-700 px-4 py-1 rounded-full cursor-pointer"
              onClick={handleEditInput}>
              <BiEdit className="text-xl lg:text-4xl" />
              <span className="text-base lg:text-xl">Edit</span>
            </span>
            <span
              className="flex items-center gap-2 shadow-md md:shadow-lg text-white bg-red-700 px-4 py-1 rounded-full cursor-pointer"
              onClick={toggleDelete}>
              <MdDeleteForever className="text-xl lg:text-4xl" />
              <span className="text-base lg:text-xl">DELETE</span>
            </span>
          </div>
        </div>
        <div className="flex flex-col  gap-7 text-sm lg:text-xl">
          <div className="py-8 divide-y-2 md:text-2xl">
            {/* Input details */}
            <div className="flex items-center gap-4 md:gap-8 lg:gap-14 mb-4 md:mb-6">
              <div className="w-full">
                <div className="flex flex-wrap w-full gap-x-2 md:gap-4 items-center font-bold text-lg md:text-xl lg:text-3xl capitalize mb-3">
                  {input?.input?.name}
                  <p
                    className={`flex flex-col rounded-full px-4 bg-${
                      !input?.isApproved ? "red" : "green"
                    }-50`}>
                    {input?.isApproved ? (
                      <span className="text-center rounded-full text-xs md:text-base lg:text-lg text-green-500">
                        {"APPROVED"}
                      </span>
                    ) : (
                      <span className="text-center rounded-full text-xs md:text-base lg:text-lg text-red-500">
                        {"REJECTED"}
                      </span>
                    )}
                  </p>
                </div>
                <span className="w-full grid grid-cols-2  gap-1 md:gap-3   whitespace-nowrap capitalize justify-between items-center">
                  <p className="flex flex-col w-full">
                    <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold tracking-wide">
                      Total:
                    </span>
                    {Number(Number(input?.quantity ?? 0)).toLocaleString(
                      "en-NG"
                    )}
                  </p>
                </span>
              </div>
            </div>

            {/* Input activity */}
            <div className="py-4 flex flex-col gap-6 text-sm lg:text-xl">
              <h4 className="font-bold text-base lg:text-xl uppercase tracking-wide text-gray-500">
                Input's Loan Details
              </h4>
              <div className="p-4 w-full border rounded-lg">
                <div className="flex gap-[11px] mb-4">
                  <p className="text-gray-700 flex-1">Project </p>
                  <select
                    name="project"
                    id="project"
                    className="px-3 rounded shadow cursor-pointer">
                    {(queryProject.data as IProject[])?.map((proj, key) => (
                      <option value={proj._id} key={key}>
                        {proj.name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* loan */}
                <div className="flex justify-center gap-[5px] mb-[30px]">
                  <p className="flex flex-col w-full tracking-wide">
                    <span className="text-gray-600 uppercase text-xs md:text-sm lg:text-base font-bold">
                      Available :
                    </span>
                    {Number(input?.quantity ?? 0).toLocaleString("en-NG")}
                  </p>
                </div>
                {/* chart  */}
              </div>
            </div>

            {/* Cooperative */}
          </div>
        </div>

        <ApprovalDialog
          input={input}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
          toggleDiaglog={toggleDiaglog}
        />
        <DeleteDialog
          input={input}
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          toggleDelete={toggleDelete}
        />
      </div>
    )
}

export default AdminInputDetails
