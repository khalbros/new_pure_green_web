import {useState, FormEvent} from "react"
import {Button} from "@material-tailwind/react"
import {FaEye, FaEyeSlash} from "react-icons/fa"

import SuccessModal from "./SuccessModal"
import RecoverySentModal from "./RecoverySentModal"
import RecoveryEmailModal from "./RecoveryEmailModal"

import {useAppDispatch, useAppSelector} from "../../../../store"

import {
  updateUserError,
  updateUserSelector,
} from "../../../../store/slices/users/update.slice"
import {changepasswordAction} from "../../../../store/actions/users"
import Input from "../../../../components/form/input"
import {toast} from "react-toastify"

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [showCRP, setShowCRP] = useState<boolean>(false)
  const [showNWP, setShowNWP] = useState<boolean>(false)
  const [showCMP, setShowCMP] = useState<boolean>(false)
  const [successDiaglog, setSuccessDiaglog] = useState<boolean>(false)
  const [emailDiaglog, setEmailDiaglog] = useState<boolean>(false)
  const [recoveryDiaglog, setRecoveryDiaglog] = useState<boolean>(false)
  const dispatch = useAppDispatch()

  const {isLoading} = useAppSelector(updateUserSelector)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      dispatch(updateUserError("Passwords not match"))
      return toast.error("Passwords not match")
    }

    dispatch(
      changepasswordAction(
        {old_password: currentPassword, new_password: newPassword},
        function () {
          toggleSuccessDiaglog()
          setConfirmPassword("")
          setNewPassword("")
          setCurrentPassword("")
        }
      )
    )
  }

  const notEmptyFields = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return false
    }
    if (
      currentPassword === "" ||
      newPassword === "" ||
      confirmPassword === ""
    ) {
      return false
    }
    return true
  }

  const toggleSuccessDiaglog = () => {
    setSuccessDiaglog(!successDiaglog)
  }
  const toggleEmailDiaglog = () => {
    setEmailDiaglog(!emailDiaglog)
  }

  const toggleRecoveryDiaglog = () => {
    setRecoveryDiaglog(!recoveryDiaglog)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full lg:max-w-lg">
        <div className="flex flex-col gap-4 w-full mt-10">
          <Input
            type={showCRP ? "text" : "password"}
            name="old_password"
            label="Current password"
            value={currentPassword}
            placeholder="password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            rightIcon={
              showCRP ? (
                <FaEyeSlash size={20} onClick={() => setShowCRP(!showCRP)} />
              ) : (
                <FaEye size={20} onClick={() => setShowCRP(!showCRP)} />
              )
            }
          />
          <div className="flex flex-col">
            <Input
              type={showNWP ? "text" : "password"}
              name="new_password"
              label="New password"
              placeholder="new password"
              rightIcon={
                showNWP ? (
                  <FaEyeSlash size={20} onClick={() => setShowNWP(!showNWP)} />
                ) : (
                  <FaEye size={20} onClick={() => setShowNWP(!showNWP)} />
                )
              }
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
          </div>
          <Input
            type={showCMP ? "text" : "password"}
            name="confirm_new_password"
            label="Confirm new password"
            placeholder="confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            rightIcon={
              showCMP ? (
                <FaEyeSlash size={20} onClick={() => setShowCMP(!showCMP)} />
              ) : (
                <FaEye size={20} onClick={() => setShowCMP(!showCMP)} />
              )
            }
          />
        </div>
        <span className="flex my-5 text-sm font-normal text-[#263238]">
          Can’t remember my password.
          <span
            className="ml-1 font-semibold cursor-pointer"
            onClick={toggleEmailDiaglog}>
            Click here
          </span>
        </span>
        <div className="flex items-center justify-center my-8 lg:my-8">
          <Button
            type="submit"
            disabled={isLoading || !notEmptyFields}
            className="w-[70%] bg-green-600 py-3 self-center disabled:bg-green-200">
            {isLoading ? "Loading..." : "Update"}
          </Button>
        </div>
      </form>
      <SuccessModal
        openDialog={successDiaglog}
        toggleDiaglog={toggleSuccessDiaglog}
      />
      <RecoveryEmailModal
        openDialog={emailDiaglog}
        toggleDiaglog={toggleEmailDiaglog}
        showResetModal={toggleRecoveryDiaglog}
      />
      <RecoverySentModal
        openDialog={recoveryDiaglog}
        toggleDiaglog={toggleRecoveryDiaglog}
      />
    </>
  )
}

export default ChangePassword
