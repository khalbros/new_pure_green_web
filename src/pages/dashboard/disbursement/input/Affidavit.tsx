import logo from "../../../../assets/puregreen-logo.png"
import { IDisbursement } from "../../../../interfaces/disbursement"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IFarmer } from "../../../../interfaces/farmer"
import { shortDateFormatter } from "../../../../utils"
import { useEffect, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@material-tailwind/react"
import Input from "../../../../components/form/input"
import { useLocation } from "react-router-dom"
import { IProject } from "../../../../interfaces/project"

function FarmerAffidavit() {
  const location = useLocation()
  const [disbursement, setDisbursement] = useState<IDisbursement>(
    location?.state
  )

  const year = new Date()
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
      <div className="flex flex-col py-10">
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
              {`${
                (disbursement?.project as IProject).name
              } input loan AGREEMENT`}
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
              <em className="uppercase font-black px-1">
                {`${(disbursement?.farmer as IFarmer)?.first_name} ${
                  (disbursement?.farmer as IFarmer)?.other_name ?? ""
                } ${(disbursement?.farmer as IFarmer)?.last_name}`}
              </em>{" "}
              , with Farmer ID{" "}
              <em className="uppercase font-black px-1">
                {(disbursement?.farmer as IFarmer)?.farmer_id}
              </em>
              {", "}a member of{" "}
              <em className="uppercase font-black px-1">
                {(disbursement?.cooperative as ICooperative).name}
              </em>
              {", "}
              do hereby acknowledge and agree to the terms and conditions
              outlined in this affidavit for accessing agricultural inputs from
              PUREGREEN Agrochemicals Nig Limited (“PUREGREEN”), located at{" "}
              <em className="uppercase font-black px-1">
                {(disbursement?.warehouse as ICooperative).name}
              </em>
            </p>
          </div>
          <div className="mt-2">
            <h4 className="font-black text-xl">Loan Details:</h4>
            <div className="grid grid-cols-2  gap-1 my-2">
              <span className="flex gap-3 items-baseline">
                <p className="">Paid Equity:</p>
                <p className="font-black tracking-wider text-lg">
                  {disbursement?.equity?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
              </span>
              <span className="flex gap-3 items-baseline">
                <p className="">Hectares:</p>
                <p className="font-black tracking-wider text-lg">
                  {disbursement?.hectares?.toLocaleString() + " Ha"}
                </p>
              </span>
              <span className="flex gap-3 items-baseline">
                <p className="">Total Loan Value:</p>
                <p className="font-black tracking-wider text-lg">
                  {disbursement?.loan_amount?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
              </span>
              <span className="flex gap-3 items-baseline">
                <p className="">Outstanding Loan Value:</p>
                <p className="font-black tracking-wider text-lg">
                  {disbursement?.outstanding_loan?.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
              </span>
            </div>
          </div>
          <div className="">
            <h4 className="font-black text-xl">Terms and Conditions:</h4>

            <ol className="list-decimal list-outside space-y-1 ml-8">
              <li className="">
                I affirms that the inputs received under this agreement are
                solely for agricultural use on designated agricultural land
                totalling{" "}
                <em className="font-black tracking-wider text-xl">
                  {disbursement?.hectares}
                </em>
                {" Ha"}.
              </li>
              <li>
                I affirm that the loan covers{" "}
                <em className="font-black tracking-wider text-xl">
                  {disbursement?.hectares}
                </em>
                {" Ha. "}
                of agricultural land.
              </li>
              <li>
                I agree to receive the inputs from a PUREGREEN warehouse upon
                execution of this affidavit.
              </li>
              <li>
                I agree to repay the loan according to the terms specified by
                PUREGREEN.
              </li>
              <li>
                I agree to make repayment in commodities or before the{" "}
                <em className="font-black tracking-wider text-xl">
                  {shortDateFormatter(date)}
                </em>
                .
              </li>
              <li>
                I affirm that I shall use the inputs exclusively on the
                designated agricultural land and not transfer them to anyone
                else.
              </li>
              <li>
                I agree to maintain records of input usage and yield data for
                reporting purposes.
              </li>
              <li>
                I understand that the inputs shall remain the property of
                PUREGREEN until the loan is fully repaid.
              </li>
              <li>I assume all risks associated with the use of the inputs.</li>
              <li className="">
                I agree to be prosecuted if I fail to comply with the terms
                stated above, including repayment of any outstanding loan value
                plus applicable penalties as determined by PUREGREEN.
              </li>
              <li>
                11. I affirm that I shall be liable for any damages or losses
                resulting from misuse or misappropriation of the inputs.
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-10 mt-16 capitalize">
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-[0.5px] border-black"></p>
              <p className="font-black">Cooperative Head (Name/Signature): </p>
            </span>

            <span className="flex flex-col">
              <p className="flex flex-1 border-b-[0.5px] border-black"></p>
              <p className="font-black">Village Head (Name/Signature): </p>
            </span>
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-[0.5px] border-black"></p>
              <p className="font-black">Warehouse Manager (Name/Signature): </p>
            </span>
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-[0.5px] border-black"></p>
              <p className="font-black">
                Area Sales Manager (Name/Signature):{" "}
              </p>
            </span>
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-[0.5px] border-black"></p>
              <p className="font-black">CEO (Name/Signature): </p>
            </span>
          </div>
          <div className="font-bold uppercase text-center mt-4">
            SWORN TO THE HIGH COURT OF JUSTICE REGISTRY, ZARIA
          </div>
          <div className="flex w-[50%] mx-auto gap-5 capitalize mt-5 mb-10">
            <p className="">This</p>
            <p className="flex flex-1 border-b-[0.5px] border-black -mt-3 -ml-4"></p>
            <p className="">Day of</p>
            <p className="flex flex-1 border-b-[0.5px] border-black -mt-3 -ml-4"></p>
            <p className="">{year.getFullYear()}</p>
          </div>
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
