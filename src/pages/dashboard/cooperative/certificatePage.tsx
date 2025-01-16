import { ChangeEvent, useState } from "react"
import Input from "../../../components/form/input"
import { useLocation } from "react-router-dom"
import { fetchData } from "../../../utils"
import { toast } from "react-toastify"
import { useQuery } from "react-query"
import { ICooperative } from "../../../interfaces/cooperative"
import Certificate from "./components/Certificate"
import Loading from "../../../components/Loading"
import { Button } from "@material-tailwind/react"
import { IFarmer } from "../../../interfaces/farmer"

function CertificatePage() {
  const { state } = useLocation()
  const [cooperative, setCooperative] = useState<ICooperative | undefined>(
    undefined
  )

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["cooperative", "cartificate"],
    queryFn: async () => {
      return fetchData(`/cooperative/members/${cooperative?._id}`)
        .then(
          (res) => {
            setFarmers(res.data)
            return res.data
          },
          (err) => toast.error(err)
        )
        .catch((err) => toast.error(err))
    },
    enabled: false,
    refetchOnWindowFocus: false,
  })

  const [farmers, setFarmers] = useState<IFarmer[] | undefined>(data)

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "cooperative") {
      setCooperative(() => state?.find((c: ICooperative) => c.name === value))
      return setFarmers(undefined)
    }
  }
  const handleGeanerate = () => refetch()

  return (
    <div className="flex flex-col gap-3 md:gap-7 text-sm lg:text-xl">
      <h3 className="text-center text-green-600 font-bold italic text-3xl font-serif mt-3 md:m-4">
        Generate Cooperative Certicate
      </h3>
      <div className="flex flex-col gap-4  items-center w-full">
        <Input
          label="Cooperative Name"
          name="cooperative"
          type="search"
          list="cooperative_list"
          autoComplete="cooperativ list"
          onChange={handleChange}
          inputContainerStyle="w-full"
        />
        <datalist id="cooperative_list" placeholder="" className="w-full">
          {state?.map((coop: ICooperative, index: string) => {
            return <option key={index} className="w-full" value={coop.name} />
          })}
        </datalist>
        <Button
          size="lg"
          color="teal"
          className="text-base md:text-lg tracking-wider"
          onClick={handleGeanerate}>
          Generate
        </Button>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        cooperative &&
        farmers && (
          <div className="overflow-scroll w-full border">
            <Certificate cooperative={cooperative} Farmers={farmers} />
          </div>
        )
      )}
    </div>
  )
}

export default CertificatePage
