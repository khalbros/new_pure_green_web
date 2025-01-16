import { BiMoneyWithdraw } from "react-icons/bi"
import { FaMoneyBillTransfer, FaMoneyBillTrendUp } from "react-icons/fa6"
import { MdAccountBalanceWallet } from "react-icons/md"
import { PiHandWithdrawDuotone } from "react-icons/pi"

const ActionBtn = () => {
  return (
    <div className="w-full flex flex-col overflow-hidden gap-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full">
        <div
          className="flex gap-3 rounded p-2 md:p-4 lg:p-6 w-full items-center justify-between border-green-300 cursor-pointer border hover:transform hover:scale-100 hover:bg-green-100 focus:bg-green-100 transition-transform duration-300 ease-linear"
          onClick={() => ""}
        >
          <div className={`flex`}>
            <MdAccountBalanceWallet className="text-xl md:text-3xl lg:text-5xl text-green-600" />
          </div>
          <div className="flex flex-col flex-1 items-end">
            <p className="flex text-green-600 font-extrabold text-lg md:text-xl lg:text-2xl leading-none capitalize">
              Fund
            </p>
            <p className="flex text-gray-400 font-extrabold text-xs md:text-sm lg:text-base leading-none uppercase">
              account
            </p>
          </div>
        </div>
        <div
          className="flex gap-3 rounded  p-2 md:p-4 lg:p-6 w-full items-center justify-between border-green-300 cursor-pointer border hover:transform hover:scale-100 hover:bg-green-100 focus:bg-green-100 transition-transform duration-300 ease-linear"
          onClick={() => ""}
        >
          <div className={`flex`}>
            <FaMoneyBillTransfer className="text-xl md:text-3xl lg:text-5xl text-green-600" />
          </div>
          <div className="flex flex-col flex-1 items-end">
            <p className="flex text-green-600 font-extrabold text-lg md:text-xl lg:text-2xl leading-none capitalize">
              Transfer
            </p>
            <p className="flex text-gray-400 font-extrabold text-xs md:text-sm lg:text-base leading-none uppercase">
              money
            </p>
          </div>
        </div>
        <div
          className="flex gap-3 rounded  p-2 md:p-4 lg:p-6 w-full items-center justify-between border-green-300 cursor-pointer border hover:transform hover:scale-100 hover:bg-green-100 focus:bg-green-100 transition-transform duration-300 ease-linear col-span-2 md:col-auto"
          onClick={() => ""}
        >
          <div className={`flex`}>
            <PiHandWithdrawDuotone className="text-xl md:text-3xl lg:text-5xl text-green-600" />
          </div>
          <div className="flex flex-col flex-1 items-end">
            <p className="flex text-green-600 font-extrabold text-lg md:text-xl lg:text-2xl leading-none capitalize">
              Withdraw
            </p>
            <p className="flex text-gray-400 font-extrabold text-xs md:text-sm lg:text-base leading-none uppercase">
              money
            </p>
          </div>
        </div>{" "}
      </div>
      <div className="grid col-span-3 grid-cols-2 gap-3 w-full">
        <div
          className="flex gap-2 md:gap-3 rounded p-2 md:p-4 lg:p-6 w-full items-center justify-between border-green-300 cursor-pointer border hover:transform hover:scale-100 hover:bg-green-100 focus:bg-green-100 transition-transform duration-300 ease-linear"
          onClick={() => ""}
        >
          <div className={`flex`}>
            <BiMoneyWithdraw className="text-xl md:text-3xl lg:text-5xl text-green-600" />
          </div>
          <div className="flex flex-col items-end">
            <p className="flex text-green-600 font-extrabold text-lg md:text-xl lg:text-2xl leading-none capitalize">
              Cash Loan
            </p>
            <p className="flex text-gray-400 font-extrabold text-xs md:text-sm lg:text-base leading-none uppercase">
              Repayment
            </p>
          </div>
        </div>
        <div
          className="flex gap-2 md:gap-3 rounded p-2 md:p-4 lg:p-6 w-full items-center justify-between border-green-300 cursor-pointer border hover:transform hover:scale-100 hover:bg-green-100 focus:bg-green-100 transition-transform duration-300 ease-linear"
          onClick={() => ""}
        >
          <div className={`flex`}>
            <FaMoneyBillTrendUp className="text-xl md:text-3xl lg:text-5xl text-green-600" />
          </div>
          <div className="flex flex-col items-end">
            <p className="flex text-green-600 font-extrabold text-lg md:text-xl lg:text-2xl leading-none capitalize">
              Equity
            </p>
            <p className="flex text-gray-400 font-extrabold text-xs md:text-sm lg:text-base leading-none uppercase">
              payment
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActionBtn
