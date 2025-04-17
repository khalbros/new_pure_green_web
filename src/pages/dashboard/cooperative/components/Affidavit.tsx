import logo from "../../../../assets/puregreen-logo.png"
import { ICooperative } from "../../../../interfaces/cooperative"
import { fetchData, shortDateFormatter } from "../../../../utils"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@material-tailwind/react"
import { toast } from "react-toastify"
import { useQuery } from "react-query"
import Loading from "../../../../components/Loading"
import Error from "../../../../components/queryResult/error"

interface IAffidavitProps {
  cooperative?: ICooperative
  date?: string
}
function Affidavit(props: IAffidavitProps) {
  const {
    data: cooperative,
    isError,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cooperative", "affidavit"],
    queryFn: async () => {
      return fetchData(`/cooperative/loan-count/${props.cooperative?._id}`)
        .then(
          (res) => res.data,
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    },
  })
  const year = new Date()
  // printing handlers
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${props.cooperative?.name} affidavit`,
    onAfterPrint() {
      // save to database
    },
  })

  if (isError) return <Error error={error as string} />
  if (isLoading) return <Loading />

  if (cooperative)
    return (
      <div className="flex flex-col py-10">
        <div
          className="container justify-center items-center capitalize p-6 mx-auto"
          ref={componentRef}>
          {/* header */}
          <div className="flex flex-col gap-4 items-center justify-center">
            <div className="flex object-contain overflow-hidden w-40 self-center">
              <img
                src={logo}
                alt="app-logo"
                className="object-contain justify-center"
              />
            </div>
            <h3 className="uppercase text-4xl font-black text-center">
              pure green agrochemicals nig ltd
            </h3>
          </div>
          <h4 className="text-center text-green-600 font-bold italic text-3xl font-serif m-5 capitalize">
            {`2025 Wet Season Cooperative Affidavits`}
          </h4>
          {/* Body  */}
          <hr />
          <div className="flex flex-col gap-6 mt-10">
            <p>
              I,{" "}
              <em className="uppercase font-black px-1">
                {props.cooperative?.chairman}
              </em>{" "}
              , acting on behalf of{" "}
              <em className="uppercase font-black px-1">
                {props.cooperative?.name}
              </em>{" "}
              in collaboration with PUREGREEN Agrochemicals Nig Limited
              (“PUREGREEN”), acknowledge and agree to the terms and conditions
              outlined in this affidavit for accessing agricultural inputs to
              support the cooperative's farming activities.
            </p>
          </div>
          <div className="mt-2">
            <h4 className="font-black text-xl">Loan Details:</h4>
            <div className="grid grid-cols-2  gap-1 my-2">
              <span className="flex gap-3 items-baseline">
                <p className="">Equity Paid:</p>
                <p className="font-black tracking-wider text-lg">
                  {cooperative?.equity.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
              </span>
              <span className="flex gap-3 items-baseline">
                <p className="">Hectares:</p>
                <p className="font-black tracking-wider text-lg">
                  {cooperative?.hectares.toLocaleString() + " Ha"}
                </p>
              </span>
              <span className="flex gap-3 items-baseline">
                <p className="">Total Loan Value:</p>
                <p className="font-black tracking-wider text-lg">
                  {cooperative?.loan_amount.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  })}
                </p>
              </span>
              <span className="flex gap-3 items-baseline">
                <p className="">Outstanding Loan Value:</p>
                <p className="font-black tracking-wider text-lg">
                  {cooperative?.outstanding_loan.toLocaleString("en-NG", {
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
                The cooperative affirms that the inputs received under this
                agreement are solely for agricultural use on designated
                agricultural land totalling{" "}
                <em className="font-black tracking-wider text-xl">
                  {cooperative?.hectares}
                </em>
                {" Ha"}.
              </li>
              <li>
                The loan provided will cover{" "}
                <em className="font-black tracking-wider text-xl">
                  {cooperative?.hectares}
                </em>
                {" Ha. "}
                of agricultural land, distributed among the cooperative's
                members.
              </li>
              <li>
                The inputs will be disbursed by a PUREGREEN warehouse upon
                execution of this affidavit.
              </li>
              <li>
                The cooperative agrees to repay the loan according to the terms
                specified by PUREGREEN.
              </li>
              <li>
                Loan repayment will be made in commodities or cash equivalent on
                or before the{" "}
                <em className="font-black tracking-wider text-xl">
                  {shortDateFormatter(props.date as string)}
                </em>
                .
              </li>
              <li>
                The cooperative affirms it shall distribute the inputs
                exclusively to its registered members and monitor proper usage
                on their designated agricultural land.
              </li>
              <li>
                The cooperative agrees to maintain records of input usage,
                farmer distribution, and yield data for reporting purposes.
              </li>
              <li>
                All inputs provided under this loan agreement remain the
                property of PUREGREEN until fully repaid by the cooperative.
              </li>
              <li>
                The cooperative assumes all risks associated with the use of the
                inputs, including risks incurred by individual members.
              </li>
              <li className="">
                The cooperative and its members agree to be liable for
                prosecution if they fail to comply with the terms stated above,
                including the repayment of any outstanding loan value plus
                applicable penalties.
              </li>
              <li>
                The cooperative agrees to compensate for any damages or losses
                resulting from the misuse or misappropriation of the inputs.
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
          onClick={handlePrint}>
          {" "}
          Save and Print
        </Button>
      </div>
    )
}

export default Affidavit
