/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import Error from "./error"
import Loading from "../Loading"

interface IProps {
  data: any
  loading: boolean
  error?: string
  children: React.ReactNode
  emptyResult?: React.ReactNode
}

const QueryResult: React.FC<IProps> = (props) => {
  if (props.loading) {
    return <Loading />
  }

  if (props.error) {
    return <Error error={props.error} />
  }

  if ((props.emptyResult && props.data?.length < 1) || !props.data) {
    return <>{props.emptyResult}</>
  }

  return <>{props.children}</>
}

export default QueryResult
