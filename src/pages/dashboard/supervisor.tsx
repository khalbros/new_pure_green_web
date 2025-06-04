/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import {
  FcAreaChart,
  FcBadDecision,
  FcBarChart,
  FcBullish,
  FcBusinessman,
  FcComboChart,
  FcDoughnutChart,
  FcFlowChart,
  FcManager,
} from "react-icons/fc"
import { Doughnut } from "react-chartjs-2"
import { fetchData, getUser } from "../../utils"
import { toast } from "react-toastify"
import { IDisbursement } from "../../interfaces/disbursement"
import { IFarmer } from "../../interfaces/farmer"
import { ITeam } from "../../interfaces/team"
import { useQuery } from "react-query"
import { FaUserCheck, FaUserClock } from "react-icons/fa"
import naira_bag from "../../assets/icons/naira_bag.jpg"
import datacapt from "../../assets/icons/pngkey.com-username-icon-png-2035339.png"
import { Avatar } from "@material-tailwind/react"

ChartJS.register(ArcElement, Tooltip, Legend)

interface IFeo {
  name: string
  farmers: string
}
interface ICooperativies {
  _id?: string
  name?: string
  team?: string
  farmers?: number
}
function SupervisorDashboard() {
  const user = useMemo(() => JSON.parse(getUser()!), [])
  const [totalCooperativies, setTotalCooperativies] = useState(0)
  const [totalHectares, setTotalHectares] = useState(0)
  const [totalOutstanding, setTotalOutstanding] = useState(0)
  const [totalRecovered, setTotalRecovered] = useState(0)
  const [totalLoanDisburse, setTotalLoanDisburse] = useState(0)
  const [recentDisbursement, setRecentDisbursement] =
    useState<IDisbursement[]>()
  const [FEOs, setFEOs] = useState<IFeo[]>()
  const [cooperativies, setCooperativies] = useState<ICooperativies[]>()

  const location = useLocation()
  const navigate = useNavigate()

  const data = {
    labels: [
      "Total Loan Disbursed",
      "Total Loan Repaid",
      "Total Disbursed Hectare",
      "Total Outstanding",
    ],
    datasets: [
      {
        data: [
          totalLoanDisburse,
          totalRecovered,
          totalHectares,
          totalOutstanding,
        ],
        backgroundColor: [
          "rgba(75, 75, 192, 1)",
          "rgba(75, 192, 75, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 8,78, 1)",
        ],
      },
    ],
  }

  useEffect(() => {
    fetchData("/cooperative/count/bysupervisor/" + user._id)
      .then((res) => {
        if (res.data) setTotalCooperativies(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/hectares-disbursed")
      .then((res) => {
        if (res.data) setTotalHectares(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/outstanding-loan")
      .then((res) => {
        if (res.data) setTotalOutstanding(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/recovered-loan")
      .then((res) => {
        if (res.data) setTotalRecovered(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement/count/loan-disbursed")
      .then((res) => {
        if (res.data) setTotalLoanDisburse(() => res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/disbursement?limit=5")
      .then((res) => {
        if (res.data) setRecentDisbursement(() => res.data)
      })
      .catch((err) => toast.error(err.message))

    fetchData("/cooperative/get/memberswithcount")
      .then((res) => {
        if (res.data) {
          setCooperativies(() => res.data)
        }
        if (!res.data) {
          toast.error(res.message)
        }
      })
      .catch((err) => toast.error(err.message))
    fetchData("/users/feos/withfarmers")
      .then((res) => {
        if (res.data) {
          setFEOs(() => res.data)
        }
      })
      .catch((err) => toast.error(err.message))
  }, [location.pathname])
  ////////// Farmer Queries //////////
  const queryRegisteredFarmers = useQuery({
    queryKey: ["counts", "farmers", "registered"],
    queryFn: async () => {
      return fetchData("/farmer/count/registered").then((res) => res.data)
    },
  })
  const queryApprovedFarmers = useQuery({
    queryKey: ["counts", "farmers", "approved"],
    queryFn: async () => {
      return fetchData("/farmer/count/approved").then((res) => res.data)
    },
  })
  const queryUnApprovedFarmers = useQuery({
    queryKey: ["counts", "farmers", "not_approved"],
    queryFn: async () => {
      return fetchData("/farmer/count/not_approved").then((res) => res.data)
    },
  })
  const queryVerifiedFarmers = useQuery({
    queryKey: ["counts", "farmers", "verified"],
    queryFn: async () => {
      return fetchData("/farmer/count/verified").then((res) => res.data)
    },
  })

  /////////// Loan queries //////////
  const queryOutstandingLoan = useQuery({
    queryKey: ["counts", "outstanding-loan"],
    queryFn: async () => {
      return fetchData("/disbursement/count/outstanding-loan").then(
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
  const queryEquity = useQuery({
    queryKey: ["counts", "equity-disbursed"],
    queryFn: async () => {
      return fetchData("/disbursement/count/equity-disbursed").then(
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
  const queryDataCapt = useQuery({
    queryKey: ["counts", "registration"],
    queryFn: async () => {
      return fetchData("/payment/count/registration").then((res) => res.data)
    },
  })

  return (
    <div className="h-fit w-full lg:m-2 space-y-4 max-w-[95vw] lg:max-w-[100vw]">
      <div className="grid grid-flow-row grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
        <StatCard
          color="red"
          icon={<FcBusinessman className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total FEOs"
          count={Number(FEOs?.length).toLocaleString()}
          action={() => navigate("user-management/feos")}
        />
        <StatCard
          color="red"
          icon={<FcFlowChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Cooperatives"
          count={totalCooperativies.toLocaleString()}
          action={() => navigate("cooperative-management")}
        />
        <StatCard
          color="red"
          icon={
            <FaUserClock className="text-4xl md:text-5xl lg:text-6xl text-teal-600" />
          }
          title="Total Farmers"
          count={queryRegisteredFarmers.data?.toLocaleString()}
          action={() => navigate("farmer-management")}
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
          color="red"
          icon={
            <FaUserCheck className="text-4xl md:text-5xl lg:text-6xl text-green-600" />
          }
          title="Approved Farmers"
          count={queryApprovedFarmers.data?.toLocaleString()}
          action={() => navigate("farmer-management/verified")}
        />
        <StatCard
          color="red"
          icon={<FcManager className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Verified Farmers"
          count={queryVerifiedFarmers.data?.toLocaleString()}
          action={() => navigate("farmer-management")}
        />
        <StatCard
          color="red"
          icon={<FcBadDecision className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Unapprove Farmers"
          count={queryUnApprovedFarmers.data?.toLocaleString()}
          action={() => navigate("farmer-management/unverified")}
        />
        <StatCard
          color="green"
          icon={<Avatar src={naira_bag} size="sm" />}
          title="Total Equity Paid"
          count={(queryEquityPaid?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/equity")}
        />
        <StatCard
          color="green"
          icon={<Avatar src={naira_bag} size="sm" />}
          title="Total Equity Booked"
          count={(queryEquity?.data ?? 0)?.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan")}
        />
        <StatCard
          color="red"
          icon={<FcBullish className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Loan Disbursed"
          count={Number(totalLoanDisburse ?? 0).toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("disbursement/input-loan")}
        />
        <StatCard
          color="green"
          icon={<FcAreaChart className="text-4xl md:text-5xl lg:text-6xl" />}
          title="Total Hectares Disbursed"
          count={Number(totalHectares ?? 0)?.toLocaleString() + " Ha"}
          action={() => navigate("disbursement/input-loan")}
        />
        <StatCard
          color="green"
          icon={<FcBarChart className="text-4xl md:text-5xl lg:text-6xl" />}
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
          color="green"
          icon={
            <FcDoughnutChart className="text-4xl md:text-5xl lg:text-6xl" />
          }
          title="Warehouse Percentage"
          count={
            Number(totalLoanDisburse) > 0
              ? Number(
                  (Number(queryLoanRecovered?.data) /
                    (Number(totalLoanDisburse) - Number(queryEquity?.data))) *
                    100
                ).toFixed(2) + " %"
              : "0 %"
          }
          action={() => navigate("disbursement/input-loan")}
        />
      </div>
      <div className="grid grid-flow-row md:grid-cols-2 items-stretch gap-2 md:gap-3 lg:gap-4">
        <div className="flex bg-white p-4 items-center justify-center">
          {(totalLoanDisburse > 0 ||
            totalHectares > 0 ||
            totalOutstanding > 0 ||
            totalRecovered > 0) && (
            <Doughnut
              data={data}
              options={{
                maintainAspectRatio: true,
                responsive: true,
              }}
            />
          )}
        </div>

        <div className="flex flex-col bg-white p-4 space-y-2 md:space-y-3 lg:space-y-4 shadow-lg border justify-between">
          {recentDisbursement && (
            <div>
              <h3 className="font-bold text-xl md:text-2xl lg:text-3xl text-green-600 text-center my-2">
                Recent Disbursements
              </h3>
              <table className="w-full">
                <thead className="bg-indigo-100">
                  <th className="text-start p-2 md:p-3">Farmer Name</th>
                  <th className="text-center p-2 md:p-3">Hectares</th>
                  <th className="text-end p-2 md:p-3">Loan Amount</th>
                </thead>
                <tbody className="divide-y">
                  {recentDisbursement?.map((disburse) => (
                    <tr className="p-2 even:bg-gray-50">
                      <td className="text-start p-2 md:p-3">
                        {(disburse?.farmer as IFarmer)?.first_name}
                      </td>
                      <td className="text-center p-2 md:p-3">
                        {Number(disburse?.hectares)?.toLocaleString()}
                      </td>
                      <td className="text-end p-2 md:p-3 tracking-wider">
                        {Number(disburse?.loan_amount)?.toLocaleString(
                          "en-NG",
                          {
                            style: "currency",
                            currency: "NGN",
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="grid grid-flow-row md:grid-cols-2 items-stretch gap-2 md:gap-3 lg:gap-4">
            <div className="bg-gray-50">
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-purple-600 text-center my-2">
                Cooperatives
              </h3>
              <table className="w-full">
                <thead className="bg-purple-100">
                  <th className="text-start p-2 md:p-3">Name</th>

                  <th className="text-center p-2 md:p-3">Team</th>
                  <th className="text-end p-2 md:p-3">Members</th>
                </thead>
                <tbody className="divide-y">
                  {cooperativies?.map((cooperative) => (
                    <tr className="p-2 even:bg-purple-50">
                      <td className="text-start p-2 md:p-3">
                        {cooperative.name}
                      </td>
                      <td className="text-center p-2 md:p-3">
                        {(cooperative?.team as ITeam)?.name}
                      </td>
                      <td className="text-end p-2 md:p-3">
                        {cooperative?.farmers}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-gray-50">
              <h3 className="font-bold text-lg md:text-xl lg:text-2xl text-green-600 text-center my-2">
                FEOs
              </h3>
              <table className="w-full">
                <thead className="bg-indigo-100">
                  <th className="text-start p-2 md:p-3">Name</th>
                  <th className="text-end p-2 md:p-3">Farmers</th>
                </thead>
                <tbody className="divide-y">
                  {FEOs?.map((feo) => (
                    <tr className="p-2 even:bg-indigo-50">
                      <td className="text-start p-2 md:p-3">{feo.name}</td>
                      <td className="text-end p-2 md:p-3">
                        {feo.farmers.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupervisorDashboard

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
          <p className="flex text-green-600 font-extrabold text-lg">
            {props.count}
          </p>
          <p className="flex text-green-600 lg:text-base text-right">
            {props.title}
          </p>
        </div>
      </div>
    </>
  )
}
