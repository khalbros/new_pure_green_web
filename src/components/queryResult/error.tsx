const Error = (props: {error: string}) => {
  return (
    <div className="w-full h-full grid place-content-center">{props.error}</div>
  )
}

export default Error
