import logo from "../../../../assets/puregreen-logo.png"
import signature from "../../../../assets/PG_SIGNATURE.png"
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
      <div className="flex flex-col py-10 text-base font-serif">
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
              <b className="uppercase font-black px-1 tracking-wider ">
                {props.cooperative?.chairman}
              </b>
              {" Chairman "}
              of{" "}
              <b className="uppercase font-black px-1 tracking-wider ">
                {props.cooperative?.name}
              </b>{" "}
              in {shortDateFormatter(cooperative.createdAt as string)} apply to
              access{" "}
              <b className="font-extrabold ">
                {cooperative?.hectares.toLocaleString() + " Hectares "}
              </b>{" "}
              of input from the warehouse of PUREGREEN Agrochemicals Nig Limited
              (“PUREGREEN”), located at{" "}
              {(props.cooperative?.warehouse as ICooperative)?.name} wareahouse.
              <h6 className="font-black text-lg">Financial Details:</h6>
              The Cooperative paid a total equity of{" "}
              <b className="font-black tracking-wider ">
                {cooperative?.equity.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </b>{" "}
              with a Total Loan Value of{" "}
              <b className="font-black tracking-wider ">
                {cooperative?.loan_amount.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </b>{" "}
              and have Outstanding Loan Value of{" "}
              <b className="font-black tracking-wider ">
                {cooperative?.outstanding_loan.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
                .
              </b>
              The Cooperative will pay an additional{" "}
              <b className="font-black tracking-wider ">25%</b> interest on the
              total loan value for any repayment made after{" "}
              <b className="font-black tracking-wider ">
                {shortDateFormatter(props.date as string)}
              </b>
              .
            </p>
          </div>

          <div className="">
            <h6 className="font-black text-lg">Terms and Conditions:</h6>

            <ol className="list-decimal list-outside space-y-1 ml-8">
              <li className="">
                <b>Purpose of Loan:</b> I affirm that the inputs received under
                this agreement are solely for distribution to the members of{" "}
                <b className="uppercase font-black px-1">
                  {props.cooperative?.name}
                </b>{" "}
                for agricultural use on their respective farmlands.
              </li>
              <li>
                <b>Distribution Responsibility:</b> I affirm that, as Chairman,
                I am responsible for ensuring that the inputs are distributed
                equitably among the members of the cooperative, with each member
                receiving inputs proportional to their allocated hectares of
                land.
              </li>
              <li>
                <b>Repayment Obligation: </b> I agree to oversee and ensure that
                the loan repayment is made according to the terms specified by
                PUREGREEN.
              </li>

              <li>
                <b>Repayment in Commodities:</b> I agree that the{" "}
                {"cooperative’s"}
                repayment shall be made in commodities on or before{" "}
                <b className="tracking-wider">
                  {shortDateFormatter(props.date as string)}
                </b>
                .
              </li>
              <li>
                <b>Use of Inputs:</b> I affirm that the inputs shall be used
                solely by the members of the cooperative on their designated
                agricultural lands and shall not be sold or transferred to third
                parties.
              </li>
              <li>
                <b>Compliance and Penalties:</b> I agree to be held accountable
                if the cooperative or any of its members fail to comply with the
                stated conditions. Any outstanding amount plus penalties as
                determined by PUREGREEN will be paid.
              </li>
              <li>
                <b>{"Cooperative Members’ Commitment:"}</b> I affirm that all
                members of the cooperative receiving inputs under this agreement
                are fully aware of and agree to the terms and conditions
                outlined in this document.
              </li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-10 mt-16 capitalize">
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">Cooperative Head Signature & Date : </p>
            </span>

            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">Village Head Signature & Date: </p>
            </span>
            <span className="flex flex-col">
              <p className="flex flex-1 border-b-2 border-black border-dotted"></p>
              <p className="font-black">Warehouse Manager Signature & Date: </p>
            </span>
            <span className="flex flex-col">
              <p className="relative flex flex-1 border-b-2 border-black border-dotted object-contain w-full self-center">
                <img
                  src={signature}
                  alt="signature"
                  className="absolute -top-11 md:left-20 h-16 w-[60%]"
                />
              </p>
              <p className="font-black">CEO's Signature & Date: </p>
            </span>
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
          onClick={handlePrint}>
          {" "}
          Save and Print
        </Button>
      </div>
    )
}

export default Affidavit
