import {Button, Dialog, DialogBody} from "@material-tailwind/react"
import {useState} from "react"
import {MdCancel, MdEmail} from "react-icons/md"
import Input from "../../../../components/form/input"

interface ModalProps {
  openDialog: boolean
  toggleDiaglog: () => void
  showResetModal: () => void
}

function RecoveryEmailModal({
  openDialog,
  toggleDiaglog,
  showResetModal,
}: ModalProps) {
  const [email, setEmail] = useState("")

  const handleSubmit = () => {
    if (!email) {
      return
    }
    toggleDiaglog()
    showResetModal()
  }
  return (
    <Dialog size="sm" open={openDialog} handler={toggleDiaglog}>
      <DialogBody className="">
        <div className="flex justify-end">
          {" "}
          <MdCancel
            className="cursor-pointer"
            size={20}
            onClick={() => toggleDiaglog()}
            color="#424242"
          />{" "}
        </div>
        <form className="flex flex-col w-full gap-y-2 items-center justify-center p-4">
          <h5 className="flex text-2xl text-green-800 font-sans font-semibold m-5">
            Forgot password
          </h5>
          <p className="flex flex-wrap text-gray-600 text-sm text-center">
            Can't remember your password? <br /> You can reset it with your
            email address
          </p>
          <div className="flex flex-col gap-4 w-full mt-10">
            <Input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<MdEmail size={20} className="text-gray-500" />}
              className="bg-transparent"
            />
          </div>
          <div className="flex flex-col w-full items-center justify-between mb-4">
            <Button
              className="w-[75%] self-center text-base lg:text-lg p-4 leading-none bg-green-700 my-4"
              onClick={handleSubmit}>
              Reset Password
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  )
}

export default RecoveryEmailModal
