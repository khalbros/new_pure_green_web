/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {ReactNode, useEffect, useState} from "react"
import {useLocation, useNavigate} from "react-router-dom"
import {Chart as ChartJS, ArcElement, Tooltip, Legend, Color} from "chart.js"

import {FaMoneyBill, FaMoneyBillAlt} from "react-icons/fa"
import {fetchData} from "../../utils"
import {toast} from "react-toastify"
import {IoIosCash} from "react-icons/io"

ChartJS.register(ArcElement, Tooltip, Legend)

function FinanceOfficerDashboard() {
  const [totalRegistered, setTotalRegistered] = useState(0)
  const [totalEquity, setTotalEquity] = useState(0)
  const [totalCash, setTotalCash] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData("/payment/registration")
      .then((res) => {
        if (res.data) setTotalRegistered(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/payment/equity")
      .then((res) => {
        if (res.data) setTotalEquity(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/recovered-cash")
      .then((res) => {
        if (res.data) setTotalCash(res.data)
      })
      .catch((err) => toast.error(err.message))
  }, [location.pathname])

  return (
    <div className="h-fit w-full lg:m-2 space-y-4 max-w-[95vw] lg:max-w-[100vw]">
      <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-3">
        <StatCard
          color="red"
          icon={
            <IoIosCash
              className="text-3xl md:text-5xl lg:text-6xl"
              color="red"
            />
          }
          title="Total Cash Loan Repaid"
          count={totalCash.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/loan")}
        />
        <StatCard
          color="red"
          icon={
            <FaMoneyBill
              className="text-3xl md:text-5xl lg:text-6xl"
              color="green"
            />
          }
          title="Total Registration Paid"
          count={totalRegistered.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/registration")}
        />

        <StatCard
          color="red"
          icon={
            <FaMoneyBillAlt
              className="text-3xl md:text-5xl lg:text-6xl"
              color="blue"
            />
          }
          title="Total Equity Paid"
          count={totalEquity.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/equity")}
        />
      </div>
      <div className="grid grid-flow-row md:grid-cols-2 items-stretch gap-2 md:gap-3 lg:gap-4">
        <div className="flex bg-white p-4 place-content-center"></div>
        {/* <div className="bg-white p-4 space-y-2 md:space-y-3 lg:space-y-4 shadow-xl border">
          <div>
            <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-green-600 text-center my-2">
              Recent Farmers
            </h3>
          </div>
          <div className="grid grid-flow-cols items-stretch gap-4 md:gap-5 lg:gap-6">
            <div className="bg-gray-50 border">
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-purple-600 text-center my-2">
                Equity
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
                          {farmer?.name}
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
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-indigo-600 text-center my-2">
                Unverified
              </h3>
              <table className="w-full">
                <thead className="bg-indigo-100">
                  <th className="text-start p-2 md:p-3">Name</th>

                  <th className="text-center p-2 md:p-3">Cooperative</th>
                  <th className="text-end p-2 md:p-3">Role</th>
                </thead>
                <tbody className="divide-y">
                  {unEquityFarmers?.slice(0, 5).map((farmer) =>
                    farmer ? (
                      <tr className="p-2 even:bg-indigo-50">
                        <td className="text-start p-2 md:p-3 capitalize">
                          {farmer?.name}
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
        </div> */}
      </div>
    </div>
  )
}

export default FinanceOfficerDashboard

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
        <div className={`flex`}>{props.icon}</div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <p className="flex text-indigo-600 font-extrabold text-[1rem] lg:text-2xl tracking-wide lg:tracking-wider">
            {props.count.toLocaleString()}
          </p>
          <p className="flex text-cyan-500 text-sm lg:text-lg text-right">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}
