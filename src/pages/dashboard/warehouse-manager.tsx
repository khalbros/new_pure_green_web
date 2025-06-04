import { ReactNode, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import {
  FcAreaChart,
  FcComboChart,
  FcFlowChart,
  FcPositiveDynamic,
  FcDoughnutChart,
} from "react-icons/fc"
import { Doughnut } from "react-chartjs-2"
import { fetchData, getUser } from "../../utils"
import { IWInput } from "../../interfaces/input"
import ReactApexChart from "react-apexcharts"
import { ICommodity } from "../../interfaces/commodity"
import { IGrade } from "../../interfaces/grade"
import { FaUsers } from "react-icons/fa"
import { useQuery } from "react-query"
import maize_bag from "../../assets/icons/maize_bag.jpg"
import naira_bag from "../../assets/icons/naira_bag.jpg"
import nairanote from "../../assets/icons/naira_note.png"
import naira_icon from "../../assets/icons/naira.png"
import input_icon from "../../assets/icons/input.png"
import grain from "../../assets/icons/grain.jpeg"
import datacapt from "../../assets/icons/pngkey.com-username-icon-png-2035339.png"
import cert1 from "../../assets/icons/cert1.png"
import { CertStatCard } from "./finance"
import { GiFarmer, GiGrain } from "react-icons/gi"

ChartJS.register(ArcElement, Tooltip, Legend)

interface ICommodities {
  commodity: ICommodity
  quantity: number
  weight: number
  grade: string
}

function WarehouseManagerDashboard() {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  const navigate = useNavigate()

  const queryFarmers = useQuery({
    queryKey: ["counts", "farmers"],
    queryFn: async () => {
      return fetchData("/farmer/count/registered").then((res) => res.data)
    },
  })
  const queryClients = useQuery({
    queryKey: ["counts", "clients"],
    queryFn: async () => {
      return fetchData("/client/count/all").then((res) => res.data)
    },
  })
  const queryCooperatives = useQuery({
    queryKey: ["counts", "cooperative"],
    queryFn: async () => {
      return fetchData("/cooperative/count/registered").then((res) => res.data)
    },
  })
  const queryToatalLoan = useQuery({
    queryKey: ["counts", "total-loan"],
    queryFn: async () => {
      return fetchData("/disbursement/count/loan-disbursed").then(
        (res) => res.data
      )
    },
  })
  const queryLoanRecovered = useQuery({
    queryKey: ["counts", "loan-repaid"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-loan").then(
        (res) => res.data
      )
    },
  })
  const queryCashRecovered = useQuery({
    queryKey: ["counts", "cash-repaid"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-cash").then(
        (res) => res.data
      )
    },
  })
  const queryGrainRecovered = useQuery({
    queryKey: ["counts", "grain-repaid"],
    queryFn: async () => {
      return fetchData("/disbursement/count/recovered-grain").then(
        (res) => res.data
      )
    },
  })
  const queryOutstandingLoan = useQuery({
    queryKey: ["counts", "outstanding-loan"],
    queryFn: async () => {
      return fetchData("/disbursement/count/outstanding-loan").then(
        (res) => res.data
      )
    },
  })
  const queryHectares = useQuery({
    queryKey: ["counts", "hectares"],
    queryFn: async () => {
      return fetchData("/disbursement/count/hectares-disbursed").then(
        (res) => res.data
      )
    },
  })
  const queryEquityPaid = useQuery({
    queryKey: ["counts", "equity"],
    queryFn: async () => {
      return fetchData("/payment/count/equity").then((res) => res.data)
    },
  })
  const queryEquity = useQuery({
    queryKey: ["counts", "equity-disbursed"],
    queryFn: async () => {
      return fetchData("/disbursement/count/equity-disbursed").then(
        (res) => res.data
      )
    },
  })
  const queryDataCapt = useQuery({
    queryKey: ["counts", "registration"],
    queryFn: async () => {
      return fetchData("/payment/count/registration").then((res) => res.data)
    },
  })
  const queryCert = useQuery({
    queryKey: ["counts", "certificates"],
    queryFn: async () => {
      return fetchData("/payment/count/certificate").then((res) => res.data)
    },
  })
  const queryCertPaid = useQuery({
    queryKey: ["counts", "certificates", "paid"],
    queryFn: async () => {
      return fetchData("/payment/count/certificate/paid").then(
        (res) => res.data
      )
    },
  })
  const queryGrossweight = useQuery({
    queryKey: ["counts", "gross-weight"],
    queryFn: async () => {
      return fetchData("/commodity/count/grossweight").then((res) => res.data)
    },
  })
  const queryNetweight = useQuery({
    queryKey: ["counts", "net-weight"],
    queryFn: async () => {
      return fetchData("/commodity/count/netweight").then((res) => res.data)
    },
  })
  const queryLoanWeight = useQuery({
    queryKey: ["counts", "loan", "weight"],
    queryFn: async () => {
      return fetchData("/commodity/count/loan/weight").then((res) => res.data)
    },
  })
  const queryTradeWeight = useQuery({
    queryKey: ["counts", "trade", "weight"],
    queryFn: async () => {
      return fetchData("/commodity/count/trade/weight").then((res) => res.data)
    },
  })
  const queryStorageWeight = useQuery({
    queryKey: ["counts", "storage", "weight"],
    queryFn: async () => {
      return fetchData("/commodity/count/storage/weight").then(
        (res) => res.data
      )
    },
  })
  const queryInputs = useQuery({
    queryKey: ["inputs"],
    queryFn: async () => {
      return fetchData("/input/by/warehouse").then((res) => res.data)
    },
  })
  const queryCommodity = useQuery({
    queryKey: ["commodity"],
    queryFn: async () => {
      return fetchData("/commodity/warehouse/" + user?.warehouse._id).then(
        (res) => res.data
      )
    },
  })
  const queryGrade = useQuery({
    queryKey: ["grade"],
    queryFn: async () => {
      return fetchData("/grade").then((res) => res.data)
    },
  })
  const queryDispatchTr = useQuery({
    queryKey: ["count", "dispatch", "trading"],
    queryFn: async () => {
      return fetchData(`/dispatch/count/bags-sent?type=${"Trading"}`).then(
        (res) => res.data
      )
    },
  })
  const queryDispatchWhS = useQuery({
    queryKey: ["count", "dispatch", "warehouse", "sent"],
    queryFn: async () => {
      return fetchData(
        `/dispatch/count/bags-sent?type=${"Inter warehouse"}`
      ).then((res) => res.data)
    },
  })
  const queryDispatchWhR = useQuery({
    queryKey: ["count", "dispatch", "warehouse", "recieve"],
    queryFn: async () => {
      return fetchData(
        `/dispatch/count/bags-sent?type=${"Inter warehouse"}`
      ).then((res) => res.data)
    },
  })

  const queryInput = useQuery({
    queryKey: ["counts", "inputs"],
    queryFn: async () => {
      return fetchData("/input/warehouse/count/total").then((res) => res.data)
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
          queryLoanRecovered?.data,
          queryHectares?.data,
          queryEquity?.data,
          queryOutstandingLoan?.data,
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

  return (
    <div className="h-fit w-full lg:m-2 space-y-4 max-w-[95vw] lg:max-w-[100vw]">
      <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-4 gap-3 items-stretch">
        <StatCard
          color="red"
          icon={
            <FaUsers className="text-4xl md:text-5xl lg:text-6xl text-light-green-700" />
          }
          title="Total Clients"
          count={(queryClients?.data ?? 0)?.toLocaleString()}
          action={() => navigate("client-management")}
        />

        <StatCard
          color="red"
          icon={<FcFlowChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Cooperativies"
          count={(queryCooperatives?.data ?? 0)?.toLocaleString()}
          action={() => navigate("cooperative-management")}
        />
        <StatCard
          color="red"
          icon={
            <GiFarmer className="text-4xl md:text-5xl lg:text-6xl text-light-green-700" />
          }
          title="Total Farmers"
          count={(queryFarmers?.data ?? 0)?.toLocaleString()}
          action={() => navigate("farmer-management")}
        />

        <CertStatCard
          color="red"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={cert1}
                className="text-3xl md:text-5xl lg:text-6xl grayscale"
                color="green"
              />
            </div>
          }
          title="Total Certificate Paid"
          count={(queryCert?.data ?? 0)?.toLocaleString("en-NG")}
          amount={(queryCertPaid?.data ?? 0)?.toLocaleString("en-NG", {
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
          title="Data Capture Fee"
          count={(queryDataCapt?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/registration")}
        />
        <StatCard
          color="green"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={naira_bag}
                className="text-3xl md:text-5xl lg:text-6xl"
              />
            </div>
          }
          title="Total Equity Paid"
          count={(queryEquityPaid?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/equity")}
        />
        <StatCard
          color="green"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={naira_bag}
                className="text-3xl md:text-5xl lg:text-6xl"
              />
            </div>
          }
          title="Total Equity Booked"
          count={(queryEquity?.data ?? 0).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan")}
        />
        <StatCard
          color="red"
          icon={
            <FcPositiveDynamic className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Total Loan Disburse"
          count={(queryToatalLoan?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan")}
        />
        <StatCard
          color="green"
          icon={<FcAreaChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Hectares Disbursed"
          count={queryHectares?.data?.toLocaleString() ?? 0 + " Ha"}
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
          count={(queryOutstandingLoan?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan/outstanding")}
        />
        <StatCard
          color="red"
          icon={<FcComboChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Loan Repaid"
          count={(queryLoanRecovered?.data ?? 0)?.toLocaleString("en-NG", {
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
                className="text-3xl md:text-5xl lg:text-6xl"
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
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
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
              <img src={input_icon} />
            </div>
          }
          title="Total Inputs"
          count={(queryInput?.data ?? 0)?.toLocaleString()}
          action={() => navigate("warehouse-input-management")}
        />
        <GrainStatCard
          color="green"
          title="Total Grains"
          weight={Number(queryGrossweight?.data?.weight ?? 0)?.toFixed(2) + ""}
          bags={queryGrossweight?.data?.quantity?.toLocaleString() ?? 0 + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<GiGrain className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Loan"
          bags={queryLoanWeight?.data?.bags.toLocaleString() ?? 0}
          weight={Number(queryLoanWeight?.data?.weight ?? 0)?.toFixed(2) + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<GiGrain className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Trade"
          bags={queryTradeWeight?.data?.bags.toLocaleString() ?? 0}
          weight={Number(queryTradeWeight?.data?.weight ?? 0)?.toFixed(2) + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<GiGrain className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Storage"
          bags={queryStorageWeight?.data?.bags.toLocaleString() ?? 0}
          weight={
            Number(queryStorageWeight?.data?.weight ?? 0)?.toFixed(2) + ""
          }
          action={() => navigate("warehouse-commodity-management")}
        />

        <GrainStatCard
          color="green"
          title="Total Net Weight"
          weight={Number(queryNetweight?.data?.weight ?? 0)?.toFixed(2) + ""}
          bags={queryNetweight?.data?.quantity?.toLocaleString() ?? 0 + ""}
          action={() => navigate("warehouse-commodity-management")}
        />

        <StatCard
          color="green"
          icon={
            <FcDoughnutChart className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Warehouse Percentage"
          count={
            Number(queryToatalLoan?.data) > 0
              ? Number(
                  (Number(queryLoanRecovered?.data) /
                    (Number(queryToatalLoan?.data) -
                      Number(queryEquity?.data))) *
                    100
                )?.toFixed(2) + " %"
              : "0 %"
          }
          action={() => navigate("disbursement/input-loan")}
        />
      </div>
      <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 gap-3 items-stretch">
        {queryToatalLoan.data && (
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
        )}

        <div className=" p-4 gap-2 md:gap-3 lg:gap-4 lg:shadow-lg border">
          <div className=" border-2 p-2">
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-light-green-700 text-center my-2">
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
          <div className=" border-2 p-2">
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-light-green-700 text-center my-2">
              Dispatch
            </h3>
            <div className="grid lg:grid-flow-row lg:grid-cols-2 gap-2 md:gap-3 mt-4">
              <div className="p-2 bg-purple-50 text-gray-700 space-y-2 md:space-y-3">
                <h3 className="font-bold text-base md:text-lg lg:text-xl text-light-green-700 my-2">
                  To Client's
                </h3>
                <p className="flex flex-row items-center justify-between w-full">
                  <span className="text-lg">Sent</span>
                  <span className="text-lg font-bold tracking-wide">
                    {Number(queryDispatchTr?.data ?? 0)?.toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p>
              </div>
              <div className="p-2 bg-indigo-50 text-gray-700 space-y-2 md:space-y-3">
                <h3 className="font-bold text-base md:text-lg lg:text-xl text-light-green-700 my-2">
                  To Warehouse
                </h3>
                <p className="flex flex-row items-center justify-between w-full">
                  <span className="text-lg">Sent</span>
                  <span className="text-lg font-bold tracking-wide">
                    {Number(queryDispatchWhS?.data ?? 0)?.toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p>
                <p className="flex flex-row items-center justify-between w-full">
                  <span className="text-lg">Receive</span>
                  <span className="text-lg font-bold tracking-wide">
                    {Number(queryDispatchWhR?.data ?? 0)?.toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-flow-row lg:grid-cols-2 gap-6 lg:gap-3 items-stretch">
        <div className="grid bg-white lg:drop-shadow-lg rounded-md p-2 md:p-3 lg:p-4 space-y-3 lg:shadow-lg border">
          <h3 className="font-bold text-base md:text-lg lg:text-xl text-light-green-700 text-center my-2">
            Inputs
          </h3>
          <div className="grid grid-flow-row md:grid-cols-2 w-full gap-2 max-h-[400px] overflow-hidden overflow-y-auto">
            {queryInputs?.data?.map((input: IWInput) => (
              <div
                className="flex items-center border flex-1 px-2"
                key={input._id}>
                <div className="flex flex-col lg:flex-row gap-2 capitalize px-2 w-full">
                  <span className="text-lg lg:text-xl tracking-wide">
                    {input.input?.name}
                  </span>
                </div>

                <div className="flex-1 gap-1">
                  <span className="flex gap-2 items-center w-full">
                    <span className="text-gray-400 text-base">Disbursed:</span>
                    <span className="text-gray-600 font-bold tracking-wide">
                      {Number(input.quantity_out ?? 0).toLocaleString()}
                    </span>
                  </span>
                  <span className="flex gap-2 items-center w-full">
                    <span className="text-gray-400 text-base">Available:</span>
                    <span className="text-gray-600 font-bold tracking-wide">
                      {Number(input.quantity ?? 0).toLocaleString()}
                    </span>
                  </span>
                </div>
                <div>
                  <ReactApexChart
                    options={{
                      chart: { type: "donut" },
                      colors: ["rgba(255, 8, 78, 1)", "rgba(75, 192, 75, 1)"],
                      legend: { show: false },
                      dataLabels: {
                        enabled: false,
                      },
                      labels: ["Disbursed", "Available"],
                    }}
                    series={[
                      Number(input.quantity_out ?? 0),
                      Number(input.quantity ?? 0),
                    ]}
                    width="110px"
                    type="donut"
                    className="-mx-5"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full overflow-x-scroll bg-white lg:drop-shadow-lg rounded-md p-2 md:p-3 lg:p-4 space-y-3 lg:shadow-lg border">
          <h3 className="font-bold text-base md:text-lg lg:text-xl text-light-green-700 text-center my-2">
            Commodities
          </h3>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse border-spacing-y-1 shadow border-[0.5px] rounded-lg whitespace-nowrap">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="text-start p-2 md:p-3">Commodity / Grade</th>
                  {queryGrade?.data?.map((grade: IGrade) => (
                    <th
                      className="text-center p-2 md:p-3 capitalize"
                      key={grade?._id}>
                      {grade?.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {queryCommodity?.data?.map(
                  (commodity: ICommodities, i: string) => (
                    <tr className="p-2 even:bg-gray-50" key={i}>
                      <td className="text-start p-2 md:p-3 capitalize font-semibold">
                        {commodity?.commodity?.name}
                      </td>
                      {queryGrade?.data?.map((grade: IGrade, i: string) =>
                        grade.name === (commodity.grade as IGrade)?.name ? (
                          <td className="text-center p-2 m" key={i}>
                            {commodity.weight.toLocaleString()}
                            <b> kg</b>
                            <br />
                            <b>(</b>
                            {commodity.quantity.toLocaleString()} <b> bags) </b>
                          </td>
                        ) : (
                          <td className="text-center p-2 m">-</td>
                        )
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WarehouseManagerDashboard

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
        onClick={props.action}>
        <div className={`flex grayscale text-gray-500`}>{props.icon}</div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <p className="text-light-green-700 font-extrabold lg:text-xl truncate">
            {props.count}
          </p>
          <p className="flex text-light-green-700 font-bold lg:text-lg text-right">
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
        <div className={`flex grayscale text-gray-500`}>
          {props.icon ?? (
            <div className="object-contain w-10 h-10">
              <img src={maize_bag} />
            </div>
          )}
        </div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-light-green-700 font-extrabold lg:text-xl">
              {props.bags + " Bags"}
            </p>
          </span>
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-light-green-700 font-extrabold lg:text-xl">
              {props.weight + " WT"}
            </p>
          </span>
          <p className="flex text-light-green-700 font-bold lg:text-lg text-right">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}
