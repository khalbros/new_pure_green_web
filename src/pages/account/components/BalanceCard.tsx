import React from "react"

function BalanceCard() {
  return (
    <div className="w-full">
      <div className="absolute top-[45vh] lg:top-[49vh] left-5 md:left-10 lg:left-20 right-5 md:right-10 lg:right-20 rounded-xl shadow shadow-green-200 bg-white p-3">
        <div className="flex w-full items-center divide-x-2">
          <div className="flex flex-col flex-1 justify-center items-center p-2">
            <p className="text-green-900 font-bold tracking-wide  text-sm md:text-lg lg:text-xl">
              {Number(25000357.8).toLocaleString("en-NG", {
                currency: "NGN",
                style: "currency",
              })}
            </p>
            <p className="text-gray-500 uppercase tracking-wide text-xs md:text-base lg:text-lg">
              Available Balance
            </p>
          </div>
          <div className="flex flex-col flex-1 justify-center items-center p-2">
            <p className="text-green-900 font-bold tracking-wide text-sm md:text-lg lg:text-xl">
              {Number(3000357.8).toLocaleString("en-NG", {
                currency: "NGN",
                style: "currency",
              })}
            </p>
            <p className="text-gray-500 uppercase tracking-wide text-xs md:text-base lg:text-lg">
              Loans Balance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BalanceCard
