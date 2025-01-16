import { ChangeEvent, useState } from "react"
import Input from "../../../components/form/input"
import { useLocation } from "react-router-dom"
import { ICooperative } from "../../../interfaces/cooperative"
import Affidavit from "./components/Affidavit"
import { Button } from "@material-tailwind/react"

function AffidavitPage() {
  const { state } = useLocation()
  const [cooperative, setCooperative] = useState<ICooperative | undefined>(
    undefined
  )
  const [date, setDate] = useState<string>("")
  const [generate, setGenerate] = useState<boolean>(false)

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === "cooperative") {
      setCooperative(() => state?.find((c: ICooperative) => c.name === value))
    }
    if (name === "date") {
      setDate(() => value)
    }
    return setGenerate(false)
  }

  return (
    <div className="flex flex-col gap-3 md:gap-7 text-sm lg:text-xl">
      <h3 className="text-center text-green-600 font-bold italic text-3xl font-serif mt-3 md:m-4">
        Generate Cooperative Affidavit
      </h3>
      <div className="flex flex-col gap-4  items-center w-full">
        <div className="flex flex-1 w-full flex-col md:flex-row gap-4">
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
          <Input
            type="date"
            label="Due Date"
            name="date"
            onChange={handleChange}
            inputContainerStyle="w-full"
          />
        </div>
        <Button
          size="lg"
          color="teal"
          className="text-base md:text-lg tracking-wider"
          onClick={() => setGenerate(true)}
          disabled={!cooperative || !date}>
          Generate
        </Button>
      </div>

      {cooperative && date && generate && (
        <div className="overflow-scroll w-full border ">
          <Affidavit cooperative={cooperative} date={date} />
        </div>
      )}
    </div>
  )
}

export default AffidavitPage
