import { ReactNode, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Color } from "chart.js"
import { fetchData } from "../../utils"
import { toast } from "react-toastify"
import nairabag from "../../assets/icons/naira_bag.jpg"
import nairanote from "../../assets/icons/naira_note.png"
import cert1 from "../../assets/icons/cert1.png"
import datacapt from "../../assets/icons/pngkey.com-username-icon-png-2035339.png"

ChartJS.register(ArcElement, Tooltip, Legend)

function FinanceOfficerDashboard() {
  const [totalRegistered, setTotalRegistered] = useState(0)
  const [totalEquity, setTotalEquity] = useState(0)
  const [totalCert, setTotalCert] = useState(0)
  const [totalCertPaid, setTotalCertPaid] = useState(0)
  const [totalCash, setTotalCash] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchData("/payment/count/registration")
      .then((res) => {
        if (res.data) setTotalRegistered(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/payment/count/equity")
      .then((res) => {
        if (res.data) setTotalEquity(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/payment/count/certificate/paid")
      .then((res) => {
        if (res.data) setTotalCertPaid(res.data)
      })
      .catch((err) => toast.error(err.message))
    fetchData("/payment/count/certificate")
      .then((res) => {
        if (res.data) setTotalCert(res.data)
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
            <div className="object-contain w-10 h-10">
              <img
                src={datacapt}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Data Capture Fee"
          count={totalRegistered.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/registration")}
        />
        <CertStatCard
          color="red"
          icon={
            <div className="object-contain w-10 h-10">
              <img
                src={cert1}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Certificate Paid"
          count={totalCert.toLocaleString("en-NG")}
          amount={totalCertPaid.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/certificate")}
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
            <div className="object-contain w-10 h-10">
              <img
                src={nairabag}
                className="text-3xl md:text-5xl lg:text-6xl"
                color="green"
              />
            </div>
          }
          title="Total Equity Paid"
          count={totalEquity.toLocaleString("en-NG", {
            style: "currency",
            currency: "NGN",
          })}
          action={() => navigate("payment/equity")}
        />
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

interface ICertProps {
  count: number | string
  amount: number | string
  title: string
  icon: ReactNode
  color: Color
  action?: VoidFunction
}
export const CertStatCard: React.FC<ICertProps> = (props) => {
  return (
    <>
      <div
        className="flex rounded bg-white p-4 lg:p-6 w-full items-center justify-between drop-shadow-lg cursor-pointer border hover:transform hover:scale-105 hover:bg-green-50 focus:bg-green-50 transition-transform duration-300 ease-linear"
        onClick={props.action}>
        <div className={`flex`}>{props.icon}</div>
        <div className="flex flex-col flex-1 items-end">
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-indigo-600 font-extrabold lg:text-xl">
              {props.count + " cert."}
            </p>
          </span>
          <span className="flex items-center justify-end gap-1 w-full">
            <p className="flex text-indigo-600 font-extrabold lg:text-xl">
              {props.amount}
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
