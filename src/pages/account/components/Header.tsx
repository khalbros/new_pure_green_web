import React from "react"
import { IFarmer } from "../../../interfaces/farmer"
import { FcImageFile } from "react-icons/fc"
import { FaUser } from "react-icons/fa"
import { TbBuildingWarehouse } from "react-icons/tb"
import { IWarehouse } from "../../../interfaces/warehouse"
import { GiOrganigram } from "react-icons/gi"
import { ICooperative } from "../../../interfaces/cooperative"
import { MdCall } from "react-icons/md"
import logo from "../../../assets/puregreen-logo.png"
import BalanceCard from "./BalanceCard"
import { useQuery } from "react-query"
import { fetchData, getFarmer } from "../../../utils"

const Header: React.FC = () => {
  const currentUser = getFarmer()
  const farmer = useQuery({
    queryKey: ["account", "farmer"],
    queryFn: async () => {
      return fetchData(`farmer/${JSON.parse(currentUser!)._id}`).then(
        (res) => res.data
      )
    },
  })
  return (
    <>
      <div className="grid mt-10 lg:mt-20 mb-12 md:mb-[4.5rem] lg:mb-20 w-screen h-[45vh] p-6 bg-gradient-to-b from-green-400 to-green-700 text-white max-w-[100vw]">
        <div className="fixed z-50 flex items-center justify-between top-0 left-0 right-0 w-full bg-white border-b-[2.5px] border-green-600 shadow-sm px-4 lg:px-8 gap-3 place-content-end">
          <img
            src={logo}
            alt="app-logo"
            className="object-contain object-center w-12 lg:w-20 h-12 lg:h-20"
          />
          <p
            className={`w-full lg:text-3xl text-gray-800 leading-10 font-extrabold`}
          >
            PureGreen{" "}
            <span className="text-green-600 font-bold italic">
              {" "}
              Agro-chemicals{" "}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-8 lg:gap-14 mb-4 md:mb-6">
          <div
            className="grid place-items-center border rounded-full w-full h-full max-h-24 max-w-24 md:max-w-40 md:max-h-40 lg:max-h-52  lg:max-w-52 object-contain bg-gray-50 hover:transform hover:scale-125 transition-transform duration-300 ease-linear overflow-hidden"
            onClick={() => null}
          >
            {farmer?.profile_img?.url ? (
              <img
                src={farmer?.profile_img?.url}
                alt="id card"
                className="contain-size"
              />
            ) : (
              <FcImageFile
                size={35}
                color="red"
                className="w-full h-full max-h-24 max-w-24 md:max-w-40 md:max-h-40 lg:max-h-52 items-center justify-center p-2 md:p-4 lg:p-6 lg:max-w-52"
              />
            )}
          </div>
          <div className="w-full">
            <p className="flex flex-wrap w-full gap-x-2 items-baseline font-bold text-base md:text-xl lg:text-3xl capitalize mb-1">
              {`${farmer?.first_name ?? "muhammad"} ${
                farmer?.other_name ?? "ghali"
              } ${farmer?.last_name ?? "umar"}`}

              {farmer?.isApproved === "APPROVED" ? (
                <p className="text-center rounded-full bg-green-50 px-3 flex- items-center justify-center text-xs md:text-base lg:text-lg text-green-500">
                  {farmer?.isApproved}
                </p>
              ) : farmer?.isApproved === "REJECTED" ? (
                <p className="text-center rounded-full bg-red-50 px-3 flex- items-center justify-center text-xs md:text-base lg:text-lg text-red-500">
                  {farmer?.isApproved}
                </p>
              ) : (
                <p className="text-center rounded-full bg-gray-50 px-3 flex- items-center justify-center text-xs md:text-base lg:text-lg text-gray-500">
                  {farmer?.isApproved}
                  pending
                </p>
              )}
            </p>
            <p className="flex gap-3 items-center font-bold text-base md:text-lg lg:text-3xl capitalize mb-1">
              {farmer?.account_name}
              01037003434
              <p className="px-3 leading-none bg-gray-50 text-center rounded-full text-xs md:text-base lg:text-lg text-gray-500 capitalize">
                {farmer?.bank_name}
                Gt bank
              </p>
            </p>
            <span className="flex flex-col w-full md:grid md:grid-cols-2 md:gap-x-8 gap-1 lg:gap-x-10 capitalize">
              <p className="flex gap-3 items-center w-full">
                <span className="text-gray-400">
                  <FaUser />
                </span>
                {farmer?.farmer_id}
                PGF-1212/1212
              </p>

              <p className="flex gap-3 items-center w-full">
                <span className="text-gray-400">
                  <MdCall />
                </span>
                {farmer?.phone}
                08089299900
              </p>

              <p className="flex items-center gap-3">
                <span className="text-gray-400">
                  <GiOrganigram />
                </span>
                {(farmer?.cooperative as ICooperative)?.name}
                Baban gona cooperative
              </p>
              <p className="flex items-center gap-3">
                <span className="text-gray-400">
                  <TbBuildingWarehouse />
                </span>
                {(farmer?.warehouse as IWarehouse)?.name}
                fagge warehouse 1
              </p>
            </span>
          </div>
        </div>
      </div>
      <BalanceCard />
    </>
  )
}

export default Header
