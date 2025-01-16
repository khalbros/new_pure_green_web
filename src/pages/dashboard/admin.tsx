/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import {
  FcAreaChart,
  FcBarChart,
  FcComboChart,
  FcDoughnutChart,
  FcFlowChart,
  FcPieChart,
  FcPositiveDynamic,
} from "react-icons/fc"

import { fetchData, getUser } from "../../utils"
import { toast } from "react-toastify"
import ReactApexChart from "react-apexcharts"
import {
  FaMoneyBillAlt,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
  FaUsers,
} from "react-icons/fa"
import { Doughnut } from "react-chartjs-2"
import { IInput } from "../../interfaces/input"
import { ICommodity } from "../../interfaces/commodity"
import { useQuery } from "react-query"

ChartJS.register(ArcElement, Tooltip, Legend)

interface ICommodities {
  commodity: ICommodity
  quantity: number
  weight: number
  grade: string
}

function AdminDashboard() {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  const location = useLocation()
  const navigate = useNavigate()
  const [loan_recovered, _setLoanRecovered] = useState<number>(0)
  const [disbursed_hectare, _setDisbursedHectare] = useState<number>(0)
  const [total_equity, _setTotalEquity] = useState<number>(0)
  const [total_loan_weight, _setTotalLoanWeight] = useState<{
    bags: number
    weight: number
  }>({ bags: 0, weight: 0 })
  const [total_trade_weight, _setTotalTradeWeight] = useState<{
    bags: number
    weight: number
  }>({ bags: 0, weight: 0 })
  const [total_storage_weight, _setTotalStorageWeight] = useState<{
    bags: number
    weight: number
  }>({ bags: 0, weight: 0 })
  const [total_netweight, _setTotalNetweight] = useState<{
    quantity: number
    weight: number
  }>({ quantity: 0, weight: 0 })
  const [total_grossweight, _setTotalGrossweight] = useState<{
    quantity: number
    weight: number
  }>({ quantity: 0, weight: 0 })
  const [total_outstanding, _setTotalOutstanding] = useState<number>(0)
  const [total_loan, _setTotalLoan] = useState<number>(0)
  const [farmers, _setTotalFarmers] = useState<number>(0)
  const [verifiedFarmers, _setTotalVerifiedFarmers] = useState<number>(0)
  const [unVerifiedFarmers, _setTotalUnVerifiedFarmers] = useState<number>(0)
  const [cooperativies, _setTotalCooperativies] = useState<number>(0)
  const [clients, _setTotalClients] = useState<number>(0)
  const [totalEquity, setTotalEquity] = useState(0)

  const [_inputs, setInputs] = useState<IInput[]>()
  const [_commodities, setCommodities] = useState<ICommodities[]>()

  // querie

  const queryCashRecovered = useQuery({
    queryKey: ["counts", "cash-recovered"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-cash").then(
        (res) => res.data
      )
    },
  })
  const queryGrainRecovered = useQuery({
    queryKey: ["counts", "grain-recovered"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-grain").then(
        (res) => res.data
      )
    },
  })

  const data = {
    labels: [
      "Total Loan Repaid",
      "Total Disbursed Hectare",
      "Total Equity",
      "Total Outstanding",
    ],
    datasets: [
      {
        label: "Disbursement",
        data: [
          loan_recovered,
          disbursed_hectare,
          total_equity,
          total_outstanding,
        ],
        backgroundColor: [
          "rgba(255, 8,78, 1)",
          "rgba(75, 192, 75, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(25, 26, 86, 1)",
        ],
      },
    ],
  }

  useEffect(() => {
    fetchData("/input")
      .then((res) => {
        if (res.data) setInputs(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/commodity/warehouse/" + user?.warehouse?._id)
      .then((res) => {
        if (res.data) setCommodities(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/hectares-disburse")
      .then((res) => {
        if (res.data) _setDisbursedHectare(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/equity-disburse")
      .then((res) => {
        if (res.data) _setTotalEquity(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/loan-disburse")
      .then((res) => {
        if (res.data) _setTotalLoan(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/outstanding-loan")
      .then((res) => {
        if (res.data) _setTotalOutstanding(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/recovered-loan")
      .then((res) => {
        if (res.data) _setLoanRecovered(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/commodity/count/grossweight")
      .then((res) => {
        if (res.data) _setTotalGrossweight(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/commodity/count/netweight")
      .then((res) => {
        if (res.data) _setTotalNetweight(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/commodity/count/loan/weight")
      .then((res) => {
        if (res.data) _setTotalLoanWeight(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/commodity/count/trade/weight")
      .then((res) => {
        if (res.data) _setTotalTradeWeight(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/commodity/count/storage/weight")
      .then((res) => {
        if (res.data) _setTotalStorageWeight(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/farmer/count/total_registered")
      .then((res) => {
        if (res.data) _setTotalFarmers(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/farmer/count/total_verified")
      .then((res) => {
        if (res.data) _setTotalVerifiedFarmers(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/farmer/count/total_unverified")
      .then((res) => {
        if (res.data) _setTotalUnVerifiedFarmers(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/cooperative/count/registered")
      .then((res) => {
        if (res.data) _setTotalCooperativies(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/client/count/all")
      .then((res) => {
        if (res.data) _setTotalClients(() => res.data)
      })
      .catch((err) => toast.error(err.message))

    fetchData("/payment/equity")
      .then((res) => {
        if (res.data) setTotalEquity(res.data)
      })
      .catch((err) => toast.error(err.message))
  }, [location.pathname])

  return (
    <div className="h-fit w-full lg:m-2 space-y-4 max-w-[95vw] lg:max-w-[100vw]">
      <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
        <StatCard
          color="red"
          icon={
            <FaUserClock
              className="text-4xl md:text-5xl lg:text-6xl"
              color="blue"
            />
          }
          title="Total Registered Farmers"
          count={farmers.toLocaleString()}
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
          count={verifiedFarmers.toLocaleString()}
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
          count={unVerifiedFarmers.toLocaleString()}
          action={() => navigate("farmer-management/unverified")}
        />

        <StatCard
          color="red"
          icon={
            <FaUsers className="text-4xl md:text-5xl lg:text-6xl text-cyan-500" />
          }
          title="Total Clients"
          count={clients.toLocaleString()}
          action={() => navigate("client-management")}
        />
        <StatCard
          color="red"
          icon={<FcFlowChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Cooperativies"
          count={cooperativies.toLocaleString()}
          action={() => navigate("cooperative-management")}
        />
        <StatCard
          color="red"
          icon={
            <FcPositiveDynamic className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Total Loan Disburse"
          count={total_loan.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement")}
        />
        <StatCard
          color="red"
          icon={<FcComboChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Cash Repaid"
          count={queryCashRecovered?.data?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/cash")}
        />
        <StatCard
          color="red"
          icon={<FcComboChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Grain Repaid"
          count={queryGrainRecovered?.data?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/grains")}
        />
        <StatCard
          color="red"
          icon={<FcComboChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Loan Repaid"
          count={loan_recovered.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/recovered")}
        />

        <StatCard
          color="green"
          icon={<FcBarChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Outstanding Loan"
          count={total_outstanding.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/outstanding")}
        />
        <StatCard
          color="green"
          icon={
            <FcDoughnutChart className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Total Equity"
          count={total_equity.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement")}
        />

        <StatCard
          color="red"
          icon={
            <FaMoneyBillAlt
              className="text-4xl md:text-5xl lg:text-6xl"
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
        <StatCard
          color="green"
          icon={<FcAreaChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Hectares Disbursed"
          count={disbursed_hectare.toLocaleString() + " Ha"}
          action={() => navigate("disbursement")}
        />

        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Loan"
          bags={total_loan_weight?.bags?.toLocaleString()}
          weight={total_loan_weight?.weight?.toLocaleString() + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Trade"
          bags={total_trade_weight?.bags?.toLocaleString()}
          weight={total_trade_weight?.weight?.toLocaleString() + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Storage"
          bags={total_storage_weight?.bags?.toLocaleString()}
          weight={total_storage_weight?.weight?.toLocaleString() + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Net Weight"
          weight={total_netweight?.weight.toLocaleString() + ""}
          bags={total_netweight?.quantity.toLocaleString() + ""}
          action={() => navigate("disbursement/grains")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Gross Weight"
          weight={total_grossweight?.weight.toLocaleString() + ""}
          bags={total_grossweight?.quantity.toLocaleString() + ""}
          action={() => navigate("disbursement/grains")}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
        <div className="">
          <Doughnut
            data={data}
            options={{
              maintainAspectRatio: true,
              responsive: true,
            }}
            className="mx-0"
          />
        </div>
        <div className=" p-4 gap-2 md:gap-3 lg:gap-4 lg:shadow-lg border">
          <div className=" border-2 p-2">
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-green-600 text-center my-2">
              Transactions
            </h3>
            <div className="grid grid-flow-row md:grid-cols-2 gap-2 md:gap-3 mt-4 border p-2 max-w-full">
              <div className="p-2 text-gray-700 space-y-2 md:space-y-3 max-w-full">
                <h4 className="font-bold text-xl text-gray-900 text-center">
                  Trading
                </h4>
                <div>
                  <ReactApexChart
                    options={{
                      chart: { type: "donut" },
                      colors: ["rgba(255, 8, 78, 1)", "rgba(75, 192, 75, 1)"],
                      legend: { show: false },
                      dataLabels: {
                        enabled: true,
                        formatter(val) {
                          return Math.round(Number(val)) + " %"
                        },
                      },
                      labels: ["Sent", "Received"],
                    }}
                    series={[230, 320]}
                    type="donut"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="p-2 text-gray-700 space-y-2 md:space-y-3">
                <h4 className="font-bold text-xl text-gray-900 text-center">
                  Storage
                </h4>

                <div>
                  <ReactApexChart
                    options={{
                      chart: { type: "donut" },
                      colors: ["rgba(255, 8, 78, 1)", "rgba(75, 192, 75, 1)"],
                      legend: { show: false },
                      dataLabels: {
                        enabled: true,
                        formatter(val) {
                          return Math.round(Number(val)) + " %"
                        },
                      },
                      labels: ["Sent", "Received"],
                    }}
                    series={[630, 320]}
                    type="donut"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
interface IProps {
  count: string
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
        onClick={props.action}
      >
        <div className={`flex`}>{props.icon}</div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <p className="flex text-indigo-600 font-extrabold text-xl">
            {props.count}
          </p>
          <p className="flex text-cyan-500 lg:text-lg text-right">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}

interface IGrainProps {
  bags: string
  weight: string
  title: string
  icon?: ReactNode
  color: Color
  action?: VoidFunction
}

export const GrainStatCard: React.FC<IGrainProps> = (props) => {
  return (
    <>
      <div
        className="flex rounded bg-white p-4 lg:p-6 w-full items-center justify-between drop-shadow-lg cursor-pointer border hover:transform hover:scale-105 hover:bg-green-50 focus:bg-green-50 transition-transform duration-300 ease-linear gap-2"
        onClick={props.action}
      >
        {props.icon && <div className={`flex`}>{props.icon}</div>}
        <div className="flex flex-col flex-1 gap-2 items-end">
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-indigo-600 font-extrabold lg:text-xl">
              {props.bags + " Bags"}
            </p>
          </span>
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-indigo-600 font-extrabold lg:text-xl">
              {props.weight + " WT"}
            </p>
          </span>
          <p className="flex text-cyan-500 font-bold lg:text-lg text-right">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}
