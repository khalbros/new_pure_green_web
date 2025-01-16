import { ReactNode, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import {
  FcAreaChart,
  FcBarChart,
  FcComboChart,
  FcPieChart,
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

ChartJS.register(ArcElement, Tooltip, Legend)

interface ICommodities {
  commodity: ICommodity
  quantity: number
  weight: number
  grade: string
}

function AreaSalesManagerDashboard() {
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
      return fetchData("/disbursement/count/loan-disburse").then(
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
      return fetchData("/disbursement/count/hectares-disburse").then(
        (res) => res.data
      )
    },
  })
  const queryEquity = useQuery({
    queryKey: ["counts", "equity"],
    queryFn: async () => {
      return fetchData("/disbursement/count/equity-disburse").then(
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
      return fetchData("/input").then((res) => res.data)
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
            <FaUsers className="text-4xl md:text-5xl lg:text-6xl text-cyan-500" />
          }
          title="Total Farmers"
          count={queryFarmers?.data?.toLocaleString()}
          action={() => navigate("farmer-management")}
        />
        <StatCard
          color="red"
          icon={
            <FaUsers className="text-4xl md:text-5xl lg:text-6xl text-cyan-500" />
          }
          title="Total Clients"
          count={queryClients?.data?.toLocaleString()}
          action={() => navigate("client-management")}
        />
        <StatCard
          color="red"
          icon={<FcFlowChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Cooperativies"
          count={queryCooperatives?.data?.toLocaleString()}
          action={() => navigate("cooperative-management")}
        />
        <StatCard
          color="red"
          icon={
            <FcPositiveDynamic className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Total Loan Disburse"
          count={queryToatalLoan?.data?.toLocaleString("en-NG", {
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
          count={queryLoanRecovered?.data?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/recovered")}
        />

        <StatCard
          color="green"
          icon={<FcBarChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Outstanding Loan"
          count={queryOutstandingLoan?.data?.toLocaleString("en-NG", {
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
          count={queryEquity?.data?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement")}
        />
        <StatCard
          color="green"
          icon={<FcAreaChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Hectares Disbursed"
          count={queryHectares?.data?.toLocaleString() + " Ha"}
          action={() => navigate("disbursement")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Loan"
          bags={queryLoanWeight?.data?.bags.toLocaleString()}
          weight={Number(queryLoanWeight?.data?.weight)?.toFixed(2) + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Trade"
          bags={queryTradeWeight?.data?.bags.toLocaleString()}
          weight={Number(queryTradeWeight?.data?.weight)?.toFixed(2) + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Grains Storage"
          bags={queryStorageWeight?.data?.bags.toLocaleString()}
          weight={Number(queryStorageWeight?.data?.weight)?.toFixed(2) + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Gross Weight"
          weight={Number(queryGrossweight?.data?.weight)?.toFixed(2) + ""}
          bags={queryGrossweight?.data?.quantity?.toLocaleString() + ""}
          action={() => navigate("warehouse-commodity-management")}
        />
        <GrainStatCard
          color="green"
          icon={<FcPieChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Net Weight"
          weight={Number(queryNetweight?.data?.weight)?.toFixed(2) + ""}
          bags={queryNetweight?.data?.quantity?.toLocaleString() + ""}
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
          action={() => navigate("disbursement")}
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
                {/* <p className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                  <span className="text-lg">Qty sent</span>
                  <span className="text-lg text-end font-bold tracking-wide">
                    {Number(305500).toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p>
                <p className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                  <span className="text-lg">Qty receive</span>
                  <span className="text-lg text-end font-bold tracking-wide">
                    {Number(305500).toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p> */}
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
            <h3 className="font-bold text-base md:text-lg lg:text-xl text-green-600 text-center my-2">
              Dispatch
            </h3>
            <div className="grid lg:grid-flow-row lg:grid-cols-2 gap-2 md:gap-3 mt-4">
              <div className="p-2 bg-purple-50 text-gray-700 space-y-2 md:space-y-3">
                <h3 className="font-bold text-base md:text-lg lg:text-xl text-green-600 my-2">
                  To Client's
                </h3>
                <p className="flex flex-row items-center justify-between w-full">
                  <span className="text-lg">Sent</span>
                  <span className="text-lg font-bold tracking-wide">
                    {Number(queryDispatchTr?.data)?.toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p>
              </div>
              <div className="p-2 bg-indigo-50 text-gray-700 space-y-2 md:space-y-3">
                <h3 className="font-bold text-base md:text-lg lg:text-xl text-green-600 my-2">
                  To Warehouse
                </h3>
                <p className="flex flex-row items-center justify-between w-full">
                  <span className="text-lg">Sent</span>
                  <span className="text-lg font-bold tracking-wide">
                    {Number(queryDispatchWhS?.data)?.toLocaleString()}{" "}
                    <span className="text-xs text-gray-500">bags</span>
                  </span>
                </p>
                <p className="flex flex-row items-center justify-between w-full">
                  <span className="text-lg">Receive</span>
                  <span className="text-lg font-bold tracking-wide">
                    {Number(queryDispatchWhR?.data)?.toLocaleString()}{" "}
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
          <h3 className="font-bold text-base md:text-lg lg:text-xl text-green-600 text-center my-2">
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
          <h3 className="font-bold text-base md:text-lg lg:text-xl text-green-600 text-center my-2">
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

export default AreaSalesManagerDashboard

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
        <div className={`flex`}>{props.icon}</div>
        <div className="flex flex-col flex-1 gap-2 items-end">
          <p className="flex text-indigo-600 font-extrabold lg:text-xl">
            {props.count}
          </p>
          <p className="flex text-cyan-500 font-bold lg:text-lg text-right">
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
