/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ReactNode, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import {
  FcAreaChart,
  FcComboChart,
  FcDoughnutChart,
  FcPieChart,
} from "react-icons/fc"
import { FaUserTie } from "react-icons/fa"
import { fetchData, getUser } from "../../utils"
import { toast } from "react-toastify"
import ReactApexChart from "react-apexcharts"
import { FaUserCheck, FaUserSlash, FaUsers } from "react-icons/fa"
import { Doughnut } from "react-chartjs-2"
import { IInput } from "../../interfaces/input"
import { ICommodity } from "../../interfaces/commodity"
import { useQuery } from "react-query"
import grain from "../../assets/icons/grain.jpeg"
import nairabag from "../../assets/icons/naira_bag.jpg"
import nairanote from "../../assets/icons/naira_note.png"
import cert1 from "../../assets/icons/certification.png"
import datacapt from "../../assets/icons/pngkey.com-username-icon-png-2035339.png"
import input_icon from "../../assets/icons/input.png"
import naira_icon from "../../assets/icons/naira.png"
import { CertStatCard } from "./finance"
import { FaPeopleGroup } from "react-icons/fa6"
import { GiFarmer, GiGrain } from "react-icons/gi"
import { GrLineChart } from "react-icons/gr"

ChartJS.register(ArcElement, Tooltip, Legend)

interface ICommodities {
  commodity: ICommodity
  quantity: number
  weight: number
  grade: string
}

function SuperAdminDashboard() {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  const location = useLocation()
  const navigate = useNavigate()
  const [loan_recovered, _setLoanRecovered] = useState<number>(0)
  const [disbursed_hectare, _setDisbursedHectare] = useState<number>(0)
  const [total_equity, _setTotalEquity] = useState<number>(0)
  const [total_netweight, _setTotalNetweight] = useState<{
    quantity: number
    weight: number
  }>({ quantity: 0, weight: 0 })
  const [total_grossweight, _setTotalGrossweight] = useState<{
    quantity: number
    weight: number
  }>({ quantity: 0, weight: 0 })
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

  const [total_outstanding, _setTotalOutstanding] = useState<number>(0)
  const [total_loan, _setTotalLoan] = useState<number>(0)

  const [cooperativies, _setTotalCooperativies] = useState<number>(0)
  const [clients, _setTotalClients] = useState<number>(0)

  const [_inputs, setInputs] = useState<IInput[]>()
  const [_commodities, setCommodities] = useState<ICommodities[]>()

  // Farmer Queries
  const queryRegisteredFarmer = useQuery({
    queryKey: ["farmer", "registered"],
    queryFn: async () => {
      return fetchData("/farmer/count/registered").then((res) => res.data)
    },
  })
  const queryApprovedFarmer = useQuery({
    queryKey: ["farmer", "approved"],
    queryFn: async () => {
      return fetchData("/farmer/count/approved").then((res) => res.data)
    },
  })
  const queryNotApprovedFarmer = useQuery({
    queryKey: ["farmer", "not_approved"],
    queryFn: async () => {
      return fetchData("/farmer/count/not_approved").then((res) => res.data)
    },
  })

  // queries Disbursement
  const queryCashRecovered = useQuery({
    queryKey: ["cash-recovered"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-cash").then(
        (res) => res.data
      )
    },
  })
  const queryGrainRecovered = useQuery({
    queryKey: ["grain-recovered"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-grain").then(
        (res) => res.data
      )
    },
  })

  const queryInput = useQuery({
    queryKey: ["counts", "inputs"],
    queryFn: async () => {
      return fetchData("/input/count/total").then((res) => res.data)
    },
  })
  const queryRegFee = useQuery({
    queryKey: ["payment", "registration"],
    queryFn: async () => {
      return fetchData("/payment/count/registration").then((res) => res.data)
    },
  })
  const queryCertFee = useQuery({
    queryKey: ["counts", "certificates", "paid"],
    queryFn: async () => {
      return fetchData("/payment/count/certificate/paid").then(
        (res) => res.data
      )
    },
  })
  const queryCert = useQuery({
    queryKey: ["counts", "certicates"],
    queryFn: async () => {
      return fetchData("/payment/count/certificate").then((res) => res.data)
    },
  })
  const queryEquity = useQuery({
    queryKey: ["payment", "equity"],
    queryFn: async () => {
      return fetchData("/payment/count/equity").then((res) => res.data)
    },
  })
  const queryUsers = useQuery({
    queryKey: ["count", "users"],
    queryFn: async () => {
      return fetchData("/users/count").then((res) => res.data)
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
    fetchData("/disbursement/count/hectares-disbursed")
      .then((res) => {
        if (res.data) _setDisbursedHectare(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/equity-disbursed")
      .then((res) => {
        if (res.data) _setTotalEquity(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/loan-disbursed")
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
  }, [location.pathname])

  return (
    <div className="h-fit w-full lg:m-2 space-y-4 max-w-[95vw] lg:max-w-[100vw]">
      <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-stretch">
        <StatCard
          color="red"
          icon={
            <FaUserTie className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Staff"
          count={queryUsers.data?.toLocaleString()}
          action={() => navigate("user-management")}
        />
        <StatCard
          color="red"
          icon={
            <FaUsers className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Clients"
          count={clients.toLocaleString()}
          action={() => navigate("client-management")}
        />
        <StatCard
          color="red"
          icon={
            <FaPeopleGroup className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Cooperativies"
          count={cooperativies.toLocaleString()}
          action={() => navigate("cooperative-management")}
        />
        <StatCard
          color="red"
          icon={
            <GiFarmer className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Registered Farmers"
          count={queryRegisteredFarmer.data?.toLocaleString()}
          action={() => navigate("farmer-management")}
        />
        <CertStatCard
          color="red"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={cert1}
                className="text-3xl md:text-5xl lg:text-6xl grayscale"
              />
            </div>
          }
          title="Total Certificate Paid"
          count={(queryCert?.data ?? 0)?.toLocaleString("en-NG")}
          amount={(queryCertFee?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/certificate")}
        />
        <StatCard
          color="green"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={datacapt}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Data Captured Fee"
          count={(queryRegFee.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/registration")}
        />
        <StatCard
          color="red"
          icon={
            <FaUserCheck className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Approved Farmers"
          count={queryApprovedFarmer.data?.toLocaleString()}
          action={() => navigate("farmer-management/verified")}
        />
        <StatCard
          color="red"
          icon={
            <FaUserSlash className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Unapproved Farmers"
          count={queryNotApprovedFarmer.data?.toLocaleString()}
          action={() => navigate("farmer-management/unverified")}
        />
        <StatCard
          color="red"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={nairabag}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Equity Paid"
          action={() => navigate("payment/equity")}
          count={(queryEquity?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
        />
        <StatCard
          color="green"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={nairabag}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Equity Booked"
          count={total_equity.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-l oan")}
        />

        <StatCard
          color="red"
          icon={
            <GrLineChart className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
          }
          title="Total Loan Disburse"
          count={total_loan.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan")}
        />
        <StatCard
          color="green"
          icon={<FcAreaChart className="text-3xl md:text-5xl lg:text-6xl" />}
          title="Total Hectares Disbursed"
          count={disbursed_hectare.toLocaleString() + " Ha"}
          action={() => navigate("disbursement/input-loan")}
        />

        <StatCard
          color="green"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={naira_icon}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Outstanding Loan"
          count={total_outstanding.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan/outstanding")}
        />
        <StatCard
          color="red"
          icon={
            <FcComboChart className="text-3xl md:text-5xl lg:text-6xl grayscale" />
          }
          title="Total Loan Repaid"
          count={loan_recovered.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/recovered")}
        />
        <StatCard
          color="red"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={nairanote}
                className="text-3xl md:text-5xl lg:text-6xl grayscale"
                color="green"
              />
            </div>
          }
          title="Total Cash Repaid"
          count={(queryCashRecovered?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/cash")}
        />

        <StatCard
          color="red"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={grain}
                className="text-3xl md:text-5xl lg:text-6xl grayscale"
              />
            </div>
          }
          title="Total Grain Repaid"
          count={(queryGrainRecovered?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/grains")}
        />
        <StatCard
          color="green"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={input_icon}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Inputs"
          count={(queryInput?.data ?? 0)?.toLocaleString()}
          action={() => navigate("input-management")}
        />

        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Grains"
          bags={total_grossweight?.quantity?.toLocaleString()}
          weight={total_grossweight?.weight?.toLocaleString()}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Grains Loan"
          bags={total_loan_weight?.bags?.toLocaleString()}
          weight={total_loan_weight?.weight?.toLocaleString()}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Grains Trade"
          bags={total_trade_weight?.bags?.toLocaleString()}
          weight={total_trade_weight?.weight?.toLocaleString() ?? 0}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Grains Storage"
          bags={total_storage_weight?.bags?.toLocaleString()}
          weight={total_storage_weight?.weight?.toLocaleString() ?? 0}
          action={() => navigate("warehouse-commodity-management")}
        />

        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-3xl md:text-5xl lg:text-6xl" />}
          title="Total Gross Weight"
          weight={total_grossweight?.weight.toLocaleString() + ""}
          bags={total_grossweight?.quantity.toLocaleString() + ""}
          action={() => navigate("disbursement/grains")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-3xl md:text-5xl lg:text-6xl" />}
          title="Total Net Weight"
          weight={total_netweight?.weight.toLocaleString() + ""}
          bags={total_netweight?.quantity.toLocaleString() + ""}
          action={() => navigate("disbursement/grains")}
        />
        <StatCard
          color="green"
          icon={
            <FcDoughnutChart className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Warehouse Percentage"
          count={
            Number(total_loan) > 0
              ? Number(
                  (Number(loan_recovered) /
                    (Number(total_loan) - Number(queryEquity?.data))) *
                    100
                )?.toFixed(2) + " %"
              : "0 %"
          }
          action={() => navigate("disbursement/input-loan")}
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

export default SuperAdminDashboard
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
        className="flex flex-wrap rounded bg-white p-4 lg:p-6 w-full items-center justify-between drop-shadow-lg cursor-pointer border hover:transform hover:scale-105 hover:bg-green-50 focus:bg-green-50 transition-transform duration-300 ease-linear"
        onClick={props.action}>
        <div className={`flex grayscale`}>{props.icon}</div>
        <div className="flex flex-col flex-1 flex-wrap gap-2 items-end">
          <p className="flex text-[1rem] text-green-600 font-extrabold lg:text-xl">
            {props.count}
          </p>
          <p className="flex text-green-600 font-bold lg:text-lg text-right">
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
        className="flex rounded bg-white p-4 lg:p-6 w-full items-center justify-between drop-shadow-lg cursor-pointer border hover:transform hover:scale-105 hover:bg-green-50 focus:bg-green-50 transition-transform duration-300 ease-linear"
        onClick={props.action}>
        <div className={`flex grayscale`}>
          <GiGrain className="text-3xl md:text-5xl lg:text-6xl text-gray-500" />
        </div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-green-600 font-extrabold lg:text-xl">
              {props.bags + " Bags"}
            </p>
          </span>
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-green-600 font-extrabold lg:text-xl">
              {props.weight + " WT"}
            </p>
          </span>
          <p className="flex text-green-600 font-bold lg:text-lg text-right">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}
