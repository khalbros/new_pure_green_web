import { ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import { Doughnut } from "react-chartjs-2"
import { FaUserCheck, FaUserClock, FaUserSlash } from "react-icons/fa"
import { MdOutlineSyncProblem } from "react-icons/md"
import { fetchData } from "../../utils"
import { toast } from "react-toastify"
import { IFarmer } from "../../interfaces/farmer"
import { ICooperative } from "../../interfaces/cooperative"

ChartJS.register(ArcElement, Tooltip, Legend)

function FieldOfficerDashboard() {
  const [verifiedFarmers, setVerifiedFarmers] = useState<IFarmer[]>()
  const [unVerifiedFarmers, setUnverifiedFarmers] = useState<IFarmer[]>()
  const [totalRegistered, setTotalRegistered] = useState(0)
  const [totalVerified, setTotalVerified] = useState(0)
  const [totalUnVerified, setTotalUnVerified] = useState(0)
  const [totalUnsync] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  const data = {
    labels: [
      "Total Registered Farmers",
      "Total Verified Farmers",
      "Total Unverified Farmers",
      "Total Unsync Farmers",
    ],
    datasets: [
      {
        label: "Farmers",
        data: [totalRegistered, totalVerified, totalUnVerified, totalUnsync],
        backgroundColor: [
          "rgba(25, 26, 999, 1)",
          "rgba(75, 192, 75, 1)",
          "rgba(355, 206, 86, 1)",
          "rgb(255, 206,5)",
        ],
      },
    ],
  }

  useEffect(() => {
    fetchData("/farmer/all")
      .then((res) => {
        if (res.data) {
          setVerifiedFarmers(
            (res.data as IFarmer[]).filter(
              (farmer) => farmer.isApproved && farmer
            ) as IFarmer[]
          )
          setUnverifiedFarmers(
            (res.data as IFarmer[]).filter(
              (farmer) => !farmer.isApproved && farmer
            ) as IFarmer[]
          )
        }
      })
      .catch((err) => toast.error(err.message))
    fetchData("/farmer/count/total_registered")
      .then((res) => {
        if (res.data) setTotalRegistered(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/farmer/count/total_verified")
      .then((res) => {
        if (res.data) setTotalVerified(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/farmer/count/total_unverified")
      .then((res) => {
        if (res.data) setTotalUnVerified(res.data)
      })
      .catch((err) => toast.error(err.message))
  }, [location.pathname])
  console.log(verifiedFarmers)

  return (
    <div className="h-fit w-full lg:m-2 space-y-4 max-w-[95vw] lg:max-w-[100vw]">
      <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-4 gap-3 items-start">
        <StatCard
          color="red"
          icon={
            <FaUserClock
              className="text-4xl md:text-5xl lg:text-6xl"
              color="blue"
            />
          }
          title="Total Registered Farmers"
          count={totalRegistered}
          action={() => navigate("farmer-management")}
        />
        <StatCard
          color="red"
          icon={
            <FaUserCheck
              className="text-4xl md:text-5xl lg:text-6xl"
              color="green"
            />
          }
          title="Total Verified Farmers"
          count={totalVerified}
          action={() => navigate("farmer-management/verified")}
        />
        <StatCard
          color="red"
          icon={
            <FaUserSlash
              className="text-4xl md:text-5xl lg:text-6xl"
              color="orange"
            />
          }
          title="Total Unverified Farmers"
          count={totalUnVerified}
          action={() => navigate("farmer-management/unverified")}
        />
        <StatCard
          color="red"
          icon={
            <MdOutlineSyncProblem
              className="text-4xl md:text-5xl lg:text-6xl"
              color="yellow"
            />
          }
          title="Total Unsync Farmers"
          count={totalUnsync}
        />
      </div>
      <div className="grid grid-flow-row md:grid-cols-2 items-stretch gap-2 md:gap-3 lg:gap-4">
        <div className="flex bg-white p-4 place-content-center">
          <Doughnut
            data={data}
            options={{
              maintainAspectRatio: true,
              responsive: true,
            }}
          />
        </div>
        <div className="bg-white p-4 space-y-2 md:space-y-3 lg:space-y-4 shadow-xl border">
          <div>
            <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-green-600 text-center my-2">
              Recent Farmers
            </h3>
          </div>
          <div className="grid grid-flow-cols items-stretch gap-4 md:gap-5 lg:gap-6">
            <div className="bg-gray-50 border">
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-purple-600 text-center my-2">
                Verified
              </h3>
              <table className="w-full">
                <thead className="bg-purple-100">
                  <th className="text-start p-2 md:p-3">Name</th>

                  <th className="text-center p-2 md:p-3">Cooperative</th>
                  <th className="text-end p-2 md:p-3">Role</th>
                </thead>
                <tbody className="divide-y">
                  {verifiedFarmers?.slice(0, 5).map((farmer) =>
                    farmer ? (
                      <tr className="p-2 even:bg-indigo-50">
                        <td className="text-start p-2 md:p-3 capitalize">
                          {farmer?.last_name}
                        </td>
                        <td className="text-center p-2 md:p-3 capitalize">
                          {(farmer?.cooperative as ICooperative)?.name}
                        </td>
                        <td className="text-end p-2 md:p-3 capitalize">
                          {farmer?.role}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50 border">
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-green-600 text-center my-2">
                Unverified
              </h3>
              <table className="w-full">
                <thead className="bg-indigo-100">
                  <th className="text-start p-2 md:p-3">Name</th>

                  <th className="text-center p-2 md:p-3">Cooperative</th>
                  <th className="text-end p-2 md:p-3">Role</th>
                </thead>
                <tbody className="divide-y">
                  {unVerifiedFarmers?.slice(0, 5).map((farmer) =>
                    farmer ? (
                      <tr className="p-2 even:bg-indigo-50">
                        <td className="text-start p-2 md:p-3 capitalize">
                          {farmer?.last_name}
                        </td>
                        <td className="text-center p-2 md:p-3 capitalize">
                          {(farmer?.cooperative as ICooperative)?.name}
                        </td>
                        <td className="text-end p-2 md:p-3 capitalize">
                          {farmer?.role}
                        </td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FieldOfficerDashboard

interface IProps {
  count: number | string
  title: string
  icon: ReactNode
  color: Color
  action?: VoidFunction
}
export const StatCard: React.FC<IProps> = (props) => {
  return (
    <>
      <div
        className="flex rounded bg-white p-4 lg:p-6 w-full items-center justify-between drop-shadow-lg cursor-pointer border hover:transform hover:scale-105 hover:bg-green-50 focus:bg-green-50 transition-transform duration-300 ease-linear"
        onClick={props.action}>
        <div className={`flex grayscale text-gray-500`}>{props.icon}</div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <p className="flex text-green-600 font-extrabold text-xl">
            {props.count.toLocaleString()}
          </p>
          <p className="flex text-green-600 lg:text-lg text-right font-extrabold">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}
