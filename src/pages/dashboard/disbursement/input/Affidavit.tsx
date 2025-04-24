import logo from "../../../../assets/puregreen-logo.png"
import signature from "../../../../assets/PG_SIGNATURE.png"
import { IDisbursement } from "../../../../interfaces/disbursement"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IFarmer } from "../../../../interfaces/farmer"
import { shortDateFormatter } from "../../../../utils"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@material-tailwind/react"
import Input from "../../../../components/form/input"
import { useLocation } from "react-router-dom"
import { IWarehouse } from "../../../../interfaces/warehouse"

function FarmerAffidavit() {
  const location = useLocation()
  const [disbursement, setDisbursement] = useState<IDisbursement>(
    location?.state
  )

  const [date, setDate] = useState("")
  // printing handlers
  const componentRef = useRef(null)

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${(disbursement?.farmer as IFarmer).farmer_id}_affidavit`,
    onAfterPrint() {
      // save to database
    },
  })
  useEffect(() => {
    setDisbursement(location?.state)
  }, [location])

  if (disbursement)
    return (
      <div className="flex flex-col py-10 text-base">
        <Input
          name="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          type="date"
          label="Due Date*"
          required
        />
        <div
          className="container justify-center items-center capitalize p-6 mx-auto"
          ref={componentRef}>
          {/* header */}
          <div className="relative flex flex-col gap-4 items-center justify-center">
            <div className=" flex object-contain overflow-hidden w-40 self-center">
              <img
                src={logo}
                alt="app-logo"
                className="object-contain justify-center"
              />
            </div>
            <h3 className="reletive uppercase text-3xl font-black text-center mr-10">
              pure green agrochemicals nig ltd
            </h3>
            <h4 className="text-center text-green-600 font-bold italic text-2xl font-serif m-5 mt-0 uppercase">
              {`2025 Wet Season Farmer Affidavits`}
            </h4>
            <div className="absolute right-0 bottom-10 object-contain overflow-hidden w-40 self-center">
              <img
                src={(disbursement?.farmer as IFarmer)?.profile_img?.url}
                alt="app-logo"
                className="object-contain justify-center"
              />
            </div>
          </div>

          {/* Body  */}
          <hr />
          <div className="flex flex-col gap-6 mt-5">
            <p>
              I,{" "}
              <b className="uppercase font-black px-1">
                {`${(disbursement?.farmer as IFarmer)?.first_name} ${
                  (disbursement?.farmer as IFarmer)?.other_name ?? ""
                } ${(disbursement?.farmer as IFarmer)?.last_name}`}
              </b>
              {", "}of{" "}
              <b className="uppercase font-black px-1">
                {(disbursement?.cooperative as ICooperative).name}
              </b>
              {", "}in{" "}
              <b className="font-black tracking-wider">
                {shortDateFormatter(disbursement?.createdAt as string)}
              </b>
              apply to access{" "}
              <b className="font-black tracking-wider">
                {disbursement?.hectares?.toLocaleString() + " Hectare(s)"}
              </b>{" "}
              of input from the warehouse of PUREGREEN Agrochemicals Nig Limited
              (“PUREGREEN”) located at{" "}
              <b className="uppercase font-black px-1">
                {(disbursement?.warehouse as IWarehouse).name} wareahouse.
              </b>
              Paid Equity of{" "}
              <b className="font-black tracking-wider">
                {disbursement?.equity?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </b>{" "}
              with a Total Loan value of{" "}
              <b className="font-black tracking-wider">
                {disbursement?.loan_amount?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </b>{" "}
              and Outstanding Loan Value of{" "}
              <b className="font-black tracking-wider text-lg">
                {disbursement?.outstanding_loan?.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </b>
            </p>
          </div>

          <div className="">
            <h4 className="font-black text-lg">Terms and Conditions:</h4>

            <ol className="list-decimal list-outside space-y-1 ml-8">
              <li className="">
                I affirm that the inputs received under this agreement are
                solely for agricultural use on my agricultural land comprising a
                minimum of{" "}
                <b className="font-black tracking-wider text-xl">
                  {disbursement?.hectares}
                </b>
                {" Ha"}.
              </li>
              <li>
                I affirm that the loan is to cover{" "}
                <b className="font-black tracking-wider text-xl">
                  {disbursement?.hectares}
                </b>
                {" Ha. "}
                of agricultural land.
              </li>
              <li>
                I agree that the inputs will be disbursed by an PUREGREEN
                warehouse upon execution of this Agreement
              </li>
              <li>
                I agree to repay the loan according to the terms specified by
                PUREGREEN.
              </li>
              <li>
                I agree that my repayment shall be made in commodities on or
                before the{" "}
                <b className="font-black tracking-wider text-xl">
                  {shortDateFormatter(date)}
                </b>
                .
              </li>
              <li>
                I affirm that I shall use the inputs solely on the designated
                agricultural land and not give part to anyone.
              </li>
              <li>
                I affirm that I shall maintain records of input usage and yield
                data for reporting purposes.
              </li>
              <li>
                I agree that the inputs shall remain the property of PUREGREEN
                until fully repaid by me.
              </li>
              <li>
                I agree to assume all risks associated with the use of the
                inputs.
              </li>
              <li className="">
                I agree to be prosecuted if I fail to comply with the conditions
                stated above and pay any outstanding amount plus penalties as
                determined by PUREGREEN.
              </li>
              <li>
                I affirm that I shall be liable for any damages or losses
                resulting from misuse or misappropriation of the inputs.
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-10 mt-16 capitalize">
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">Farmer's Signature & Date : </p>
            </span>
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">
                Cooperative Head's Signature & Date :{" "}
              </p>
            </span>

            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">Village Head's Signature & Date: </p>
            </span>
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">
                Warehouse Manager's Signature & Date:{" "}
              </p>
            </span>
            <div className="col-span-2 mx-auto">
              <p className="relative flex flex-1 border-b-2 border-black border-dotted object-contain w-full self-center">
                <img
                  src={signature}
                  alt="signature"
                  className="absolute -top-11 h-16 w-full"
                />
              </p>
              <p className="font-black">CEO's Signature & Date: </p>
            </div>
          </div>

          <div className="font-bold uppercase text-center mt-4">Before Me</div>
          <div className="flex w-[50%] mx-auto gap-5 capitalize mt-8 border-b-2 border-black border-dotted"></div>
          <p className="font-bold uppercase text-center mt-4">
            The Commissioner For Oaths
          </p>
        </div>
        <Button
          type="button"
          className="grid items-center justify-center self-center tracking-wider md:text-lg "
          size="lg"
          variant="gradient"
          form="blue"
          disabled={!date.trim()}
          onClick={handlePrint}>
          {" "}
          Save and Print
        </Button>
      </div>
    )
}

export default FarmerAffidavit
