import { timeFormatter } from "../../../utils"
import { CgSearch } from "react-icons/cg"

function TransactionList() {
  return (
    <div className="w-full my-5 border rounded-lg shadow-md overflow-auto">
      <div className="flex justify-between items-center w-full p-4 bg-green-700">
        <h4 className="flex flex-1 gap-2 font-bold text-base md:text-lg lg:text-2xl capitalize tracking-wide text-gray-100">
          Transaction <span className="hidden md:flex"> History</span>
        </h4>
        <div className="flex flex-1 items-center  pl-3 overflow-hidden bg-white rounded-md">
          <CgSearch color="green" />
          <input 
            type="search"
            className="w-full bg-white rounded-md text-lg md:text-xl lg:text-3xl text-green-700 outline-none px-2 py-1 md:py-2 md:px3"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="whitespace-nowrap capitalize">
          <div className="divide-y w-full items-center justify-center">
            {[1, 2, 3]?.map((item, i) => (
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
        {/* Pagination */}
      </div>
    </div>
  )
}

export default TransactionList
