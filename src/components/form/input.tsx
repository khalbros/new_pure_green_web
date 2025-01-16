import React, {ReactNode, useState, forwardRef} from "react"

interface InputAttributes
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  inputContainerStyle?: string
}
const Input = (
  {
    className,
    leftIcon,
    rightIcon,
    inputContainerStyle,
    ...props
  }: InputAttributes,
  ref?: React.LegacyRef<HTMLInputElement>
) => {
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
        inputContainerStyle ? inputContainerStyle : ""
      }`}>
      {props.label && (
        <label
          htmlFor={props.name}
          className="capitalize text-base font-normal text-[#281103]">
          {props.label}
        </label>
      )}
      <div
        className={`flex gap-3 flex-row items-center justify-between py-2 px-3 rounded-lg border border-gray-400 ${
          isFocused || props.value ? "ring-1 ring-black" : null
        }`}>
        {leftIcon}
        <input
          id={props.name}
          className={`w-full py-2 outline-none ${className}`}
          {...props}
          onFocus={onFocused}
          onBlur={onBlured}
          ref={ref}
        />
        {rightIcon}
      </div>
    </div>
  )
}

export default forwardRef<HTMLInputElement, InputAttributes>(Input)
