/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChangeEvent, useContext, useEffect, useState } from "react"
import { Button, Dialog, DialogBody } from "@material-tailwind/react"

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import AddUser from "../../../assets/illustrations/no-data.png"
import { MdAdd, MdCancel } from "react-icons/md"
import DeleteUser from "../../../assets/illustrations/thinking.png"
import { FiSearch } from "react-icons/fi"
import { IClient } from "../../../interfaces/client"
import usePagination from "../../../hooks/usePagination"
import Input from "../../../components/form/input"
import QueryResult from "../../../components/queryResult"
import EmptyResult from "../../../components/queryResult/emptyResult"
import { ClientContext } from "."
import ClientDetails from "./details"
import { fetchData, generateExcelFile } from "../../../utils"
import { HiDocumentDownload } from "react-icons/hi"
import { useQuery } from "react-query"
import DesktopList from "./components/large-screens/table"
import MobileList from "./components/small-screens/list"

const ClientTable = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      return fetchData("/client").then((res) => res.data)
    },
  })

  const [openDrawer, setOpenDrawer] = useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [clients, setClients] = useState<IClient[]>(data)
  const [client, setClient] = useState<IClient>()
  const navigate = useNavigate()

  const [_ctx] = useContext(ClientContext)
  const { currentPage, pages, nextPage, prevPage, changePage } =
    usePagination(clients)

  // export data handler
  const exportTableData = () => {
    return clients?.map((client) => ({
      Client: client.name,
      "Client ID": client.client_id,
      Email: client.email,
      "Phone No.": client.phone,
      Address: client.address,
      "Account No.": client.account_number,
      "Bank Name": client.bank_name,
    }))
  }

  // search
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (!value) {
      setClients(data)
      return
    }
    const result = (data as IClient[])?.filter(
      (client) =>
        client.name?.toLowerCase().includes(value.toLowerCase()) ||
        client.bank_name?.toLowerCase().includes(value.toLowerCase()) ||
        client.email?.toLowerCase().includes(value.toLowerCase()) ||
        client.account_number?.includes(value) ||
        client.phone?.includes(value)
    )
    setClients(result)
  }

  // open drawer with clients details
  const toggleDrawer = (client?: IClient) => {
    if (client) {
      setClient(client)
    }
    setOpenDrawer(!openDrawer)
  }

  // open or close delete dialog
  const toggleDiaglog = (client?: IClient) => {
    if (client) {
      setClient(client)
    }
    setOpenDialog(!openDialog)
  }

  useEffect(() => {
    if (data) {
      setClients(data)
    }
  }, [data])

  return (
    <>
      <QueryResult
        data={data}
        loading={isLoading}
        error={isError ? String(error) : ""}
        emptyResult={
          <EmptyResult
            item="Client"
            image={AddUser}
            path="/dashboard/client-management/add"
          />
        }>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate("/dashboard/client-management/add")}
            className="bg-green-700 flex gap-1 justify-center items-center py-1 text-sm lg:text-base lg:py-2 mt-5">
            <MdAdd className="text-[18px] lg:text-[30px]" /> Enroll New Client
          </Button>
          <Button
            onClick={() => generateExcelFile(exportTableData(), "clients")}
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
          <div className="lg:hidden">
            <MobileList clients={clients} />
          </div>
          <div className="hidden lg:flex">
            <DesktopList clients={clients} />
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
              alt="delete client"
            />
            <p className="mx-auto text-base text-center max-w-[300px] text-black mb-7">
              Are you sure you want to disable client with the name “
              {client?.name}”
            </p>
            <Button
              onClick={() => {}}
              className="bg-green-600 w-60p mx-auto block mb-16">
              Confirm
            </Button>
          </DialogBody>
        </Dialog>
        <ClientDetails client={client} open={openDrawer} close={toggleDrawer} />
      </QueryResult>
    </>
  )
}

export default ClientTable
