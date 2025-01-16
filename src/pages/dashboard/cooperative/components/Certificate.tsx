import logo from "../../../../assets/puregreen-logo.png"
import { ICooperative } from "../../../../interfaces/cooperative"
import { IFarmer } from "../../../../interfaces/farmer"
import { fetchData, shortDateFormatter } from "../../../../utils"
import { IWarehouse } from "../../../../interfaces/warehouse"
import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { Button } from "@material-tailwind/react"
import { toast } from "react-toastify"
import { useQuery } from "react-query"

interface ICertificateProps {
  cooperative?: ICooperative
  Farmers?: IFarmer[]
}
function Certificate(props: ICertificateProps) {
  const certNum = useQuery({
    queryKey: ["certificate", "number"],
    queryFn: async () => {
      return fetchData("/cooperative/certificate/number")
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
    documentTitle: `${props.cooperative?.name} certificate`,
    onAfterPrint() {
      // save to database
    },
  })
  return (
    <div className="flex flex-col transition-transform py-10">
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

        <h4 className="text-center text-red-600 font-bold italic text-3xl font-serif m-8">
          Certificate of Cooperative Registration
        </h4>
        {/* Body  */}
        <div className="flex flex-1 w-full flex-col gap-8 flex-wrap">
          <div className="flex gap-3 capitalize items-start">
            <p className="font-black capitalize">Cooperative name:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black px-5 font-serif -mt-1 -ml-2">
              {props.cooperative?.name}
            </p>
          </div>
          <div className="flex gap-x-3 items-baseline">
            <p className="flex font-black capitalize">Registration Number:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black px-5 font-serif -ml-2 -mt-2 tracking-wider">
              {certNum.isLoading ? "generating..." : certNum.data}
            </p>
            <p className="font-black capitalize">Date Of Registration:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black px-5 -ml-2 -mt-2">
              {shortDateFormatter(props.cooperative?.createdAt as string)}
            </p>
          </div>
          <div className="flex gap-x-3 items-baseline">
            <p className="flex font-black capitalize">Warehouse:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black px-5 font-serif -ml-2 -mt-2">
              {(props.cooperative?.warehouse as IWarehouse)?.name}
            </p>
            <p className="font-black capitalize">Region:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black px-5 -ml-2 -mt-2">
              {props.cooperative?.village}
            </p>
          </div>

          <div className="flex gap-x-3 items-baseline -mt-7">
            <p className="font-black capitalize">Address/Location:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black px-5 -ml-2 -mt-2">
              {props.cooperative?.village}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6 mt-10">
          <p>
            This is to certify that{" "}
            <em className="uppercase font-black px-1">
              {props.cooperative?.name}
            </em>{" "}
            has been officially registered under Pure Green Agrochemicals Nig
            Ltd. Below are the members of this cooperative:
          </p>

          <table className="w-full border border-black border-collapse rounded-lg whitespace-pre-wrap capitalize">
            <thead className="bg-blue-gray-100 divide-x divide-black">
              <th className="p-2">Farmer Name</th>
              <th className="p-2">Farmer ID</th>
              <th className="p-2">NIN</th>
              <th className="p-2">BVN</th>
              <th className="p-2">Phone No.</th>
              <th className="p-2">Collateral Details</th>
            </thead>
            <tbody className="divide-x divide-y border border-black divide-black">
              {props.Farmers?.map((farm, index) => (
                <tr key={index} className="divide-x divide-y divide-black">
                  <td className="p-2">{`${farm.first_name} ${farm.other_name} ${farm.last_name}`}</td>
                  <td className="p-2">{farm.farmer_id}</td>
                  <td className="p-2">{farm.id_number}</td>
                  <td className="p-2">{farm.bvn}</td>
                  <td className="p-2">{farm.phone}</td>
                  <td className="p-2">{props.cooperative?.collateral?.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-2 capitalize my-10">
          <p className="space-x-3">
            <span className="text-red-600 font-bold">Legal Disclaimer: </span>
            <span>
              This certificate is non-transferable and remains valid as per the
              terms and conditions outlined during the registration process.
            </span>
          </p>
          <p className="space-x-3">
            <span className="text-red-600 font-bold">Acknowledgment: </span>
            <span>
              All listed farmers are recognized as active members of the
              cooperative.
            </span>
          </p>
        </div>
        <div className="">
          <h4 className="font-black text-xl">Signatures:</h4>
          <div className="flex gap-5 capitalize mt-5 mb-10">
            <p className="">Cooperative Head:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black -mt-3 -ml-4"></p>
            <p className="">Warehouse Manager:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black -mt-3 -ml-4"></p>
            <p className="">Area Sales Manager:</p>
            <p className="flex flex-1 border-b-[0.5px] border-black -mt-3 -ml-4"></p>
          </div>
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

export default Certificate
