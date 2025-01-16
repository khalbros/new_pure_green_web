import React, {InputHTMLAttributes, ReactNode, useState} from "react"

interface InputAttributes extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  inputContainerStyle?: string
}
const Select: React.FC<InputAttributes> = ({className, ...props}) => {
  const [isFocused, setIsFocused] = useState(false)
  const onBlured = () => {
    setIsFocused(!isFocused)
  }
  const onFocused = () => {
    setIsFocused(!isFocused)
  }
  return (
    <div
      className={`flex flex-col gap-2 ${
        props.inputContainerStyle ? props.inputContainerStyle : ""
      }`}>
      {props.label && (
        <label htmlFor={props.name} className="capitalize">
          {" "}
          {props.label}
        </label>
      )}
      <div
        className={`flex flex-row items-center justify-between rounded-lg border border-gray-400 ${
          isFocused || props.value ? "ring-1 ring-black" : null
        }`}>
        {props.leftIcon && props.leftIcon}
        <select
          id={props.name}
          className={`w-full py-5 lg:py-[16px] px-3 mr-3 outline-none bg-inherit ${className}`}
          {...props}
          onFocus={onFocused}
          onBlur={onBlured}
        />
        {props.rightIcon && props.rightIcon}
      </div>
    </div>
  )
}

export default Select
