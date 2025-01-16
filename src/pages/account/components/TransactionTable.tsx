import { useNavigate } from "react-router-dom"
import { timeFormatter } from "../../../utils"

function TransactionTable() {
  const navigate = useNavigate()
  return (
    <div className="w-full my-10 border rounded-lg shadow-md overflow-hidden">
      <div className="flex justify-between items-center w-full p-4 bg-green-700">
        <h4 className="font-bold text-base md:text-lg lg:text-2xl capitalize tracking-wide text-gray-100">
          Transaction History
        </h4>
        <h6
          onClick={() => navigate("transaction-history")}
          className="capitalize text-teal-200 text-bold text-xs md:text-base lg:text-lg font-bold underline tracking-wide cursor-pointer hover:text-teal-500 active:text-teal-400"
        >
          view all
        </h6>
      </div>
      <div className="w-full">
        <div className="whitespace-nowrap capitalize">
          <div className="divide-y w-full items-center justify-center">
            {[1, 2, 3, 4].map((item, i) => (
              <div
                key={i + item}
                className="flex px-4 py-2 lg:py-3 lg:px-6 items-center justify-between capitalize even:bg-green-50"
              >
                <p className="flex flex-1 flex-col lg:flex-row items-start justify-between">
                  <span className="text-base md:text-lg font-bold tracking-wide">
                    Equity payment
                  </span>
                  <span className="text-gray-400 text-xs md:text-sm lg:text-base font-light tracking-wide">
                    {timeFormatter("1/9/2024")}
                  </span>
                </p>
                <p className="flex flex-1 flex-col text-right leading-none">
                  <span className="text-base md:text-lg font-bold tracking-wide">
                    {Number(501110000).toLocaleString("en-NG", {
                      style: "currency",
                      currency: "NGN",
                    })}
                  </span>
                  <span className="text-red-400 font-bold">Debit</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionTable
